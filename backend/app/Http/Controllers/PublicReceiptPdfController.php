<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\ReceiptPdfLink;
use App\Support\PdfTemplateStyles;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PublicReceiptPdfController extends Controller
{
    public function show(Request $request, string $token)
    {
        $link = ReceiptPdfLink::where('token', $token)->first();

        abort_if($link === null, 403, 'Link tidak valid atau sudah tidak berlaku.');
        abort_if($link->isExpired(), 403, 'Link sudah kedaluwarsa.');

        $receipt = Receipt::findOrFail($link->receipt_id);

        $receipt->load(['company', 'client', 'invoice']);

        $companyLogo = $this->imagePath($receipt->company->logo);
        $companyStamp = $this->imagePath($receipt->company->stamp);
        $companySignature = $this->imagePath($receipt->company->signature);

        $pdf = Pdf::loadView('receipt.pdf.index', [
            'receipt' => $receipt,
            'templateCss' => PdfTemplateStyles::get('minimalis'),

            'companyLogo' => $companyLogo,
            'companyStamp' => $companyStamp,
            'companySignature' => $companySignature,
        ])->setPaper('a4', 'portrait');
        $filename = str_replace('/', '-', "Kwitansi-{$receipt->receipt_number}.pdf");

        return $pdf->stream($filename);
    }

    private function imagePath(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);

        if (!$path) {
            return null;
        }

        $relativePath = ltrim(str_replace('/storage/', '', $path), '/');
        $fullPath = storage_path('app/public/' . $relativePath);

        return file_exists($fullPath) ? $fullPath : null;
    }
}