<div class="wrap">

    <div class="header">
        <div>
            @if($companyLogo)
                <img
                    src="{{ $companyLogo }}"
                    class="company-logo"
                    alt="{{ $invoice->company->name }}"
                >
            @endif
            <div class="company-name">{{ $invoice->company->name }}</div>
            <div class="company-info">
                @if($invoice->company->address)<div>{{ $invoice->company->address }}</div>@endif
                @if($invoice->company->city)<div>{{ $invoice->company->city }}, {{ $invoice->company->country }}</div>@endif
                @if($invoice->company->phone)<div>Telp: {{ $invoice->company->phone }}</div>@endif
                @if($invoice->company->email)<div>{{ $invoice->company->email }}</div>@endif
                @if($invoice->company->npwp)<div class="mono muted">NPWP: {{ $invoice->company->npwp }}</div>@endif
            </div>
        </div>
        <div class="header-right">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number mono">{{ $invoice->invoice_number }}</div>
            <div class="invoice-meta">
                <div>Tanggal: {{ $invoice->invoice_date->translatedFormat('d F Y') }}</div>
                <div>Jatuh tempo: {{ $invoice->due_date->translatedFormat('d F Y') }}</div>
            </div>
        </div>
    </div>
    <hr class="divider">

    @if($invoice->project_code || $invoice->installment_label)
        <table class="project-grid"><tr>
            @if($invoice->project_code)
                <td class="project-box">
                    <div class="project-label">Project</div>
                    <div class="project-value mono">{{ $invoice->project_code }}</div>
                </td>
            @endif
            @if($invoice->installment_label)
                <td class="project-box">
                    <div class="project-label">Termin Pembayaran</div>
                    <div class="project-value">{{ $invoice->installment_label }}</div>
                </td>
            @endif
        </tr></table>
    @endif

    <div class="bill-to">
        <div class="bill-to-label">Ditagihkan kepada</div>
        <div class="client-name">{{ $invoice->client->name }}</div>
        <div class="client-info">
            @if($invoice->client->pic_name)<div>u.p. <b>{{ $invoice->client->pic_name }}</b></div>@endif
            @if($invoice->client->address)<div>{{ $invoice->client->address }}</div>@endif
            @if($invoice->client->city)<div>{{ $invoice->client->city }}, {{ $invoice->client->country }}</div>@endif
            @if($invoice->client->email)<div>{{ $invoice->client->email }}</div>@endif
            @if($invoice->client->npwp)<div class="mono muted">NPWP: {{ $invoice->client->npwp }}</div>@endif
        </div>
    </div>

    <table class="items">
        <thead>
            <tr>
                <th>Deskripsi</th>
                <th class="text-right" style="width:50px;">Qty</th>
                <th style="width:45px;">Sat.</th>
                <th class="text-right" style="width:110px;">Harga</th>
                <th class="text-right" style="width:120px;">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
                <tr>
                    <td>
                        <div class="td-name">{{ $item->name }}</div>
                        @if($item->description)<div class="td-note">{{ $item->description }}</div>@endif
                    </td>
                    <td class="text-right mono">{{ $item->quantity }}</td>
                    <td class="muted">{{ $item->unit }}</td>
                    <td class="text-right mono">{{ 'Rp ' . number_format($item->price, 0, ',', '.') }}</td>
                    <td class="text-right mono td-total">{{ 'Rp ' . number_format($item->total, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals-wrap"><tr><td></td><td class="totals-box">
        <table class="totals-inner">
            <tr><td>Subtotal</td><td class="text-right mono">{{ 'Rp ' . number_format($invoice->subtotal, 0, ',', '.') }}</td></tr>
            @if($invoice->tax_rate > 0)
                <tr><td>PPN ({{ $invoice->tax_rate }}%)</td><td class="text-right mono">{{ 'Rp ' . number_format($invoice->tax_amount, 0, ',', '.') }}</td></tr>
            @endif
            @if($invoice->discount > 0)
                <tr><td>Diskon</td><td class="text-right mono">-{{ 'Rp ' . number_format($invoice->discount, 0, ',', '.') }}</td></tr>
            @endif
            <tr class="totals-final"><td>Total pembayaran</td><td class="text-right mono">{{ 'Rp ' . number_format($invoice->total, 0, ',', '.') }}</td></tr>
        </table>
    </td></tr></table>

    <div class="terbilang">Terbilang: <em>{{ \App\Support\Terbilang::make($invoice->total) }}</em></div>

    @if($invoice->company->bank_name)
        <div class="bank-info">
            <div class="bank-label">Rekening pembayaran</div>
            <div>Bank: <b>{{ $invoice->company->bank_name }}</b></div>
            @if($invoice->company->bank_account_name)<div>Atas nama: <b>{{ $invoice->company->bank_account_name }}</b></div>@endif
            @if($invoice->company->bank_account_number)<div>Nomor rekening: <b class="mono">{{ $invoice->company->bank_account_number }}</b></div>@endif
        </div>
    @endif

    @if($invoice->notes || $invoice->terms)
        <table class="notes-grid"><tr>
            @if($invoice->notes)<td><div class="notes-title">Catatan</div>{{ $invoice->notes }}</td>@endif
            @if($invoice->terms)<td><div class="notes-title">Syarat &amp; ketentuan</div>{{ $invoice->terms }}</td>@endif
        </tr></table>
    @endif

    <table class="sign-wrap"><tr><td></td><td class="sign-box">
        <div class="sign-date">{{ $invoice->company->city ? $invoice->company->city . ', ' : '' }}{{ $invoice->invoice_date->translatedFormat('d F Y') }}</div>
        <div class="sign-label">Hormat kami,</div>
        <div class="sign-imgwrap">
            @if($companyStamp)
                <img src="{{ $companyStamp }}" class="stamp">
            @endif
            @if($companySignature)
                <img src="{{ $companySignature }}" class="signature">
            @endif
        </div>
        <div class="sign-name">{{ $invoice->company->signature_name ?: $invoice->company->name }}</div>
        <div class="sign-title">{{ $invoice->company->signature_title ?: 'Penanggung Jawab' }}</div>
    </td></tr></table>

    <div class="footer">
        <div>{{ $invoice->company->name }}</div>
        @if($invoice->company->email)<div>{{ $invoice->company->email }}</div>@endif
    </div>
</div>