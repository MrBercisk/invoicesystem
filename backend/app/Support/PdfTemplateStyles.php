<?php

namespace App\Support;

class PdfTemplateStyles
{
    public static function get(string $template): string
    {
        return match ($template) {
            'formal' => self::formal(),
            'gradient' => self::gradient(),
            default => self::minimalis(),
        };
    }

    private static function shared(): string
    {
        return "
            .text-right { text-align: right; }
            .mono { font-family: 'Courier New', monospace; }
            .muted { color: #71717a; }
            .discount { color: #991b1b; }
            table { border-collapse: collapse; width: 100%; }
        ";
    }

    private static function minimalis(): string
    {
        return self::shared() . "
            body { font-family: 'Helvetica', Arial, sans-serif; font-size: 11px; color: #18181b; }
            .wrap { padding: 22mm 20mm; }
            .header { width: 100%; display: table; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #d4d4d8; }
            .header > div { display: table-cell; vertical-align: top; }
            .header-right { text-align: right; }
            .company-logo { max-height: 45px; max-width: 200px; margin-bottom: 8px; }
            .company-name { font-size: 15px; font-weight: 700; color: #09090b; }
            .company-info { font-size: 9px; color: #71717a; margin-top: 4px; line-height: 1.6; }
            .invoice-title { font-size: 9.5px; font-weight: 700; color: #52525b; letter-spacing: 1px; text-transform: uppercase; }
            .invoice-number { font-size: 15px; font-weight: 700; color: #09090b; margin-top: 4px; }
            .invoice-meta { font-size: 9px; color: #71717a; margin-top: 8px; line-height: 1.7; }

            .project-grid { margin-bottom: 14px; }
            .project-box { background: #fafafa; border: 1px solid #e4e4e7; padding: 8px 10px; width: 50%; }
            .project-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 700; margin-bottom: 2px; }
            .project-value { font-size: 10px; font-weight: 700; color: #09090b; }

            .bill-to { border-top: 1px solid #e4e4e7; padding-top: 10px; margin-bottom: 18px; }
            .bill-to-label { font-size: 8.5px; font-weight: 700; color: #71717a; margin-bottom: 3px; }
            .client-name { font-size: 12.5px; font-weight: 700; color: #09090b; }
            .client-info { font-size: 9px; color: #52525b; line-height: 1.6; margin-top: 2px; }

            .items th { font-size: 8.5px; font-weight: 700; color: #52525b; padding: 6px; border-bottom: 1.5px solid #18181b; text-align: left; }
            .items td { font-size: 9.5px; color: #27272a; padding: 8px 6px; border-bottom: 1px solid #f0f0f1; vertical-align: top; }
            .td-name { font-weight: 700; color: #09090b; }
            .td-note { font-size: 8.5px; color: #71717a; margin-top: 2px; }
            .td-total { font-weight: 700; color: #09090b; }

            .totals-wrap { margin-bottom: 16px; }
            .totals-box { width: 250px; }
            .totals-inner td { border-bottom: none; padding: 3px 0; font-size: 9.5px; color: #52525b; }
            .totals-final td { font-size: 11.5px; font-weight: 700; color: #09090b; padding-top: 8px; border-top: 1.5px solid #18181b !important; }
            .totals-final td.text-right { color: #991b1b; font-size: 13px; }

            .terbilang { font-size: 10px; color: #71717a; text-align: right; margin-bottom: 16px; font-style: italic; }

            .bank-info { border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 10px 0; margin-bottom: 16px; font-size: 9.5px; color: #27272a; line-height: 1.6; }
            .bank-label { font-size: 8.5px; font-weight: 700; color: #71717a; margin-bottom: 4px; }

            .notes-grid { margin-bottom: 20px; font-size: 9px; color: #52525b; }
            .notes-grid td { width: 50%; vertical-align: top; padding-right: 12px; }
            .notes-title { font-weight: 700; color: #52525b; margin-bottom: 3px; font-size: 8.5px; }

            .sign-wrap { margin-top: 14px; margin-bottom: 18px; }
            .sign-box { width: 190px; text-align: center; font-size: 9.5px; }
            .sign-date { font-size: 9px; color: #71717a; margin-bottom: 2px; }
            .sign-label { font-weight: 700; color: #09090b; margin-bottom: 4px; }
            .sign-imgwrap { position: relative; height: 76px; margin: 4px 0; text-align: center; }
            .signature { max-height: 70px; max-width: 165px; }
            .stamp { position: absolute; width: 70px; height: 70px; left: 50%; top: 50%; margin-left: -35px; margin-top: -35px; opacity: 0.6; }
            .sign-name { font-weight: 700; color: #09090b; font-size: 10px; border-top: 1px solid #18181b; padding-top: 4px; }
            .sign-title { font-size: 8.5px; color: #71717a; margin-top: 2px; }

            .footer { border-top: 1px solid #e4e4e7; padding-top: 10px; text-align: center; font-size: 8.5px; color: #a1a1aa; }
        ";
    }

    private static function formal(): string
    {
        return self::shared() . "
            body { font-family: 'Times New Roman', Georgia, serif; font-size: 11px; color: #1a1a1a; }
            .wrap { padding: 22mm 20mm; }
            .header { width: 100%; display: table; margin-bottom: 14px; }
            .header > div { display: table-cell; vertical-align: top; }
            .header-right { text-align: right; }
            .company-logo { max-height: 50px; max-width: 200px; margin-bottom: 8px; }
            .company-name { font-size: 16px; font-weight: 700; }
            .company-info { font-family: Helvetica, Arial, sans-serif; font-size: 9.5px; color: #4b4b4b; margin-top: 3px; line-height: 1.5; }
            .invoice-title { font-size: 17px; font-weight: 700; letter-spacing: 1.5px; }
            .invoice-number { font-family: 'Courier New', monospace; font-size: 10px; color: #4b4b4b; margin-top: 2px; }
            .invoice-meta { font-family: Helvetica, Arial, sans-serif; font-size: 9.5px; color: #4b4b4b; margin-top: 8px; line-height: 1.6; }
            .divider { border: none; border-top: 1px solid #1a1a1a; margin: 10px 0 16px; }

            .project-grid { margin-bottom: 14px; }
            .project-box { border: 1px solid #d4d4d4; padding: 8px 10px; width: 50%; font-family: Helvetica, Arial, sans-serif; }
            .project-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b6b6b; font-weight: 700; margin-bottom: 2px; }
            .project-value { font-size: 10px; font-weight: 700; color: #1a1a1a; }

            .bill-to { margin-bottom: 16px; border-top: 1px solid #d4d4d4; padding-top: 8px; font-family: Helvetica, Arial, sans-serif; }
            .bill-to-label { font-size: 8.5px; font-weight: 500; color: #6b6b6b; margin-bottom: 3px; }
            .client-name { font-family: 'Times New Roman', serif; font-size: 12.5px; font-weight: 700; color: #1a1a1a; }
            .client-info { font-size: 9.5px; color: #4b4b4b; line-height: 1.5; margin-top: 3px; }

            .items { font-family: Helvetica, Arial, sans-serif; }
            .items th { font-size: 9px; font-weight: 700; color: #4b4b4b; padding: 6px; border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; text-align: left; }
            .items td { font-size: 9.5px; color: #1a1a1a; padding: 7px 6px; border-bottom: 1px solid #e8e8e8; vertical-align: top; }
            .td-name { font-family: 'Times New Roman', serif; font-weight: 500; font-size: 11px; }
            .td-note { font-size: 8.5px; color: #6b6b6b; font-style: italic; margin-top: 2px; }
            .td-total { font-weight: 500; }

            .totals-wrap { margin-bottom: 16px; font-family: Helvetica, Arial, sans-serif; }
            .totals-box { width: 250px; }
            .totals-inner td { border-bottom: none; padding: 3px 0; font-size: 9.5px; color: #4b4b4b; }
            .totals-final td { font-size: 11.5px; font-weight: 700; color: #1a1a1a; padding-top: 7px; border-top: 2px solid #1a1a1a !important; }

            .terbilang { font-size: 9.5px; color: #6b6b6b; text-align: right; margin-bottom: 16px; font-style: italic; }

            .bank-info { border-top: 1px solid #d4d4d4; border-bottom: 1px solid #d4d4d4; padding: 9px 0; margin-bottom: 16px; font-family: Helvetica, Arial, sans-serif; font-size: 9.5px; color: #1a1a1a; line-height: 1.6; }
            .bank-label { font-size: 8.5px; font-weight: 500; color: #6b6b6b; margin-bottom: 4px; }

            .notes-grid { margin-bottom: 20px; font-family: Helvetica, Arial, sans-serif; font-size: 9px; color: #4b4b4b; }
            .notes-grid td { width: 50%; vertical-align: top; padding-right: 12px; }
            .notes-title { font-weight: 700; margin-bottom: 3px; font-size: 8.5px; color: #6b6b6b; }

            .sign-wrap { margin-top: 12px; margin-bottom: 16px; }
            .sign-box { width: 190px; text-align: center; font-size: 9.5px; }
            .sign-date { font-family: Helvetica, Arial, sans-serif; font-size: 9px; color: #4b4b4b; margin-bottom: 2px; }
            .sign-label { font-family: Helvetica, Arial, sans-serif; font-weight: 500; color: #4b4b4b; margin-bottom: 4px; }
            .sign-imgwrap { position: relative; height: 76px; margin: 4px 0; text-align: center; }
            .signature { max-height: 70px; max-width: 165px; }
            .stamp { position: absolute; width: 70px; height: 70px; left: 50%; top: 50%; margin-left: -35px; margin-top: -35px; opacity: 0.6; }
            .sign-name { font-weight: 700; color: #1a1a1a; font-size: 10.5px; border-top: 1px solid #1a1a1a; padding-top: 4px; }
            .sign-title { font-family: Helvetica, Arial, sans-serif; font-size: 8.5px; color: #4b4b4b; margin-top: 2px; }

            .footer { border-top: 1px solid #1a1a1a; padding-top: 9px; text-align: center; font-size: 8.5px; color: #6b6b6b; font-style: italic; }
        ";
    }

    private static function gradient(): string
    {
        return self::shared() . "
            body { font-family: 'Helvetica', Arial, sans-serif; font-size: 10.5px; color: #18181b; }
            .wrap { }
            .header-bg { background: #17171a; padding: 24px 26px 20px; color: #ffffff; border-bottom: 2px solid #7f1d1d; }
            .header-inner { width: 100%; }
            .header-inner td { vertical-align: top; }
            .header-right { text-align: right; }
            .company-logo { max-height: 42px; max-width: 188px; margin-bottom: 10px; }
            .company-name { font-size: 16px; font-weight: 700; color: #ffffff; }
            .company-info { font-size: 9px; color: #a1a1aa; margin-top: 4px; line-height: 1.5; }
            .muted-light { color: #71717a; }
            .invoice-title { font-size: 9px; font-weight: 700; color: #d4a5ab; letter-spacing: 1.5px; text-transform: uppercase; }
            .invoice-number { font-size: 16px; font-weight: 700; color: #ffffff; margin-top: 4px; }
            .invoice-meta { font-size: 9px; color: #a1a1aa; margin-top: 8px; line-height: 1.6; }

            .body-wrap { padding: 22px 26px; }

            .project-grid { margin-bottom: 14px; }
            .project-box { background: #fafafa; border: 1px solid #e4e4e7; padding: 8px 10px; width: 50%; }
            .project-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; font-weight: 700; margin-bottom: 2px; }
            .project-value { font-size: 10px; font-weight: 700; color: #09090b; }

            .bill-to { padding-top: 10px; padding-bottom: 10px; margin-bottom: 16px; border-bottom: 1px solid #e4e4e7; }
            .bill-to-label { font-size: 8.5px; font-weight: 700; color: #71717a; margin-bottom: 3px; }
            .client-name { font-size: 12px; font-weight: 700; color: #09090b; }
            .client-info { font-size: 9px; color: #52525b; line-height: 1.6; margin-top: 2px; }

            .items th { font-size: 8.5px; font-weight: 700; color: #52525b; padding: 6px; border-bottom: 1.5px solid #18181b; text-align: left; }
            .items td { font-size: 9px; color: #27272a; padding: 8px 6px; border-bottom: 1px solid #f0f0f1; vertical-align: top; }
            .td-name { font-weight: 700; color: #09090b; }
            .td-note { font-size: 8.5px; color: #71717a; margin-top: 2px; }
            .td-total { font-weight: 700; color: #09090b; }

            .totals-wrap { margin-bottom: 16px; }
            .totals-box { width: 250px; }
            .totals-inner td { border-bottom: none; padding: 3px 0; font-size: 9.5px; color: #52525b; }
            .totals-final-box { width: 100%; margin-top: 6px; background: #17171a; }
            .totals-final-box td { color: #ffffff; font-size: 11.5px; font-weight: 700; padding: 8px 10px; border-left: 2px solid #7f1d1d; }

            .terbilang { font-size: 9.5px; color: #71717a; text-align: right; margin-bottom: 16px; font-style: italic; }

            .bank-info { border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 9px 0; margin-bottom: 16px; font-size: 9.5px; color: #27272a; line-height: 1.6; }
            .bank-label { font-size: 8.5px; font-weight: 700; color: #71717a; margin-bottom: 4px; }

            .notes-grid { margin-bottom: 20px; font-size: 9px; color: #52525b; }
            .notes-grid td { width: 50%; vertical-align: top; padding-right: 12px; }
            .notes-title { font-weight: 700; color: #52525b; margin-bottom: 3px; font-size: 8.5px; }

            .sign-wrap { margin-top: 14px; margin-bottom: 16px; }
            .sign-box { width: 190px; text-align: center; font-size: 9.5px; }
            .sign-date { font-size: 9px; color: #71717a; margin-bottom: 2px; }
            .sign-label { font-weight: 700; color: #09090b; margin-bottom: 4px; }
            .sign-imgwrap { position: relative; height: 74px; margin: 4px 0; text-align: center; }
            .signature { max-height: 68px; max-width: 160px; }
            .stamp { position: absolute; width: 68px; height: 68px; left: 50%; top: 50%; margin-left: -34px; margin-top: -34px; opacity: 0.6; }
            .sign-name { font-weight: 700; color: #09090b; font-size: 10px; border-top: 1.5px solid #18181b; padding-top: 4px; }
            .sign-title { font-size: 8.5px; color: #71717a; margin-top: 2px; }

            .footer { border-top: 1px solid #e4e4e7; padding-top: 10px; text-align: center; font-size: 8px; color: #a1a1aa; }
        ";
    }
}