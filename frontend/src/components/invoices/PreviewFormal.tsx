import type { Invoice } from '../../types';
import { terbilang } from '../../lib/terbilang';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewFormal({ invoice, formatRupiah, formatDate }: Props) {
  // Status invoice: 'draft' | 'sent' | 'paid' | 'cancelled' — sesuaikan dengan kolom `status` di tabel invoices.
  const status = invoice.status;

  return (
    <div className="relative overflow-hidden bg-white border border-neutral-300 p-8 sm:p-12 text-neutral-900 max-w-[210mm] mx-auto font-serif-invoice">
      {status === 'draft' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-bold uppercase text-neutral-300"
            style={{ fontSize: '110px', letterSpacing: '14px', transform: 'rotate(-28deg)', opacity: 0.4 }}
          >
            Draft
          </span>
        </div>
      )}
      {status === 'paid' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
          <div
            className="border-[6px] border-emerald-700 text-emerald-700 font-bold uppercase px-8 py-3"
            style={{ fontSize: '44px', letterSpacing: '8px', transform: 'rotate(-14deg)', opacity: 0.5 }}
          >
            Lunas
          </div>
        </div>
      )}
      {status === 'cancelled' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
          <div
            className="border-[6px] border-red-700 text-red-700 font-bold uppercase px-6 py-3"
            style={{ fontSize: '38px', letterSpacing: '6px', transform: 'rotate(-14deg)', opacity: 0.5 }}
          >
            Dibatalkan
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
        <div>
          {invoice.company.logo && (
            <img
              src={invoice.company.logo}
              alt={invoice.company.name}
              className="max-h-11 max-w-[190px] object-contain mb-3"
            />
          )}
          <h1 className="text-xl font-bold text-neutral-900">{invoice.company.name}</h1>
          <div className="text-xs text-neutral-600 font-sans mt-1.5 leading-relaxed">
            {invoice.company.address && <div>{invoice.company.address}</div>}
            {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
            {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
            {invoice.company.email && <div>{invoice.company.email}</div>}
            {invoice.company.npwp && <div className="text-neutral-500 font-mono">NPWP: {invoice.company.npwp}</div>}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xl font-semibold text-neutral-900 tracking-wide">Invoice</div>
          <div className="text-xs font-mono text-neutral-600 mt-1">{invoice.invoice_number}</div>
          <div className="text-xs text-neutral-600 font-sans mt-2 space-y-0.5">
            <div>Tanggal: {formatDate(invoice.invoice_date)}</div>
            <div>Jatuh tempo: {formatDate(invoice.due_date)}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-900 mt-4 mb-5" />
      {(invoice.project_code || invoice.installment_label) && (
        <div
          className={`grid gap-3 mb-6 ${
            invoice.project_code && invoice.installment_label
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1'
          }`}
        >
          {invoice.project_code && (
            <div className="border border-neutral-300 px-3 py-2.5">
              <div className="text-[9px] uppercase tracking-wider font-sans font-semibold text-neutral-500 mb-1">
                Project
              </div>
              <div className="text-xs font-mono font-semibold text-neutral-900">
                {invoice.project_code}
              </div>
            </div>
          )}

          {invoice.installment_label && (
            <div className="border border-neutral-300 px-3 py-2.5">
              <div className="text-[9px] uppercase tracking-wider font-sans font-semibold text-neutral-500 mb-1">
                Termin Pembayaran
              </div>
              <div className="text-xs font-sans font-semibold text-neutral-900">
                {invoice.installment_label}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bill To ── */}
      <div className="mb-6">
        <div className="text-[10px] text-neutral-500 font-sans mb-1.5">Ditagihkan kepada</div>
        <div className="font-bold text-neutral-900 text-[15px]">{invoice.client.name}</div>
        <div className="text-xs text-neutral-600 font-sans mt-1 leading-relaxed">
          {invoice.client.pic_name && <div>u.p. <span className="font-medium text-neutral-800">{invoice.client.pic_name}</span></div>}
          {invoice.client.address && <div>{invoice.client.address}</div>}
          {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
          {invoice.client.email && <div>{invoice.client.email}</div>}
          {invoice.client.npwp && <div className="font-mono text-neutral-500">NPWP: {invoice.client.npwp}</div>}
        </div>
      </div>

      {/* ── Items ── */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-t border-b border-neutral-900">
              <th className="py-2 pr-2 font-medium text-neutral-600 text-[10px]">Deskripsi</th>
              <th className="py-2 px-2 font-medium text-neutral-600 text-[10px] text-right w-16">Qty</th>
              <th className="py-2 px-2 font-medium text-neutral-600 text-[10px] w-14">Sat.</th>
              <th className="py-2 px-2 font-medium text-neutral-600 text-[10px] text-right w-32">Harga</th>
              <th className="py-2 pl-2 font-medium text-neutral-600 text-[10px] text-right w-32">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 pr-2">
                  <div className="font-medium text-neutral-900 font-serif-invoice text-sm">{item.name}</div>
                  {item.description && <div className="text-[11px] text-neutral-500 italic mt-0.5">{item.description}</div>}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-neutral-700">{item.quantity}</td>
                <td className="py-2.5 px-2 text-neutral-500">{item.unit}</td>
                <td className="py-2.5 px-2 text-right font-mono text-neutral-700">{formatRupiah(item.price)}</td>
                <td className="py-2.5 pl-2 text-right font-mono font-medium text-neutral-900">{formatRupiah(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ── */}
      <div className="flex justify-end mb-2">
        <div className="w-72 font-sans">
          <div className="flex justify-between text-xs px-0 py-1 text-neutral-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatRupiah(invoice.subtotal)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div className="flex justify-between text-xs px-0 py-1 text-neutral-600">
              <span>PPN ({invoice.tax_rate}%)</span>
              <span className="font-mono">{formatRupiah(invoice.tax_amount)}</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div className="flex justify-between text-xs px-0 py-1 text-neutral-600">
              <span>Diskon</span>
              <span className="font-mono">-{formatRupiah(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between px-0 pt-2 mt-1 border-t-2 border-neutral-900 text-sm font-bold text-neutral-900">
            <span>Total pembayaran</span>
            <span className="font-mono">{formatRupiah(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Terbilang ── */}
      <div className="mb-6 text-right font-sans">
        <p className="text-[11px] text-neutral-500 italic">
          Terbilang: <span className="font-serif-invoice not-italic text-neutral-800">{terbilang(invoice.total)}</span>
        </p>
      </div>

      {/* ── Bank Payment Info ── */}
      {invoice.company.bank_name && (
        <div className="py-3 mb-6 border-t border-b border-neutral-300 font-sans text-xs">
          <div className="text-[10px] text-neutral-500 mb-1.5">Rekening pembayaran</div>
          <div className="text-neutral-700">Bank: <span className="font-semibold text-neutral-900">{invoice.company.bank_name}</span></div>
          {invoice.company.bank_account_name && (
            <div className="text-neutral-700 mt-0.5">Atas nama: <span className="font-semibold text-neutral-900">{invoice.company.bank_account_name}</span></div>
          )}
          {invoice.company.bank_account_number && (
            <div className="text-neutral-700 mt-0.5">Nomor rekening: <span className="font-mono font-semibold text-neutral-900">{invoice.company.bank_account_number}</span></div>
          )}
        </div>
      )}

      {/* ── Notes / Terms ── */}
      {(invoice.notes || invoice.terms) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-xs text-neutral-600 mb-8">
          {invoice.notes && (
            <div>
              <div className="font-medium text-neutral-500 text-[10px] mb-1">Catatan</div>
              <p className="leading-relaxed">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <div className="font-medium text-neutral-500 text-[10px] mb-1">Syarat &amp; ketentuan</div>
              <p className="leading-relaxed">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Signature & Stamp ── */}
      <div className="flex justify-end mb-6">
        <div className="w-52 text-center text-xs font-sans">
          <div className="text-neutral-600 text-[11px] mb-1">
            {invoice.company.city ? `${invoice.company.city}, ` : ''}{formatDate(invoice.invoice_date)}
          </div>
          <div className="text-neutral-700 mb-1">Hormat kami,</div>

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

          <div className="border-t border-neutral-900 pt-1.5">
            <span className="font-bold text-neutral-900 font-serif-invoice text-[13px]">
              {invoice.company.signature_name || invoice.company.name}
            </span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            {invoice.company.signature_title || 'Penanggung Jawab'}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-neutral-900 pt-3 text-center text-[10px] text-neutral-500 font-sans italic">
        <div>{invoice.company.name}</div>
        {invoice.company.email && <div>{invoice.company.email}</div>}
      </div>
    </div>
  );
}