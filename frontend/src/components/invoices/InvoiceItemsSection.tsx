import {
  Plus,
  Package,
} from 'lucide-react';

import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form';

import InvoiceItemRow from './InvoiceItemRow';

import { formatRupiah } from '../../lib/terbilang';
import type { InvoiceFormData, InvoiceFormItem, Product} from '../../types';


interface InvoiceItemsSectionProps {
    fields: FieldArrayWithId<
        InvoiceFormData,
        'items',
        'id'
    >[];

  products: Product[];

   watchedItems: InvoiceFormItem[];

   register: UseFormRegister<InvoiceFormData>;

    append: UseFieldArrayAppend<
        InvoiceFormData,
        'items'
    >;


  remove: UseFieldArrayRemove;

  onProductSelect: (
    index: number,
    productId: number
  ) => void;
}

export default function InvoiceItemsSection({
  fields,
  products,
  watchedItems,
  register,
  append,
  remove,
  onProductSelect,
}: InvoiceItemsSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">

      {/* Header */}

      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
          <Package
            size={15}
            className="text-slate-700"
          />

          <span>
            Rincian Barang & Jasa
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              name: '',
              description: '',
              quantity: 1,
              unit: 'pcs',
              price: 0,
            })
          }
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus size={13} />

          Tambah Baris
        </button>
      </div>

      {/* Items */}

      <div className="p-4 sm:p-5 space-y-3">
        {fields.map((field, index) => (
          <InvoiceItemRow
            key={field.id}
            index={index}
            field={field}
            products={products}
            watchedItem={
              watchedItems[index]
            }
            register={register}
            fieldsLength={fields.length}
            onRemove={() => remove(index)}
            onProductSelect={
              onProductSelect
            }
            formatRupiah={formatRupiah}
          />
        ))}
      </div>
    </div>
  );
}