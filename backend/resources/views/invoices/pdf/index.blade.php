<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page { margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        .watermark {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999;
        }

        .watermark-inner {
            position: absolute;
            top: 47%;
            left: 30%;
            text-transform: uppercase;
            font-weight: 700;
            white-space: nowrap;   /* kunci: box mengikuti panjang teks, bukan container */
        }

        /* DRAFT */
        .watermark-draft {
            font-size: 60px;
            letter-spacing: 8px;
            color: #d4d4d8;
            opacity: 0.4;
            transform: translate(-50%, -50%) rotate(-28deg);
        }

        /* LUNAS */
        .watermark-paid {
            font-size: 22px;
            letter-spacing: 4px;
            color: #047857;
            border: 3px solid #047857;
            padding: 6px 16px;
            opacity: 0.5;
            transform: translate(-50%, -50%) rotate(-14deg);
        }

        /* DIBATALKAN */
        .watermark-cancelled {
            font-size: 19px;
            letter-spacing: 3px;
            color: #b91c1c;
            border: 3px solid #b91c1c;
            padding: 6px 12px;
            opacity: 0.5;
            transform: translate(-50%, -50%) rotate(-14deg);
        }
        

        {!! $templateCss !!}
    </style>
</head>
<body>
    @include('invoices.pdf._watermark', ['invoice' => $invoice])
    @include('invoices.pdf.' . $template, ['invoice' => $invoice])
</body>
</html>