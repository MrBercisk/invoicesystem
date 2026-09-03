import {
  Trash2,
} from 'lucide-react';

import type {
  FieldArrayWithId,
  UseFormRegister,
} from 'react-hook-form';
import type { InvoiceFormData, InvoiceFormItem, Product} from '../../types';


interface InvoiceItemRowProps {
  index: number;

  field: FieldArrayWithId<
    InvoiceFormData,
    'items',
    'id'
  >;

  products: Product[];

  watchedItem?: InvoiceFormItem;

  register: UseFormRegister<InvoiceFormData>;

  fieldsLength: number;

  onRemove: () => void;

  onProductSelect: (
    index: number,
    productId: number
  ) => void;

  formatRupiah: (value: number) => string;
}

export default function InvoiceItemRow({
  index,
  products,
  watchedItem,
  register,
  fieldsLength,
  onRemove,
  onProductSelect,
  formatRupiah,
}: InvoiceItemRowProps) {
  const qty =
    Number(watchedItem?.quantity) || 0;

  const price =
    Number(watchedItem?.price) || 0;

  const rowTotal = qty * price;

  return (
    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">

      {/* ======================================================
          TOP ROW
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">

        {/* Catalog */}

        <div className="sm:col-span-4">
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
            Katalog Produk (Opsional)
          </label>

          <select
            value={watchedItem?.product_id ?? ''}
            onChange={(event) => {
              if (event.target.value) {
                onProductSelect(
                  index,
                  Number(event.target.value)
                );
              }
            }}
            className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-slate-700"
          >
            <option value="">
              -- Pilih dari katalog --
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name} (
                {formatRupiah(product.price)}
                /{product.unit || 'pcs'})
              </option>
            ))}
          </select>
        </div>

        {/* Name */}

        <div className="sm:col-span-5">
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
            Nama Item / Uraian Pekerjaan{' '}
            <span className="text-rose-500">
              *
            </span>
          </label>

          <input
            type="text"
            placeholder="Contoh: Pembuatan Website E-Commerce"
            {...register(
              `items.${index}.name` as const,
              {
                required: true,
              }
            )}
            className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Total */}

        <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-3 pt-4">
          <div className="text-right">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              Subtotal Item
            </div>

            <div className="text-xs font-bold font-mono text-slate-950">
              {formatRupiah(rowTotal)}
            </div>
          </div>

          {fieldsLength > 1 && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="Hapus baris"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================
          BOTTOM ROW
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">

        {/* Description */}

        <div className="sm:col-span-6">
          <input
            type="text"
            placeholder="Deskripsi tambahan atau catatan spesifikasi..."
            {...register(
              `items.${index}.description` as const
            )}
            className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-slate-600"
          />
        </div>

        {/* Quantity */}

        <div className="sm:col-span-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium w-7">
              Qty:
            </span>

            <input
              type="number"
              min="1"
              step="any"
              placeholder="1"
              {...register(
                `items.${index}.quantity` as const,
                {
                  valueAsNumber: true,
                }
              )}
              className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-right font-mono font-medium"
            />
          </div>
        </div>

        {/* Unit */}

        <div className="sm:col-span-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium w-7">
              Sat:
            </span>

            <input
              type="text"
              placeholder="pcs"
              {...register(
                `items.${index}.unit` as const
              )}
              className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5"
            />
          </div>
        </div>

        {/* Price */}

        <div className="sm:col-span-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium w-7">
              Rp:
            </span>

            <input
              type="number"
              min="0"
              placeholder="0"
              {...register(
                `items.${index}.price` as const,
                {
                  valueAsNumber: true,
                }
              )}
              className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-right font-mono font-bold text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}