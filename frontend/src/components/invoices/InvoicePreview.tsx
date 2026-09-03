import { useState } from 'react';
import { Printer, Download, Send, CheckCircle, MessageCircle } from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../../types';
import { PreviewMinimalis } from './PreviewMinimalis';
import { PreviewFormal } from './PreviewFormal';
import { PreviewGradient } from './PreviewGradient';
import { type Template, templateMeta, getTemplateStyles } from './invoiceTemplateStyles';
import { terbilang } from '../../lib/terbilang';
import { WhatsAppShareModal } from '../WhatsAppShareModal';

interface Props {
  invoice: Invoice;
  onStatusChange?: (status: InvoiceStatus) => void;
}

const STATUS_MAP: Record<InvoiceStatus, { label: string; dot: string; text: string; bg: string }> = {
  draft:     { label: 'Draft',      dot: 'bg-zinc-400',    text: 'text-zinc-700', bg: 'bg-zinc-100 border-zinc-200' },
  sent:      { label: 'Terkirim',   dot: 'bg-zinc-900',    text: 'text-zinc-900', bg: 'bg-zinc-100 border-zinc-300' },
  paid:      { label: 'Lunas',      dot: 'bg-emerald-600', text: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
  cancelled: { label: 'Dibatalkan', dot: 'bg-red-600',     text: 'text-red-700',  bg: 'bg-red-50 border-red-200' },
};

export function InvoicePreview({ invoice, onStatusChange }: Props) {
  const [template, setTemplate] = useState<Template>('minimalis');
  const [waModalOpen, setWaModalOpen] = useState(false);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const buildStatusWatermarkHtml = (status: InvoiceStatus): string => {
    if (status === 'draft') {
      return `<div class="status-watermark status-watermark--draft">DRAFT</div>`;
    }
    if (status === 'paid') {
      return `<div class="status-watermark status-watermark--paid">LUNAS</div>`;
    }
    if (status === 'cancelled') {
      return `<div class="status-watermark status-watermark--cancelled">DIBATALKAN</div>`;
    }
    return '';
  };

  const STATUS_WATERMARK_CSS = `
    .status-watermark {
      position: fixed;
      top: 50%;
      left: 30%;
      transform: translate(-50%, -50%) rotate(-14deg);
      z-index: 999;
      pointer-events: none;
      user-select: none;
      text-transform: uppercase;
      font-weight: 700;
      white-space: nowrap;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .status-watermark--draft {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 60px;
      letter-spacing: 8px;
      color: #d4d4d8;
      opacity: 0.4;
      transform: translate(-50%, -50%) rotate(-28deg);
    }
    .status-watermark--paid {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 22px;
      letter-spacing: 4px;
      color: #047857;
      border: 3px solid #047857;
      padding: 6px 16px;
      opacity: 0.5;
      transform: translate(-50%, -50%) rotate(-14deg);
    }
    .status-watermark--cancelled {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 19px;
      letter-spacing: 3px;
      color: #b91c1c;
      border: 3px solid #b91c1c;
      padding: 6px 12px;
      opacity: 0.5;
      transform: translate(-50%, -50%) rotate(-14deg);
    }
  `;
  const buildInvoiceHTML = (t: Template): string => {
    const styles = getTemplateStyles(t);
    const isFormal = t === 'formal';
    const isGradient = t === 'gradient';

    const logoHtml = invoice.company.logo ? `<img src="${invoice.company.logo}" class="company-logo" alt="${invoice.company.name}" />` : '';

    const signatureSectionHtml = `
      <div class="signature-section">
        <div class="signature-wrap">
          <div class="signature-date">${invoice.company.city ? invoice.company.city + ', ' : ''}${formatDate(invoice.invoice_date)}</div>
          <div class="signature-company">Hormat Kami,</div>
          <div class="signature-box">
            ${invoice.company.stamp ? `<img src="${invoice.company.stamp}" class="stamp-img" alt="Stempel Perusahaan" />` : ''}
            ${invoice.company.signature ? `<img src="${invoice.company.signature}" class="signature-img" alt="Tanda Tangan" />` : ''}
          </div>
          <div class="signature-line"></div>
          <div class="signer-name">${invoice.company.signature_name || invoice.company.name}</div>
          <div class="signer-title">${invoice.company.signature_title || 'Penanggung Jawab'}</div>
        </div>
      </div>
    `;

    const headerSection = isGradient ? `
      <div class="header-bg">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            ${logoHtml}
            <div class="company-name">${invoice.company.name}</div>
            <div class="company-info">
              ${invoice.company.address ? invoice.company.address + '<br>' : ''}
              ${invoice.company.city ? invoice.company.city + ', ' + (invoice.company.country || '') + '<br>' : ''}
              ${invoice.company.phone ? 'Telp: ' + invoice.company.phone + '<br>' : ''}
              ${invoice.company.email ? invoice.company.email + '<br>' : ''}
              ${invoice.company.npwp ? 'NPWP: ' + invoice.company.npwp : ''}
            </div>
          </div>
          <div>
            <div class="invoice-title">Invoice Penagihan</div>
            <div class="invoice-number">${invoice.invoice_number}</div>
            <div class="invoice-meta">
              <span class="label">Tanggal: </span>${formatDate(invoice.invoice_date)}<br>
              <span class="label">Jatuh Tempo: </span>${formatDate(invoice.due_date)}
            </div>
          </div>
        </div>
      </div>
      <div class="body-wrap">
    ` : `
      <div class="wrap">
      <div class="header">
        <div>
          ${logoHtml}
          <div class="company-name">${invoice.company.name}</div>
          <div class="company-info">
            ${invoice.company.address ? invoice.company.address + '<br>' : ''}
            ${invoice.company.city ? invoice.company.city + ', ' + (invoice.company.country || '') + '<br>' : ''}
            ${invoice.company.phone ? 'Telp: ' + invoice.company.phone + '<br>' : ''}
            ${invoice.company.email ? invoice.company.email + '<br>' : ''}
            ${invoice.company.npwp ? 'NPWP: ' + invoice.company.npwp : ''}
          </div>
        </div>
        <div>
          <div class="invoice-title">${isFormal ? 'FAKTUR' : 'INVOICE'}</div>
          <div class="invoice-number">${invoice.invoice_number}</div>
          <div class="invoice-meta">
            <span class="label">Tanggal: </span>${formatDate(invoice.invoice_date)}<br>
            <span class="label">Jatuh Tempo: </span>${formatDate(invoice.due_date)}
          </div>
        </div>
      </div>
      ${isFormal ? '<hr class="divider">' : ''}
    `;

    const closingWrap = `</div>`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoice_number}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>${styles}${STATUS_WATERMARK_CSS}</style>
      </head>
      <body>
      ${buildStatusWatermarkHtml(invoice.status)}
      ${headerSection}

        ${invoice.project_code || invoice.installment_label ? `
          <div style="
            display:grid;
            grid-template-columns:${invoice.project_code && invoice.installment_label ? '1fr 1fr' : '1fr'};
            gap:8px;
            margin-bottom:18px;
          ">
            ${invoice.project_code ? `
              <div style="
                background:#fafafa;
                border:1px solid #e4e4e7;
                border-radius:4px;
                padding:9px 12px;
              ">
                <div style="
                  font-size:8px;
                  font-weight:800;
                  color:#71717a;
                  text-transform:uppercase;
                  letter-spacing:1px;
                  margin-bottom:2px;
                ">
                  Project
                </div>
                <div style="
                  font-family:'JetBrains Mono', monospace;
                  font-size:11px;
                  font-weight:700;
                  color:#09090b;
                ">
                  ${invoice.project_code}
                </div>
              </div>
            ` : ''}

            ${invoice.installment_label ? `
              <div style="
                background:#fafafa;
                border:1px solid #e4e4e7;
                border-radius:4px;
                padding:9px 12px;
              ">
                <div style="
                  font-size:8px;
                  font-weight:800;
                  color:#71717a;
                  text-transform:uppercase;
                  letter-spacing:1px;
                  margin-bottom:2px;
                ">
                  Termin Pembayaran
                </div>
                <div style="
                  font-size:11px;
                  font-weight:700;
                  color:#09090b;
                ">
                  ${invoice.installment_label}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="bill-to">
          <div class="bill-to-label">Ditagihkan Kepada</div>
          <div class="client-name">${invoice.client.name}</div>
          <div class="client-info">
            ${invoice.client.pic_name ? 'u.p. ' + invoice.client.pic_name + '<br>' : ''}
            ${invoice.client.address ? invoice.client.address + '<br>' : ''}
            ${invoice.client.city ? invoice.client.city + ', ' + (invoice.client.country || '') + '<br>' : ''}
            ${invoice.client.email ? invoice.client.email + '<br>' : ''}
            ${invoice.client.npwp ? 'NPWP: ' + invoice.client.npwp : ''}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="text-align:left">Deskripsi</th>
              <th style="text-align:right; width:55px">Qty</th>
              <th style="text-align:left; width:45px; padding-left:6px">Sat.</th>
              <th style="text-align:right; width:130px">Harga Satuan</th>
              <th style="text-align:right; width:130px">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>
                  <div class="td-name">${item.name}</div>
                  ${item.description ? `<div class="td-note">${item.description}</div>` : ''}
                </td>
                <td class="td-right">${item.quantity}</td>
                <td style="padding-left:6px; color:#a1a1aa">${item.unit}</td>
                <td class="td-right">${formatRupiah(item.price)}</td>
                <td class="td-right" style="font-weight:700; color:#09090b">${formatRupiah(item.quantity * item.price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="totals-box">
            <div class="totals-row"><span>Subtotal</span><span>${formatRupiah(invoice.subtotal)}</span></div>
            ${invoice.tax_rate > 0 ? `<div class="totals-row"><span>PPN (${invoice.tax_rate}%)</span><span>${formatRupiah(invoice.tax_amount)}</span></div>` : ''}
            ${invoice.discount > 0 ? `<div class="totals-row"><span>Diskon</span><span>- ${formatRupiah(invoice.discount)}</span></div>` : ''}
            <div class="totals-final"><span>Total</span><span ${!isFormal ? 'class="totals-amount"' : ''}>${formatRupiah(invoice.total)}</span></div>
          </div>
        </div>
        <div style="background:#fafafa; border:1px solid #e4e4e7; border-left:3.5px solid #dc2626; border-radius:4px; padding:10px 14px; margin-bottom:18px; font-size:10.5px; color:#3f3f46;">
          <span style="font-weight:800; color:#dc2626; text-transform:uppercase; font-size:9px; letter-spacing:1px; display:block; margin-bottom:2px;">Terbilang:</span>
          <em style="font-family:'Newsreader', serif; font-size:13px; color:#09090b; font-weight:600;"># ${terbilang(invoice.total)} #</em>
        </div>
        ${invoice.company.bank_name ? `
          <div class="bank-info">
            <div class="bank-label">Informasi Rekening Pembayaran</div>
            <div class="bank-row">Bank: <span class="bank-value">${invoice.company.bank_name}</span></div>
            ${invoice.company.bank_account_name && invoice.company.bank_account_name.trim() ? `<div class="bank-row">A/N: <span class="bank-value">${invoice.company.bank_account_name}</span></div>` : ''}
            ${invoice.company.bank_account_number ? `<div class="bank-row">No. Rek: <span class="bank-value" style="font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700;">${invoice.company.bank_account_number}</span></div>` : ''}
          </div>
        ` : ''}
        ${invoice.notes || invoice.terms ? `
          <div class="notes-grid">
            ${invoice.notes ? `<div><div class="notes-title">Catatan</div><div>${invoice.notes}</div></div>` : ''}
            ${invoice.terms ? `<div><div class="notes-title">Syarat & Ketentuan</div><div>${invoice.terms}</div></div>` : ''}
          </div>
        ` : ''}
        ${signatureSectionHtml}
        <div class="footer">
          Terima kasih atas kepercayaan Anda • ${invoice.company.name}
          ${invoice.company.email ? ' • ' + invoice.company.email : ''}
        </div>
      ${closingWrap}
      <script>window.onload = () => { window.print(); window.close(); }</script>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(buildInvoiceHTML(template));
    win.document.close();
  };

  const s = STATUS_MAP[invoice.status];
  const previewProps = { invoice, formatRupiah, formatDate };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        {/* Left: Status and Template Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          {/* Template Segmented Control */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs">
            {(Object.entries(templateMeta) as [Template, typeof templateMeta[Template]][]).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setTemplate(key)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  template === key
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onStatusChange && invoice.status === 'draft' && (
            <button
              onClick={() => onStatusChange('sent')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Send size={13} /> Tandai Terkirim
            </button>
          )}
          {onStatusChange && invoice.status === 'sent' && (
            <button
              onClick={() => onStatusChange('paid')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle size={13} /> Tandai Lunas
            </button>
          )}

          <button
            onClick={() => setWaModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Kirim Ringkasan Faktur via WhatsApp (1-Klik)"
          >
            <MessageCircle size={14} className="stroke-[2.5]" />
            <span>Kirim WA</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 px-3 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Printer size={14} /> Cetak
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-3.5 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Download size={14} /> Simpan PDF
          </button>
        </div>
      </div>

      {/* ── Active Invoice Template Canvas ── */}
      <div className="bg-zinc-100/80 p-4 sm:p-8 rounded-2xl border border-zinc-200 overflow-x-auto">
        {template === 'minimalis' && <PreviewMinimalis {...previewProps} />}
        {template === 'formal'    && <PreviewFormal    {...previewProps} />}
        {template === 'gradient'  && <PreviewGradient  {...previewProps} />}
      </div>

      {/* ── WhatsApp 1-Click Share Modal ── */}
      <WhatsAppShareModal
        invoice={invoice}
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        pdfTemplate={template}
      />
    </div>
  );
}
