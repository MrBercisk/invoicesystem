export type Template = 'minimalis' | 'formal' | 'gradient';

export const templateMeta: Record<Template, { label: string; desc: string; preview: string }> = {
  minimalis: { label: 'Modern Minimalis', desc: 'Clean, aksen biru',   preview: 'bg-white border-2 border-blue-500' },
  formal:    { label: 'Classic Formal',   desc: 'Hitam putih, resmi',  preview: 'bg-white border-2 border-gray-900' },
  gradient:  { label: 'Gradient Modern',  desc: 'Header gradient',     preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
};

export const getTemplateStyles = (t: Template): string => {
  if (t === 'minimalis') return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #374151; background: white; }
    .wrap { width: 210mm; padding: 18mm 20mm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
    .company-name { font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.5px; }
    .company-info { font-size: 10.5px; color: #6b7280; margin-top: 6px; line-height: 1.7; }
    .invoice-title { font-size: 11px; font-weight: 600; color: #2563eb; letter-spacing: 3px; text-transform: uppercase; text-align: right; }
    .invoice-number { font-size: 20px; font-weight: 700; color: #111827; text-align: right; margin-top: 4px; }
    .invoice-meta { font-size: 10.5px; color: #6b7280; text-align: right; margin-top: 10px; line-height: 1.8; }
    .label { color: #9ca3af; }
    .bill-to { background: #f9fafb; border-left: 3px solid #2563eb; padding: 14px 18px; margin-bottom: 28px; border-radius: 0 6px 6px 0; }
    .bill-to-label { font-size: 9px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
    .client-name { font-size: 14px; font-weight: 700; color: #111827; }
    .client-info { font-size: 10.5px; color: #6b7280; line-height: 1.7; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    th { font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 0 10px 0; border-bottom: 1px solid #e5e7eb; }
    td { font-size: 11px; color: #374151; padding: 10px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    .td-right { text-align: right; }
    .td-name { font-weight: 500; color: #111827; }
    .td-note { font-size: 10px; color: #9ca3af; margin-top: 2px; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 28px; }
    .totals-box { width: 260px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; padding: 4px 0; }
    .totals-final { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: #111827; padding: 10px 0 0 0; border-top: 2px solid #111827; margin-top: 6px; }
    .totals-amount { color: #2563eb; }
    .bank-info { background: #eff6ff; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; }
    .bank-label { font-size: 9px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
    .bank-row { font-size: 11px; color: #374151; line-height: 1.8; }
    .bank-value { font-weight: 600; }
    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 10.5px; color: #6b7280; margin-bottom: 24px; }
    .notes-title { font-weight: 600; color: #374151; margin-bottom: 4px; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center; font-size: 10px; color: #9ca3af; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  if (t === 'formal') return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Times New Roman', Georgia, serif; font-size: 12px; color: #000; background: white; }
    .wrap { width: 210mm; padding: 20mm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .company-name { font-size: 20px; font-weight: 700; color: #000; }
    .company-info { font-size: 11px; color: #333; margin-top: 6px; line-height: 1.7; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #000; text-align: right; letter-spacing: 4px; }
    .invoice-number { font-size: 13px; color: #333; text-align: right; margin-top: 6px; }
    .invoice-meta { font-size: 11px; color: #333; text-align: right; margin-top: 10px; line-height: 1.8; border-top: 1px solid #000; padding-top: 10px; }
    .label { font-weight: 600; }
    .divider { border: none; border-top: 2px solid #000; margin: 20px 0; }
    .bill-to { margin-bottom: 28px; }
    .bill-to-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; border-bottom: 1px solid #000; padding-bottom: 4px; }
    .client-name { font-size: 14px; font-weight: 700; color: #000; }
    .client-info { font-size: 11px; color: #333; line-height: 1.7; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    th { font-size: 11px; font-weight: 700; color: #000; padding: 8px 6px; border-top: 2px solid #000; border-bottom: 1px solid #000; text-transform: uppercase; letter-spacing: 0.5px; }
    td { font-size: 11px; color: #000; padding: 8px 6px; border-bottom: 1px solid #ccc; vertical-align: top; }
    .td-right { text-align: right; }
    .td-name { font-weight: 600; }
    .td-note { font-size: 10px; color: #555; margin-top: 2px; font-style: italic; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 28px; }
    .totals-box { width: 260px; border: 1px solid #000; }
    .totals-row { display: flex; justify-content: space-between; font-size: 11px; color: #000; padding: 6px 12px; border-bottom: 1px solid #ddd; }
    .totals-final { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; padding: 8px 12px; background: #000; color: #fff; }
    .bank-info { border: 1px solid #000; padding: 14px; margin-bottom: 20px; }
    .bank-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; border-bottom: 1px solid #000; padding-bottom: 4px; }
    .bank-row { font-size: 11px; color: #000; line-height: 1.8; }
    .bank-value { font-weight: 700; }
    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px; color: #333; margin-bottom: 24px; }
    .notes-title { font-weight: 700; margin-bottom: 4px; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
    .footer { border-top: 2px solid #000; padding-top: 14px; text-align: center; font-size: 10px; color: #333; font-style: italic; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  // gradient
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #1e1b4b; background: white; }
    .wrap { width: 210mm; margin: 0 auto; }
    .header-bg { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%); padding: 28px 24px 36px; color: white; }
    .company-name { font-size: 20px; font-weight: 700; color: white; }
    .company-info { font-size: 10.5px; color: rgba(255,255,255,0.75); margin-top: 6px; line-height: 1.7; }
    .invoice-title { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.7); letter-spacing: 5px; text-transform: uppercase; text-align: right; }
    .invoice-number { font-size: 22px; font-weight: 700; color: white; text-align: right; margin-top: 4px; }
    .invoice-meta { font-size: 10.5px; color: rgba(255,255,255,0.75); text-align: right; margin-top: 10px; line-height: 1.8; }
    .label { color: rgba(255,255,255,0.5); }
    .body-wrap { padding: 24px 24px 20px; }
    .bill-to { background: linear-gradient(135deg, #f5f3ff, #faf5ff); border-radius: 10px; padding: 16px 20px; margin-bottom: 28px; border: 1px solid #e9d5ff; }
    .bill-to-label { font-size: 9px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
    .client-name { font-size: 15px; font-weight: 700; color: #1e1b4b; }
    .client-info { font-size: 10.5px; color: #6b7280; line-height: 1.7; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    th { font-size: 10px; font-weight: 600; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 0 10px 0; border-bottom: 2px solid #e9d5ff; }
    td { font-size: 11px; color: #374151; padding: 10px 0; border-bottom: 1px solid #f3f0ff; vertical-align: top; }
    .td-right { text-align: right; }
    .td-name { font-weight: 500; color: #1e1b4b; }
    .td-note { font-size: 10px; color: #9ca3af; margin-top: 2px; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 28px; }
    .totals-box { width: 260px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; padding: 4px 0; }
    .totals-final { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; padding: 10px 14px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border-radius: 8px; margin-top: 8px; }
    .bank-info { background: linear-gradient(135deg, #f5f3ff, #faf5ff); border: 1px solid #e9d5ff; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; }
    .bank-label { font-size: 9px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
    .bank-row { font-size: 11px; color: #374151; line-height: 1.8; }
    .bank-value { font-weight: 600; color: #4f46e5; }
    .notes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 10.5px; color: #6b7280; margin-bottom: 24px; }
    .notes-title { font-weight: 600; color: #4f46e5; margin-bottom: 4px; }
    .footer { border-top: 1px solid #e9d5ff; padding-top: 16px; text-align: center; font-size: 10px; color: #9ca3af; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;
};