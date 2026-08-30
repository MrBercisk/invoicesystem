import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Plus, 
  ArrowRight
} from 'lucide-react';
import { invoicesApi, companiesApi, clientsApi } from '../lib/api';
import { formatRupiah, formatDate } from '../lib/terbilang';
import type { InvoiceStatus } from '../types';

export function DashboardPage() {
  const { data: invoicesData, isLoading: loadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesApi.getAll(),
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getAll(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });

  const invoices = invoicesData?.data || [];

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'sent')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const pendingCount = invoices.filter(i => i.status === 'sent').length;
  const draftCount = invoices.filter(i => i.status === 'draft').length;

  const statusBadge = (status: InvoiceStatus) => {
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
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ringkasan Keuangan & Faktur</h1>
          <p className="text-xs text-slate-500 mt-1">Pantau total penerimaan kas, piutang tertunda, dan riwayat faktur resmi.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <Plus size={15} /> Buat Faktur Baru
          </Link>
        </div>
      </div>

      {/* ── Financial Ledger Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Penerimaan Kas Lunas */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Kas Diterima (Lunas)</div>
          <div className="text-xl font-bold font-mono text-slate-950 mt-2.5">{formatRupiah(totalRevenue)}</div>
          <div className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 size={13} /> {paidCount} invoice selesai dibayar
          </div>
        </div>

        {/* Card 2: Piutang Tertunda */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Piutang Menunggu Bayar</div>
          <div className="text-xl font-bold font-mono text-slate-950 mt-2.5">{formatRupiah(pendingAmount)}</div>
          <div className="text-xs text-sky-700 font-medium mt-2 flex items-center gap-1">
            <Clock size={13} /> {pendingCount} invoice berstatus terkirim
          </div>
        </div>

        {/* Card 3: Total Faktur Terbit */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Faktur Diterbitkan</div>
          <div className="text-xl font-bold font-mono text-slate-950 mt-2.5">{invoices.length} <span className="text-xs font-normal font-sans text-slate-500">berkas</span></div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            {draftCount} Draft • {pendingCount} Terkirim • {paidCount} Lunas
          </div>
        </div>

        {/* Card 4: Entitas Bisnis */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Entitas Terdaftar</div>
          <div className="text-xl font-bold font-mono text-slate-950 mt-2.5">{clients.length} <span className="text-xs font-normal font-sans text-slate-500">Klien</span></div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            {companies.length} profil perusahaan aktif
          </div>
        </div>
      </div>

      {/* ── Recent Invoices Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Faktur Penagihan Terkini</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar transaksi dan dokumen penagihan terbaru yang diterbitkan</p>
          </div>
          <Link
            to="/invoices"
            className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            Lihat Semua Faktur <ArrowRight size={13} />
          </Link>
        </div>

        {loadingInvoices ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Memuat data faktur...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={32} className="mx-auto text-slate-300 mb-2.5" />
            <div className="text-sm font-bold text-slate-800">Belum ada faktur penagihan</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Mulai buat faktur penagihan pertama Anda untuk klien dengan format standar yang rapi.
            </p>
            <Link
              to="/invoices/new"
              className="inline-flex items-center gap-1.5 mt-4 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus size={14} /> Buat Faktur Sekarang
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Invoice & Tanggal</th>
                  <th className="py-3 px-4">Klien Tujuan</th>
                  <th className="py-3 px-4">Penerbit</th>
                  <th className="py-3 px-4 text-right">Nominal Tagihan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 7).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link to={`/invoices/${invoice.id}`} className="font-mono font-bold text-slate-900 hover:underline">
                        {invoice.invoice_number}
                      </Link>
                      <div className="text-[11px] text-slate-400 mt-0.5">{formatDate(invoice.invoice_date)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{invoice.client?.name}</div>
                      {invoice.client?.pic_name && (
                        <div className="text-[11px] text-slate-400">u.p. {invoice.client.pic_name}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-medium text-xs flex items-center gap-1.5">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[170px]">{invoice.company?.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950">
                      {formatRupiah(invoice.total)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {statusBadge(invoice.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        Buka Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
