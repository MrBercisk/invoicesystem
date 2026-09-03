<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoicePdfLink;
use App\Support\PdfTemplateStyles;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PublicInvoicePdfController extends Controller
{
    private const ALLOWED_TEMPLATES = ['minimalis', 'formal', 'gradient'];

    public function show(Request $request, string $token)
    {
        $link = InvoicePdfLink::where('token', $token)->first();

        abort_if($link === null, 403, 'Link tidak valid atau sudah tidak berlaku.');
        abort_if($link->isExpired(), 403, 'Link sudah kedaluwarsa.');

        $invoice = Invoice::findOrFail($link->invoice_id);

        $template = in_array($link->template, self::ALLOWED_TEMPLATES, true)
            ? $link->template
            : 'minimalis';

        $invoice->load(['company', 'client', 'items']);

        $companyLogo = $this->imagePath($invoice->company->logo);
        $companyStamp = $this->imagePath($invoice->company->stamp);
        $companySignature = $this->imagePath($invoice->company->signature);

        $pdf = Pdf::loadView('invoices.pdf.index', [
            'invoice' => $invoice,
            'template' => $template,
            'templateCss' => PdfTemplateStyles::get($template),

            'companyLogo' => $companyLogo,
            'companyStamp' => $companyStamp,
            'companySignature' => $companySignature,
        ])->setPaper('a4', 'portrait');

        $filename = str_replace(
            '/',
            '-',
            "Invoice-{$invoice->invoice_number}.pdf"
        );

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