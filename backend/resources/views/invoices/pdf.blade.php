<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page { margin: 28px 32px; }
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #18181b; }
        .header { display: flex; justify-content: space-between; margin-bottom: 18px; }
        .company-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .company-info { font-size: 9.5px; color: #52525b; line-height: 1.5; }
        .invoice-title { font-size: 18px; font-weight: 800; text-align: right; text-transform: uppercase; }
        .invoice-number { font-family: monospace; font-size: 11px; text-align: right; color: #3f3f46; margin-top: 2px; }
        .invoice-meta { font-size: 9.5px; text-align: right; color: #52525b; margin-top: 6px; line-height: 1.6; }
        .status-badge {
            display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase;
            padding: 3px 10px; border-radius: 4px; letter-spacing: 0.5px; margin-top: 6px;
        }
        .status-draft { background: #f4f4f5; color: #52525b; }
        .status-sent { background: #f4f4f5; color: #18181b; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .project-box {
            background: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px;
            padding: 8px 12px; margin-bottom: 14px; font-size: 9.5px;
        }
        .project-box b { font-size: 10.5px; }
        .bill-to { margin-bottom: 14px; }
        .bill-to-label { font-size: 9px; text-transform: uppercase; color: #71717a; font-weight: 700; margin-bottom: 3px; }
        .client-name { font-size: 13px; font-weight: 700; }
        .client-info { font-size: 9.5px; color: #52525b; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        th { text-align: left; font-size: 9px; text-transform: uppercase; color: #71717a; border-bottom: 1.5px solid #18181b; padding: 5px 4px; }
        td { padding: 6px 4px; border-bottom: 1px solid #e4e4e7; font-size: 10.5px; vertical-align: top; }
        .text-right { text-align: right; }
        .totals { width: 260px; margin-left: auto; margin-bottom: 14px; }
        .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 10.5px; }
        .totals-final { display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #18181b; font-size: 13px; font-weight: 800; }
        .terbilang {
            background: #fafafa; border-left: 3px solid #dc2626; border-radius: 4px;
            padding: 8px 12px; margin-bottom: 14px; font-size: 10px;
        }
        .bank-info { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px; padding: 8px 12px; margin-bottom: 14px; font-size: 10px; }
        .notes-grid { display: flex; gap: 16px; font-size: 9.5px; color: #3f3f46; margin-bottom: 20px; }
        .notes-title { font-weight: 700; text-transform: uppercase; font-size: 8.5px; color: #71717a; margin-bottom: 3px; }
        .footer { text-align: center; font-size: 8.5px; color: #a1a1aa; border-top: 1px solid #e4e4e7; padding-top: 10px; }
    </style>
</head>
<body>

    <div class="header">
        <div>
            <div class="company-name">{{ $invoice->company->name }}</div>
            <div class="company-info">
                @if($invoice->company->address){{ $invoice->company->address }}<br>@endif
                @if($invoice->company->city){{ $invoice->company->city }}<br>@endif
                @if($invoice->company->phone)Telp: {{ $invoice->company->phone }}<br>@endif
                @if($invoice->company->email){{ $invoice->company->email }}@endif
            </div>
        </div>
        <div>
            <div class="invoice-title">Invoice</div>
            <div class="invoice-number">{{ $invoice->invoice_number }}</div>
            <div class="invoice-meta">
                Tanggal: {{ $invoice->invoice_date->translatedFormat('d F Y') }}<br>
                Jatuh Tempo: {{ $invoice->due_date->translatedFormat('d F Y') }}
            </div>
            <div style="text-align:right;">
                <span class="status-badge status-{{ $invoice->status }}">
                    @switch($invoice->status)
                        @case('draft') Draft @break
                        @case('sent') Terkirim @break
                        @case('paid') Lunas @break
                        @case('cancelled') Dibatalkan @break
                    @endswitch
                </span>
            </div>
        </div>
    </div>

    @if($invoice->project_code || $invoice->installment_label)
        <div class="project-box">
            @if($invoice->project_code)<span>Project: <b>{{ $invoice->project_code }}</b></span><br>@endif
            @if($invoice->installment_label)<span>Termin: <b>{{ $invoice->installment_label }}</b></span><br>@endif
            @if($invoice->project_code)
                <span style="color:#71717a;">
                    Total Project: {{ 'Rp ' . number_format($invoice->project_total, 0, ',', '.') }}
                    &nbsp;•&nbsp; Sudah Dibayar (termin lain): {{ 'Rp ' . number_format($invoice->already_paid, 0, ',', '.') }}
                    &nbsp;•&nbsp; Sisa Setelah Invoice Ini: {{ 'Rp ' . number_format($invoice->remaining, 0, ',', '.') }}
                </span>
            @endif
        </div>
    @endif

    <div class="bill-to">
        <div class="bill-to-label">Ditagihkan Kepada</div>
        <div class="client-name">{{ $invoice->client->name }}</div>
        <div class="client-info">
            @if($invoice->client->pic_name)u.p. {{ $invoice->client->pic_name }}<br>@endif
            @if($invoice->client->address){{ $invoice->client->address }}<br>@endif
            @if($invoice->client->city){{ $invoice->client->city }}<br>@endif
            @if($invoice->client->email){{ $invoice->client->email }}@endif
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Deskripsi</th>
                <th class="text-right" style="width:50px;">Qty</th>
                <th style="width:45px;">Sat.</th>
                <th class="text-right" style="width:110px;">Harga Satuan</th>
                <th class="text-right" style="width:110px;">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
                <tr>
                    <td>
                        <b>{{ $item->name }}</b>
                        @if($item->description)<br><span style="color:#a1a1aa;">{{ $item->description }}</span>@endif
                    </td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td style="color:#a1a1aa;">{{ $item->unit }}</td>
                    <td class="text-right">{{ 'Rp ' . number_format($item->price, 0, ',', '.') }}</td>
                    <td class="text-right"><b>{{ 'Rp ' . number_format($item->total, 0, ',', '.') }}</b></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row"><span>Subtotal</span><span>{{ 'Rp ' . number_format($invoice->subtotal, 0, ',', '.') }}</span></div>
        @if($invoice->tax_rate > 0)
            <div class="totals-row"><span>PPN ({{ $invoice->tax_rate }}%)</span><span>{{ 'Rp ' . number_format($invoice->tax_amount, 0, ',', '.') }}</span></div>
        @endif
        @if($invoice->discount > 0)
            <div class="totals-row"><span>Diskon</span><span>- {{ 'Rp ' . number_format($invoice->discount, 0, ',', '.') }}</span></div>
        @endif
        <div class="totals-final"><span>Total</span><span>{{ 'Rp ' . number_format($invoice->total, 0, ',', '.') }}</span></div>
    </div>

    <div class="terbilang">
        <b style="color:#dc2626; text-transform:uppercase; font-size:8.5px;">Terbilang:</b><br>
        <em>{{ \App\Support\Terbilang::make($invoice->total) }}</em>
    </div>

    @if($invoice->company->bank_name)
        <div class="bank-info">
            <b style="text-transform:uppercase; font-size:8.5px; color:#71717a;">Informasi Rekening Pembayaran</b><br>
            Bank: <b>{{ $invoice->company->bank_name }}</b><br>
            @if($invoice->company->bank_account_name)A/N: <b>{{ $invoice->company->bank_account_name }}</b><br>@endif
            @if($invoice->company->bank_account_number)No. Rek: <b>{{ $invoice->company->bank_account_number }}</b>@endif
        </div>
    @endif

    @if($invoice->notes || $invoice->terms)
        <div class="notes-grid">
            @if($invoice->notes)
                <div style="flex:1;"><div class="notes-title">Catatan</div>{{ $invoice->notes }}</div>
            @endif
            @if($invoice->terms)
                <div style="flex:1;"><div class="notes-title">Syarat & Ketentuan</div>{{ $invoice->terms }}</div>
            @endif
        </div>
    @endif

    <div class="footer">
        Terima kasih atas kepercayaan Anda • {{ $invoice->company->name }}
        @if($invoice->company->email) • {{ $invoice->company->email }}@endif
    </div>

</body>
</html>