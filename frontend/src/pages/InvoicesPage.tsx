import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  Building2, 
  FileText, 
  X,
  Printer,
  MessageCircle
} from 'lucide-react';
import { invoicesApi } from '../lib/api';
import { formatRupiah, formatDate } from '../lib/terbilang';
import { InvoicePreview } from '../components/invoices/InvoicePreview';
import { WhatsAppShareModal } from '../components/WhatsAppShareModal';
import type { Invoice, InvoiceStatus } from '../types';

export function InvoicesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [waInvoice, setWaInvoice] = useState<Invoice | null>(null);

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ['invoices', statusFilter, searchTerm],
    queryFn: () => invoicesApi.getAll({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchTerm || undefined,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => invoicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      if (previewInvoice) setPreviewInvoice(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: InvoiceStatus }) =>
      invoicesApi.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      if (previewInvoice?.id === updated.id) {
        setPreviewInvoice(updated);
      }
    },
  });

  const invoices = invoicesData?.data || [];

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Lunas
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Terkirim
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Draft
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Batal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Faktur Penagihan</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola arsip invoice resmi, cetak dokumen PDF, atau perbarui status pelunasan.</p>
        </div>
        <Link
          to="/invoices/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={15} /> Buat Faktur Baru
        </Link>
      </div>

      {/* ── Filters & Search ── */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor faktur / nama klien..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {[
            { id: 'all', label: 'Semua Faktur' },
            { id: 'draft', label: 'Draft' },
            { id: 'sent', label: 'Terkirim' },
            { id: 'paid', label: 'Lunas' },
            { id: 'cancelled', label: 'Dibatalkan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap text-xs ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Invoices List ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">Memuat data faktur...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="mx-auto text-slate-300 mb-2.5" />
            <div className="text-sm font-bold text-slate-800">Tidak ada faktur ditemukan</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Coba sesuaikan kata kunci pencarian atau ganti filter status di atas.'
                : 'Belum ada faktur yang dibuat. Buat faktur pertama Anda sekarang.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Faktur & Tanggal</th>
                  <th className="py-3 px-4">Klien Tujuan</th>
                  <th className="py-3 px-4">Penerbit</th>
                  <th className="py-3 px-4 text-right">Total Tagihan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{invoice.invoice_number}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{formatDate(invoice.invoice_date)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{invoice.client?.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {invoice.client?.email || invoice.client?.city || '-'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{invoice.company?.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950">
                      {formatRupiah(invoice.total)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setWaInvoice(invoice)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Kirim via WhatsApp (1-Klik)"
                        >
                          <MessageCircle size={15} />
                        </button>
                        <button
                          onClick={() => setPreviewInvoice(invoice)}
                          className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                          title="Pratinjau Cepat"
                        >
                          <Eye size={15} />
                        </button>
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                          title="Detail Dokumen & Cetak"
                        >
                          <Printer size={15} />
                        </Link>
                        <Link
                          to={`/invoices/${invoice.id}/edit`}
                          className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Faktur"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus faktur ${invoice.invoice_number}?`)) {
                              deleteMutation.mutate(invoice.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick Preview Modal ── */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pratinjau Dokumen: {previewInvoice.invoice_number}</h3>
                <p className="text-xs text-slate-500">Pilih template faktur, cetak atau unduh sebagai berkas PDF.</p>
              </div>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <InvoicePreview
                invoice={previewInvoice}
                onStatusChange={(status) => {
                  statusMutation.mutate({ id: previewInvoice.id, status });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── WhatsApp 1-Click Share Modal ── */}
      {waInvoice && (
        <WhatsAppShareModal
          invoice={waInvoice}
          isOpen={Boolean(waInvoice)}
          onClose={() => setWaInvoice(null)}
        />
      )}
    </div>
  );
}
