import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { handoverApi } from '../lib/api';
import type { HandoverDocument, HandoverStatus } from '../types';
import { HandoverPreview } from '../components/handover/HandoverPreview';

export function HandoverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<HandoverDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    handoverApi.getOne(Number(id)).then((data) => {
      setDoc(data);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (status: HandoverStatus) => {
    if (!doc) return;
    try {
      setUpdatingStatus(true);
      const updated = await handoverApi.updateStatus(doc.id, status);
      setDoc(updated);
    } catch (err) {
      console.error('Gagal mengubah status dokumen:', err);
      alert('Gagal mengubah status dokumen. Silakan coba lagi.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-zinc-500">Memuat dokumen...</div>;
  if (!doc) return <div className="p-6 text-sm text-red-500">Dokumen tidak ditemukan.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/handover-documents')}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">{doc.document_number}</h1>
            <p className="text-xs text-zinc-500">{doc.client.name}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/handover-documents/${doc.id}/edit`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold border border-zinc-300 hover:bg-zinc-50 px-3 py-2 rounded-lg cursor-pointer"
        >
          <Pencil size={13} /> Edit
        </button>
      </div>

      <HandoverPreview
        document={doc}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}