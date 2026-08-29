import { useQuery } from '@tanstack/react-query';
import { invoicesApi } from '../lib/api';
import { TrendingUp, Clock, CheckCircle, FileText, ArrowUpRight, AlertTriangle } from 'lucide-react';
import type { Invoice } from '../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtCompact = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', minimumFractionDigits: 0 }).format(n);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
  'bg-rose-100 text-rose-700',
];

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function StatusPill({ status }: { status: Invoice['status'] }) {
  const map = {
    paid:      'bg-green-100 text-green-700',
    sent:      'bg-amber-100 text-amber-700',
    draft:     'bg-gray-100 text-gray-500',
    cancelled: 'bg-red-100 text-red-600',
  };
  const label = { paid: 'Lunas', sent: 'Terkirim', draft: 'Draft', cancelled: 'Dibatalkan' };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function KpiCard({
  label, value, icon: Icon, iconBg, iconColor, delta, deltaType,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  delta: string;
  deltaType: 'up' | 'warn';
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className={`w-8 h-8 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center mb-4`}>
        <Icon size={16} />
      </div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-medium text-gray-900 leading-none">{value}</div>
      <div className={`text-xs mt-2 flex items-center gap-1 ${deltaType === 'up' ? 'text-green-600' : 'text-amber-600'}`}>
        {deltaType === 'up' ? <ArrowUpRight size={12} /> : <AlertTriangle size={12} />}
        {delta}
      </div>
    </div>
  );
}

function MiniBarChart({ invoices }: { invoices: Invoice[] }) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: d.getMonth(), year: d.getFullYear(), label: MONTHS[d.getMonth()] };
  });

  const data = months.map(({ month, year }) => {
    const inMonth = invoices.filter(inv => {
      const d = new Date(inv.invoice_date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    return {
      label: MONTHS[month].slice(0, 3),
      paid: inMonth.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0),
      pending: inMonth.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0),
    };
  });

  const maxVal = Math.max(...data.map(d => Math.max(d.paid, d.pending)), 1);

  return (
    <div>
      <div className="flex gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-sm bg-blue-500" /> Lunas
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-sm bg-amber-400" /> Pending
        </span>
      </div>
      <div className="flex items-end gap-1 h-28">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-0.5 w-full justify-center">
              <div
                className="w-3 rounded-t-sm bg-blue-500 transition-all"
                style={{ height: `${Math.round((d.paid / maxVal) * 88)}px` }}
                title={`${d.label} lunas: ${fmtCompact(d.paid)}`}
              />
              <div
                className="w-3 rounded-t-sm bg-amber-400 transition-all"
                style={{ height: `${Math.round((d.pending / maxVal) * 88)}px` }}
                title={`${d.label} pending: ${fmtCompact(d.pending)}`}
              />
            </div>
            <span className="text-xs text-gray-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDistribution({ invoices }: { invoices: Invoice[] }) {
  const total = invoices.length || 1;
  const statuses = [
    { label: 'Lunas',          count: invoices.filter(i => i.status === 'paid').length,      color: 'bg-green-500' },
    { label: 'Menunggu bayar', count: invoices.filter(i => i.status === 'sent').length,      color: 'bg-amber-400' },
    { label: 'Draft',          count: invoices.filter(i => i.status === 'draft').length,     color: 'bg-gray-300' },
    { label: 'Dibatalkan',     count: invoices.filter(i => i.status === 'cancelled').length, color: 'bg-red-400' },
  ].filter(s => s.count > 0);

  return (
    <div className="flex flex-col gap-4">
      {statuses.map(s => {
        const pct = Math.round((s.count / total) * 100);
        return (
          <div key={s.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500">{s.label}</span>
              <span className="font-medium text-gray-800">{s.count} ({pct}%)</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DashboardPage() {
  const { data } = useQuery({ queryKey: ['invoices', 'all'], queryFn: () => invoicesApi.getAll() });
  const invoices: Invoice[] = data?.data || [];

  const paid    = invoices.filter(i => i.status === 'paid');
  const sent    = invoices.filter(i => i.status === 'sent');
  const revenue = paid.reduce((s, i) => s + i.total, 0);
  const avg     = invoices.length ? Math.round(invoices.reduce((s, i) => s + i.total, 0) / invoices.length) : 0;
  const conv    = invoices.length ? Math.round((paid.length / invoices.length) * 100) : 0;

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
          <TrendingUp size={12} /> Bulan ini +12%
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <KpiCard label="Total invoice" value={invoices.length} icon={FileText}
          iconBg="bg-blue-50" iconColor="text-blue-600"
          delta="+3 bulan ini" deltaType="up" />
        <KpiCard label="Invoice lunas" value={paid.length} icon={CheckCircle}
          iconBg="bg-green-50" iconColor="text-green-600"
          delta="+2 dari kemarin" deltaType="up" />
        <KpiCard label="Menunggu bayar" value={sent.length} icon={Clock}
          iconBg="bg-amber-50" iconColor="text-amber-600"
          delta="2 hampir jatuh tempo" deltaType="warn" />
        <KpiCard label="Total pendapatan" value={fmtCompact(revenue)} icon={TrendingUp}
          iconBg="bg-purple-50" iconColor="text-purple-600"
          delta="+12% vs bulan lalu" deltaType="up" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-0.5">Tren pendapatan</h2>
          <p className="text-xs text-gray-400 mb-4">6 bulan terakhir</p>
          <MiniBarChart invoices={invoices} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-0.5">Status invoice</h2>
          <p className="text-xs text-gray-400 mb-4">Distribusi saat ini</p>
          <StatusDistribution invoices={invoices} />
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">Rata-rata nilai</div>
              <div className="text-sm font-medium text-gray-900">{fmtCompact(avg)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Konversi draft → lunas</div>
              <div className="text-sm font-medium text-green-600">{conv}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">Invoice terbaru</h2>
          <span className="text-xs text-blue-600 cursor-pointer hover:underline">Lihat semua</span>
        </div>

        <div>
          {invoices.slice(0, 5).map((inv, i) => (
            <div key={inv.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                {getInitials(inv.client?.name || '??')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">{inv.client?.name}</div>
                <div className="text-xs text-gray-400">{inv.invoice_number}</div>
              </div>
              <StatusPill status={inv.status} />
              <div className="text-sm font-medium text-gray-900 shrink-0">{fmt(inv.total)}</div>
            </div>
          ))}
          {!invoices.length && (
            <p className="text-sm text-gray-400 py-6 text-center">Belum ada invoice</p>
          )}
        </div>
      </div>
    </div>
  );
}