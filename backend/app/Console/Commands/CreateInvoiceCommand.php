<?php

namespace App\Console\Commands;

use App\Models\Client;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreateInvoiceCommand extends Command
{
    protected $signature = 'invoice:create
        {--client= : ID client (kalau dilewati, akan diminta cari/pilih)}
        {--company= : ID company (kalau dilewati & cuma ada 1 company, otomatis dipakai)}';

    protected $description = 'Membuat invoice baru secara interaktif, item bisa diambil dari tabel products';

    public function handle(): int
    {
        $company = $this->resolveCompany();
        if (!$company) {
            return self::FAILURE;
        }

        $client = $this->resolveClient();
        if (!$client) {
            return self::FAILURE;
        }

        $invoiceDate = $this->ask('Tanggal invoice (YYYY-MM-DD)', now()->toDateString());
        $dueDays     = (int) $this->ask('Jatuh tempo berapa hari dari tanggal invoice?', 14);
        $dueDate     = \Carbon\Carbon::parse($invoiceDate)->addDays($dueDays)->toDateString();

        $status = $this->choice('Status invoice', ['draft', 'sent', 'paid', 'cancelled'], 1); // default: sent

        [$projectCode, $installmentLabel] = $this->resolveInstallment(
            $client,
            $company
        );

        // ── Kumpulkan item satu per satu ──
        $items = [];
        do {
            $item = $this->pickItem();
            if ($item) {
                $items[] = $item;
                $this->info("  + {$item['name']} — {$item['quantity']} {$item['unit']} x Rp".number_format($item['price'], 0, ',', '.'));
            }
        } while ($this->confirm('Tambah item lagi?', empty($items) ? true : false));

        if (empty($items)) {
            $this->error('Invoice harus punya minimal 1 item.');
            return self::FAILURE;
        }

        $taxRate  = (float) $this->ask('Tarif pajak / PPN (%)', 0);
        $discount = (float) $this->ask('Diskon (nominal rupiah)', 0);
        $notes    = $this->ask('Catatan (opsional)', '');
        $terms    = $this->ask('Syarat & ketentuan (opsional)', '');

        // ── Simpan dalam transaction ──
        $invoice = DB::transaction(function () use ($company, $client, $invoiceDate, $dueDate, $status, $items, $taxRate, $discount, $notes, $terms, $projectCode, $installmentLabel) {
            $invoice = Invoice::create([
                'invoice_number' => Invoice::generateNumber($company->id),
                'company_id'         => $company->id,
                'client_id'          => $client->id,
                'invoice_date'       => $invoiceDate,
                'due_date'           => $dueDate,
                'status'             => $status,
                'tax_rate'           => $taxRate,
                'discount'           => $discount,
                'subtotal'           => 0,
                'tax_amount'         => 0,
                'total'              => 0,
                'notes'              => $notes ?: null,
                'terms'              => $terms ?: null,
                'project_code'         => $projectCode,
                'installment_label'  => $installmentLabel,
            ]);

            foreach ($items as $item) {
                $invoice->items()->create([
                    'product_id'  => $item['product_id'],
                    'name'        => $item['name'],
                    'description' => $item['description'],
                    'quantity'    => $item['quantity'],
                    'unit'        => $item['unit'],
                    'price'       => $item['price'],
                    'total'       => $item['quantity'] * $item['price'],
                ]);
            }

            $invoice->load('items');
            $invoice->recalculate();

            return $invoice;
        });

        $this->newLine();
        $this->info("✔ Invoice {$invoice->invoice_number} berhasil dibuat (ID: {$invoice->id})");
        $this->table(
            ['Field', 'Value'],
            [
                ['Client', $client->name],
                ['Company', $company->name],
                ['Tanggal', $invoiceDate],
                ['Jatuh Tempo', $dueDate],
                ['Status', $status],
                ['Termin', $installmentLabel ?: '-'],
                ['Project Code', $projectCode ?: '-'],
                ['Subtotal', number_format($invoice->subtotal, 0, ',', '.')],
                ['Pajak', number_format($invoice->tax_amount, 0, ',', '.')],
                ['Diskon', number_format($invoice->discount, 0, ',', '.')],
                ['Total', number_format($invoice->total, 0, ',', '.')],
            ]
        );

        return self::SUCCESS;
    }

    /**
     * Tanya apakah invoice ini bagian dari skema termin (DP / pelunasan).
     * Return [project_code|null, installment_label|null]
     */
    protected function resolveInstallment(
        Client $client,
        Company $company
    ): array
    {
        if (!$this->confirm('Apakah invoice ini bagian dari termin pembayaran (DP/pelunasan)?', false)) {
            return [null, null];
        }

        $mode = $this->choice('Ini termin apa?', [
            'Termin pertama (DP) — buat project baru',
            'Termin lanjutan (pelunasan) — sambungkan ke DP yang sudah ada',
        ], 0);

        if (str_starts_with($mode, 'Termin pertama')) {
            $projectCode = 'PRJ-'.now()->format('Ymd').'-'.strtoupper(\Illuminate\Support\Str::random(4));
            $percent   = $this->ask('Berapa persen DP dari total proyek?', 50);
            $label     = "Termin 1 — Uang Muka ({$percent}%)";

            $this->info("  Project Code baru: {$projectCode} (catat ini untuk membuat invoice pelunasan nanti)");
            return [$projectCode, $label];
        }

        // Termin lanjutan — cari invoice sebelumnya milik client yang sama
      $previous = Invoice::where('company_id', $company->id)
            ->where('client_id', $client->id)
            ->whereNotNull('project_code')
            ->where('project_code', '!=', '')
            ->orderByDesc('created_at')
            ->get()
            ->unique('project_code');

        if ($previous->isEmpty()) {
            $this->warn('Tidak ditemukan invoice termin sebelumnya untuk client ini.');
            $projectCode = $this->ask('Masukkan Project Code manual (dari invoice DP sebelumnya)');
            $label     = $this->ask('Label termin', 'Termin 2 — Pelunasan');
            return [$projectCode ?: null, $label];
        }

        $options = $previous->mapWithKeys(fn ($inv) => [
            $inv->project_code => "{$inv->project_code} — {$inv->invoice_number} ({$inv->installment_label})",
        ])->toArray();

        $chosenLabel = $this->choice('Sambungkan ke project mana?', array_values($options));
        $projectCode   = array_search($chosenLabel, $options, true);
        $label       = $this->ask('Label termin ini', 'Termin 2 — Pelunasan');

        return [$projectCode, $label];
    }

    /**
     * Resolve company: pakai --company, auto-pilih kalau cuma 1, atau tanya user.
     */
    protected function resolveCompany(): ?Company
    {
        if ($id = $this->option('company')) {
            $company = Company::find($id);
            if (!$company) {
                $this->error("Company dengan ID {$id} tidak ditemukan.");
                return null;
            }
            return $company;
        }

        $companies = Company::orderBy('name')->get();

        if ($companies->isEmpty()) {
            $this->error('Belum ada data Company. Buat dulu company-nya sebelum membuat invoice.');
            return null;
        }

        if ($companies->count() === 1) {
            return $companies->first();
        }

        $choice = $this->choice('Pilih company (pengirim invoice)', $companies->pluck('name', 'id')->toArray());
        return $companies->firstWhere('name', $choice);
    }

    /**
     * Resolve client: pakai --client, atau cari-by-nama / buat baru.
     */
    protected function resolveClient(): ?Client
    {
        if ($id = $this->option('client')) {
            $client = Client::find($id);
            if (!$client) {
                $this->error("Client dengan ID {$id} tidak ditemukan.");
                return null;
            }
            return $client;
        }

        $keyword = $this->ask('Cari client (nama, kosongkan untuk lihat semua)', '');

        $query = Client::query();
        if ($keyword !== '') {
            $query->where('name', 'like', "%{$keyword}%");
        }
        $matches = $query->orderBy('name')->limit(15)->get();

        if ($matches->isEmpty()) {
            if (!$this->confirm('Client tidak ditemukan. Buat client baru?', true)) {
                $this->error('Dibatalkan — tidak ada client.');
                return null;
            }
            return $this->createClientInteractively();
        }

        $options = $matches->pluck('name', 'id')->toArray();
        $options['__new__'] = '+ Buat client baru';

        $choiceId = array_search(
            $this->choice('Pilih client', array_values($options)),
            $options,
            true
        );

        if ($choiceId === '__new__') {
            return $this->createClientInteractively();
        }

        return $matches->firstWhere('id', (int) $choiceId);
    }

    protected function createClientInteractively(): Client
    {
        $this->line('Buat client baru:');

        return Client::create([
            'name'     => $this->ask('Nama client / perusahaan'),
            'email'    => $this->ask('Email (opsional)', ''),
            'phone'    => $this->ask('Telepon (opsional)', ''),
            'address'  => $this->ask('Alamat (opsional)', ''),
            'city'     => $this->ask('Kota (opsional)', ''),
            'country'  => $this->ask('Negara', 'Indonesia'),
            'npwp'     => $this->ask('NPWP (opsional)', ''),
            'pic_name' => $this->ask('Nama PIC (opsional)', ''),
        ]);
    }

    /**
     * Satu putaran: pilih product dari katalog (dengan pencarian) atau input item custom.
     * Return array item siap masuk ke invoice_items, atau null kalau dibatalkan.
     */
    protected function pickItem(): ?array
    {
        $mode = $this->choice('Item ini dari mana?', ['Cari dari katalog Product', 'Input manual (bukan dari katalog)'], 0);

        if ($mode === 'Input manual (bukan dari katalog)') {
            $name        = $this->ask('Nama item');
            $description = $this->ask('Deskripsi (opsional)', '');
            $quantity    = (float) $this->ask('Qty', 1);
            $unit        = $this->ask('Satuan', 'pcs');
            $price       = (float) $this->ask('Harga satuan');

            return [
                'product_id'  => null,
                'name'        => $name,
                'description' => $description ?: null,
                'quantity'    => $quantity,
                'unit'        => $unit,
                'price'       => $price,
            ];
        }

        $keyword = $this->ask('Cari product (nama, kosongkan untuk lihat semua)', '');

        $query = Product::query();
        if ($keyword !== '') {
            $query->where('name', 'like', "%{$keyword}%");
        }
        $products = $query->orderBy('name')->limit(15)->get();

        if ($products->isEmpty()) {
            $this->warn('Tidak ada product cocok. Coba input manual.');
            return $this->pickItem();
        }

        $labels = $products->mapWithKeys(fn ($p) => [
            $p->id => "{$p->name} — Rp".number_format($p->price, 0, ',', '.')." / {$p->unit}",
        ])->toArray();

        $chosenLabel = $this->choice('Pilih product', array_values($labels));
        $chosenId    = array_search($chosenLabel, $labels, true);
        $product     = $products->firstWhere('id', (int) $chosenId);

        $quantity = (float) $this->ask('Qty', 1);
        $price    = (float) $this->ask('Harga satuan (bisa diubah dari harga default)', $product->price);

        return [
            'product_id'  => $product->id,
            'name'        => $product->name,
            'description' => $product->description,
            'quantity'    => $quantity,
            'unit'        => $product->unit ?: 'pcs',
            'price'       => $price,
        ];
    }
}