import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  CreditCard, 
  MapPin, 
  Upload, 
  FileCheck, 
  CheckCircle2 
} from 'lucide-react';
import { companiesApi } from '../lib/api';
import type { Company } from '../types';

// ─── Image Upload Field ────────────────────────────────────────────────────────
function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  aspect = 'standard',
}: {
  label: string;
  value?: string;
  onChange: (val: string | undefined) => void;
  hint: string;
  aspect?: 'logo' | 'sign' | 'stamp' | 'standard';
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(undefined);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
          >
            <Trash2 size={11} /> Hapus
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border border-slate-200 bg-slate-50 rounded-lg p-2 flex items-center justify-center hover:border-slate-400 hover:bg-slate-100 transition-all ${
            aspect === 'stamp' ? 'h-24' : 'h-20'
          }`}
        >
          <img
            src={value}
            alt={label}
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-xs font-semibold gap-1">
            <Upload size={13} /> Ganti File
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50 rounded-lg p-3 flex flex-col items-center justify-center gap-1 text-slate-500 transition-all group"
        >
          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600">
            <Upload size={12} />
          </div>
          <span className="text-xs font-semibold text-slate-700">Unggah Berkas</span>
          <span className="text-[10px] text-slate-400">{hint}</span>
        </button>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function CompanyModal({ company, onClose }: { company?: Company; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: company || {
      country: 'Indonesia',
    },
  });

  const logoValue = watch('logo');
  const signatureValue = watch('signature');
  const stampValue = watch('stamp');

  const mutation = useMutation({
    mutationFn: (data: Partial<Company>) =>
      company ? companiesApi.update(company.id, data) : companiesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] });
      onClose();
    },
  });

  const inp = `
    w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium
    placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900
    focus:ring-1 focus:ring-slate-900 transition-all
  `;
  const lbl = 'block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {company ? `Edit Profil: ${company.name}` : 'Tambah Profil Perusahaan'}
            </h2>
            <p className="text-xs text-slate-500">
              Konfigurasi logo, legalitas NPWP, rekening bank, serta stempel digital.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(d => mutation.mutate(d))}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* Section 1: Identitas & Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Building2 size={14} className="text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Identitas & Logo Usaha
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className={lbl}>Nama Resmi Perusahaan <span className="text-rose-500">*</span></label>
                  <input {...register('name')} required placeholder="Moracraft Studio" className={inp} />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className={lbl}>Email Penagihan</label>
                    <input {...register('email')} type="email" placeholder="studiomoracraft@gmail.com" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Nomor Telepon</label>
                    <input {...register('phone')} placeholder="+62 21 5558 9200" className={inp} />
                  </div>
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Logo Perusahaan"
                  value={logoValue}
                  onChange={(val) => setValue('logo', val)}
                  hint="PNG/SVG transparan (Maks 2MB)"
                  aspect="logo"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Alamat & Legalitas */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <MapPin size={14} className="text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Alamat & Legalitas NPWP
              </span>
            </div>

            <div>
              <label className={lbl}>Alamat Lengkap Kantor</label>
              <textarea {...register('address')} rows={2} placeholder="Gamping, Sleman, Yogyakarta" className={inp + ' resize-none'} />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className={lbl}>Kota</label>
                <input {...register('city')} placeholder="Sleman" className={inp} />
              </div>
              <div>
                <label className={lbl}>Provinsi</label>
                <input {...register('state')} placeholder="Daerah Istimewa Yogyakarta" className={inp} />
              </div>
              <div>
                <label className={lbl}>Kode Pos</label>
                <input {...register('postal_code')} placeholder="12950" className={inp} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={lbl}>Nomor NPWP</label>
                <input {...register('npwp')} placeholder="01.234.567.8-012.000" className={inp} />
              </div>
              <div>
                <label className={lbl}>Situs Web</label>
                <input {...register('website')} placeholder="https://perusahaan.co.id" className={inp} />
              </div>
            </div>
          </div>

          {/* Section 3: Pengesahan & Tanda Tangan */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck size={14} className="text-slate-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3. Pengesahan Invoice (Tanda Tangan & Cap)
                </span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                Otomatis pada Dokumen
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={lbl}>Nama Penanda Tangan (PIC)</label>
                <input {...register('signer_name')} placeholder="Bimo Satrio Putra Pradana, S.Kom" className={inp} />
              </div>
              <div>
                <label className={lbl}>Jabatan PIC</label>
                <input {...register('signer_title')} placeholder="Founder & Software Engineer" className={inp} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <ImageUploadField
                label="Tanda Tangan Digital"
                value={signatureValue}
                onChange={(val) => setValue('signature', val)}
                hint="PNG transparan tanda tangan"
                aspect="sign"
              />
              <ImageUploadField
                label="Cap / Stempel Resmi"
                value={stampValue}
                onChange={(val) => setValue('stamp', val)}
                hint="PNG transparan cap stempel bulat"
                aspect="stamp"
              />
            </div>
          </div>

          {/* Section 4: Bank Section */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <CreditCard size={14} className="text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                4. Rekening Pembayaran Resmi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={lbl}>Nama Bank</label>
                <input {...register('bank_name')} placeholder="Bank Mandiri / BCA / BNI" className={inp} />
              </div>
              <div>
                <label className={lbl}>Nomor Rekening</label>
                <input {...register('bank_account_number')} placeholder="23504472621" className={inp} />
              </div>
            </div>

            <div>
              <label className={lbl}>Nama Pemilik Rekening (A/N)</label>
              <input {...register('bank_account_name')} placeholder="Moracraft Studio" className={inp} />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition-all shadow-xs"
            >
              {mutation.isPending ? 'Menyimpan…' : company ? 'Simpan Perubahan' : 'Tambah Perusahaan'}
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

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo ? (
              <div className="w-11 h-11 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-slate-950 text-sm truncate">{company.name}</h3>
              {company.city && (
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={11} className="text-slate-400" />
                  {company.city}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-all"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="Hapus"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="px-4 sm:px-5 pb-3 flex items-center gap-1.5 flex-wrap text-[10px]">
          {company.logo && (
            <span className="inline-flex items-center gap-1 font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 size={10} /> Logo
            </span>
          )}
          {(company.signature || company.stamp) && (
            <span className="inline-flex items-center gap-1 font-semibold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-200">
              <CheckCircle2 size={10} /> {company.signature && company.stamp ? 'Ttd & Stempel' : company.signature ? 'Ttd Digital' : 'Stempel'}
            </span>
          )}
          {company.signer_name && (
            <span className="inline-flex items-center font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 truncate max-w-[150px]">
              PIC: {company.signer_name}
            </span>
          )}
        </div>

        {/* Contact info */}
        {(company.email || company.phone || company.website) && (
          <div className="px-4 sm:px-5 pb-3 space-y-1">
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-950 transition-colors truncate"
              >
                <Mail size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{company.email}</span>
              </a>
            )}
            {company.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={12} className="text-slate-400 shrink-0" />
                <span>{company.phone}</span>
              </div>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-950 transition-colors truncate"
              >
                <Globe size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bank info */}
      {company.bank_name && (
        <div className="mx-4 sm:mx-5 mb-4 p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
          <CreditCard size={13} className="text-slate-400 shrink-0" />
          <div className="min-w-0 text-xs">
            <p className="font-semibold text-slate-900 truncate">
              {company.bank_name}
              {company.bank_account_number && (
                <span className="font-mono text-slate-600 ml-1 font-bold">{company.bank_account_number}</span>
              )}
            </p>
            {company.bank_account_name && (
              <p className="text-[10px] text-slate-500 truncate">A/N: {company.bank_account_name}</p>
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
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profil Perusahaan & Entitas</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola identitas penerbit invoice, logo perusahaan, stempel, dan nomor rekening penampung.</p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus size={15} />
          Tambah Perusahaan
        </button>
      </div>

      {/* Cards */}
      <div>
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map(c => (
              <CompanyCard
                key={c.id}
                company={c}
                onEdit={() => setModal({ open: true, company: c })}
                onDelete={() => {
                  if (confirm(`Hapus entitas "${c.name}"?`)) deleteMutation.mutate(c.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Building2 size={36} className="mx-auto text-slate-300 mb-2.5" />
            <div className="text-sm font-bold text-slate-800">Belum ada perusahaan</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tambahkan profil perusahaan Anda untuk menampilkan kop surat, logo, dan rekening pembayaran otomatis.
            </p>
            <button
              onClick={() => setModal({ open: true })}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus size={14} /> Tambah Sekarang
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
