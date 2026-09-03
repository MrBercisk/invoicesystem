@php
    $asetItems = $document->items->where('type', 'barang');
    $fiturItems = $document->items->where('type', 'pekerjaan');
@endphp
<div class="wrap">

    <div class="header">
        <div>
            @if($companyLogo)
                <img
                    src="{{ $companyLogo }}"
                    class="company-logo"
                    alt="{{ $document->company->name }}"
                >
            @endif
            <div class="company-name">{{ $document->company->name }}</div>
            <div class="company-info">
                @if($document->company->address)<div>{{ $document->company->address }}</div>@endif
                @if($document->company->phone)<div>Telp: {{ $document->company->phone }}</div>@endif
            </div>
        </div>
        <div class="header-right">
            <div class="invoice-title">BERITA ACARA SERAH TERIMA</div>
            <div class="invoice-number mono">{{ $document->document_number }}</div>
            <div class="invoice-meta">
                <div>Tanggal: {{ $document->document_date->translatedFormat('d F Y') }}</div>
                @if($document->location)<div>Lokasi: {{ $document->location }}</div>@endif
            </div>
        </div>
    </div>

    <p style="font-size:11px; color:#3f3f46; margin-bottom:16px;">
        Pada hari ini, tanggal {{ $document->document_date->translatedFormat('d F Y') }}, telah dilakukan serah terima
        @if($asetItems->count() > 0 && $fiturItems->count() > 0)
            aset/akses dan fitur
        @elseif($asetItems->count() > 0)
            aset/akses
        @else
            fitur
        @endif
        antara pihak <strong>{{ $document->company->name }}</strong> dengan <strong>{{ $document->client->name }}</strong>
        dengan rincian sebagai berikut:
    </p>

    @if($asetItems->count() > 0)
        <h4 style="font-size:11px; font-weight:800; margin-bottom:8px;">A. Daftar Aset/Akses</h4>
        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr>
                    <th style="width:30px; text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">No</th>
                    <th style="text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">Nama Aset/Akses</th>
                    <th style="width:50px; text-align:right; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">Qty</th>
                    <th style="width:60px; text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">Satuan</th>
                    <th style="width:70px; text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">Kondisi</th>
                    <th style="text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">Catatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($asetItems as $idx => $item)
                    <tr>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">{{ $idx + 1 }}</td>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">
                            {{ $item->name }}
                            @if($item->description)<div style="color:#a1a1aa; font-size:9.5px;">{{ $item->description }}</div>@endif
                        </td>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top; text-align:right;">{{ $item->quantity }}</td>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">{{ $item->unit ?: '-' }}</td>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">{{ $item->condition ?: '-' }}</td>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">{{ $item->notes ?: '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if($fiturItems->count() > 0)
        <h4 style="font-size:11px; font-weight:800; margin-bottom:8px;">B. Daftar Fitur</h4>
        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <thead>
                <tr>
                    <th style="width:30px; text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">No</th>
                    <th style="text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">Nama Fitur</th>
                    <th style="text-align:left; font-size:9px; text-transform:uppercase; color:#71717a; border-bottom:1.5px solid #18181b; padding:5px 4px;">Deskripsi</th>
                </tr>
            </thead>
            <tbody>
                @foreach($fiturItems as $idx => $item)
                    <tr>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">{{ $idx + 1 }}</td>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">{{ $item->name }}</td>
                        <td style="padding:6px 4px; border-bottom:1px solid #e4e4e7; font-size:10.5px; vertical-align:top;">{{ $item->description ?: '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if($document->notes)
        <p style="font-size:10.5px; margin-bottom:16px;"><strong>Catatan:</strong> {{ $document->notes }}</p>
    @endif
    @if($document->terms)
        <p style="font-size:10.5px; margin-bottom:24px; color:#52525b;">{{ $document->terms }}</p>
    @endif

<table class="sign-wrap">
    <tr>
        {{-- YANG MENYERAHKAN --}}
        <td class="sign-box">
            <div class="sign-label">Yang Menyerahkan,</div>

            <div class="sign-imgwrap">
                @if($companyStamp)
                    <img src="{{ $companyStamp }}" class="stamp">
                @endif

                @if($companySignature)
                    <img src="{{ $companySignature }}" class="signature">
                @endif
            </div>

            <div class="sign-name">
                {{ $document->handover_by_name ?: $document->company->name }}
            </div>

            <div class="sign-title">
                {{ $document->handover_by_title ?: 'Penanggung Jawab' }}
            </div>
        </td>

        {{-- YANG MENERIMA --}}
        <td class="sign-box">
            <div class="sign-label">Yang Menerima,</div>

            <div class="sign-imgwrap"></div>

            <div class="sign-name">
                {{ $document->received_by_name ?: $document->client->name }}
            </div>

            <div class="sign-title">
                {{ $document->received_by_title ?: 'Perwakilan Klien' }}
            </div>
        </td>
    </tr>
</table>



    <div class="footer">
        <div>{{ $document->company->name }}</div>
        @if($document->company->email)<div>{{ $document->company->email }}</div>@endif
    </div>
</div>