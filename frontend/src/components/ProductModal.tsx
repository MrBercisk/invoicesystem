import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { X} from 'lucide-react';
import { productsApi } from '../lib/api';
import type { Product } from '../types';

interface Props {
  product?: Product;
  onClose: () => void;
}

const UNITS = ['pcs', 'unit', 'bulan', 'tahun', 'jam', 'hari', 'paket', 'lisensi'];

const inp = `
  w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800
  placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400
  focus:ring-2 focus:ring-zinc-900/10 transition-all
`;
const lbl = 'block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5';

export function ProductModal({ product, onClose }: Props) {
  const qc = useQueryClient();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: product || { unit: 'pcs' },
  });

  const selectedUnit = watch('unit');

  const mutation = useMutation({
    mutationFn: (data: Partial<Product>) =>
      product
        ? productsApi.update(product.id, { ...data, price: Number(data.price) })
        : productsApi.create({ ...data, price: Number(data.price) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-zinc-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
              {product ? 'Edit data' : 'Tambah baru'}
            </p>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">
              {product ? product.name : 'Produk baru'}
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
          className="px-7 py-6 space-y-5"
        >
          <div>
            <label className={lbl}>
              Nama Produk / Layanan{' '}
              <span className="text-rose-400 normal-case tracking-normal">*</span>
            </label>
            <input
              {...register('name')}
              required
              placeholder="Jasa Konsultasi / Software License"
              className={inp}
            />
          </div>

          <div>
            <label className={lbl}>Deskripsi</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Keterangan singkat produk atau layanan ini…"
              className={inp + ' resize-none'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>
                Harga (Rp){' '}
                <span className="text-rose-400 normal-case tracking-normal">*</span>
              </label>
              <input
                {...register('price')}
                type="number"
                min={0}
                required
                placeholder="500000"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Satuan</label>
              <select {...register('unit')} className={inp}>
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview harga */}
          <div className="bg-zinc-50 rounded-xl px-4 py-3 flex items-center justify-between border border-zinc-100">
            <p className="text-xs text-zinc-400">Tampil di invoice sebagai</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-zinc-800 tabular-nums">
                {watch('price')
                  ? new Intl.NumberFormat('id-ID', {
                      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
                    }).format(Number(watch('price')))
                  : 'Rp 0'}
              </span>
              {selectedUnit && (
                <span className="text-xs text-zinc-400">/ {selectedUnit}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-100">
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
              {mutation.isPending ? 'Menyimpan…' : product ? 'Simpan perubahan' : 'Tambah produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}