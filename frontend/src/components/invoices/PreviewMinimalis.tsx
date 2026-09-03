import type { Invoice } from '../../types';
import { terbilang } from '../../lib/terbilang';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewMinimalis({ invoice, formatRupiah, formatDate }: Props) {
  // Status invoice: 'draft' | 'sent' | 'paid' | 'cancelled' — sesuaikan dengan kolom `status` di tabel invoices.
  const status = invoice.status;

  return (
    <div className="relative overflow-hidden bg-white border border-zinc-200 p-8 sm:p-12 text-zinc-900 max-w-[210mm] mx-auto">
      {status === 'draft' && (
        <div className="absolute z-20 pointer-events-none select-none" style={{ top: '53%', left: '30%' }}>
          <span
            className="font-bold uppercase text-zinc-300"
            style={{
              fontSize: '60px',
              letterSpacing: '8px',
              transform: 'translate(-50%, -50%) rotate(-28deg)',
              opacity: 0.4,
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            Draft
          </span>
        </div>
      )}
      {status === 'paid' && (
        <div className="absolute z-20 pointer-events-none select-none" style={{ top: '53%', left: '30%' }}>
          <div
            className="border-[3px] border-emerald-600 text-emerald-600 font-bold uppercase rounded-md"
            style={{
              fontSize: '22px',
              letterSpacing: '4px',
              padding: '6px 16px',
              transform: 'translate(-50%, -50%) rotate(-14deg)',
              opacity: 0.5,
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            Lunas
          </div>
        </div>
      )}
      {status === 'cancelled' && (
        <div className="absolute z-20 pointer-events-none select-none" style={{ top: '53%', left: '30%' }}>
          <div
            className="border-[3px] border-red-600 text-red-600 font-bold uppercase rounded-md"
            style={{
              fontSize: '19px',
              letterSpacing: '3px',
              padding: '6px 12px',
              transform: 'translate(-50%, -50%) rotate(-14deg)',
              opacity: 0.5,
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            Dibatalkan
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-5 border-b border-zinc-200">
        <div>
          {invoice.company.logo && (
            <img
              src={invoice.company.logo}
              alt={invoice.company.name}
              className="max-h-[50px] max-w-[225px] object-contain mb-3"
            />
          )}
          <h1 className="text-lg font-bold text-zinc-950 tracking-tight">{invoice.company.name}</h1>
          <div className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            {invoice.company.address && <div>{invoice.company.address}</div>}
            {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
            {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
            {invoice.company.email && <div>{invoice.company.email}</div>}
            {invoice.company.npwp && <div className="text-zinc-400 font-mono">NPWP: {invoice.company.npwp}</div>}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-[10.5px] font-semibold text-zinc-500 tracking-wide uppercase">Invoice</div>
          <div className="text-lg font-bold font-mono text-zinc-950 mt-1">{invoice.invoice_number}</div>
          <div className="text-xs text-zinc-500 mt-2 space-y-0.5">
            <div><span className="text-zinc-400">Tanggal </span>{formatDate(invoice.invoice_date)}</div>
            <div><span className="text-zinc-400">Jatuh tempo </span>{formatDate(invoice.due_date)}</div>
          </div>
        </div>
      </div>
      {/* ── Project / Termin ── */}
      {(invoice.project_code || invoice.installment_label) && (
        <div
          className={`grid gap-3 mt-5 mb-6 ${
            invoice.project_code && invoice.installment_label
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1'
          }`}
        >
          {invoice.project_code && (
            <div className="border border-zinc-200 px-3 py-2.5">
              <div className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">
                Project
              </div>
              <div className="text-xs font-mono font-semibold text-zinc-950">
                {invoice.project_code}
              </div>
            </div>
          )}

          {invoice.installment_label && (
            <div className="border border-zinc-200 px-3 py-2.5">
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
      <div className="pt-4 pb-5 mt-5 mb-6 border-b border-zinc-200">
        <div className="text-[10.5px] font-semibold text-zinc-500 mb-1.5">Ditagihkan kepada</div>
        <div className="font-bold text-zinc-950 text-sm">{invoice.client.name}</div>
        <div className="text-xs text-zinc-600 mt-1 leading-relaxed">
          {invoice.client.pic_name && <div>u.p. <span className="font-medium text-zinc-800">{invoice.client.pic_name}</span></div>}
          {invoice.client.address && <div>{invoice.client.address}</div>}
          {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
          {invoice.client.email && <div>{invoice.client.email}</div>}
          {invoice.client.npwp && <div className="text-zinc-400">NPWP: {invoice.client.npwp}</div>}
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
                  <div className="font-semibold text-zinc-900">{item.name}</div>
                  {item.description && <div className="text-[11px] text-zinc-500 mt-0.5">{item.description}</div>}
                </td>
                <td className="py-3 px-2 text-right font-mono text-zinc-700">{item.quantity}</td>
                <td className="py-3 px-2 text-zinc-400">{item.unit}</td>
                <td className="py-3 px-2 text-right font-mono text-zinc-700">{formatRupiah(item.price)}</td>
                <td className="py-3 pl-2 text-right font-mono font-semibold text-zinc-950">{formatRupiah(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ── */}
      <div className="flex justify-end mb-2">
        <div className="w-72">
          <div className="flex justify-between text-xs text-zinc-600 py-1">
            <span>Subtotal</span>
            <span className="font-mono text-zinc-900 font-medium">{formatRupiah(invoice.subtotal)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div className="flex justify-between text-xs text-zinc-600 py-1">
              <span>PPN ({invoice.tax_rate}%)</span>
              <span className="font-mono text-zinc-900 font-medium">{formatRupiah(invoice.tax_amount)}</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div className="flex justify-between text-xs text-zinc-600 py-1">
              <span>Diskon</span>
              <span className="font-mono text-red-800 font-medium">-{formatRupiah(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-3 mt-1 border-t-[1.5px] border-zinc-900">
            <span className="text-xs font-bold text-zinc-950">Total tagihan</span>
            <span className="font-mono font-bold text-red-800 text-lg">{formatRupiah(invoice.total)}</span>
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
            <div className="text-xs text-zinc-700 mt-0.5">No. rekening <span className="font-mono font-semibold text-zinc-950">{invoice.company.bank_account_number}</span></div>
          )}
        </div>
      )}

      {/* ── Notes / Terms ── */}
      {(invoice.notes || invoice.terms) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-600 mb-8">
          {invoice.notes && (
            <div>
              <div className="font-semibold text-zinc-500 text-[10.5px] mb-1">Catatan</div>
              <p className="leading-relaxed">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <div className="font-semibold text-zinc-500 text-[10.5px] mb-1">Syarat &amp; ketentuan</div>
              <p className="leading-relaxed">{invoice.terms}</p>
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
          <div className="font-semibold text-zinc-900 mb-1">Hormat kami,</div>

          <div className="relative h-[100px] flex items-center justify-center my-1">
            {invoice.company.stamp && (
              <img
                src={invoice.company.stamp}
                alt="Stempel Perusahaan"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 object-contain opacity-70 pointer-events-none select-none z-0"
              />
            )}
            {invoice.company.signature ? (
              <img
                src={invoice.company.signature}
                alt="Tanda Tangan"
                className="max-h-20 max-w-[175px] object-contain relative z-10"
              />
            ) : (
              <div className="h-14" />
            )}
          </div>

          <div className="border-t border-zinc-900 pt-1.5">
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
  );
}