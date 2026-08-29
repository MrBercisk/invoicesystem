import type { Invoice } from '../types';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewMinimalis({ invoice, formatRupiah, formatDate }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{invoice.company.name}</h1>
          <div className="text-xs text-gray-500 mt-1 leading-relaxed">
            {invoice.company.address && <div>{invoice.company.address}</div>}
            {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
            {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
            {invoice.company.email && <div>{invoice.company.email}</div>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-blue-600 tracking-widest uppercase">Invoice</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{invoice.invoice_number}</div>
          <div className="text-xs text-gray-500 mt-2 leading-relaxed">
            <div><span className="text-gray-400">Tanggal: </span>{formatDate(invoice.invoice_date)}</div>
            <div><span className="text-gray-400">Jatuh Tempo: </span>{formatDate(invoice.due_date)}</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-l-4 border-blue-500 pl-4 py-3 pr-4 mb-7 rounded-r-lg">
        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Ditagihkan Kepada</div>
        <div className="font-bold text-gray-900">{invoice.client.name}</div>
        <div className="text-xs text-gray-500 mt-1 leading-relaxed">
          {invoice.client.pic_name && <div>u.p. {invoice.client.pic_name}</div>}
          {invoice.client.email && <div>{invoice.client.email}</div>}
          {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
        </div>
      </div>

      <table className="w-full mb-7">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Deskripsi</th>
            <th className="text-right pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Qty</th>
            <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide w-14 pl-2">Sat.</th>
            <th className="text-right pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">Harga</th>
            <th className="text-right pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2.5">
                <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                {item.description && <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>}
              </td>
              <td className="py-2.5 text-right text-sm text-gray-700">{item.quantity}</td>
              <td className="py-2.5 text-sm text-gray-400 pl-2">{item.unit}</td>
              <td className="py-2.5 text-right text-sm text-gray-700">{formatRupiah(item.price)}</td>
              <td className="py-2.5 text-right text-sm font-semibold text-gray-900">{formatRupiah(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-7">
        <div className="w-64 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatRupiah(invoice.subtotal)}</span></div>
          {invoice.tax_rate > 0 && <div className="flex justify-between text-sm text-gray-500"><span>PPN ({invoice.tax_rate}%)</span><span>{formatRupiah(invoice.tax_amount)}</span></div>}
          {invoice.discount > 0 && <div className="flex justify-between text-sm text-gray-500"><span>Diskon</span><span>-{formatRupiah(invoice.discount)}</span></div>}
          <div className="flex justify-between pt-2 border-t-2 border-gray-900 text-base font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatRupiah(invoice.total)}</span>
          </div>
        </div>
      </div>

      {invoice.company.bank_name && (
        <div className="bg-blue-50 rounded-lg p-4 mb-5">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Informasi Pembayaran</div>
          <div className="text-sm text-gray-700">Bank: <span className="font-semibold">{invoice.company.bank_name}</span></div>
          {invoice.company.bank_account_name && <div className="text-sm text-gray-700">A/N: <span className="font-semibold">{invoice.company.bank_account_name}</span></div>}
          {invoice.company.bank_account_number && <div className="text-sm text-gray-700">No. Rek: <span className="font-bold text-base">{invoice.company.bank_account_number}</span></div>}
        </div>
      )}

      <div className="border-t border-gray-100 pt-5 text-center text-xs text-gray-400">
        Terima kasih atas kepercayaan Anda • {invoice.company.name}{invoice.company.email && ` • ${invoice.company.email}`}
      </div>
    </div>
  );
}