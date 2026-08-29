import { useState } from 'react';
import { Printer, Download, Send, CheckCircle, LayoutTemplate, ChevronDown } from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../types';
import { PreviewMinimalis } from './PreviewMinimalis';
import { PreviewFormal } from './PreviewFormal';
import { PreviewGradient } from './PreviewGradient';
import { type Template, templateMeta, getTemplateStyles } from './invoiceTemplateStyles';

interface Props {
  invoice: Invoice;
  onStatusChange?: (status: InvoiceStatus) => void;
}

const STATUS_MAP: Record<InvoiceStatus, { label: string; dot: string; text: string }> = {
  draft:     { label: 'Draft',      dot: 'bg-zinc-400',    text: 'text-zinc-500' },
  sent:      { label: 'Terkirim',   dot: 'bg-sky-400',     text: 'text-sky-600' },
  paid:      { label: 'Lunas',      dot: 'bg-emerald-400', text: 'text-emerald-600' },
  cancelled: { label: 'Batal',      dot: 'bg-rose-400',    text: 'text-rose-500' },
};

export function InvoicePreview({ invoice, onStatusChange }: Props) {
  const [template, setTemplate] = useState<Template>('minimalis');
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const buildInvoiceHTML = (t: Template): string => {
    const styles = getTemplateStyles(t);
    const isFormal = t === 'formal';
    const isGradient = t === 'gradient';

    const headerSection = isGradient ? `
      <div class="header-bg">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
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
            <div class="invoice-title">Invoice</div>
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
          <div class="invoice-title">INVOICE</div>
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
      <html><head><title>Invoice ${invoice.invoice_number}</title><style>${styles}</style></head>
      <body>
      ${headerSection}
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
                <td style="padding-left:6px; color:#9ca3af">${item.unit}</td>
                <td class="td-right">${formatRupiah(item.price)}</td>
                <td class="td-right" style="font-weight:500">${formatRupiah(item.quantity * item.price)}</td>
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
        ${invoice.company.bank_name ? `
          <div class="bank-info">
            <div class="bank-label">Informasi Pembayaran</div>
            <div class="bank-row">Bank: <span class="bank-value">${invoice.company.bank_name}</span></div>
            ${invoice.company.bank_account_name ? `<div class="bank-row">A/N: <span class="bank-value">${invoice.company.bank_account_name}</span></div>` : ''}
            ${invoice.company.bank_account_number ? `<div class="bank-row">No. Rek: <span class="bank-value" style="font-size:14px">${invoice.company.bank_account_number}</span></div>` : ''}
          </div>
        ` : ''}
        ${invoice.notes || invoice.terms ? `
          <div class="notes-grid">
            ${invoice.notes ? `<div><div class="notes-title">Catatan</div><div>${invoice.notes}</div></div>` : ''}
            ${invoice.terms ? `<div><div class="notes-title">Syarat & Ketentuan</div><div>${invoice.terms}</div></div>` : ''}
          </div>
        ` : ''}
        <div class="footer">
          Terima kasih atas kepercayaan Anda • ${invoice.company.name}
          ${invoice.company.email ? ' • ' + invoice.company.email : ''}
        </div>
      ${closingWrap}
      <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
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
      {/* ── Action bar ── */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 space-y-3">

        {/* Row 1: status + template picker */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>

          {/* Template picker */}
          <div className="relative">
            <button
              onClick={() => setShowTemplatePicker(v => !v)}
              className="flex items-center gap-1.5 text-xs font-medium border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 text-zinc-600 transition-colors"
            >
              <LayoutTemplate size={13} />
              <span className="hidden sm:inline">Template:</span>
              <span className="font-semibold text-zinc-800 capitalize">{template}</span>
              <ChevronDown size={12} className="text-zinc-400" />
            </button>

            {showTemplatePicker && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowTemplatePicker(false)} />
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-zinc-200 rounded-2xl shadow-xl p-3 z-30 flex gap-2.5 w-64 sm:w-72">
                  {(Object.entries(templateMeta) as [Template, typeof templateMeta[Template]][]).map(([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => { setTemplate(key); setShowTemplatePicker(false); }}
                      className={`flex-1 rounded-xl p-2.5 text-left border-2 transition-all ${
                        template === key
                          ? 'border-zinc-900 bg-zinc-50'
                          : 'border-zinc-100 hover:border-zinc-300'
                      }`}
                    >
                      <div className={`h-7 rounded-lg mb-2 ${meta.preview}`} />
                      <div className="text-[11px] font-semibold text-zinc-800 leading-tight">{meta.label}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{meta.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Row 2: action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {onStatusChange && invoice.status === 'draft' && (
            <button
              onClick={() => onStatusChange('sent')}
              className="flex items-center gap-1.5 text-xs font-semibold bg-sky-600 text-white px-3 py-2 rounded-xl hover:bg-sky-700 transition-colors flex-1 sm:flex-none justify-center"
            >
              <Send size={13} /> Tandai Terkirim
            </button>
          )}
          {onStatusChange && invoice.status === 'sent' && (
            <button
              onClick={() => onStatusChange('paid')}
              className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white px-3 py-2 rounded-xl hover:bg-emerald-700 transition-colors flex-1 sm:flex-none justify-center"
            >
              <CheckCircle size={13} /> Tandai Lunas
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-medium border border-zinc-200 px-3 py-2 rounded-xl hover:bg-zinc-50 text-zinc-600 transition-colors"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 text-white px-3 py-2 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              <Download size={13} />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      {template === 'minimalis' && <PreviewMinimalis {...previewProps} />}
      {template === 'formal'    && <PreviewFormal    {...previewProps} />}
      {template === 'gradient'  && <PreviewGradient  {...previewProps} />}
    </div>
  );
}