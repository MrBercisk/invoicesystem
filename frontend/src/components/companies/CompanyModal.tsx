import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  useForm,
  type SubmitHandler,
} from 'react-hook-form';

import {
  X,
  Building2,
  MapPin,
  CreditCard,
  FileCheck,
  Briefcase,
} from 'lucide-react';

import { companiesApi } from '../../lib/api';
import type { Company, CompanyFormValues } from '../../types';
import { availableBusinessTypes } from '../../lib/itemLabels.generated';

import {
  ImageUploadField,
} from './ImageUploadField';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */


interface CompanyModalProps {
  company?: Company;
  onClose: () => void;
}

/* -------------------------------------------------------------------------- */
/* Business type labels                                                       */
/* -------------------------------------------------------------------------- */

/*
 * Label yang ditampilkan ke user untuk tiap business_type. Key harus sama
 * persis dengan key di App\Support\ItemLabels.php. Kalau nambah business_type
 * baru di backend, tambahkan juga label human-friendly-nya di sini.
 */
const BUSINESS_TYPE_LABELS: Record<string, string> = {
  general: 'Umum',
  web_dev: 'Jasa Web Development',
  kue: 'Kue / Bakery',
};

function businessTypeLabel(value: string): string {
  return BUSINESS_TYPE_LABELS[value] ?? value;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function appendFormData(
  formData: FormData,
  key: string,
  value: unknown,
) {
  if (value === undefined || value === null) {
    return;
  }

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  if (
    typeof value === 'string' &&
    value.trim() === ''
  ) {
    return;
  }

  formData.append(key, String(value));
}

function buildCompanyFormData(
  data: CompanyFormValues,
): FormData {
  const formData = new FormData();

  const fields: Array<keyof CompanyFormValues> = [
    'name',
    'business_type',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'postal_code',
    'country',
    'npwp',
    'website',
    'signature_name',
    'signature_title',
    'bank_name',
    'bank_account_name',
    'bank_account_number',
  ];

  fields.forEach((field) => {
    appendFormData(
      formData,
      field,
      data[field],
    );
  });

  /*
   * Hanya kirim file baru.
   *
   * Jika sedang edit dan value masih berupa URL
   * gambar lama, URL tersebut tidak dikirim kembali.
   */
  if (data.logo instanceof File) {
    formData.append('logo', data.logo);
  }

  if (data.signature instanceof File) {
    formData.append(
      'signature',
      data.signature,
    );
  }

  if (data.stamp instanceof File) {
    formData.append(
      'stamp',
      data.stamp,
    );
  }

  return formData;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function CompanyModal({
  company,
  onClose,
}: CompanyModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<CompanyFormValues>({
    defaultValues: {
      name: company?.name ?? '',
      business_type: company?.business_type ?? 'general',
      email: company?.email ?? '',
      phone: company?.phone ?? '',
      address: company?.address ?? '',
      city: company?.city ?? '',
      state: company?.state ?? '',
      postal_code:
        company?.postal_code ?? '',
      country:
        company?.country ?? 'Indonesia',
      npwp: company?.npwp ?? '',
      website:
        company?.website ?? '',

      logo: company?.logo,

      signature_name:
        company?.signature_name ?? '',
      signature_title:
        company?.signature_title ?? '',

      signature:
        company?.signature,

      stamp:
        company?.stamp,

      bank_name:
        company?.bank_name ?? '',
      bank_account_name:
        company?.bank_account_name ?? '',
      bank_account_number:
        company?.bank_account_number ?? '',
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Watched values                                                           */
  /* ------------------------------------------------------------------------ */

  const logoValue = watch('logo');

  const signatureValue =
    watch('signature');

  const stampValue =
    watch('stamp');

  /* ------------------------------------------------------------------------ */
  /* Mutation                                                                 */
  /* ------------------------------------------------------------------------ */

  const mutation = useMutation({
    mutationFn: (
      data: CompanyFormValues,
    ) => {
      const formData =
        buildCompanyFormData(data);

      if (company) {
        return companiesApi.update(
          company.id,
          formData,
        );
      }

      return companiesApi.create(
        formData,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });

      onClose();
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const onSubmit: SubmitHandler<
    CompanyFormValues
  > = (data) => {
    mutation.mutate(data);
  };

  /* ------------------------------------------------------------------------ */
  /* Styles                                                                   */
  /* ------------------------------------------------------------------------ */

  const inputClass = `
    w-full
    bg-slate-50
    border border-slate-200
    rounded-lg
    px-3 py-1.5
    text-xs
    text-slate-900
    font-medium
    placeholder:text-slate-400
    focus:outline-none
    focus:bg-white
    focus:border-slate-900
    focus:ring-1
    focus:ring-slate-900
    transition-all
  `;

  const labelClass =
    'block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1';

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative flex flex-col w-full max-w-2xl overflow-hidden bg-white border shadow-2xl rounded-2xl max-h-[92vh] border-slate-200">

        {/* ================================================================== */}
        {/* Header                                                             */}
        {/* ================================================================== */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold leading-tight text-slate-900">
              {company
                ? `Edit Profil: ${company.name}`
                : 'Tambah Profil Perusahaan'}
            </h2>

            <p className="text-xs text-slate-500">
              Kelola identitas perusahaan,
              legalitas, tanda tangan, stempel,
              dan rekening pembayaran.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================================================================== */}
        {/* Form                                                               */}
        {/* ================================================================== */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 px-6 py-5 space-y-5 overflow-y-auto"
        >

          {/* ================================================================ */}
          {/* Section 1 - Identitas & Logo                                    */}
          {/* ================================================================ */}

          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Building2
                size={14}
                className="text-slate-700"
              />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Identitas & Logo Usaha
              </span>
            </div>

            <div className="grid items-start grid-cols-1 gap-3 md:grid-cols-3">

              {/* Identity */}
              <div className="space-y-3 md:col-span-2">

                {/* Company Name */}
                <div>
                  <label className={labelClass}>
                    Nama Resmi Perusahaan{' '}
                    <span className="text-rose-500">
                      *
                    </span>
                  </label>

                  <input
                    {...register('name')}
                    required
                    placeholder="Moracraft Studio"
                    className={inputClass}
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className={`${labelClass} flex items-center gap-1`}>
                    <Briefcase size={10} />
                    Jenis Bisnis
                  </label>

                  <select
                    {...register('business_type')}
                    className={inputClass}
                  >
                    {availableBusinessTypes().map((value) => (
                      <option key={value} value={value}>
                        {businessTypeLabel(value)}
                      </option>
                    ))}
                  </select>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Menentukan istilah yang dipakai pada dokumen serah terima
                    (mis. "Daftar Fitur" vs "Daftar Produk").
                  </p>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-2.5">

                  <div>
                    <label className={labelClass}>
                      Email Penagihan
                    </label>

                    <input
                      {...register('email')}
                      type="email"
                      placeholder="studiomoracraft@gmail.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Nomor Telepon
                    </label>

                    <input
                      {...register('phone')}
                      placeholder="+62 21 5558 9200"
                      className={inputClass}
                    />
                  </div>

                </div>
              </div>

              {/* Logo */}
              <ImageUploadField
                label="Logo Perusahaan"
                value={logoValue}
                onChange={(value) =>
                  setValue(
                    'logo',
                    value,
                    {
                      shouldDirty: true,
                    },
                  )
                }
                hint="PNG/JPG/WebP · Maks 5MB"
                aspect="logo"
              />

            </div>
          </div>

          {/* ================================================================ */}
          {/* Section 2 - Address & Legal                                     */}
          {/* ================================================================ */}

          <div className="pt-2 space-y-3 border-t border-slate-100">

            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <MapPin
                size={14}
                className="text-slate-700"
              />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Alamat & Legalitas
              </span>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>
                Alamat Lengkap
              </label>

              <textarea
                {...register('address')}
                rows={2}
                placeholder="Gamping, Sleman, Yogyakarta"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* City / State / Postal Code */}
            <div className="grid grid-cols-3 gap-2.5">

              <div>
                <label className={labelClass}>
                  Kota
                </label>

                <input
                  {...register('city')}
                  placeholder="Sleman"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Provinsi
                </label>

                <input
                  {...register('state')}
                  placeholder="Daerah Istimewa Yogyakarta"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Kode Pos
                </label>

                <input
                  {...register('postal_code')}
                  placeholder="55281"
                  className={inputClass}
                />
              </div>

            </div>

            {/* Country / NPWP */}
            <div className="grid grid-cols-2 gap-2.5">

              <div>
                <label className={labelClass}>
                  Negara
                </label>

                <input
                  {...register('country')}
                  placeholder="Indonesia"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Nomor NPWP
                </label>

                <input
                  {...register('npwp')}
                  placeholder="01.234.567.8-012.000"
                  className={inputClass}
                />
              </div>

            </div>

            {/* Website */}
            <div>
              <label className={labelClass}>
                Situs Web
              </label>

              <input
                {...register('website')}
                type="url"
                placeholder="https://perusahaan.co.id"
                className={inputClass}
              />
            </div>

          </div>

          {/* ================================================================ */}
          {/* Section 3 - Invoice Authorization                               */}
          {/* ================================================================ */}

          <div className="pt-2 space-y-3 border-t border-slate-100">

            <div className="flex items-center justify-between pb-1 border-b border-slate-100">

              <div className="flex items-center gap-2">

                <FileCheck
                  size={14}
                  className="text-slate-700"
                />

                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  3. Pengesahan Invoice
                </span>

              </div>

              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                Otomatis pada Dokumen
              </span>

            </div>

            {/* Signature Name / Title */}
            <div className="grid grid-cols-2 gap-2.5">

              <div>
                <label className={labelClass}>
                  Nama Penanda Tangan (PIC)
                </label>

                <input
                  {...register(
                    'signature_name',
                  )}
                  placeholder="Bimo Satrio Putra Pradana, S.Kom"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Jabatan PIC
                </label>

                <input
                  {...register(
                    'signature_title',
                  )}
                  placeholder="Founder & Software Engineer"
                  className={inputClass}
                />
              </div>

            </div>

            {/* Signature & Stamp */}
            <div className="grid grid-cols-2 gap-3 pt-1">

              <ImageUploadField
                label="Tanda Tangan Digital"
                value={signatureValue}
                onChange={(value) =>
                  setValue(
                    'signature',
                    value,
                    {
                      shouldDirty: true,
                    },
                  )
                }
                hint="PNG/JPG/WebP · Maks 5MB"
                aspect="sign"
              />

              <ImageUploadField
                label="Cap / Stempel Resmi"
                value={stampValue}
                onChange={(value) =>
                  setValue(
                    'stamp',
                    value,
                    {
                      shouldDirty: true,
                    },
                  )
                }
                hint="PNG/JPG/WebP · Maks 5MB"
                aspect="stamp"
              />

            </div>

          </div>

          {/* ================================================================ */}
          {/* Section 4 - Bank Account                                        */}
          {/* ================================================================ */}

          <div className="pt-2 space-y-3 border-t border-slate-100">

            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">

              <CreditCard
                size={14}
                className="text-slate-700"
              />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                4. Rekening Pembayaran Resmi
              </span>

            </div>

            {/* Bank / Account Number */}
            <div className="grid grid-cols-2 gap-2.5">

              <div>
                <label className={labelClass}>
                  Nama Bank
                </label>

                <input
                  {...register('bank_name')}
                  placeholder="Bank Mandiri / BCA / BNI"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Nomor Rekening
                </label>

                <input
                  {...register(
                    'bank_account_number',
                  )}
                  placeholder="23504472621"
                  className={inputClass}
                />
              </div>

            </div>

            {/* Account Name */}
            <div>
              <label className={labelClass}>
                Nama Pemilik Rekening (A/N)
              </label>

              <input
                {...register(
                  'bank_account_name',
                )}
                placeholder="Moracraft Studio"
                className={inputClass}
              />
            </div>

          </div>

          {/* ================================================================ */}
          {/* Mutation Error                                                   */}
          {/* ================================================================ */}

          {mutation.isError && (
            <div className="p-3 text-xs border rounded-lg border-rose-200 bg-rose-50 text-rose-700">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Gagal menyimpan data perusahaan.'}
            </div>
          )}

          {/* ================================================================ */}
          {/* Actions                                                          */}
          {/* ================================================================ */}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">

            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition-all shadow-xs"
            >
              {mutation.isPending
                ? 'Menyimpan…'
                : company
                  ? 'Simpan Perubahan'
                  : 'Tambah Perusahaan'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}