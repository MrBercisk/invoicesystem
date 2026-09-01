import type { Invoice } from '../../types';
import { terbilang } from '../../lib/terbilang';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewGradient({ invoice, formatRupiah, formatDate }: Props) {
  // Status invoice: 'draft' | 'sent' | 'paid' | 'cancelled' — sesuaikan dengan kolom `status` di tabel invoices.
  const status = invoice.status;

  return (
    <div className="relative overflow-hidden bg-white border border-zinc-200 text-zinc-900 max-w-[210mm] mx-auto">
      {status === 'draft' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-extrabold uppercase text-zinc-400"
            style={{ fontSize: '110px', letterSpacing: '14px', transform: 'rotate(-28deg)', opacity: 0.3 }}
          >
            Draft
          </span>
        </div>
      )}
      {status === 'paid' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
          <div
            className="border-[6px] border-emerald-500 text-emerald-500 font-extrabold uppercase px-8 py-3 rounded-md"
            style={{ fontSize: '44px', letterSpacing: '8px', transform: 'rotate(-14deg)', opacity: 0.6 }}
          >
            Lunas
          </div>
        </div>
      )}
      {status === 'cancelled' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
          <div
            className="border-[6px] border-red-500 text-red-500 font-extrabold uppercase px-6 py-3 rounded-md"
            style={{ fontSize: '38px', letterSpacing: '6px', transform: 'rotate(-14deg)', opacity: 0.6 }}
          >
            Dibatalkan
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-zinc-950 p-8 sm:p-10 text-white border-b-2 border-red-900">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            {invoice.company.logo && (
              <img
                src={invoice.company.logo}
                alt={invoice.company.name}
                className="max-h-9 max-w-[170px] object-contain mb-3"
              />
            )}
            <h1 className="text-lg font-bold text-white tracking-tight">{invoice.company.name}</h1>
            <div className="text-xs text-zinc-400 mt-1.5 leading-relaxed space-y-0.5">
              {invoice.company.address && <div>{invoice.company.address}</div>}
              {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
              {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
              {invoice.company.email && <div>{invoice.company.email}</div>}
              {invoice.company.npwp && <div className="text-zinc-500 font-mono">NPWP: {invoice.company.npwp}</div>}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-[10px] font-semibold text-red-200/70 tracking-wide uppercase">Invoice</div>
            <div className="text-xl font-bold font-mono text-white mt-1">{invoice.invoice_number}</div>
            <div className="text-xs text-zinc-400 mt-2.5 space-y-1">
              <div><span className="text-zinc-500">Tanggal </span>{formatDate(invoice.invoice_date)}</div>
              <div><span className="text-zinc-500">Jatuh tempo </span>{formatDate(invoice.due_date)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-10">
        {(invoice.project_code || invoice.installment_label) && (
          <div
            className={`grid gap-3 mb-6 ${
              invoice.project_code && invoice.installment_label
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {invoice.project_code && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">
                  Project
                </div>
                <div className="text-xs font-mono font-semibold text-zinc-950">
                  {invoice.project_code}
                </div>
              </div>
            )}

            {invoice.installment_label && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">
                  Termin Pembayaran
                </div>
                <div className="text-xs font-semibold text-zinc-950">
                  {invoice.installment_label}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ── Bill To ── */}
        <div className="pt-4 pb-5 mb-6 border-b border-zinc-200">
          <div className="text-[10.5px] font-semibold text-zinc-500 mb-1.5">Ditagihkan kepada</div>
          <div className="font-bold text-zinc-950 text-sm">{invoice.client.name}</div>
          <div className="text-xs text-zinc-600 mt-1 leading-relaxed">
            {invoice.client.pic_name && <div>u.p. <span className="font-medium text-zinc-800">{invoice.client.pic_name}</span></div>}
            {invoice.client.address && <div>{invoice.client.address}</div>}
            {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
            {invoice.client.email && <div>{invoice.client.email}</div>}
            {invoice.client.npwp && <div className="text-zinc-400 font-mono">NPWP: {invoice.client.npwp}</div>}
          </div>
        </div>

        {/* ── Items ── */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-[1.5px] border-zinc-900">
                <th className="pb-2 pr-2 font-semibold text-zinc-500 text-[10px]">Deskripsi</th>
                <th className="pb-2 px-2 font-semibold text-zinc-500 text-[10px] text-right w-16">Qty</th>
                <th className="pb-2 px-2 font-semibold text-zinc-500 text-[10px] w-14">Sat.</th>
                <th className="pb-2 px-2 font-semibold text-zinc-500 text-[10px] text-right w-32">Harga</th>
                <th className="pb-2 pl-2 font-semibold text-zinc-500 text-[10px] text-right w-32">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 pr-2">
                    <div className="font-semibold text-zinc-950">{item.name}</div>
                    {item.description && <div className="text-[11px] text-zinc-500 mt-0.5">{item.description}</div>}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-zinc-700">{item.quantity}</td>
                  <td className="py-3 px-2 text-zinc-400">{item.unit}</td>
                  <td className="py-3 px-2 text-right font-mono text-zinc-700">{formatRupiah(item.price)}</td>
                  <td className="py-3 pl-2 text-right font-mono font-bold text-zinc-950">{formatRupiah(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Totals ── */}
        <div className="flex justify-end mb-6">
          <div className="w-72 space-y-1.5">
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
                <span className="font-mono text-red-800 font-medium">-{formatRupiah(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center p-3 bg-zinc-950 text-white text-sm font-bold border-l-2 border-red-900 mt-2">
              <span>Total tagihan</span>
              <span className="font-mono text-base">{formatRupiah(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* ── Terbilang ── */}
        <div className="mb-6 text-right">
          <p className="text-[11px] text-zinc-500 italic">Terbilang: {terbilang(invoice.total)}</p>
        </div>

        {/* ── Bank Payment Info ── */}
        {invoice.company.bank_name && (
          <div className="py-3 mb-6 border-t border-b border-zinc-200">
            <div className="text-[10.5px] font-semibold text-zinc-500 mb-1.5">Pembayaran</div>
            <div className="text-xs text-zinc-700">Bank <span className="font-semibold text-zinc-950">{invoice.company.bank_name}</span></div>
            {invoice.company.bank_account_name && (
              <div className="text-xs text-zinc-700 mt-0.5">a.n. <span className="font-semibold text-zinc-950">{invoice.company.bank_account_name}</span></div>
            )}
            {invoice.company.bank_account_number && (
              <div className="text-xs text-zinc-700 mt-0.5">No. rekening <span className="font-mono font-bold text-zinc-950">{invoice.company.bank_account_number}</span></div>
            )}
          </div>
        )}

        {/* ── Notes / Terms ── */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-600 mb-8">
            {invoice.notes && (
              <div>
                <div className="font-semibold text-zinc-500 text-[10.5px] mb-1">Catatan</div>
                <p className="leading-relaxed text-zinc-600">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <div className="font-semibold text-zinc-500 text-[10.5px] mb-1">Syarat &amp; ketentuan</div>
                <p className="leading-relaxed text-zinc-600">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Signature & Stamp ── */}
        <div className="flex justify-end mb-6">
          <div className="w-52 text-center text-xs">
            <div className="text-zinc-500 text-[11px] mb-1">
              {invoice.company.city ? `${invoice.company.city}, ` : ''}
              {formatDate(invoice.invoice_date)}
            </div>
            <div className="font-semibold text-zinc-950 mb-1">Hormat kami,</div>

            <div className="relative h-20 flex items-center justify-center my-1">
              {invoice.company.stamp && (
                <img
                  src={invoice.company.stamp}
                  alt="Stempel Perusahaan"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 object-contain opacity-70 pointer-events-none select-none z-0"
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

            <div className="border-t-[1.5px] border-zinc-950 pt-1.5">
              <span className="font-bold text-zinc-950 text-xs">
                {invoice.company.signature_name || invoice.company.name}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {invoice.company.signature_title || 'Penanggung Jawab'}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-zinc-200 pt-3 text-center text-[10px] text-zinc-400">
          <div>{invoice.company.name}</div>
          {invoice.company.email && <div>{invoice.company.email}</div>}
        </div>
      </div>
    </div>
  );
}