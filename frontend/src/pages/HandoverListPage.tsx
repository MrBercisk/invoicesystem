import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';
import { handoverApi } from '../lib/api';
import type { HandoverDocument, HandoverStatus } from '../types';

const STATUS_BADGE: Record<HandoverStatus, string> = {
  draft: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<HandoverStatus, string> = {
  draft: 'Draft',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export function HandoverListPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<HandoverDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    handoverApi.getAll({ search }).then((res) => {
      setDocuments(res.data);
      setLoading(false);
    });
  }, [search]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-900">Dokumen Serah Terima</h1>
        <button
          onClick={() => navigate('/handover-documents/new')}
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg shadow-xs cursor-pointer"
        >
          <Plus size={14} /> Buat Dokumen
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari nomor dokumen atau nama klien..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-xs text-zinc-500">Memuat...</div>
        ) : documents.length === 0 ? (
          <div className="p-10 text-center">
            <FileText size={32} className="mx-auto text-zinc-300 mb-2" />
            <p className="text-xs text-zinc-500">Belum ada dokumen serah terima.</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-left">
                <th className="px-4 py-2.5 font-semibold">No. Dokumen</th>
                <th className="px-4 py-2.5 font-semibold">Klien</th>
                <th className="px-4 py-2.5 font-semibold">Tanggal</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => navigate(`/handover-documents/${doc.id}`)}
                  className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono font-semibold text-zinc-900">{doc.document_number}</td>
                  <td className="px-4 py-3 text-zinc-700">{doc.client.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(doc.document_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_BADGE[doc.status]}`}>
                      {STATUS_LABEL[doc.status]}
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