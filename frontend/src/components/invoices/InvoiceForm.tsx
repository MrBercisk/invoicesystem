import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Plus } from 'lucide-react';
import type { Company, Client, Product, Invoice } from '../../types';

const itemSchema = z.object({
  product_id: z.number().optional(),
  name: z.string().min(1, 'Nama item wajib diisi'),
  description: z.string().optional(),
  quantity: z.number().min(0.01, 'Qty minimal 0.01'),
  unit: z.string().default('pcs'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  total: z.number().default(0),
});

const invoiceSchema = z.object({
  company_id: z.number().min(1, 'Pilih perusahaan'),
  client_id: z.number().min(1, 'Pilih klien'),
  invoice_date: z.string().min(1, 'Tanggal invoice wajib diisi'),
  due_date: z.string().min(1, 'Tanggal jatuh tempo wajib diisi'),

  tax_rate: z.number().default(11),
  discount: z.number().default(0),

  notes: z.string().optional(),
  terms: z.string().optional(),

  project_code: z.string().optional(),
  installment_label: z.string().optional(),

  items: z.array(itemSchema).min(1, 'Minimal 1 item'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface Props {
  companies: Company[];
  clients: Client[];
  products: Product[];
  defaultValues?: Partial<Invoice>;
  onSubmit: (data: InvoiceFormData) => Promise<Invoice>;
  isLoading?: boolean;
}

export function InvoiceForm({ companies, clients, products, defaultValues, onSubmit, isLoading }: Props) {
  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      company_id: defaultValues?.company_id ?? 0,
      client_id: defaultValues?.client_id ?? 0,
      invoice_date: defaultValues?.invoice_date || new Date().toISOString().split('T')[0],
      due_date: defaultValues?.due_date || '',
      tax_rate: defaultValues?.tax_rate ?? 11,
      discount: defaultValues?.discount ?? 0,
      notes: defaultValues?.notes || '',
      terms: defaultValues?.terms || '',
      project_code: defaultValues?.project_code || '',
      installment_label: defaultValues?.installment_label || '',
      items: defaultValues?.items?.map(i => ({
        product_id: i.product_id,
        name: i.name,
        description: i.description || '',
        quantity: i.quantity,
        unit: i.unit,
        price: i.price,
        total: i.total,
      })) || [{ name: '', quantity: 1, unit: 'pcs', price: 0, total: 0 }],
      },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');
  const taxRate = watch('tax_rate');
  const discount = watch('discount');

  const subtotal = watchedItems?.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0) || 0;
  const taxAmount = subtotal * ((taxRate || 0) / 100);
  const total = subtotal + taxAmount - (discount || 0);

  const applyProduct = (index: number, product: Product) => {
    setValue(`items.${index}.name`, product.name);
    setValue(`items.${index}.price`, product.price);
    setValue(`items.${index}.unit`, product.unit);
    setValue(`items.${index}.product_id`, product.id);
    const qty = watchedItems[index]?.quantity || 1;
    setValue(`items.${index}.total`, qty * product.price);
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Perusahaan Anda *</label>
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                className={inputClass}
              >
                <option value={0}>-- Pilih Perusahaan --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          />
          {errors.company_id && <p className={errorClass}>{errors.company_id.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Klien / Customer *</label>
          <Controller
            name="client_id"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                className={inputClass}
              >
                <option value={0}>-- Pilih Klien --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          />
          {errors.client_id && <p className={errorClass}>{errors.client_id.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Tanggal Invoice *</label>
          <input type="date" {...register('invoice_date')} className={inputClass} />
          {errors.invoice_date && <p className={errorClass}>{errors.invoice_date.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Tanggal Jatuh Tempo *</label>
          <input type="date" {...register('due_date')} className={inputClass} />
          {errors.due_date && <p className={errorClass}>{errors.due_date.message}</p>}
        </div>
      </div>
      {/* Payment / Project */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800">
            Pembayaran & Termin
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Gunakan project dan termin jika invoice merupakan bagian dari pembayaran bertahap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Kode Project
            </label>

            <input
              {...register('project_code')}
              placeholder="Contoh: PRJ-20260902-X7K2"
              className={inputClass}
            />

            <p className="text-xs text-gray-400 mt-1">
              Kosongkan jika invoice bukan bagian dari project/termin.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Label Termin
            </label>

            <input
              {...register('installment_label')}
              placeholder="Contoh: Termin 1 — Uang Muka (50%)"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Item / Produk</h3>
          <button
            type="button"
            onClick={() => append({ name: '', quantity: 1, unit: 'pcs', price: 0, total: 0 })}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus size={16} /> Tambah Item
          </button>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nama Item</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium w-24">Qty</th>
                <th className="text-left px-2 py-3 text-gray-600 font-medium w-20">Satuan</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium w-36">Harga Satuan</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium w-36">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                const qty = watchedItems?.[index]?.quantity || 0;
                const price = watchedItems?.[index]?.price || 0;
                const rowTotal = qty * price;
                return (
                  <tr key={field.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">
                      <input
                        {...register(`items.${index}.name`)}
                        placeholder="Nama item / layanan"
                        className={inputClass}
                      />
                      {products.length > 0 && (
                        <select
                          onChange={e => {
                            const p = products.find(p => p.id === Number(e.target.value));
                            if (p) applyProduct(index, p);
                          }}
                          className="mt-1 w-full text-xs border border-gray-100 rounded px-2 py-1 text-gray-500"
                          defaultValue=""
                        >
                          <option value="">Isi dari produk...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        className={`${inputClass} text-right`}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        {...register(`items.${index}.unit`)}
                        className={inputClass}
                        placeholder="pcs"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.price`, { valueAsNumber: true })}
                        className={`${inputClass} text-right`}
                      />
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-gray-800">
                      {formatRupiah(rowTotal)}
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {errors.items && <p className={errorClass}>{errors.items.message}</p>}
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-72 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">PPN</span>
            <input
              type="number"
              {...register('tax_rate', { valueAsNumber: true })}
              className="w-16 border border-gray-200 rounded px-2 py-1 text-sm text-right"
            />
            <span className="text-gray-500">%</span>
            <span className="ml-auto font-medium">{formatRupiah(taxAmount)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Diskon (Rp)</span>
            <input
              type="number"
              {...register('discount', { valueAsNumber: true })}
              className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm text-right"
            />
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Catatan</label>
          <textarea {...register('notes')} rows={3} className={inputClass} placeholder="Catatan tambahan..." />
        </div>
        <div>
          <label className={labelClass}>Syarat & Ketentuan</label>
          <textarea {...register('terms')} rows={3} className={inputClass} />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Invoice'}
        </button>
      </div>
    </form>
  );
}