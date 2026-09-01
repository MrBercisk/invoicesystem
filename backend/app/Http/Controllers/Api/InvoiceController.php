<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceStatusRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['company', 'client', 'items'])
                        ->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($clientQuery) use ($search) {
                        $clientQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhere('project_code', 'like', "%{$search}%")
                    ->orWhere('installment_label', 'like', "%{$search}%");
            });
        }
        return ApiResponse::success($query->paginate(15));
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Project baru jika invoice memiliki installment label
        // tetapi belum memiliki project code, generate otomatis.
        // Jika project code sudah ada, gunakan kode tersebut.
        if (
            !empty($data['installment_label']) &&
            empty($data['project_code'])
        ) {
            do {
                $projectCode =
                    'PRJ-' .
                    now()->format('Ymd') .
                    '-' .
                    strtoupper(Str::random(4));
            } while (
                Invoice::where(
                    'project_code',
                    $projectCode
                )->exists()
            );

            $data['project_code'] = $projectCode;
        }

        $invoice = Invoice::create([
            ...$data,
            'invoice_number' => Invoice::generateNumber($data['company_id']),
            'status'         => 'draft',
            'subtotal'       => 0,
            'tax_amount'     => 0,
            'total'          => 0,
        ]);

        foreach ($data['items'] as $item) {
            $itemTotal = $item['quantity'] * $item['price'];

            $invoice->items()->create([
                ...$item,
                'total' => $itemTotal,
            ]);
        }

        $invoice->recalculate();

        return ApiResponse::created(
            $invoice->load(['company', 'client', 'items'])
        );
    }

    public function show(Invoice $invoice): JsonResponse
    {
        return ApiResponse::success($invoice->load(['company', 'client', 'items.product']));
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): JsonResponse
    {
        $data = $request->validated();

        $invoice->update($data);

        if (isset($data['items'])) {
            $invoice->items()->delete();
            foreach ($data['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['price'];
                $invoice->items()->create([...$item, 'total' => $itemTotal]);
            }
            $invoice->recalculate();
        }

        return ApiResponse::success($invoice->load(['company', 'client', 'items']));
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        try {
            $invoice->delete();

            return ApiResponse::message('Deleted successfully');
        } catch (QueryException $e) {
            return ApiResponse::error('Invoice tidak bisa dihapus karena masih memiliki data terkait.');
        }
    }

    public function updateStatus(UpdateInvoiceStatusRequest $request, Invoice $invoice): JsonResponse
    {
        $invoice->update(['status' => $request->validated('status')]);

        return ApiResponse::success($invoice);
    }
    public function projects(Request $request): JsonResponse
    {
        $request->validate([
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
        ]);

        $projects = Invoice::query()
            ->where('company_id', $request->integer('company_id'))
            ->where('client_id', $request->integer('client_id'))
            ->whereNotNull('project_code')
            ->where('project_code', '!=', '')
            ->select([
                'id',
                'invoice_number',
                'project_code',
                'installment_label',
                'client_id',
                'company_id',
                'invoice_date',
                'status',
                'total',
            ])
            ->orderBy('invoice_date')
            ->get()
            ->groupBy('project_code')
            ->map(function ($invoices, $projectCode) {
                $projectTotal = $invoices->sum(
                    fn ($invoice) => (float) $invoice->total
                );

                $paidTotal = $invoices
                    ->where('status', 'paid')
                    ->sum(
                        fn ($invoice) => (float) $invoice->total
                    );

                return [
                    'project_code' => $projectCode,
                    'project_total' => $projectTotal,
                    'invoice_count' => $invoices->count(),
                    'paid_total' => $paidTotal,
                    'remaining_total' => $projectTotal - $paidTotal,

                    'invoices' => $invoices->map(
                        fn ($invoice) => [
                            'id' => $invoice->id,
                            'invoice_number' =>
                                $invoice->invoice_number,
                            'installment_label' =>
                                $invoice->installment_label,
                            'invoice_date' =>
                                $invoice->invoice_date,
                            'status' =>
                                $invoice->status,
                            'total' =>
                                (float) $invoice->total,
                        ]
                    )->values(),
                ];
            })
            ->values();

        return ApiResponse::success($projects);
    }
}