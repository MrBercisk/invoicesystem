import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Receipt as ReceiptIcon } from 'lucide-react';
import { receiptsApi } from '../lib/api';
import type { Receipt, ReceiptStatus } from '../types';

const STATUS_BADGE: Record<ReceiptStatus, string> = {
  issued: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  void: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<ReceiptStatus, string> = {
  issued: 'Terbit',
  void: 'Dibatalkan',
};

export function ReceiptListPage() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    receiptsApi.getAll({ search }).then((res) => {
      setReceipts(res.data);
      setLoading(false);
    });
  }, [search]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatCurrency = (n: number) =>
    `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-900">Kwitansi</h1>
        <button
          onClick={() => navigate('/receipts/new')}
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg shadow-xs cursor-pointer"
        >
          <Plus size={14} /> Buat Kwitansi
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari nomor kwitansi atau nama klien..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-xs text-zinc-500">Memuat...</div>
        ) : receipts.length === 0 ? (
          <div className="p-10 text-center">
            <ReceiptIcon size={32} className="mx-auto text-zinc-300 mb-2" />
            <p className="text-xs text-zinc-500">Belum ada kwitansi.</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-left">
                <th className="px-4 py-2.5 font-semibold">No. Kwitansi</th>
                <th className="px-4 py-2.5 font-semibold">Klien</th>
                <th className="px-4 py-2.5 font-semibold">Tanggal</th>
                <th className="px-4 py-2.5 font-semibold text-right">Jumlah</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/receipts/${r.id}`)}
                  className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono font-semibold text-zinc-900">{r.receipt_number}</td>
                  <td className="px-4 py-3 text-zinc-700">{r.client.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(r.receipt_date)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-900">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_BADGE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}