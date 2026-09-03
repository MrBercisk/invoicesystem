import { useState } from 'react';
import { Printer, Download, CheckCircle, XCircle } from 'lucide-react';
import type { HandoverDocument, HandoverStatus } from '../../types';
import { handoverApi } from '../../lib/api';
import { type Template, getTemplateStyles } from './handoverTemplateStyles';

interface Props {
  document: HandoverDocument;
  onStatusChange?: (status: HandoverStatus) => void;
}

const STATUS_MAP: Record<HandoverStatus, { label: string; dot: string; text: string; bg: string }> = {
  draft:     { label: 'Draft',      dot: 'bg-zinc-400',    text: 'text-zinc-700',   bg: 'bg-zinc-100 border-zinc-200' },
  completed: { label: 'Selesai',    dot: 'bg-emerald-600', text: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
  cancelled: { label: 'Dibatalkan', dot: 'bg-red-600',     text: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
};

export function HandoverPreview({ document: doc, onStatusChange }: Props) {
  const template: Template = 'minimalis';
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const asetItems = doc.items.filter((i) => i.type === 'barang');
  const fiturItems = doc.items.filter((i) => i.type === 'pekerjaan');

  const buildHandoverHTML = (t: Template): string => {
    const styles = getTemplateStyles(t);
    const logoHtml = doc.company.logo
      ? `<img src="${doc.company.logo}" class="company-logo" alt="${doc.company.name}" />`
      : '';

    const asetRows = asetItems.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.name}${item.description ? `<div class="td-note">${item.description}</div>` : ''}</td>
        <td class="td-right">${item.quantity}</td>
        <td>${item.unit || '-'}</td>
        <td>${item.condition || '-'}</td>
        <td>${item.notes || '-'}</td>
      </tr>
    `).join('');

    const fiturRows = fiturItems.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.name}</td>
        <td>${item.description || '-'}</td>
      </tr>
    `).join('');

    const signatureHtml = doc.company.signature
      ? `<img src="${doc.company.signature}" class="signature" alt="Signature" />`
      : '';

    const stampHtml = doc.company.stamp
      ? `<img src="${doc.company.stamp}" class="stamp" alt="Stamp" />`
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${doc.document_number}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>${styles}</style>
      </head>
      <body>
        <div class="wrap">
          <div class="header">
            <div>
              ${logoHtml}
              <div class="company-name">${doc.company.name}</div>
              <div class="company-info">
                ${doc.company.address ? doc.company.address + '<br>' : ''}
                ${doc.company.phone ? 'Telp: ' + doc.company.phone : ''}
              </div>
            </div>
            <div>
              <div class="invoice-title">BERITA ACARA SERAH TERIMA</div>
              <div class="invoice-number">${doc.document_number}</div>
              <div class="invoice-meta">
                <span class="label">Tanggal: </span>${formatDate(doc.document_date)}<br>
                ${doc.location ? `<span class="label">Lokasi: </span>${doc.location}` : ''}
              </div>
            </div>
          </div>

          <p style="font-size:11px; color:#3f3f46; margin-bottom:16px;">
            Pada hari ini, tanggal ${formatDate(doc.document_date)}, telah dilakukan serah terima
            ${asetItems.length > 0 && fiturItems.length > 0 ? 'aset/akses dan fitur' : asetItems.length > 0 ? 'aset/akses' : 'fitur'}
            antara pihak <strong>${doc.company.name}</strong> dengan <strong>${doc.client.name}</strong>
            dengan rincian sebagai berikut:
          </p>

          ${asetItems.length > 0 ? `
            <h4 style="font-size:11px; font-weight:800; margin-bottom:8px;">A. Daftar Aset/Akses</h4>
            <table style="margin-bottom:20px;">
              <thead>
                <tr>
                  <th style="width:30px">No</th>
                  <th style="text-align:left">Nama Aset/Akses</th>
                  <th style="width:50px">Qty</th>
                  <th style="width:60px">Satuan</th>
                  <th style="width:70px">Kondisi</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>${asetRows}</tbody>
            </table>
          ` : ''}

          ${fiturItems.length > 0 ? `
            <h4 style="font-size:11px; font-weight:800; margin-bottom:8px;">B. Daftar Fitur</h4>
            <table style="margin-bottom:20px;">
              <thead>
                <tr>
                  <th style="width:30px">No</th>
                  <th style="text-align:left">Nama Fitur</th>
                  <th style="text-align:left">Deskripsi</th>
                </tr>
              </thead>
              <tbody>${fiturRows}</tbody>
            </table>
          ` : ''}

          ${doc.notes ? `<p style="font-size:10.5px; margin-bottom:16px;"><strong>Catatan:</strong> ${doc.notes}</p>` : ''}
          ${doc.terms ? `<p style="font-size:10.5px; margin-bottom:24px; color:#52525b;">${doc.terms}</p>` : ''}

          

            <table class="sign-wrap">
              <tr>

                <td class="sign-box">
                  <div class="sign-label">
                    Yang Menyerahkan,
                  </div>

                  <div class="sign-imgwrap">
                    ${stampHtml}
                    ${signatureHtml}
                  </div>

                  <div class="sign-name">
                    ${doc.handover_by_name || doc.company.name}
                  </div>

                  <div class="sign-title">
                    ${doc.handover_by_title || 'Penanggung Jawab'}
                  </div>
                </td>

                <td class="sign-box">
                  <div class="sign-label">
                    Yang Menerima,
                  </div>

                  <div class="sign-imgwrap"></div>

                  <div class="sign-name">
                    ${doc.received_by_name || doc.client.name}
                  </div>

                  <div class="sign-title">
                    ${doc.received_by_title || 'Perwakilan Klien'}
                  </div>
                </td>

              </tr>
            </table>
        </div>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(buildHandoverHTML(template));
    win.document.close();
  };

  const handleDownloadPdf = async () => {
    if (downloadingPdf) return;
    try {
      setDownloadingPdf(true);
      const { url } = await handoverApi.getPdfUrl(doc.id, template);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Gagal mengambil PDF dokumen serah terima:', err);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const s = STATUS_MAP[doc.status];

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

            <span className="text-xs text-zinc-500 font-medium">
            Berita Acara Serah Terima
            </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onStatusChange && doc.status === 'draft' && (
            <button
              onClick={() => onStatusChange('completed')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle size={13} /> Tandai Selesai
            </button>
          )}
          {onStatusChange && doc.status === 'draft' && (
            <button
              onClick={() => onStatusChange('cancelled')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-lg transition-colors"
            >
              <XCircle size={13} /> Batalkan
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 px-3 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Printer size={14} /> Cetak
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-3.5 py-2 rounded-lg transition-colors shadow-xs disabled:opacity-60"
          >
            <Download size={14} className={downloadingPdf ? 'animate-pulse' : ''} />
            {downloadingPdf ? 'Membuat PDF…' : 'Simpan PDF'}
          </button>
        </div>
      </div>

      {/* ── Canvas Preview Sederhana (di layar admin) ── */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="font-extrabold text-base">{doc.company.name}</div>
            <div className="text-[11px] text-zinc-500">{doc.company.address}</div>
          </div>
          <div className="text-right">
            <div className="font-extrabold text-sm">BERITA ACARA SERAH TERIMA</div>
            <div className="font-mono text-xs text-zinc-600">{doc.document_number}</div>
            <div className="text-[11px] text-zinc-500 mt-1">{formatDate(doc.document_date)}</div>
          </div>
        </div>

        <p className="text-xs text-zinc-700 mb-5">
          Pada hari ini, tanggal {formatDate(doc.document_date)}, telah dilakukan serah terima{' '}
          {asetItems.length > 0 && fiturItems.length > 0 ? 'aset/akses dan fitur' : asetItems.length > 0 ? 'aset/akses' : 'fitur'}{' '}
          antara pihak <strong>{doc.company.name}</strong> dengan <strong>{doc.client.name}</strong>
          {doc.location ? ` di ${doc.location}` : ''}.
        </p>

        {asetItems.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2">A. Daftar Aset/Akses</h4>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
                  <th className="text-left py-1.5">Nama</th>
                  <th className="text-right py-1.5">Qty</th>
                  <th className="text-left py-1.5 pl-2">Kondisi</th>
                </tr>
              </thead>
              <tbody>
                {asetItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-zinc-100">
                    <td className="py-1.5">{item.name}</td>
                    <td className="py-1.5 text-right">{item.quantity} {item.unit}</td>
                    <td className="py-1.5 pl-2">{item.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {fiturItems.length > 0 && (
          <div>
            <h4 className="text-xs font-bold mb-2">B. Daftar Fitur</h4>
            <ul className="text-[11px] space-y-1 list-disc list-inside text-zinc-700">
              {fiturItems.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong>{item.description ? ` — ${item.description}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-2 gap-8 mt-16">

          {/* Yang Menyerahkan */}
          <div className="text-center">
            <div className="text-[11px] font-semibold mb-1">
              Yang Menyerahkan,
            </div>

            <div className="relative h-[76px] my-1 flex items-center justify-center">

              {doc.company.stamp && (
                <img
                  src={doc.company.stamp}
                  alt="Stamp"
                  className="
                    absolute
                    w-[70px] h-[70px]
                    object-contain
                    opacity-60
                    left-1/2 top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                  "
                />
              )}

              {doc.company.signature && (
                <img
                  src={doc.company.signature}
                  alt="Signature"
                  className="
                    relative
                    max-w-[165px]
                    max-h-[70px]
                    object-contain
                    z-10
                  "
                />
              )}

            </div>

            <div className="border-t border-zinc-900 pt-1">
              <div className="text-[11px] font-bold">
                {doc.handover_by_name || doc.company.name}
              </div>

              <div className="text-[9px] text-zinc-500 mt-0.5">
                {doc.handover_by_title || 'Penanggung Jawab'}
              </div>
            </div>
          </div>

          {/* Yang Menerima */}
          <div className="text-center">
            <div className="text-[11px] font-semibold mb-1">
              Yang Menerima,
            </div>

            <div className="relative h-[76px] my-1" />

            <div className="border-t border-zinc-900 pt-1">
              <div className="text-[11px] font-bold">
                {doc.received_by_name || doc.client.name}
              </div>

              <div className="text-[9px] text-zinc-500 mt-0.5">
                {doc.received_by_title || 'Perwakilan Klien'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}