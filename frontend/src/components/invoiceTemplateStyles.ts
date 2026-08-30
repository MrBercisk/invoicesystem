export type Template = 'minimalis' | 'formal' | 'gradient';

export const templateMeta: Record<Template, { label: string; desc: string; preview: string }> = {
  minimalis: { label: 'Modern Crimson', desc: 'Aksen Merah & Hitam Presisi', preview: 'bg-white border-2 border-red-600' },
  formal:    { label: 'Classic Monocle', desc: 'Resmi Standar B2B Monokrom', preview: 'bg-white border-2 border-zinc-900' },
  gradient:  { label: 'Executive Onyx', desc: 'Header Hitam Garis Merah', preview: 'bg-zinc-950 border-2 border-red-600' },
};

export const getTemplateStyles = (t: Template): string => {
  if (t === 'minimalis') return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11.5px; color: #18181b; background: white; -webkit-font-smoothing: antialiased; }
    .wrap { width: 210mm; padding: 18mm 20mm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 18px; border-bottom: 2px solid #18181b; }
    .company-logo { max-height: 44px; max-width: 170px; object-fit: contain; margin-bottom: 8px; display: block; }
    .company-name { font-size: 18px; font-weight: 800; color: #09090b; letter-spacing: -0.3px; }
    .company-info { font-size: 10px; color: #71717a; margin-top: 4px; line-height: 1.6; }
    .invoice-title { font-size: 11px; font-weight: 800; color: #dc2626; letter-spacing: 2px; text-transform: uppercase; text-align: right; }
    .invoice-number { font-size: 18px; font-weight: 800; color: #09090b; text-align: right; margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
    .invoice-meta { font-size: 10px; color: #71717a; text-align: right; margin-top: 8px; line-height: 1.7; }
    .label { color: #a1a1aa; font-weight: 500; }
    .bill-to { background: #fafafa; border: 1px solid #e4e4e7; border-left: 3.5px solid #dc2626; padding: 12px 16px; margin-bottom: 22px; border-radius: 4px; }
    .bill-to-label { font-size: 9px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
    .client-name { font-size: 14px; font-weight: 800; color: #09090b; }
    .client-info { font-size: 10px; color: #52525b; line-height: 1.6; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 22px; }
    th { font-size: 9.5px; font-weight: 800; color: #09090b; text-transform: uppercase; letter-spacing: 0.8px; padding: 9px 8px; border-bottom: 2px solid #09090b; border-top: 1px solid #e4e4e7; background: #fafafa; }
    td { font-size: 10.5px; color: #27272a; padding: 9px 8px; border-bottom: 1px solid #f4f4f5; vertical-align: top; }
    .td-right { text-align: right; font-family: 'JetBrains Mono', monospace; }
    .td-name { font-weight: 700; color: #09090b; }
    .td-note { font-size: 9.5px; color: #71717a; margin-top: 2px; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
    .totals-box { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #52525b; padding: 4px 0; }
    .totals-row span:last-child { font-family: 'JetBrains Mono', monospace; color: #09090b; font-weight: 600; }
    .totals-final { display: flex; justify-content: space-between; font-size: 13.5px; font-weight: 800; color: #ffffff; padding: 9px 12px; background: #09090b; border-left: 3px solid #dc2626; border-radius: 4px; margin-top: 6px; }
    .totals-amount { font-family: 'JetBrains Mono', monospace; color: #ffffff; }
    .bank-info { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px; padding: 12px 14px; margin-bottom: 18px; }
    .bank-label { font-size: 9px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
    .bank-row { font-size: 10.5px; color: #27272a; line-height: 1.6; }
    .bank-value { font-weight: 700; color: #09090b; }
    
    .signature-section { display: flex; justify-content: flex-end; margin-top: 18px; margin-bottom: 22px; page-break-inside: avoid; }
    .signature-wrap { width: 220px; text-align: center; font-size: 10.5px; color: #52525b; }
    .signature-date { margin-bottom: 3px; font-size: 10px; color: #71717a; }
    .signature-company { font-weight: 800; color: #09090b; margin-bottom: 4px; font-size: 11px; }
    .signature-box { position: relative; height: 70px; display: flex; align-items: center; justify-content: center; margin: 4px 0; }
    .signature-img { max-height: 60px; max-width: 140px; object-fit: contain; z-index: 2; position: relative; }
    .stamp-img { position: absolute; max-height: 70px; max-width: 70px; object-fit: contain; left: 20px; top: 0; z-index: 1; opacity: 0.85; }
    .signature-line { border-bottom: 1.5px solid #09090b; margin-top: 2px; padding-bottom: 2px; }
    .signer-name { font-weight: 800; color: #09090b; font-size: 11px; }
    .signer-title { font-size: 9.5px; color: #71717a; margin-top: 2px; }

    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 10px; color: #52525b; margin-bottom: 20px; }
    .notes-title { font-weight: 800; color: #09090b; margin-bottom: 3px; text-transform: uppercase; font-size: 9px; letter-spacing: 0.8px; }
    .footer { border-top: 1px solid #e4e4e7; padding-top: 12px; text-align: center; font-size: 9.5px; color: #a1a1aa; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  if (t === 'formal') return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Newsreader', Georgia, 'Times New Roman', serif; font-size: 11.5px; color: #000; background: white; }
    .wrap { width: 210mm; padding: 18mm 20mm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .company-logo { max-height: 48px; max-width: 170px; object-fit: contain; margin-bottom: 8px; display: block; }
    .company-name { font-size: 19px; font-weight: 700; color: #000; letter-spacing: 0.2px; }
    .company-info { font-size: 10.5px; color: #333; margin-top: 3px; line-height: 1.5; font-family: sans-serif; }
    .invoice-title { font-size: 24px; font-weight: 800; color: #000; text-align: right; letter-spacing: 2.5px; }
    .invoice-number { font-size: 13px; color: #dc2626; font-weight: 700; text-align: right; margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
    .invoice-meta { font-size: 10.5px; color: #333; text-align: right; margin-top: 6px; line-height: 1.6; border-top: 1px solid #000; padding-top: 6px; font-family: sans-serif; }
    .label { font-weight: 600; color: #555; }
    .divider { border: none; border-top: 2px solid #000; margin: 14px 0 20px 0; }
    .bill-to { margin-bottom: 20px; border: 1.5px solid #000; padding: 10px 14px; background: #fff; }
    .bill-to-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; border-bottom: 1px solid #000; padding-bottom: 2px; font-family: sans-serif; color: #000; }
    .client-name { font-size: 14px; font-weight: 700; color: #000; }
    .client-info { font-size: 10.5px; color: #333; line-height: 1.5; margin-top: 3px; font-family: sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { font-size: 10px; font-weight: 800; color: #000; padding: 7px 6px; border-top: 2px solid #000; border-bottom: 1.5px solid #000; text-transform: uppercase; letter-spacing: 0.5px; font-family: sans-serif; background: #fafafa; }
    td { font-size: 10.5px; color: #000; padding: 8px 6px; border-bottom: 1px solid #e4e4e7; vertical-align: top; font-family: sans-serif; }
    .td-right { text-align: right; font-family: 'JetBrains Mono', monospace; }
    .td-name { font-weight: 600; font-family: serif; font-size: 12px; }
    .td-note { font-size: 9.5px; color: #555; margin-top: 2px; font-style: italic; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
    .totals-box { width: 280px; border: 1.5px solid #000; }
    .totals-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #000; padding: 4px 10px; border-bottom: 1px solid #eee; font-family: sans-serif; }
    .totals-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
    .totals-final { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; padding: 7px 10px; background: #000; color: #fff; font-family: sans-serif; }
    .bank-info { border: 1.5px solid #000; padding: 10px 14px; margin-bottom: 18px; }
    .bank-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; border-bottom: 1px solid #000; padding-bottom: 2px; font-family: sans-serif; }
    .bank-row { font-size: 10.5px; color: #000; line-height: 1.6; font-family: sans-serif; }
    .bank-value { font-weight: 700; }

    .signature-section { display: flex; justify-content: flex-end; margin-top: 18px; margin-bottom: 20px; page-break-inside: avoid; }
    .signature-wrap { width: 220px; text-align: center; font-size: 10.5px; color: #000; }
    .signature-date { margin-bottom: 3px; font-size: 10px; font-family: sans-serif; }
    .signature-company { font-weight: 700; margin-bottom: 4px; text-transform: uppercase; font-family: sans-serif; font-size: 10px; }
    .signature-box { position: relative; height: 70px; display: flex; align-items: center; justify-content: center; margin: 4px 0; }
    .signature-img { max-height: 60px; max-width: 140px; object-fit: contain; z-index: 2; position: relative; }
    .stamp-img { position: absolute; max-height: 70px; max-width: 70px; object-fit: contain; left: 15px; top: 0; z-index: 1; opacity: 0.85; }
    .signature-line { border-bottom: 1.5px solid #000; margin-top: 2px; padding-bottom: 2px; }
    .signer-name { font-weight: 700; color: #000; font-size: 11.5px; text-decoration: underline; font-family: serif; }
    .signer-title { font-size: 9.5px; color: #333; margin-top: 2px; font-family: sans-serif; }

    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 10px; color: #333; margin-bottom: 20px; font-family: sans-serif; }
    .notes-title { font-weight: 700; margin-bottom: 3px; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; }
    .footer { border-top: 1.5px solid #000; padding-top: 10px; text-align: center; font-size: 9.5px; color: #444; font-style: italic; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  // Executive Onyx & Crimson template
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #09090b; background: white; -webkit-font-smoothing: antialiased; }
    .wrap { width: 210mm; margin: 0 auto; }
    .header-bg { background: #09090b; padding: 24px 26px 22px; color: white; border-bottom: 4px solid #dc2626; }
    .company-logo { max-height: 42px; max-width: 160px; object-fit: contain; margin-bottom: 8px; display: block; background: #ffffff; padding: 4px 6px; border-radius: 4px; }
    .company-name { font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: -0.2px; }
    .company-info { font-size: 9.5px; color: #a1a1aa; margin-top: 4px; line-height: 1.5; }
    .invoice-title { font-size: 11px; font-weight: 800; color: #f87171; letter-spacing: 3px; text-transform: uppercase; text-align: right; }
    .invoice-number { font-size: 19px; font-weight: 800; color: #ffffff; text-align: right; margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
    .invoice-meta { font-size: 9.5px; color: #a1a1aa; text-align: right; margin-top: 8px; line-height: 1.6; }
    .label { color: #71717a; }
    .body-wrap { padding: 22px 26px; }
    .bill-to { background: #fafafa; border: 1px solid #e4e4e7; border-left: 3.5px solid #dc2626; border-radius: 4px; padding: 12px 16px; margin-bottom: 20px; }
    .bill-to-label { font-size: 8.5px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 3px; }
    .client-name { font-size: 14px; font-weight: 800; color: #09090b; }
    .client-info { font-size: 9.5px; color: #52525b; line-height: 1.5; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { font-size: 9px; font-weight: 800; color: #09090b; text-transform: uppercase; letter-spacing: 0.8px; padding: 9px 8px; border-bottom: 2px solid #09090b; border-top: 1px solid #e4e4e7; background: #fafafa; }
    td { font-size: 10px; color: #27272a; padding: 9px 8px; border-bottom: 1px solid #f4f4f5; vertical-align: top; }
    .td-right { text-align: right; font-family: 'JetBrains Mono', monospace; }
    .td-name { font-weight: 700; color: #09090b; }
    .td-note { font-size: 9px; color: #71717a; margin-top: 2px; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
    .totals-box { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 10px; color: #52525b; padding: 3.5px 0; }
    .totals-row span:last-child { font-family: 'JetBrains Mono', monospace; color: #09090b; font-weight: 600; }
    .totals-final { display: flex; justify-content: space-between; font-size: 13.5px; font-weight: 800; padding: 9px 12px; background: #09090b; color: white; border-left: 3px solid #dc2626; border-radius: 4px; margin-top: 6px; }
    .totals-final span:last-child { font-family: 'JetBrains Mono', monospace; }
    .bank-info { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px; padding: 10px 14px; margin-bottom: 18px; }
    .bank-label { font-size: 8.5px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 3px; }
    .bank-row { font-size: 10px; color: #27272a; line-height: 1.5; }
    .bank-value { font-weight: 700; color: #09090b; }

    .signature-section { display: flex; justify-content: flex-end; margin-top: 18px; margin-bottom: 20px; page-break-inside: avoid; }
    .signature-wrap { width: 220px; text-align: center; font-size: 10px; color: #52525b; }
    .signature-date { margin-bottom: 3px; font-size: 9.5px; color: #71717a; }
    .signature-company { font-weight: 800; color: #09090b; margin-bottom: 4px; font-size: 10.5px; }
    .signature-box { position: relative; height: 68px; display: flex; align-items: center; justify-content: center; margin: 4px 0; }
    .signature-img { max-height: 58px; max-width: 140px; object-fit: contain; z-index: 2; position: relative; }
    .stamp-img { position: absolute; max-height: 68px; max-width: 68px; object-fit: contain; left: 20px; top: 0; z-index: 1; opacity: 0.85; }
    .signature-line { border-bottom: 1.5px solid #09090b; margin-top: 2px; padding-bottom: 2px; }
    .signer-name { font-weight: 800; color: #09090b; font-size: 10.5px; }
    .signer-title { font-size: 9px; color: #71717a; margin-top: 2px; }

    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 9.5px; color: #71717a; margin-bottom: 18px; }
    .notes-title { font-weight: 800; color: #09090b; margin-bottom: 2px; text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.8px; }
    .footer { border-top: 1px solid #e4e4e7; padding-top: 12px; text-align: center; font-size: 9px; color: #a1a1aa; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;
};

