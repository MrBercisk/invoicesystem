<?php

namespace App\Http\Controllers;

use App\Models\HandoverDocument;
use App\Models\HandoverPdfLink;
use App\Support\PdfTemplateStyles;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PublicHandoverPdfController extends Controller
{
    private const ALLOWED_TEMPLATES = ['minimalis', 'formal', 'gradient'];

    public function show(Request $request, string $token)
    {
        $link = HandoverPdfLink::where('token', $token)->first();

        abort_if($link === null, 403, 'Link tidak valid atau sudah tidak berlaku.');
        abort_if($link->isExpired(), 403, 'Link sudah kedaluwarsa.');

        $document = HandoverDocument::findOrFail($link->handover_document_id);

        $template = in_array($link->template, self::ALLOWED_TEMPLATES, true)
            ? $link->template
            : 'minimalis';

        $document->load(['company', 'client', 'invoice', 'items']);

        $companyLogo = $this->imagePath($document->company->logo);
        $companyStamp = $this->imagePath($document->company->stamp);
        $companySignature = $this->imagePath($document->company->signature);

        $pdf = Pdf::loadView('handover.pdf.index', [
            'document' => $document,
            'template' => $template,
            'templateCss' => PdfTemplateStyles::get($template),

            'companyLogo' => $companyLogo,
            'companyStamp' => $companyStamp,
            'companySignature' => $companySignature,
        ])->setPaper('a4', 'portrait');

        $filename = str_replace(
            '/',
            '-',
            "BAST-{$document->document_number}.pdf"
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