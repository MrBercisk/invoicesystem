import type { Invoice } from '../../types';
import { terbilang } from '../../lib/terbilang';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewFormal({ invoice, formatRupiah, formatDate }: Props) {
  return (
    <div className="bg-white border border-neutral-400 rounded-xl p-8 sm:p-12 shadow-sm text-neutral-900 max-w-[210mm] mx-auto font-serif-invoice">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-4">
        <div>
          {invoice.company.logo && (
            <img
              src={invoice.company.logo}
              alt={invoice.company.name}
              className="max-h-12 max-w-[190px] object-contain mb-3"
            />
          )}
          <h1 className="text-2xl font-bold text-black tracking-tight">{invoice.company.name}</h1>
          <div className="text-xs text-neutral-700 font-sans mt-1.5 leading-relaxed">
            {invoice.company.address && <div>{invoice.company.address}</div>}
            {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
            {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
            {invoice.company.email && <div>{invoice.company.email}</div>}
            {invoice.company.npwp && <div className="text-neutral-500 font-mono">NPWP: {invoice.company.npwp}</div>}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-2xl font-bold text-black tracking-widest font-serif-invoice uppercase">FAKTUR</div>
          <div className="text-sm font-mono text-neutral-800 mt-1 font-bold">{invoice.invoice_number}</div>
          <div className="text-xs text-neutral-700 font-sans mt-2 space-y-0.5 border-t border-black pt-2">
            <div><span className="font-semibold">Tanggal: </span>{formatDate(invoice.invoice_date)}</div>
            <div><span className="font-semibold">Jatuh Tempo: </span>{formatDate(invoice.due_date)}</div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-b border-black py-1 my-4" />

      {/* ── Bill To ── */}
      <div className="my-4 border border-black p-4">
        <div className="text-[10px] font-bold text-black uppercase tracking-widest font-sans border-b border-black pb-1 mb-2">
          Ditagihkan Kepada (Yth.)
        </div>
        <div className="font-bold text-black text-base">{invoice.client.name}</div>
        <div className="text-xs text-neutral-800 font-sans mt-1.5 leading-relaxed">
          {invoice.client.pic_name && <div>u.p. <span className="font-semibold">{invoice.client.pic_name}</span></div>}
          {invoice.client.address && <div>{invoice.client.address}</div>}
          {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
          {invoice.client.email && <div>{invoice.client.email}</div>}
          {invoice.client.npwp && <div className="font-mono text-neutral-600">NPWP: {invoice.client.npwp}</div>}
        </div>
      </div>

      {/* ── Table Items ── */}
      <div className="overflow-x-auto my-5">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-t-2 border-b border-black">
              <th className="py-2.5 px-2 font-bold text-black uppercase tracking-wide text-[10px]">Deskripsi Transaksi / Barang</th>
              <th className="py-2.5 px-2 font-bold text-black uppercase tracking-wide text-[10px] text-right w-16">Qty</th>
              <th className="py-2.5 px-2 font-bold text-black uppercase tracking-wide text-[10px] w-14">Sat.</th>
              <th className="py-2.5 px-2 font-bold text-black uppercase tracking-wide text-[10px] text-right w-32">Harga</th>
              <th className="py-2.5 px-2 font-bold text-black uppercase tracking-wide text-[10px] text-right w-32">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 px-2">
                  <div className="font-semibold text-black font-serif-invoice text-sm">{item.name}</div>
                  {item.description && <div className="text-[11px] text-neutral-600 italic mt-0.5">{item.description}</div>}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-neutral-800">{item.quantity}</td>
                <td className="py-2.5 px-2 text-neutral-500">{item.unit}</td>
                <td className="py-2.5 px-2 text-right font-mono text-neutral-800">{formatRupiah(item.price)}</td>
                <td className="py-2.5 px-2 text-right font-mono font-semibold text-black">{formatRupiah(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ── */}
      <div className="flex justify-end mb-5">
        <div className="w-72 border border-black font-sans">
          <div className="flex justify-between text-xs px-3 py-1.5 border-b border-neutral-200 text-neutral-700">
            <span>Subtotal</span>
            <span className="font-mono font-medium">{formatRupiah(invoice.subtotal)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div className="flex justify-between text-xs px-3 py-1.5 border-b border-neutral-200 text-neutral-700">
              <span>PPN ({invoice.tax_rate}%)</span>
              <span className="font-mono font-medium">{formatRupiah(invoice.tax_amount)}</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div className="flex justify-between text-xs px-3 py-1.5 border-b border-neutral-200 text-neutral-700">
              <span>Diskon</span>
              <span className="font-mono font-medium text-rose-700">-{formatRupiah(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between px-3 py-2 bg-black text-white text-xs font-bold">
            <span>TOTAL PEMBAYARAN</span>
            <span className="font-mono text-sm">{formatRupiah(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Terbilang Box ── */}
      <div className="border border-black p-3.5 mb-5 text-xs text-black bg-neutral-50">
        <div className="font-bold uppercase tracking-wider text-[10px] mb-0.5 font-sans">Terbilang:</div>
        <div className="italic font-medium text-sm text-neutral-900 font-serif-invoice"># {terbilang(invoice.total)} #</div>
      </div>

      {/* ── Bank Payment Info ── */}
      {invoice.company.bank_name && (
        <div className="border border-black p-3.5 mb-5 font-sans text-xs">
          <div className="font-bold uppercase tracking-widest text-[10px] border-b border-black pb-1 mb-2">Informasi Rekening Pembayaran</div>
          <div className="text-neutral-800">Bank: <span className="font-bold text-black">{invoice.company.bank_name}</span></div>
          {invoice.company.bank_account_name && (
            <div className="text-neutral-800 mt-0.5">Atas Nama: <span className="font-bold text-black">{invoice.company.bank_account_name}</span></div>
          )}
          {invoice.company.bank_account_number && (
            <div className="text-neutral-800 mt-0.5">Nomor Rekening: <span className="font-mono font-bold text-black text-sm">{invoice.company.bank_account_number}</span></div>
          )}
        </div>
      )}

      {/* ── Notes / Terms ── */}
      {(invoice.notes || invoice.terms) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs text-neutral-700 mb-5">
          {invoice.notes && (
            <div>
              <div className="font-bold text-black uppercase tracking-wider text-[10px] mb-1">Catatan</div>
              <p className="leading-relaxed">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <div className="font-bold text-black uppercase tracking-wider text-[10px] mb-1">Syarat & Ketentuan</div>
              <p className="leading-relaxed">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Signature & Stamp Section ── */}
      <div className="flex justify-end mb-6">
        <div className="w-56 text-center text-xs">
          <div className="text-neutral-700 font-sans text-[11px] mb-1">
            {invoice.company.city ? `${invoice.company.city}, ` : ''}{formatDate(invoice.invoice_date)}
          </div>
          <div className="font-bold text-black font-sans uppercase tracking-wide mb-1 text-[10px]">Hormat Kami,</div>

          <div className="relative h-20 flex items-center justify-center my-1">
            {invoice.company.stamp && (
              <img
                src={invoice.company.stamp}
                alt="Stempel Perusahaan"
                className="absolute left-2 top-0 h-20 w-20 object-contain opacity-85 pointer-events-none select-none z-0"
              />
            )}
            {invoice.company.signature ? (
              <img
                src={invoice.company.signature}
                alt="Tanda Tangan"
                className="max-h-16 max-w-[140px] object-contain relative z-10"
              />
            ) : (
              <div className="h-14" />
            )}
          </div>

          <div className="border-b border-black pt-1 pb-1">
            <span className="font-bold text-black underline text-xs">
              {invoice.company.signature_name || invoice.company.name}
            </span>
          </div>
          <div className="text-[10px] text-neutral-600 font-sans mt-1">
            {invoice.company.signature_title || 'Penanggung Jawab'}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-neutral-300 pt-3 text-center text-[10px] text-neutral-500 font-sans italic">
        Terima kasih atas kepercayaan dan kerjasamanya • {invoice.company.name}{invoice.company.email && ` • ${invoice.company.email}`}
      </div>
    </div>
  );
}
