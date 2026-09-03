export type Template = 'minimalis' | 'formal' | 'gradient';

export const templateMeta: Record<Template, { label: string; desc: string; preview: string }> = {
  minimalis: { label: 'Modern Crimson', desc: 'Sans-serif bersih, satu aksen merah', preview: 'bg-white border border-zinc-300' },
  formal:    { label: 'Classic Ledger',  desc: 'Monokrom, gaya akuntansi resmi',    preview: 'bg-white border border-zinc-900' },
  gradient:  { label: 'Executive Onyx',  desc: 'Header gelap, sentuhan oxblood',    preview: 'bg-zinc-950 border border-red-900' },
};

export const getTemplateStyles = (t: Template): string => {
  if (t === 'minimalis') return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11.5px; color: #18181b; background: white; -webkit-font-smoothing: antialiased; }
    .wrap { width: 210mm; padding: 20mm 22mm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; padding-bottom: 16px; border-bottom: 1px solid #d4d4d8; }
    .company-logo { max-height: 50px; max-width: 213px; object-fit: contain; margin-bottom: 10px; display: block; }
    .company-name { font-size: 17px; font-weight: 700; color: #09090b; letter-spacing: -0.2px; }
    .company-info { font-size: 10px; color: #71717a; margin-top: 4px; line-height: 1.6; }
    .invoice-title { font-size: 10.5px; font-weight: 600; color: #52525b; letter-spacing: 1.2px; text-transform: uppercase; text-align: right; }
    .invoice-number { font-size: 17px; font-weight: 700; color: #09090b; text-align: right; margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
    .invoice-meta { font-size: 10px; color: #71717a; text-align: right; margin-top: 8px; line-height: 1.7; }
    .label { color: #a1a1aa; font-weight: 500; }

    .bill-to { border-top: 1px solid #e4e4e7; padding-top: 12px; margin-bottom: 24px; }
    .bill-to-label { font-size: 9.5px; font-weight: 600; color: #71717a; margin-bottom: 4px; }
    .client-name { font-size: 14px; font-weight: 700; color: #09090b; }
    .client-info { font-size: 10px; color: #52525b; line-height: 1.6; margin-top: 2px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 22px; }
    th { font-size: 9.5px; font-weight: 600; color: #52525b; padding: 8px 8px; border-bottom: 1.5px solid #18181b; text-align: left; }
    th:first-child { padding-left: 0; }
    td { font-size: 10.5px; color: #27272a; padding: 10px 8px; border-bottom: 1px solid #f0f0f1; vertical-align: top; }
    td:first-child { padding-left: 0; }
    .td-right { text-align: right; font-family: 'JetBrains Mono', monospace; }
    .td-name { font-weight: 600; color: #09090b; }
    .td-note { font-size: 9.5px; color: #71717a; margin-top: 2px; }

    .totals { display: flex; justify-content: flex-end; margin-bottom: 22px; }
    .totals-box { width: 270px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #52525b; padding: 4px 0; }
    .totals-row span:last-child { font-family: 'JetBrains Mono', monospace; color: #09090b; font-weight: 600; }
    .totals-final { display: flex; justify-content: space-between; align-items: baseline; font-size: 12.5px; font-weight: 700; color: #09090b; padding: 10px 0 2px; margin-top: 6px; border-top: 1.5px solid #18181b; }
    .totals-amount { font-family: 'JetBrains Mono', monospace; color: #991b1b; font-size: 15px; }

    .bank-info { border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 12px 0; margin-bottom: 20px; }
    .bank-label { font-size: 9.5px; font-weight: 600; color: #71717a; margin-bottom: 4px; }
    .bank-row { font-size: 10.5px; color: #27272a; line-height: 1.6; }
    .bank-value { font-weight: 600; color: #09090b; }

    .signature-section { display: flex; justify-content: flex-end; margin-top: 20px; margin-bottom: 22px; page-break-inside: avoid; }
    .signature-wrap { width: 210px; text-align: center; font-size: 10.5px; color: #52525b; }
    .signature-date { margin-bottom: 3px; font-size: 10px; color: #71717a; }
    .signature-company { font-weight: 600; color: #09090b; margin-bottom: 4px; font-size: 11px; }
    .signature-box { position: relative; height: 95px; margin: 4px 0; display: flex; align-items: center; justify-content: center; }
    .signature-img { position: relative; z-index: 2; max-width: 175px; max-height: 75px; object-fit: contain; }
    .stamp-img { position: absolute; z-index: 1; width: 80px; height: 80px; object-fit: contain; left: 50%; top: 50%; transform: translate(-50%, -50%); opacity: 0.7; }
    .signature-line { border-bottom: 1px solid #18181b; margin-top: 2px; padding-bottom: 2px; }
    .signer-name { font-weight: 700; color: #09090b; font-size: 11px; }
    .signer-title { font-size: 9.5px; color: #71717a; margin-top: 2px; }

    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 10px; color: #52525b; margin-bottom: 20px; }
    .notes-title { font-weight: 600; color: #52525b; margin-bottom: 3px; font-size: 9.5px; }
    .footer { border-top: 1px solid #e4e4e7; padding-top: 12px; text-align: center; font-size: 9.5px; color: #a1a1aa; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  if (t === 'formal') return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Newsreader', Georgia, 'Times New Roman', serif; font-size: 11.5px; color: #1a1a1a; background: white; }
    .wrap { width: 210mm; padding: 20mm 22mm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
    .company-logo { max-height: 57px; max-width: 213px; object-fit: contain; margin-bottom: 10px; display: block; }
    .company-name { font-size: 18px; font-weight: 700; color: #1a1a1a; }
    .company-info { font-size: 10.5px; color: #4b4b4b; margin-top: 3px; line-height: 1.5; font-family: sans-serif; }
    .invoice-title { font-size: 19px; font-weight: 600; color: #1a1a1a; text-align: right; letter-spacing: 1.5px; }
    .invoice-number { font-size: 11.5px; color: #4b4b4b; font-weight: 500; text-align: right; margin-top: 2px; font-family: 'JetBrains Mono', monospace; }
    .invoice-meta { font-size: 10.5px; color: #4b4b4b; text-align: right; margin-top: 8px; line-height: 1.6; font-family: sans-serif; }
    .label { font-weight: 500; color: #6b6b6b; }
    .divider { border: none; border-top: 1px solid #1a1a1a; margin: 12px 0 20px 0; }

    .bill-to { margin-bottom: 20px; border-top: 1px solid #d4d4d4; padding-top: 10px; }
    .bill-to-label { font-size: 9.5px; font-weight: 500; color: #6b6b6b; margin-bottom: 4px; font-family: sans-serif; }
    .client-name { font-size: 13.5px; font-weight: 700; color: #1a1a1a; }
    .client-info { font-size: 10.5px; color: #4b4b4b; line-height: 1.5; margin-top: 3px; font-family: sans-serif; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { font-size: 10px; font-weight: 600; color: #4b4b4b; padding: 7px 6px; border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; text-align: left; font-family: sans-serif; }
    th:first-child { padding-left: 0; }
    td { font-size: 10.5px; color: #1a1a1a; padding: 8px 6px; border-bottom: 1px solid #e8e8e8; vertical-align: top; font-family: sans-serif; }
    td:first-child { padding-left: 0; }
    .td-right { text-align: right; font-family: 'JetBrains Mono', monospace; }
    .td-name { font-weight: 500; font-family: serif; font-size: 12px; }
    .td-note { font-size: 9.5px; color: #6b6b6b; margin-top: 2px; font-style: italic; }

    .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
    .totals-box { width: 270px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #4b4b4b; padding: 4px 0; font-family: sans-serif; }
    .totals-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: #1a1a1a; }
    .totals-final { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; padding: 8px 0 0; margin-top: 4px; border-top: 2px solid #1a1a1a; font-family: sans-serif; color: #1a1a1a; }

    .bank-info { border-top: 1px solid #d4d4d4; border-bottom: 1px solid #d4d4d4; padding: 10px 0; margin-bottom: 18px; }
    .bank-label { font-size: 9.5px; font-weight: 500; color: #6b6b6b; margin-bottom: 4px; font-family: sans-serif; }
    .bank-row { font-size: 10.5px; color: #1a1a1a; line-height: 1.6; font-family: sans-serif; }
    .bank-value { font-weight: 600; }

    .signature-section { display: flex; justify-content: flex-end; margin-top: 18px; margin-bottom: 20px; page-break-inside: avoid; }
    .signature-wrap { width: 210px; text-align: center; font-size: 10.5px; color: #1a1a1a; }
    .signature-date { margin-bottom: 3px; font-size: 10px; font-family: sans-serif; color: #4b4b4b; }
    .signature-company { font-weight: 500; margin-bottom: 4px; font-family: sans-serif; font-size: 10.5px; color: #4b4b4b; }
    .signature-box { position: relative; height: 95px; margin: 4px 0; display: flex; align-items: center; justify-content: center; }
    .signature-img { position: relative; z-index: 2; max-width: 175px; max-height: 75px; object-fit: contain; }
    .stamp-img { position: absolute; z-index: 1; width: 80px; height: 80px; object-fit: contain; left: 50%; top: 50%; transform: translate(-50%, -50%); opacity: 0.7; }
    .signature-line { border-bottom: 1px solid #1a1a1a; margin-top: 2px; padding-bottom: 2px; }
    .signer-name { font-weight: 700; color: #1a1a1a; font-size: 11.5px; }
    .signer-title { font-size: 9.5px; color: #4b4b4b; margin-top: 2px; font-family: sans-serif; }

    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 10px; color: #4b4b4b; margin-bottom: 20px; font-family: sans-serif; }
    .notes-title { font-weight: 600; margin-bottom: 3px; font-size: 9.5px; color: #6b6b6b; }
    .footer { border-top: 1px solid #1a1a1a; padding-top: 10px; text-align: center; font-size: 9.5px; color: #6b6b6b; font-style: italic; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  // Executive Onyx
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #18181b; background: white; -webkit-font-smoothing: antialiased; }
    .wrap { width: 210mm; margin: 0 auto; }
    .header-bg { background: #17171a; padding: 26px 28px 22px; color: white; border-bottom: 2px solid #7f1d1d; }
    .company-logo { max-height: 47px; max-width: 200px; object-fit: contain; margin-bottom: 12px; display: block; }
    .company-name { font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.2px; }
    .company-info { font-size: 9.5px; color: #a1a1aa; margin-top: 4px; line-height: 1.5; }
    .invoice-title { font-size: 10px; font-weight: 600; color: #d4a5ab; letter-spacing: 1.5px; text-transform: uppercase; text-align: right; }
    .invoice-number { font-size: 18px; font-weight: 700; color: #ffffff; text-align: right; margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
    .invoice-meta { font-size: 9.5px; color: #a1a1aa; text-align: right; margin-top: 8px; line-height: 1.6; }
    .label { color: #71717a; }
    .body-wrap { padding: 24px 28px; }

    .bill-to { border-top: 1px solid #e4e4e7; padding-top: 12px; margin-bottom: 22px; }
    .bill-to-label { font-size: 9px; font-weight: 600; color: #71717a; margin-bottom: 3px; }
    .client-name { font-size: 13.5px; font-weight: 700; color: #09090b; }
    .client-info { font-size: 9.5px; color: #52525b; line-height: 1.5; margin-top: 2px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { font-size: 9px; font-weight: 600; color: #52525b; padding: 8px 8px; border-bottom: 1.5px solid #18181b; text-align: left; }
    th:first-child { padding-left: 0; }
    td { font-size: 10px; color: #27272a; padding: 9px 8px; border-bottom: 1px solid #f0f0f1; vertical-align: top; }
    td:first-child { padding-left: 0; }
    .td-right { text-align: right; font-family: 'JetBrains Mono', monospace; }
    .td-name { font-weight: 600; color: #09090b; }
    .td-note { font-size: 9px; color: #71717a; margin-top: 2px; }

    .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
    .totals-box { width: 270px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 10px; color: #52525b; padding: 3.5px 0; }
    .totals-row span:last-child { font-family: 'JetBrains Mono', monospace; color: #09090b; font-weight: 600; }
    .totals-final { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; padding: 10px 12px; background: #17171a; color: white; border-left: 2px solid #7f1d1d; margin-top: 6px; }
    .totals-final span:last-child { font-family: 'JetBrains Mono', monospace; }

    .bank-info { border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 10px 0; margin-bottom: 18px; }
    .bank-label { font-size: 9px; font-weight: 600; color: #71717a; margin-bottom: 3px; }
    .bank-row { font-size: 10px; color: #27272a; line-height: 1.5; }
    .bank-value { font-weight: 600; color: #09090b; }

    .signature-section { display: flex; justify-content: flex-end; margin-top: 18px; margin-bottom: 20px; page-break-inside: avoid; }
    .signature-wrap { width: 210px; text-align: center; font-size: 10px; color: #52525b; }
    .signature-date { margin-bottom: 3px; font-size: 9.5px; color: #71717a; }
    .signature-company { font-weight: 600; color: #09090b; margin-bottom: 4px; font-size: 10.5px; }
    .signature-box { position: relative; height: 92px; margin: 4px 0; display: flex; align-items: center; justify-content: center; }
    .signature-img { position: relative; z-index: 2; max-width: 175px; max-height: 75px; object-fit: contain; }
    .stamp-img { position: absolute; z-index: 1; width: 80px; height: 80px; object-fit: contain; left: 50%; top: 50%; transform: translate(-50%, -50%); opacity: 0.7; }
    .signature-line { border-bottom: 1px solid #18181b; margin-top: 2px; padding-bottom: 2px; }
    .signer-name { font-weight: 700; color: #09090b; font-size: 10.5px; }
    .signer-title { font-size: 9px; color: #71717a; margin-top: 2px; }

    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 9.5px; color: #71717a; margin-bottom: 18px; }
    .notes-title { font-weight: 600; color: #52525b; margin-bottom: 2px; font-size: 9px; }
    .footer { border-top: 1px solid #e4e4e7; padding-top: 12px; text-align: center; font-size: 9px; color: #a1a1aa; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;
};