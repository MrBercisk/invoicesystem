<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $receipt->receipt_number }}</title>
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
            white-space: nowrap;
        }

        /* DIBATALKAN */
        .watermark-void {
            font-size: 19px;
            letter-spacing: 3px;
            color: #b91c1c;
            border: 3px solid #b91c1c;
            padding: 6px 12px;
            opacity: 0.5;
            transform: translate(-50%, -50%) rotate(-14deg);
        }

        {!! $templateCss ?? '' !!}
    </style>
</head>
<body>
    @include('receipt.pdf._watermark', ['receipt' => $receipt])
    @include('receipt.pdf', [
        'receipt' => $receipt,
        'companyLogo' => $companyLogo,
        'companyStamp' => $companyStamp,
        'companySignature' => $companySignature,
    ])
</body>
</html>