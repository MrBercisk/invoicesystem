import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Printer, Ban } from 'lucide-react';
import { receiptsApi } from '../lib/api';
import type { Receipt } from '../types';

export function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [voiding, setVoiding] = useState(false);

  useEffect(() => {
    receiptsApi.getOne(Number(id)).then((data) => {
      setReceipt(data);
      setLoading(false);
    });
  }, [id]);

  const handleVoid = async () => {
    if (!receipt) return;
    if (!confirm('Batalkan kwitansi ini? Tindakan ini menandai kwitansi sebagai tidak berlaku.')) return;
    try {
      setVoiding(true);
      const updated = await receiptsApi.void(receipt.id);
      setReceipt(updated);
    } catch (err) {
      console.error('Gagal membatalkan kwitansi:', err);
      alert('Gagal membatalkan kwitansi. Silakan coba lagi.');
    } finally {
      setVoiding(false);
    }
  };

  const handlePrint = async () => {
    if (!receipt) return;
    const { url } = await receiptsApi.getPdfUrl(receipt.id);
    window.open(url, '_blank');
  };

  if (loading) return <div className="p-6 text-sm text-zinc-500">Memuat kwitansi...</div>;
  if (!receipt) return <div className="p-6 text-sm text-red-500">Kwitansi tidak ditemukan.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/receipts')}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">{receipt.receipt_number}</h1>
            <p className="text-xs text-zinc-500">{receipt.client.name}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold border border-zinc-300 hover:bg-zinc-50 px-3 py-2 rounded-lg cursor-pointer"
          >
            <Printer size={13} /> Cetak
          </button>
          {receipt.status === 'issued' && (
            <>
              <button
                onClick={() => navigate(`/receipts/${receipt.id}/edit`)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-zinc-300 hover:bg-zinc-50 px-3 py-2 rounded-lg cursor-pointer"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={handleVoid}
                disabled={voiding}
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg cursor-pointer disabled:opacity-60"
              >
                <Ban size={13} /> {voiding ? 'Memproses...' : 'Batalkan'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Preview isi kwitansi ── */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
        {receipt.status === 'void' && (
          <div className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
            KWITANSI INI TELAH DIBATALKAN
          </div>
        )}

        <div className="flex justify-between items-start border-b border-zinc-100 pb-4">
          <div>
            <p className="text-[11px] text-zinc-500">Sudah terima dari</p>
            <p className="text-sm font-bold text-zinc-900">{receipt.client.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-zinc-500">Tanggal</p>
            <p className="text-sm font-semibold text-zinc-900">
              {new Date(receipt.receipt_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-zinc-500">Untuk pembayaran</p>
          <p className="text-sm text-zinc-800">{receipt.payment_for}</p>
        </div>

        {receipt.invoice && (
          <div>
            <p className="text-[11px] text-zinc-500">Referensi invoice</p>
            <p className="text-sm font-mono text-zinc-800">{receipt.invoice.invoice_number}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] text-zinc-500">Metode pembayaran</p>
            <p className="text-sm text-zinc-800 capitalize">{receipt.payment_method}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-zinc-500 mb-0.5">Jumlah diterima</p>
            <p className="text-xl font-bold text-zinc-900">Rp {receipt.amount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <p className="text-[11px] italic text-zinc-500 text-right border-t border-zinc-100 pt-3">
          Terbilang: {receipt.amount_in_words}
        </p>

        {receipt.requires_stamp_duty && (
          <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Dokumen ini memerlukan materai sesuai ketentuan yang berlaku.
          </p>
        )}

        {receipt.notes && (
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 mb-1">Catatan</p>
            <p className="text-xs text-zinc-700">{receipt.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}