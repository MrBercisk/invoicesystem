import { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Eye, Edit, Trash2, ArrowUpRight, MoreVertical } from 'lucide-react';
import { invoicesApi, companiesApi, clientsApi, productsApi } from '../lib/api';
import type { InvoiceStatus } from '../types';
import { InvoiceForm } from '../components/InvoiceForm';
import { InvoicePreview } from '../components/InvoicePreview';

const STATUS_MAP: Record<InvoiceStatus, { label: string; dot: string; text: string }> = {
  draft:     { label: 'Draft',    dot: 'bg-zinc-400',    text: 'text-zinc-500' },
  sent:      { label: 'Terkirim', dot: 'bg-sky-400',     text: 'text-sky-600' },
  paid:      { label: 'Lunas',    dot: 'bg-emerald-400', text: 'text-emerald-600' },
  cancelled: { label: 'Batal',    dot: 'bg-rose-400',    text: 'text-rose-500' },
};

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const isOverdue = (due: string, status: InvoiceStatus) =>
  new Date(due) < new Date() && status !== 'paid' && status !== 'cancelled';

function StatusPill({ status }: { status: InvoiceStatus }) {
  const s = STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

// ─── Action menu (mobile dropdown, desktop inline) ────────────────────────────
function RowActions({
  onView, onEdit, onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      {/* Mobile: tombol ⋮ + dropdown */}
      <button
        className="sm:hidden p-2.5 rounded-xl bg-zinc-100 text-zinc-500 active:bg-zinc-200 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden min-w-[140px]">
            <button
              onClick={() => { setOpen(false); onView(); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <Eye size={14} className="text-zinc-400" /> Lihat detail
            </button>
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <Edit size={14} className="text-zinc-400" /> Edit
            </button>
            <div className="h-px bg-zinc-100 mx-3" />
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={14} /> Hapus
            </button>
          </div>
        </>
      )}

      {/* Desktop: inline icons (hover reveal) */}
      <div className="hidden sm:flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onView}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
          title="Lihat detail"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
          title="Edit"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          title="Hapus"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Invoice list ─────────────────────────────────────────────────────────────
function InvoiceList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['invoices', search, statusFilter],
    queryFn: () => invoicesApi.getAll({ search, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: invoicesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });

  const invoices = data?.data ?? [];
  const total = data?.total ?? 0;
  const paidCount  = invoices.filter(i => i.status === 'paid').length;
  const pendingSum = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0);

  return (
    <div className="min-h-full bg-zinc-50">
      {/* Top bar */}
      <div className="border-b border-zinc-200 bg-white px-4 sm:px-8 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">
              Manajemen Tagihan
            </p>
            <h1 className="text-[1.6rem] font-bold tracking-tight text-zinc-900 leading-none">
              Invoice
            </h1>
          </div>
          <button
            onClick={() => navigate('new')}
            className="group flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-3 sm:px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-all flex-shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Buat invoice</span>
            <span className="sm:hidden">Buat</span>
            <ArrowUpRight size={13} className="opacity-40 group-hover:opacity-80 transition-opacity hidden sm:block" />
          </button>
        </div>

        {total > 0 && (
          <div className="mt-5 flex gap-4 sm:gap-6 flex-wrap">
            <div>
              <span className="text-2xl font-bold text-zinc-900 tabular-nums">{total}</span>
              <span className="ml-1.5 text-xs text-zinc-400 font-medium">total</span>
            </div>
            <div className="w-px bg-zinc-200" />
            <div>
              <span className="text-2xl font-bold text-emerald-600 tabular-nums">{paidCount}</span>
              <span className="ml-1.5 text-xs text-zinc-400 font-medium">lunas</span>
            </div>
            <div className="w-px bg-zinc-200" />
            <div>
              <span className="text-xl sm:text-2xl font-bold text-sky-600 tabular-nums">
                {formatRupiah(pendingSum)}
              </span>
              <span className="ml-1.5 text-xs text-zinc-400 font-medium">menunggu</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div className="px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-b border-zinc-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nomor atau klien..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-100 border-0 rounded-lg text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:bg-white transition-all"
          />
        </div>

        {/* Status filter — scroll horizontal di mobile */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg overflow-x-auto flex-shrink-0 scrollbar-none">
          {(['', 'draft', 'sent', 'paid', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap flex-shrink-0 ${
                statusFilter === s
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {s === '' ? 'Semua' : STATUS_MAP[s as InvoiceStatus].label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 py-4 sm:py-6">

        {/* ── Mobile card list ── */}
        <div className="sm:hidden space-y-2">
          {invoices.map(inv => (
            <div
              key={inv.id}
              className="bg-white border border-zinc-200 rounded-2xl p-4 active:bg-zinc-50 transition-colors"
              onClick={() => navigate(`${inv.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-mono font-bold text-zinc-900 text-sm tracking-tight">
                    {inv.invoice_number}
                  </p>
                  <p className="text-zinc-600 text-sm font-medium mt-0.5 truncate">
                    {inv.client?.name}
                  </p>
                </div>
                <RowActions
                  onView={() => navigate(`${inv.id}`)}
                  onEdit={() => navigate(`${inv.id}/edit`)}
                  onDelete={() => { if (confirm('Hapus invoice ini?')) deleteMutation.mutate(inv.id); }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <StatusPill status={inv.status} />
                <span className="font-semibold text-zinc-900 tabular-nums text-sm">
                  {formatRupiah(inv.total)}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
                <span>{new Date(inv.invoice_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>·</span>
                <span className={isOverdue(inv.due_date, inv.status) ? 'text-rose-500 font-semibold' : ''}>
                  {isOverdue(inv.due_date, inv.status) && 'Lewat · '}
                  Jatuh tempo {new Date(inv.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          ))}

          {!invoices.length && (
            <div className="flex flex-col items-center gap-3 py-20">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Search size={18} className="text-zinc-400" />
              </div>
              <p className="text-zinc-400 text-sm">
                {search || statusFilter ? 'Tidak ada hasil ditemukan' : 'Belum ada invoice'}
              </p>
              {!search && !statusFilter && (
                <button
                  onClick={() => navigate('new')}
                  className="text-sm text-zinc-900 font-medium underline underline-offset-2"
                >
                  Buat invoice pertama
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden sm:block bg-white border border-zinc-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">No. Invoice</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Klien</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hidden md:table-cell">Tanggal</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hidden lg:table-cell">Jatuh Tempo</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {invoices.map(inv => (
                <tr
                  key={inv.id}
                  className="group hover:bg-zinc-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`${inv.id}`)}
                >
                  <td className="px-5 py-4">
                    <span className="font-mono font-semibold text-zinc-800 tracking-tight">
                      {inv.invoice_number}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-700 font-medium">{inv.client?.name}</td>
                  <td className="px-5 py-4 text-zinc-500 text-xs hidden md:table-cell">
                    {new Date(inv.invoice_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-xs hidden lg:table-cell">
                    <span className={isOverdue(inv.due_date, inv.status) ? 'text-rose-600 font-semibold' : 'text-zinc-500'}>
                      {isOverdue(inv.due_date, inv.status) && (
                        <span className="mr-1 text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded">
                          Lewat
                        </span>
                      )}
                      {new Date(inv.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-semibold text-zinc-900 tabular-nums">{formatRupiah(inv.total)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={inv.status} />
                  </td>
                  <td className="px-4 py-4">
                    <RowActions
                      onView={() => navigate(`${inv.id}`)}
                      onEdit={() => navigate(`${inv.id}/edit`)}
                      onDelete={() => { if (confirm('Hapus invoice ini?')) deleteMutation.mutate(inv.id); }}
                    />
                  </td>
                </tr>
              ))}

              {!invoices.length && (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                        <Search size={18} className="text-zinc-400" />
                      </div>
                      <p className="text-zinc-400 text-sm">
                        {search || statusFilter ? 'Tidak ada hasil ditemukan' : 'Belum ada invoice'}
                      </p>
                      {!search && !statusFilter && (
                        <button
                          onClick={() => navigate('new')}
                          className="text-sm text-zinc-900 font-medium underline underline-offset-2"
                        >
                          Buat invoice pertama
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <p className="mt-3 text-xs text-zinc-400 text-right">
            Menampilkan {invoices.length} dari {total} invoice
          </p>
        )}
      </div>
    </div>
  );
}

// ─── New invoice ──────────────────────────────────────────────────────────────
function NewInvoice() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: companiesApi.getAll });
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: clientsApi.getAll });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: productsApi.getAll });

  const mutation = useMutation({
    mutationFn: invoicesApi.create,
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      navigate(`../${inv.id}`);
    },
  });

  return (
    <div className="min-h-full bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white px-4 sm:px-8 py-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors mb-3 font-medium"
        >
          <span className="text-base leading-none">←</span> Kembali ke daftar
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Invoice baru</p>
        <h1 className="text-[1.6rem] font-bold tracking-tight text-zinc-900 leading-none">Buat tagihan</h1>
      </div>
      <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-8 py-5 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-700">Detail Invoice</h2>
          </div>
          <div className="px-5 sm:px-8 py-5 sm:py-6">
            <InvoiceForm
              companies={companies}
              clients={clients}
              products={products}
              onSubmit={mutation.mutateAsync}
              isLoading={mutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice detail ───────────────────────────────────────────────────────────
function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.getOne(Number(id)),
  });

  const statusMutation = useMutation({
    mutationFn: (status: InvoiceStatus) => invoicesApi.updateStatus(Number(id), status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoice', id] }),
  });

  if (isLoading) {
    return (
      <div className="min-h-full bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
          <p className="text-xs text-zinc-400">Memuat invoice…</p>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-full bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white px-4 sm:px-8 py-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors mb-3 font-medium"
        >
          <span className="text-base leading-none">←</span> Kembali ke daftar
        </button>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Detail Invoice</p>
            <h1 className="text-[1.4rem] sm:text-[1.6rem] font-bold tracking-tight text-zinc-900 leading-none font-mono">
              {invoice.invoice_number}
            </h1>
          </div>
          <StatusPill status={invoice.status} />
        </div>
      </div>
      <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-4xl">
        <InvoicePreview invoice={invoice} onStatusChange={statusMutation.mutate} />
      </div>
    </div>
  );
}
function EditInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.getOne(Number(id)),
  });
  const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: companiesApi.getAll });
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: clientsApi.getAll });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: productsApi.getAll });

  const mutation = useMutation({
    mutationFn: (data: any) => invoicesApi.update(Number(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoice', id] });
      navigate(`../${id}`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-full bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
          <p className="text-xs text-zinc-400">Memuat data invoice…</p>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-full bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white px-4 sm:px-8 py-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors mb-3 font-medium"
        >
          <span className="text-base leading-none">←</span> Kembali
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Edit Invoice</p>
        <h1 className="text-[1.4rem] sm:text-[1.6rem] font-bold tracking-tight text-zinc-900 leading-none font-mono">
          {invoice.invoice_number}
        </h1>
      </div>
      <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-8 py-5 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-700">Edit Detail Invoice</h2>
          </div>
          <div className="px-5 sm:px-8 py-5 sm:py-6">
            <InvoiceForm
              companies={companies}
              clients={clients}
              products={products}
              defaultValues={invoice}
              onSubmit={mutation.mutateAsync}
              isLoading={mutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
export function InvoicesPage() {
  return (
    <Routes>
      <Route index element={<InvoiceList />} />
      <Route path="new" element={<NewInvoice />} />
      <Route path=":id" element={<InvoiceDetail />} />
      <Route path=":id/edit" element={<EditInvoice />} />
    </Routes>
  );
}