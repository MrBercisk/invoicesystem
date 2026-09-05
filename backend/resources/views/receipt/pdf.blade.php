<div class="wrap">

    <div class="header">
        <div>
            @if($companyLogo)
                <img
                    src="{{ $companyLogo }}"
                    class="company-logo"
                    alt="{{ $receipt->company->name }}"
                >
            @endif
            <div class="company-name">{{ $receipt->company->name }}</div>
            <div class="company-info">
                @if($receipt->company->address)<div>{{ $receipt->company->address }}</div>@endif
                @if($receipt->company->phone)<div>Telp: {{ $receipt->company->phone }}</div>@endif
            </div>
        </div>
        <div class="header-right">
            <div class="invoice-title">KWITANSI</div>
            <div class="invoice-number mono">{{ $receipt->receipt_number }}</div>
            <div class="invoice-meta">
                <div>Tanggal: {{ $receipt->receipt_date->translatedFormat('d F Y') }}</div>
                @if($receipt->invoice)
                    <div>Ref. Invoice: {{ $receipt->invoice->invoice_number }}</div>
                @endif
            </div>
        </div>
    </div>

    <div class="bill-to">
        <div class="bill-to-label">Sudah Terima Dari</div>
        <div class="client-name">{{ $receipt->client->name }}</div>
        @if($receipt->client->address)
            <div class="client-info">{{ $receipt->client->address }}</div>
        @endif
    </div>

    <table class="items" style="margin-bottom: 4px;">
        <tbody>
            <tr>
                <td style="width:160px; font-weight:700; color:#52525b;">Untuk Pembayaran</td>
                <td>{{ $receipt->payment_for }}</td>
            </tr>
            <tr>
                <td style="font-weight:700; color:#52525b;">Metode Pembayaran</td>
                <td style="text-transform:capitalize;">{{ $receipt->payment_method }}</td>
            </tr>
        </tbody>
    </table>

    <div class="terbilang">Terbilang: {{ ucfirst($receipt->amount_in_words) }}</div>

    <table class="totals-wrap" style="width:100%;">
        <tr>
            <td></td>
            <td class="totals-box" style="text-align:right;">
                <table class="totals-inner" style="width:100%;">
                    <tr class="totals-final">
                        <td>Total Diterima</td>
                        <td class="text-right">Rp {{ number_format($receipt->amount, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    @if($receipt->requires_stamp_duty)
        <p class="muted" style="font-size:9px; margin-bottom:16px;">
            *Dokumen ini memerlukan materai sesuai ketentuan yang berlaku.
        </p>
    @endif

    @if($receipt->notes)
        <div class="notes-grid">
            <div class="notes-title">Catatan</div>
            <div>{{ $receipt->notes }}</div>
        </div>
    @endif

    <table class="sign-wrap" style="width:100%;">
        <tr>
            <td class="sign-box" style="width:50%; text-align:left;"></td>
            <td class="sign-box">
                <div class="sign-date">
                    {{ $receipt->company->city ?? '' }}, {{ $receipt->receipt_date->translatedFormat('d F Y') }}
                </div>
                <div class="sign-label">Yang Menerima,</div>

                <div class="sign-imgwrap">
                    @if($companyStamp)
                        <img src="{{ $companyStamp }}" class="stamp">
                    @endif

                    @if($companySignature)
                        <img src="{{ $companySignature }}" class="signature">
                    @endif
                </div>

                <div class="sign-name">
                    {{ $receipt->received_by_name ?: $receipt->company->name }}
                </div>

                <div class="sign-title">
                    {{ $receipt->received_by_title ?: 'Penanggung Jawab' }}
                </div>
            </td>
        </tr>
    </table>

    <div class="footer">
        <div>{{ $receipt->company->name }}</div>
        @if($receipt->company->email)<div>{{ $receipt->company->email }}</div>@endif
    </div>
</div>