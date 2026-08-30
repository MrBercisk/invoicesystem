import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Building2,
  Users,
  MessageCircle
} from 'lucide-react';
import { invoicesApi } from '../lib/api';
import { InvoicePreview } from '../components/invoices/InvoicePreview';
import { WhatsAppShareModal } from '../components/WhatsAppShareModal';
import type { InvoiceStatus } from '../types';

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [waModalOpen, setWaModalOpen] = useState(false);

  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.getOne(Number(id)),
    enabled: Boolean(id),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: InvoiceStatus }) =>
      invoicesApi.updateStatus(Number(id), status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => invoicesApi.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      navigate('/invoices');
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-400 font-medium">Memuat detail faktur...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="p-12 text-center">
        <div className="text-rose-600 font-bold mb-2 text-sm">Faktur tidak ditemukan</div>
        <Link to="/invoices" className="text-xs text-slate-900 font-semibold hover:underline">
          Kembali ke daftar faktur
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/invoices"
            className="p-2 text-slate-600 hover:text-slate-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-mono text-slate-950 tracking-tight">{invoice.invoice_number}</h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Building2 size={13} className="text-slate-400" /> {invoice.company.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Users size={13} className="text-slate-400" /> {invoice.client.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status === 'draft' && (
            <button
              onClick={() => statusMutation.mutate({ status: 'sent' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
            >
              <Send size={13} /> Tandai Terkirim
            </button>
          )}

          {invoice.status === 'sent' && (
            <button
              onClick={() => statusMutation.mutate({ status: 'paid' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
            >
              <CheckCircle2 size={13} /> Tandai Lunas
            </button>
          )}

          <button
            onClick={() => setWaModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Kirim Ringkasan Faktur via WhatsApp (1-Klik)"
          >
            <MessageCircle size={13} className="stroke-[2.5]" /> Kirim WA
          </button>

          <Link
            to={`/invoices/${invoice.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-950 transition-colors shadow-xs"
          >
            <Pencil size={13} /> Edit Faktur
          </Link>

          <button
            onClick={() => {
              if (window.confirm(`Hapus faktur ${invoice.invoice_number}?`)) {
                deleteMutation.mutate();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
            title="Hapus Faktur"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* ── Invoice Document Preview ── */}
      <InvoicePreview
        invoice={invoice}
        onStatusChange={(status) => statusMutation.mutate({ status })}
      />

      {/* ── WhatsApp 1-Click Share Modal ── */}
      <WhatsAppShareModal
        invoice={invoice}
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
      />
    </div>
  );
}
