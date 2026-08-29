import type { Invoice } from '../types';

interface Props {
  invoice: Invoice;
  formatRupiah: (n: number) => string;
  formatDate: (d: string) => string;
}

export function PreviewGradient({ invoice, formatRupiah, formatDate }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="p-8 pb-10" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)' }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white">{invoice.company.name}</h1>
            <div className="text-xs mt-1.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {invoice.company.address && <div>{invoice.company.address}</div>}
              {invoice.company.city && <div>{invoice.company.city}, {invoice.company.country}</div>}
              {invoice.company.phone && <div>Telp: {invoice.company.phone}</div>}
              {invoice.company.email && <div>{invoice.company.email}</div>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-light tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>Invoice</div>
            <div className="text-2xl font-bold text-white mt-1">{invoice.invoice_number}</div>
            <div className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <div><span style={{ color: 'rgba(255,255,255,0.5)' }}>Tanggal: </span>{formatDate(invoice.invoice_date)}</div>
              <div><span style={{ color: 'rgba(255,255,255,0.5)' }}>Jatuh Tempo: </span>{formatDate(invoice.due_date)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="rounded-xl p-4 mb-7" style={{ background: 'linear-gradient(135deg, #f5f3ff, #faf5ff)', border: '1px solid #e9d5ff' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#7c3aed' }}>Ditagihkan Kepada</div>
          <div className="font-bold text-indigo-950 text-base">{invoice.client.name}</div>
          <div className="text-xs text-gray-500 mt-1 leading-relaxed">
            {invoice.client.pic_name && <div>u.p. {invoice.client.pic_name}</div>}
            {invoice.client.address && <div>{invoice.client.address}</div>}
            {invoice.client.city && <div>{invoice.client.city}, {invoice.client.country}</div>}
            {invoice.client.email && <div>{invoice.client.email}</div>}
          </div>
        </div>

        <table className="w-full mb-7">
          <thead>
            <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
              <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#7c3aed' }}>Deskripsi</th>
              <th className="text-right pb-2 text-xs font-semibold uppercase tracking-wide w-16" style={{ color: '#7c3aed' }}>Qty</th>
              <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wide w-14 pl-2" style={{ color: '#7c3aed' }}>Sat.</th>
              <th className="text-right pb-2 text-xs font-semibold uppercase tracking-wide w-32" style={{ color: '#7c3aed' }}>Harga</th>
              <th className="text-right pb-2 text-xs font-semibold uppercase tracking-wide w-32" style={{ color: '#7c3aed' }}>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f0ff' }}>
                <td className="py-2.5">
                  <div className="font-medium text-indigo-950 text-sm">{item.name}</div>
                  {item.description && <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>}
                </td>
                <td className="py-2.5 text-right text-sm text-gray-700">{item.quantity}</td>
                <td className="py-2.5 text-sm text-gray-400 pl-2">{item.unit}</td>
                <td className="py-2.5 text-right text-sm text-gray-700">{formatRupiah(item.price)}</td>
                <td className="py-2.5 text-right text-sm font-semibold text-indigo-950">{formatRupiah(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-7">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatRupiah(invoice.subtotal)}</span></div>
            {invoice.tax_rate > 0 && <div className="flex justify-between text-sm text-gray-500"><span>PPN ({invoice.tax_rate}%)</span><span>{formatRupiah(invoice.tax_amount)}</span></div>}
            {invoice.discount > 0 && <div className="flex justify-between text-sm text-gray-500"><span>Diskon</span><span>-{formatRupiah(invoice.discount)}</span></div>}
            <div className="flex justify-between px-4 py-2.5 rounded-lg text-white font-bold text-sm mt-2" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <span>Total</span><span>{formatRupiah(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.company.bank_name && (
          <div className="rounded-lg p-4 mb-5" style={{ background: 'linear-gradient(135deg, #f5f3ff, #faf5ff)', border: '1px solid #e9d5ff' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7c3aed' }}>Informasi Pembayaran</div>
            <div className="text-sm text-gray-700">Bank: <span className="font-semibold" style={{ color: '#4f46e5' }}>{invoice.company.bank_name}</span></div>
            {invoice.company.bank_account_name && <div className="text-sm text-gray-700">A/N: <span className="font-semibold" style={{ color: '#4f46e5' }}>{invoice.company.bank_account_name}</span></div>}
            {invoice.company.bank_account_number && <div className="text-sm text-gray-700">No. Rek: <span className="font-bold text-base" style={{ color: '#4f46e5' }}>{invoice.company.bank_account_number}</span></div>}
          </div>
        )}

        <div className="pt-4 text-center text-xs text-gray-400" style={{ borderTop: '1px solid #e9d5ff' }}>
          Terima kasih atas kepercayaan Anda • {invoice.company.name}{invoice.company.email && ` • ${invoice.company.email}`}
        </div>
      </div>
    </div>
  );
}