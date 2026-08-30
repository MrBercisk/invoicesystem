import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Building2, 
  Users, 
  Package, 
  Calculator, 
  FileCheck2
} from 'lucide-react';
import { invoicesApi, companiesApi, clientsApi, productsApi } from '../lib/api';
import { formatRupiah, terbilang } from '../lib/terbilang';
import type { InvoiceItem } from '../types';

interface FormData {
  company_id: number;
  client_id: number;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  tax_rate: number;
  discount: number;
  notes?: string;
  terms?: string;
  items: {
    product_id?: number;
    name: string;
    description?: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
}

export function InvoiceFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getAll(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: existingInvoice, isLoading: loadingExisting } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => (id ? invoicesApi.getOne(Number(id)) : null),
    enabled: isEditing,
  });

  const today = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0];

  const { register, control, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      company_id: companies[0]?.id || 1,
      client_id: clients[0]?.id || 1,
      invoice_date: today,
      due_date: defaultDueDate,
      status: 'draft',
      tax_rate: 11,
      discount: 0,
      notes: 'Pembayaran dapat ditransfer ke rekening bank tertera. Harap sertakan nomor invoice pada berita transfer.',
      terms: 'Jatuh tempo pembayaran adalah 14 hari sejak invoice diterbitkan.',
      items: [
        { name: '', description: '', quantity: 1, unit: 'paket', price: 0 }
      ],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (existingInvoice) {
      reset({
        company_id: existingInvoice.company_id,
        client_id: existingInvoice.client_id,
        invoice_date: existingInvoice.invoice_date,
        due_date: existingInvoice.due_date,
        status: existingInvoice.status,
        tax_rate: existingInvoice.tax_rate,
        discount: existingInvoice.discount,
        notes: existingInvoice.notes || '',
        terms: existingInvoice.terms || '',
        items: existingInvoice.items.map(item => ({
          product_id: item.product_id,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          unit: item.unit || 'pcs',
          price: item.price,
        })),
      });
    } else if (companies.length > 0 && !watch('company_id')) {
      setValue('company_id', companies[0].id);
    }
  }, [existingInvoice, companies, reset, setValue, watch]);

  const watchedItems = watch('items') || [];
  const watchedTaxRate = Number(watch('tax_rate')) || 0;
  const watchedDiscount = Number(watch('discount')) || 0;

  const subtotal = watchedItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const prc = Number(item.price) || 0;
    return acc + (qty * prc);
  }, 0);

  const taxAmount = subtotal * (watchedTaxRate / 100);
  const total = Math.max(0, subtotal + taxAmount - watchedDiscount);

  const saveMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        company_id: Number(data.company_id),
        client_id: Number(data.client_id),
        tax_rate: Number(data.tax_rate) || 0,
        discount: Number(data.discount) || 0,
        items: data.items.map(i => ({
          ...i,
          quantity: Number(i.quantity) || 1,
          price: Number(i.price) || 0,
          total: (Number(i.quantity) || 1) * (Number(i.price) || 0),
        })) as InvoiceItem[],
      };
      if (isEditing && id) {
        return invoicesApi.update(Number(id), payload);
      }
      return invoicesApi.create(payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      navigate(`/invoices/${res.id}`);
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.items.length === 0) {
      alert('Minimal harus ada 1 item dalam invoice');
      return;
    }
    saveMutation.mutate(data);
  };

  const handleProductSelect = (index: number, productId: number) => {
    const selected = products.find(p => p.id === Number(productId));
    if (selected) {
      setValue(`items.${index}.product_id`, selected.id);
      setValue(`items.${index}.name`, selected.name);
      setValue(`items.${index}.description`, selected.description || '');
      setValue(`items.${index}.price`, selected.price);
      setValue(`items.${index}.unit`, selected.unit || 'pcs');
    }
  };

  if (isEditing && loadingExisting) {
    return <div className="p-12 text-center text-xs text-slate-400 font-medium">Memuat data faktur...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/invoices"
            className="p-2 text-slate-600 hover:text-slate-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? `Edit Faktur: ${existingInvoice?.invoice_number}` : 'Formulir Faktur / Invoice'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Lengkapi profil penerbit, informasi klien, rincian biaya, dan syarat pembayaran.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/invoices"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50 transition-all"
          >
            <Save size={14} />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan & Lihat Dokumen'}</span>
          </button>
        </div>
      </div>

      {/* ── Section 1: Entitas & Tanggal ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Perusahaan Penerbit */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
            <Building2 size={15} className="text-slate-700" />
            <span>Perusahaan Penerbit</span>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pilih Profil Usaha</label>
            <select
              {...register('company_id', { required: true, valueAsNumber: true })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>Logo & Rekening terisi otomatis</span>
              <Link to="/companies" className="text-slate-900 hover:underline font-semibold">Kelola</Link>
            </div>
          </div>
        </div>

        {/* Klien Ditagih */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
            <Users size={15} className="text-slate-700" />
            <span>Klien Tujuan</span>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pilih Klien / Perusahaan</label>
            <select
              {...register('client_id', { required: true, valueAsNumber: true })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.city ? `(${c.city})` : ''}
                </option>
              ))}
            </select>
            <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>Alamat & NPWP klien otomatis terisi</span>
              <Link to="/clients" className="text-slate-900 hover:underline font-semibold">Kelola</Link>
            </div>
          </div>
        </div>

        {/* Parameter Tanggal & Status */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
            <FileCheck2 size={15} className="text-slate-700" />
            <span>Parameter Faktur</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1 uppercase">Tgl. Terbit</label>
              <input
                type="date"
                {...register('invoice_date')}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1 uppercase">Jatuh Tempo</label>
              <input
                type="date"
                {...register('due_date')}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1 uppercase">Status Awal</label>
            <select
              {...register('status')}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="draft">Draft (Konsep)</option>
              <option value="sent">Sent (Terkirim)</option>
              <option value="paid">Paid (Lunas)</option>
              <option value="cancelled">Cancelled (Batal)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Section 2: Line Items ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
            <Package size={15} className="text-slate-700" />
            <span>Rincian Barang & Jasa</span>
          </div>
          <button
            type="button"
            onClick={() => append({ name: '', description: '', quantity: 1, unit: 'pcs', price: 0 })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus size={13} /> Tambah Baris
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {fields.map((field, index) => {
            const qty = Number(watchedItems[index]?.quantity) || 0;
            const prc = Number(watchedItems[index]?.price) || 0;
            const rowTotal = qty * prc;

            return (
              <div
                key={field.id}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
                  {/* Quick Catalog Autocomplete */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                      Katalog Produk (Opsional)
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleProductSelect(index, Number(e.target.value));
                      }}
                      className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-slate-700"
                      defaultValue=""
                    >
                      <option value="">-- Pilih dari katalog --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatRupiah(p.price)}/{p.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                      Nama Item / Uraian Pekerjaan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pembuatan Website E-Commerce"
                      {...register(`items.${index}.name` as const, { required: true })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* Row Total display */}
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-3 pt-4">
                    <div className="text-right">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Subtotal Item</div>
                      <div className="text-xs font-bold font-mono text-slate-950">{formatRupiah(rowTotal)}</div>
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus baris"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  {/* Description */}
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Deskripsi tambahan atau catatan spesifikasi..."
                      {...register(`items.${index}.description` as const)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-slate-600"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium w-7">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        placeholder="1"
                        {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-right font-mono font-medium"
                      />
                    </div>
                  </div>

                  {/* Unit */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium w-7">Sat:</span>
                      <input
                        type="text"
                        placeholder="pcs"
                        {...register(`items.${index}.unit` as const)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium w-7">Rp:</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register(`items.${index}.price` as const, { valueAsNumber: true })}
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 text-right font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 3: Totals & Terbilang Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Notes & Terms */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Catatan Tambahan (Notes)</label>
            <textarea
              rows={2}
              {...register('notes')}
              placeholder="Catatan untuk klien..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Syarat & Ketentuan (Terms & Conditions)</label>
            <textarea
              rows={2}
              {...register('terms')}
              placeholder="Ketentuan garansi, jatuh tempo..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Terbilang Live Preview */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[9px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
              Teks Terbilang Otomatis (Rupiah)
            </div>
            <div className="text-xs font-medium text-slate-900 italic font-serif-invoice">
              # {terbilang(total)} #
            </div>
          </div>
        </div>

        {/* Calculation Box */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
            <Calculator size={15} className="text-slate-700" />
            <span>Perhitungan Total</span>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Subtotal Barang/Jasa</span>
            <span className="font-mono font-medium text-slate-900">{formatRupiah(subtotal)}</span>
          </div>

          {/* Pajak PPN */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>PPN (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register('tax_rate', { valueAsNumber: true })}
                className="w-14 text-center text-xs bg-slate-50 border border-slate-200 rounded-md py-1 font-mono font-medium"
              />
            </div>
            <span className="font-mono font-medium text-slate-900">{formatRupiah(taxAmount)}</span>
          </div>

          {/* Diskon */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Potongan Diskon (Rp)</span>
            </div>
            <input
              type="number"
              min="0"
              placeholder="0"
              {...register('discount', { valueAsNumber: true })}
              className="w-28 text-right text-xs bg-slate-50 border border-slate-200 rounded-md p-1 font-mono font-medium"
            />
          </div>

          {/* Grand Total */}
          <div className="pt-3 border-t border-slate-900 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-900 uppercase">Total Tagihan</span>
            <span className="text-lg font-extrabold font-mono text-slate-950">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>
    </form>
  );
}
