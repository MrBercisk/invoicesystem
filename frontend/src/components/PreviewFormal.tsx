import type { Invoice } from '../types';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewFormal({ invoice, formatRupiah, formatDate }: Props) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-10 shadow-sm" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-black">{invoice.company.name}</h1>
          <div className="text-xs text-gray-600 mt-1.5 leading-relaxed">
            {invoice.company.address && <div>{invoice.company.address}</div>}
            {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
            {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
            {invoice.company.email && <div>{invoice.company.email}</div>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-black tracking-widest">INVOICE</div>
          <div className="text-sm text-gray-600 mt-2">{invoice.invoice_number}</div>
          <div className="text-xs text-gray-600 mt-2 leading-relaxed border-t border-black pt-2">
            <div><span className="font-semibold">Tanggal: </span>{formatDate(invoice.invoice_date)}</div>
            <div><span className="font-semibold">Jatuh Tempo: </span>{formatDate(invoice.due_date)}</div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-b border-black pt-4 pb-4 mb-5">
        <div className="text-xs font-bold uppercase tracking-widest mb-2">Ditagihkan Kepada</div>
        <div className="font-bold text-black text-base">{invoice.client.name}</div>
        <div className="text-xs text-gray-700 mt-1 leading-relaxed">
          {invoice.client.pic_name && <div>u.p. {invoice.client.pic_name}</div>}
          {invoice.client.address && <div>{invoice.client.address}</div>}
          {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
          {invoice.client.email && <div>{invoice.client.email}</div>}
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-t-2 border-b border-black">
            <th className="text-left py-2 text-xs font-bold uppercase tracking-wide">Deskripsi</th>
            <th className="text-right py-2 text-xs font-bold uppercase tracking-wide w-16">Qty</th>
            <th className="text-left py-2 text-xs font-bold uppercase tracking-wide w-14 pl-2">Sat.</th>
            <th className="text-right py-2 text-xs font-bold uppercase tracking-wide w-32">Harga</th>
            <th className="text-right py-2 text-xs font-bold uppercase tracking-wide w-32">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-300">
              <td className="py-2.5">
                <div className="font-semibold text-black text-sm">{item.name}</div>
                {item.description && <div className="text-xs text-gray-500 italic mt-0.5">{item.description}</div>}
              </td>
              <td className="py-2.5 text-right text-sm">{item.quantity}</td>
              <td className="py-2.5 text-sm text-gray-500 pl-2">{item.unit}</td>
              <td className="py-2.5 text-right text-sm">{formatRupiah(item.price)}</td>
              <td className="py-2.5 text-right text-sm font-semibold">{formatRupiah(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-6">
        <div className="w-64 border border-black">
          <div className="flex justify-between text-sm px-3 py-1.5 border-b border-gray-300"><span>Subtotal</span><span>{formatRupiah(invoice.subtotal)}</span></div>
          {invoice.tax_rate > 0 && <div className="flex justify-between text-sm px-3 py-1.5 border-b border-gray-300"><span>PPN ({invoice.tax_rate}%)</span><span>{formatRupiah(invoice.tax_amount)}</span></div>}
          {invoice.discount > 0 && <div className="flex justify-between text-sm px-3 py-1.5 border-b border-gray-300"><span>Diskon</span><span>-{formatRupiah(invoice.discount)}</span></div>}
          <div className="flex justify-between px-3 py-2 bg-black text-white font-bold text-sm"><span>TOTAL</span><span>{formatRupiah(invoice.total)}</span></div>
        </div>
      </div>

      {invoice.company.bank_name && (
        <div className="border border-black p-4 mb-5">
          <div className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-black pb-1">Informasi Pembayaran</div>
          <div className="text-sm">Bank: <span className="font-bold">{invoice.company.bank_name}</span></div>
          {invoice.company.bank_account_name && <div className="text-sm">A/N: <span className="font-bold">{invoice.company.bank_account_name}</span></div>}
          {invoice.company.bank_account_number && <div className="text-sm">No. Rek: <span className="font-bold">{invoice.company.bank_account_number}</span></div>}
        </div>
      )}

      <div className="border-t-2 border-black pt-4 text-center text-xs text-gray-600 italic">
        Terima kasih atas kepercayaan Anda • {invoice.company.name}{invoice.company.email && ` • ${invoice.company.email}`}
      </div>
    </div>
  );
}