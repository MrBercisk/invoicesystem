import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Building2, Mail, Phone, Globe, CreditCard, MapPin } from 'lucide-react';
import { companiesApi } from '../lib/api';
import type { Company } from '../types';

// ─── Modal ────────────────────────────────────────────────────────────────────
function CompanyModal({ company, onClose }: { company?: Company; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm({ defaultValues: company || {} });

  const mutation = useMutation({
    mutationFn: (data: Partial<Company>) =>
      company ? companiesApi.update(company.id, data) : companiesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] });
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-zinc-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
              {company ? 'Edit data' : 'Tambah baru'}
            </p>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">
              {company ? company.name : 'Perusahaan baru'}
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
          {/* Identitas */}
          <div>
            <label className={lbl}>Nama Perusahaan <span className="text-rose-400 normal-case tracking-normal">*</span></label>
            <input {...register('name')} required placeholder="PT. Contoh Indonesia" className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Email</label>
              <input {...register('email')} type="email" placeholder="info@perusahaan.com" className={inp} />
            </div>
            <div>
              <label className={lbl}>Telepon</label>
              <input {...register('phone')} placeholder="+62 21 0000 0000" className={inp} />
            </div>
          </div>

          <div>
            <label className={lbl}>Alamat</label>
            <textarea {...register('address')} rows={2} placeholder="Jl. Contoh No. 1" className={inp + ' resize-none'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Kota</label>
              <input {...register('city')} placeholder="Jakarta" className={inp} />
            </div>
            <div>
              <label className={lbl}>Kode Pos</label>
              <input {...register('postal_code')} placeholder="12345" className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>NPWP</label>
              <input {...register('npwp')} placeholder="00.000.000.0-000.000" className={inp} />
            </div>
            <div>
              <label className={lbl}>Website</label>
              <input {...register('website')} placeholder="https://perusahaan.com" className={inp} />
            </div>
          </div>

          {/* Bank section */}
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-zinc-100" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Rekening Bank
              </span>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Nama Bank</label>
                <input {...register('bank_name')} placeholder="BCA / Mandiri / BNI" className={inp} />
              </div>
              <div>
                <label className={lbl}>No. Rekening</label>
                <input {...register('bank_account_number')} placeholder="1234567890" className={inp} />
              </div>
            </div>

            <div className="mt-4">
              <label className={lbl}>Nama Pemilik Rekening</label>
              <input {...register('bank_account_name')} placeholder="PT. Contoh Indonesia" className={inp} />
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
              {mutation.isPending ? 'Menyimpan…' : company ? 'Simpan perubahan' : 'Tambah perusahaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Company card ─────────────────────────────────────────────────────────────
function CompanyCard({
  company,
  onEdit,
  onDelete,
}: {
  company: Company;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const initials = company.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  // Deterministic color from name
  const hues = [210, 155, 280, 340, 30, 190];
  const hue = hues[company.name.charCodeAt(0) % hues.length];

  return (
    <div className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
      {/* Top accent + avatar */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              backgroundColor: `hsl(${hue} 60% 93%)`,
              color: `hsl(${hue} 60% 35%)`,
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 leading-tight truncate">{company.name}</h3>
            {company.city && (
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                <MapPin size={10} />
                {company.city}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Hapus"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Contact info */}
      {(company.email || company.phone || company.website) && (
        <div className="px-5 pb-4 space-y-1.5">
          {company.email && (
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 transition-colors group/link"
            >
              <Mail size={11} className="text-zinc-300 group-hover/link:text-zinc-500 flex-shrink-0" />
              <span className="truncate">{company.email}</span>
            </a>
          )}
          {company.phone && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Phone size={11} className="text-zinc-300 flex-shrink-0" />
              {company.phone}
            </div>
          )}
          {company.website && (
             <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 transition-colors truncate group/link"
            >
              <Globe size={11} className="text-zinc-300 group-hover/link:text-zinc-500 flex-shrink-0" />
              <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>
      )}

      {/* Bank info */}
      {company.bank_name && (
        <div className="mx-5 mb-5 px-3 py-2.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center gap-2">
          <CreditCard size={12} className="text-zinc-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-zinc-700 truncate">
              {company.bank_name}
              {company.bank_account_number && (
                <span className="font-mono text-zinc-500 ml-1.5">{company.bank_account_number}</span>
              )}
            </p>
            {company.bank_account_name && (
              <p className="text-[10px] text-zinc-400 truncate">{company.bank_account_name}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function CompaniesPage() {
  const [modal, setModal] = useState<{ open: boolean; company?: Company }>({ open: false });
  const qc = useQueryClient();

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: companiesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  });

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
              Perusahaan
            </h1>
          </div>
          <button
            onClick={() => setModal({ open: true })}
            className="group flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-all"
          >
            <Plus size={15} strokeWidth={2.5} />
            Tambah perusahaan
          </button>
        </div>

        {companies.length > 0 && (
          <div className="mt-5 flex items-center gap-2">
            <span className="text-2xl font-bold text-zinc-900 tabular-nums">{companies.length}</span>
            <span className="text-xs text-zinc-400 font-medium">perusahaan terdaftar</span>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="px-8 py-6">
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map(c => (
              <CompanyCard
                key={c.id}
                company={c}
                onEdit={() => setModal({ open: true, company: c })}
                onDelete={() => {
                  if (confirm(`Hapus "${c.name}"?`)) deleteMutation.mutate(c.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Building2 size={24} className="text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-zinc-700 font-medium">Belum ada perusahaan</p>
              <p className="text-zinc-400 text-sm mt-1">Tambah perusahaan pertama untuk mulai membuat invoice.</p>
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
        <CompanyModal
          company={modal.company}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}