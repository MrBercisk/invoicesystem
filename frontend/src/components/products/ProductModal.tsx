import {
  X,
} from 'lucide-react';

import type {
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';

import type { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  editingProduct: Product | null;

  register: UseFormRegister<Partial<Product>>;

  handleSubmit: UseFormHandleSubmit<
    Partial<Product>
  >;

  onSubmit: (
    data: Partial<Product>
  ) => void;

  onClose: () => void;

  isSaving: boolean;
}

export default function ProductModal({
  isOpen,
  editingProduct,
  register,
  handleSubmit,
  onSubmit,
  onClose,
  isSaving,
}: ProductModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">

        {/* Header */}

        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">

          <div>

            <h3 className="font-bold text-slate-900 text-base">
              {editingProduct
                ? 'Edit Produk / Jasa'
                : 'Tambah Produk / Jasa'}
            </h3>

            <p className="text-xs text-slate-500">
              Lengkapi nama item, deskripsi spesifikasi,
              dan patokan harga.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3.5"
        >

          {/* Name */}

          <div>

            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Nama Barang / Jasa{' '}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <input
              type="text"
              placeholder="Contoh: Jasa SEO & Optimasi Website"
              {...register('name', {
                required: true,
              })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            />

          </div>

          {/* Description */}

          <div>

            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Deskripsi / Cakupan
            </label>

            <textarea
              rows={2}
              placeholder="Rincian singkat item..."
              {...register('description')}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            />

          </div>

          {/* Price + Unit */}

          <div className="grid grid-cols-2 gap-2.5">

            <div>

              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Harga Satuan (Rp){' '}
                <span className="text-rose-500">
                  *
                </span>
              </label>

              <input
                type="number"
                min="0"
                placeholder="1500000"
                {...register('price', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />

            </div>

            <div>

              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Satuan Unit{' '}
                <span className="text-rose-500">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="pcs / bulan / paket / jam"
                {...register('unit', {
                  required: true,
                })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50"
            >
              {isSaving
                ? 'Menyimpan...'
                : 'Simpan Produk'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}