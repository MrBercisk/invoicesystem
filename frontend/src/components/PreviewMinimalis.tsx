import type { Invoice } from '../types';
import { terbilang } from '../lib/terbilang';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewMinimalis({ invoice, formatRupiah, formatDate }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-8 sm:p-12 shadow-sm text-zinc-900 max-w-[210mm] mx-auto">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-zinc-900">
        <div>
          {invoice.company.logo && (
            <img
              src={invoice.company.logo}
              alt={invoice.company.name}
              className="max-h-12 max-w-[190px] object-contain mb-3"
            />
          )}
          <h1 className="text-xl font-extrabold text-zinc-950 tracking-tight">{invoice.company.name}</h1>
          <div className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            {invoice.company.address && <div>{invoice.company.address}</div>}
            {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
            {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
            {invoice.company.email && <div>{invoice.company.email}</div>}
            {invoice.company.npwp && <div className="text-zinc-400 font-mono">NPWP: {invoice.company.npwp}</div>}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-[11px] font-extrabold text-red-600 tracking-widest uppercase">Invoice Penagihan</div>
          <div className="text-xl font-bold font-mono text-zinc-950 mt-1">{invoice.invoice_number}</div>
          <div className="text-xs text-zinc-500 mt-2 space-y-0.5">
            <div><span className="text-zinc-400">Tanggal: </span>{formatDate(invoice.invoice_date)}</div>
            <div><span className="text-zinc-400">Jatuh Tempo: </span>{formatDate(invoice.due_date)}</div>
          </div>
        </div>
      </div>

      {/* ── Bill To ── */}
      <div className="my-6 bg-zinc-50/90 border border-zinc-200 border-l-[3.5px] border-l-red-600 p-4 rounded-r-md">
        <div className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest mb-1">Ditagihkan Kepada</div>
        <div className="font-extrabold text-zinc-950 text-sm">{invoice.client.name}</div>
        <div className="text-xs text-zinc-600 mt-1 leading-relaxed">
          {invoice.client.pic_name && <div>u.p. <span className="font-medium text-zinc-800">{invoice.client.pic_name}</span></div>}
          {invoice.client.address && <div>{invoice.client.address}</div>}
          {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
          {invoice.client.email && <div>{invoice.client.email}</div>}
          {invoice.client.npwp && <div className="text-zinc-400">NPWP: {invoice.client.npwp}</div>}
        </div>
      </div>

      {/* ── Table Items ── */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-t border-b-2 border-zinc-900 bg-zinc-50">
              <th className="py-2.5 px-2.5 font-bold text-zinc-800 uppercase tracking-wider text-[10px]">Deskripsi</th>
              <th className="py-2.5 px-2.5 font-bold text-zinc-800 uppercase tracking-wider text-[10px] text-right w-16">Qty</th>
              <th className="py-2.5 px-2.5 font-bold text-zinc-800 uppercase tracking-wider text-[10px] w-14">Sat.</th>
              <th className="py-2.5 px-2.5 font-bold text-zinc-800 uppercase tracking-wider text-[10px] text-right w-32">Harga</th>
              <th className="py-2.5 px-2.5 font-bold text-zinc-800 uppercase tracking-wider text-[10px] text-right w-32">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-3 px-2.5">
                  <div className="font-semibold text-zinc-900">{item.name}</div>
                  {item.description && <div className="text-[11px] text-zinc-500 mt-0.5">{item.description}</div>}
                </td>
                <td className="py-3 px-2.5 text-right font-mono text-zinc-700">{item.quantity}</td>
                <td className="py-3 px-2.5 text-zinc-400">{item.unit}</td>
                <td className="py-3 px-2.5 text-right font-mono text-zinc-700">{formatRupiah(item.price)}</td>
                <td className="py-3 px-2.5 text-right font-mono font-bold text-zinc-950">{formatRupiah(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ── */}
      <div className="flex justify-end mb-6">
        <div className="w-72 space-y-2">
          <div className="flex justify-between text-xs text-zinc-600">
            <span>Subtotal</span>
            <span className="font-mono text-zinc-900 font-medium">{formatRupiah(invoice.subtotal)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div className="flex justify-between text-xs text-zinc-600">
              <span>PPN ({invoice.tax_rate}%)</span>
              <span className="font-mono text-zinc-900 font-medium">{formatRupiah(invoice.tax_amount)}</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Diskon</span>
              <span className="font-mono text-red-600 font-medium">-{formatRupiah(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between p-3 bg-zinc-950 text-white rounded-md text-sm font-bold border-l-4 border-red-600 shadow-xs">
            <span>Total Tagihan</span>
            <span className="font-mono text-base">{formatRupiah(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Terbilang Box ── */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3.5 mb-6 text-xs text-zinc-700">
        <div className="font-bold text-zinc-900 uppercase tracking-wider text-[10px] mb-0.5">Terbilang:</div>
        <div className="italic font-serif-invoice text-zinc-900 text-sm"># {terbilang(invoice.total)} #</div>
      </div>

      {/* ── Bank Payment Info ── */}
      {invoice.company.bank_name && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3.5 mb-6 border-l-2 border-l-zinc-900">
          <div className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest mb-1.5">Informasi Rekening Pembayaran</div>
          <div className="text-xs text-zinc-700">Bank: <span className="font-semibold text-zinc-950">{invoice.company.bank_name}</span></div>
          {invoice.company.bank_account_name && (
            <div className="text-xs text-zinc-700 mt-0.5">A/N: <span className="font-semibold text-zinc-950">{invoice.company.bank_account_name}</span></div>
          )}
          {invoice.company.bank_account_number && (
            <div className="text-xs text-zinc-700 mt-0.5">No. Rekening: <span className="font-mono font-bold text-zinc-950">{invoice.company.bank_account_number}</span></div>
          )}
        </div>
      )}

      {/* ── Notes / Terms ── */}
      {(invoice.notes || invoice.terms) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600 mb-6">
          {invoice.notes && (
            <div>
              <div className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] mb-1">Catatan</div>
              <p className="leading-relaxed text-zinc-600">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <div className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] mb-1">Syarat & Ketentuan</div>
              <p className="leading-relaxed text-zinc-600">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Signature & Stamp Section ── */}
      <div className="flex justify-end mb-6">
        <div className="w-56 text-center text-xs">
          <div className="text-zinc-500 text-[11px] mb-1">
            {invoice.company.city ? `${invoice.company.city}, ` : ''}{formatDate(invoice.invoice_date)}
          </div>
          <div className="font-bold text-zinc-900 mb-1">Hormat Kami,</div>

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

          <div className="border-b-2 border-zinc-900 pt-1 pb-1">
            <span className="font-bold text-zinc-950 text-xs">
              {invoice.company.signer_name || invoice.company.name}
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {invoice.company.signer_title || 'Penanggung Jawab'}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-zinc-200 pt-4 text-center text-[10px] text-zinc-400">
        Terima kasih atas kepercayaan Anda • {invoice.company.name}{invoice.company.email && ` • ${invoice.company.email}`}
      </div>
    </div>
  );
}
