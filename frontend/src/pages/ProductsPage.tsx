import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Package, Search, Tag } from 'lucide-react';
import { productsApi } from '../lib/api';
import type { Product } from '../types';
import { ProductModal } from '../components/ProductModal';

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n);

// Warna unit badge deterministik
const UNIT_COLORS: Record<string, { bg: string; text: string }> = {
  pcs:     { bg: 'bg-sky-50',    text: 'text-sky-600' },
  unit:    { bg: 'bg-violet-50', text: 'text-violet-600' },
  bulan:   { bg: 'bg-amber-50',  text: 'text-amber-600' },
  tahun:   { bg: 'bg-emerald-50',text: 'text-emerald-600' },
  jam:     { bg: 'bg-rose-50',   text: 'text-rose-500' },
  hari:    { bg: 'bg-orange-50', text: 'text-orange-600' },
  paket:   { bg: 'bg-teal-50',   text: 'text-teal-600' },
  lisensi: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

function UnitBadge({ unit }: { unit: string }) {
  const c = UNIT_COLORS[unit] ?? { bg: 'bg-zinc-100', text: 'text-zinc-500' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${c.bg} ${c.text}`}>
      <Tag size={9} />
      {unit}
    </span>
  );
}

// Avatar produk dari inisial
function ProductAvatar({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const hues = [210, 155, 280, 340, 30, 190, 260, 15];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: `hsl(${hue} 55% 92%)`, color: `hsl(${hue} 55% 38%)` }}
    >
      {initials}
    </div>
  );
}

export function ProductsPage() {
  const [modal, setModal] = useState<{ open: boolean; product?: Product }>({ open: false });
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const filtered = products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.unit?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const avgPrice = products.length
    ? products.reduce((s, p) => s + p.price, 0) / products.length
    : 0;

  return (
    <div className="min-h-full bg-zinc-50">
      {/* Top bar */}
      <div className="border-b border-zinc-200 bg-white px-8 py-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">
              Master Data
            </p>
            <h1 className="text-[1.6rem] font-bold tracking-tight text-zinc-900 leading-none">
              Produk & Layanan
            </h1>
          </div>
          <button
            onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-all"
          >
            <Plus size={15} strokeWidth={2.5} />
            Tambah produk
          </button>
        </div>

        {products.length > 0 && (
          <div className="mt-5 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-zinc-900 tabular-nums">{products.length}</span>
              <span className="text-xs text-zinc-400 font-medium">produk terdaftar</span>
            </div>
            <div className="w-px h-5 bg-zinc-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-zinc-600 tabular-nums">{fmt(avgPrice)}</span>
              <span className="text-xs text-zinc-400 font-medium">rata-rata harga</span>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      {products.length > 0 && (
        <div className="px-8 py-3.5 border-b border-zinc-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
          <div className="relative max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau deskripsi…"
              className="w-full pl-8 pr-4 py-1.5 text-sm bg-zinc-100 border-0 rounded-lg text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="px-8 py-6">
        {products.length > 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Produk
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hidden lg:table-cell">
                    Deskripsi
                  </th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Harga
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hidden md:table-cell">
                    Satuan
                  </th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map(p => (
                  <tr key={p.id} className="group hover:bg-zinc-50 transition-colors">
                    {/* Nama */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <ProductAvatar name={p.name} />
                        <div>
                          <p className="font-semibold text-zinc-900 leading-tight">{p.name}</p>
                          {/* Deskripsi tampil di mobile sebagai subtitle */}
                          {p.description && (
                            <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[180px] lg:hidden">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Deskripsi — hidden di mobile */}
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      {p.description ? (
                        <p className="text-xs text-zinc-500 truncate max-w-xs">{p.description}</p>
                      ) : (
                        <span className="text-zinc-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Harga */}
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-semibold text-zinc-900 tabular-nums">{fmt(p.price)}</span>
                    </td>

                    {/* Satuan */}
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {p.unit ? <UnitBadge unit={p.unit} /> : <span className="text-zinc-300 text-xs">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal({ open: true, product: p })}
                          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Hapus "${p.name}"?`)) deleteMutation.mutate(p.id); }}
                          className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                          <Search size={18} className="text-zinc-400" />
                        </div>
                        <p className="text-zinc-400 text-sm">Tidak ada hasil untuk "{search}"</p>
                        <button
                          onClick={() => setSearch('')}
                          className="text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-700"
                        >
                          Hapus filter
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {filtered.length > 0 && search && (
              <div className="px-5 py-3 border-t border-zinc-50">
                <p className="text-xs text-zinc-400">{filtered.length} dari {products.length} produk</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Package size={24} className="text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-zinc-700 font-medium">Belum ada produk</p>
              <p className="text-zinc-400 text-sm mt-1">Tambah produk atau layanan untuk digunakan di invoice.</p>
            </div>
            <button
              onClick={() => setModal({ open: true })}
              className="mt-1 text-sm font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600 transition-colors"
            >
              Tambah sekarang
            </button>
          </div>
        )}
      </div>

      {modal.open && (
        <ProductModal product={modal.product} onClose={() => setModal({ open: false })} />
      )}
    </div>
  );
}