import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Users, Mail, Phone, MapPin, User } from 'lucide-react';
import { clientsApi } from '../lib/api';
import type { Client } from '../types';

// ─── Modal ────────────────────────────────────────────────────────────────────
function ClientModal({ client, onClose }: { client?: Client; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm({ defaultValues: client || {} });

  const mutation = useMutation({
    mutationFn: (data: Partial<Client>) =>
      client ? clientsApi.update(client.id, data) : clientsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      onClose();
    },
  });

  const inp = `
    w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800
    placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400
    focus:ring-2 focus:ring-zinc-900/10 transition-all
  `;
  const lbl = 'block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-zinc-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
              {client ? 'Edit data' : 'Tambah baru'}
            </p>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">
              {client ? client.name : 'Klien baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(d => mutation.mutate(d))}
          className="flex-1 overflow-y-auto px-7 py-6 space-y-5"
        >
          <div>
            <label className={lbl}>
              Nama Klien / Perusahaan{' '}
              <span className="text-rose-400 normal-case tracking-normal">*</span>
            </label>
            <input
              {...register('name')}
              required
              placeholder="PT. Mitra Sejahtera"
              className={inp}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>PIC</label>
              <input {...register('pic_name')} placeholder="Nama kontak" className={inp} />
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="klien@email.com"
                className={inp}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Telepon</label>
              <input {...register('phone')} placeholder="+62 812 0000 0000" className={inp} />
            </div>
            <div>
              <label className={lbl}>NPWP</label>
              <input {...register('npwp')} placeholder="00.000.000.0-000.000" className={inp} />
            </div>
          </div>

          <div>
            <label className={lbl}>Alamat</label>
            <textarea
              {...register('address')}
              rows={2}
              placeholder="Jl. Contoh No. 1"
              className={inp + ' resize-none'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Kota</label>
              <input {...register('city')} placeholder="Jakarta" className={inp} />
            </div>
            <div>
              <label className={lbl}>Negara</label>
              <input {...register('country')} defaultValue="Indonesia" className={inp} />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-700 disabled:opacity-40 transition-all"
            >
              {mutation.isPending ? 'Menyimpan…' : client ? 'Simpan perubahan' : 'Tambah klien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function ClientAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const hues = [210, 155, 280, 340, 30, 190, 260, 15];
  const hue = hues[name.charCodeAt(0) % hues.length];

  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{
        backgroundColor: `hsl(${hue} 60% 93%)`,
        color: `hsl(${hue} 60% 35%)`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ClientsPage() {
  const [modal, setModal] = useState<{ open: boolean; client?: Client }>({ open: false });
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });

  const filtered = clients.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.pic_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  );

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
              Klien
            </h1>
          </div>
          <button
            onClick={() => setModal({ open: true })}
            className="group flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-all"
          >
            <Plus size={15} strokeWidth={2.5} />
            Tambah klien
          </button>
        </div>

        {clients.length > 0 && (
          <div className="mt-5 flex items-center gap-2">
            <span className="text-2xl font-bold text-zinc-900 tabular-nums">{clients.length}</span>
            <span className="text-xs text-zinc-400 font-medium">klien terdaftar</span>
          </div>
        )}
      </div>

      {/* Search bar */}
      {clients.length > 0 && (
        <div className="px-8 py-3.5 border-b border-zinc-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
          <div className="relative max-w-xs">
            <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, PIC, atau kota…"
              className="w-full pl-8 pr-4 py-1.5 text-sm bg-zinc-100 border-0 rounded-lg text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="px-8 py-6">
        {clients.length > 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Klien
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hidden md:table-cell">
                    PIC
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hidden lg:table-cell">
                    Kontak
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hidden xl:table-cell">
                    Lokasi
                  </th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map(c => (
                  <tr key={c.id} className="group hover:bg-zinc-50 transition-colors">
                    {/* Nama */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <ClientAvatar name={c.name} />
                        <span className="font-semibold text-zinc-900">{c.name}</span>
                      </div>
                    </td>

                    {/* PIC */}
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {c.pic_name ? (
                        <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
                          <User size={11} className="text-zinc-300 flex-shrink-0" />
                          {c.pic_name}
                        </div>
                      ) : (
                        <span className="text-zinc-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Kontak */}
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="space-y-1">
                        {c.email ? (
                          <a
                            href={`mailto:${c.email}`}
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                          >
                            <Mail size={10} className="text-zinc-300 flex-shrink-0" />
                            {c.email}
                          </a>
                        ) : null}
                        {c.phone ? (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Phone size={10} className="text-zinc-300 flex-shrink-0" />
                            {c.phone}
                          </div>
                        ) : null}
                        {!c.email && !c.phone && (
                          <span className="text-zinc-300 text-xs">—</span>
                        )}
                      </div>
                    </td>

                    {/* Lokasi */}
                    <td className="px-5 py-3.5 hidden xl:table-cell">
                      {c.city ? (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <MapPin size={10} className="text-zinc-300 flex-shrink-0" />
                          {c.city}{c.country && c.country !== 'Indonesia' ? `, ${c.country}` : ''}
                        </div>
                      ) : (
                        <span className="text-zinc-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal({ open: true, client: c })}
                          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus "${c.name}"?`)) deleteMutation.mutate(c.id);
                          }}
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
                          <User size={18} className="text-zinc-400" />
                        </div>
                        <p className="text-zinc-400 text-sm">
                          Tidak ada hasil untuk "{search}"
                        </p>
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
                <p className="text-xs text-zinc-400">
                  {filtered.length} dari {clients.length} klien
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Users size={24} className="text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-zinc-700 font-medium">Belum ada klien</p>
              <p className="text-zinc-400 text-sm mt-1">
                Tambah klien pertama untuk mulai membuat invoice.
              </p>
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
        <ClientModal client={modal.client} onClose={() => setModal({ open: false })} />
      )}
    </div>
  );
}