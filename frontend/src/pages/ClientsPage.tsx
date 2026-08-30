import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Users, Mail, Phone, MapPin, Search } from 'lucide-react';
import { clientsApi } from '../lib/api';
import type { Client } from '../types';

export function ClientsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });

  const { register, handleSubmit, reset } = useForm<Partial<Client>>();

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Client>) => {
      if (editingClient) {
        return clientsApi.update(editingClient.id, data);
      }
      return clientsApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      reset(client);
    } else {
      setEditingClient(null);
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Indonesia',
        npwp: '',
        pic_name: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    reset();
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.pic_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Buku Kontak Klien</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola data mitra bisnis, nama penanggung jawab (PIC), NPWP, dan alamat penagihan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus size={15} /> Tambah Klien
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama klien, email, PIC, atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </div>

      {/* ── Client Cards Grid ── */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">Memuat data klien...</div>
      ) : filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Users size={36} className="mx-auto text-slate-300 mb-2.5" />
          <div className="text-sm font-bold text-slate-800">Tidak ada klien ditemukan</div>
          <p className="text-xs text-slate-500 mt-1">Tambah klien baru untuk memudahkan proses penagihan faktur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm">{client.name}</h3>
                    {client.pic_name && (
                      <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                        u.p. <span className="font-bold text-slate-800">{client.pic_name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(client)}
                      className="p-1.5 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus klien ${client.name}?`)) {
                          deleteMutation.mutate(client.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{client.address}{client.city ? `, ${client.city}` : ''}</span>
                    </div>
                  )}
                  {client.npwp && (
                    <div className="text-[10px] text-slate-400 pt-1">
                      NPWP: <span className="font-mono text-slate-700 font-semibold">{client.npwp}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Client Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingClient ? 'Edit Data Klien' : 'Tambah Klien Baru'}
                </h3>
                <p className="text-xs text-slate-500">Isi identitas perusahaan dan penanggung jawab tagihan.</p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Perusahaan / Klien <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PT Mitra Perkasa"
                  {...register('name', { required: true })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama PIC / Penanggung Jawab
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso (Finance Manager)"
                  {...register('pic_name')}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="billing@klien.com"
                    {...register('email')}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="+62 21 ..."
                    {...register('phone')}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Alamat Kantor</label>
                <textarea
                  rows={2}
                  placeholder="Jl. Jenderal Sudirman No..."
                  {...register('address')}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Kota</label>
                  <input
                    type="text"
                    placeholder="Jakarta Pusat"
                    {...register('city')}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">NPWP Klien</label>
                  <input
                    type="text"
                    placeholder="01.234.567.8-012.000"
                    {...register('npwp')}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Klien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
