import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { receiptsApi, companiesApi, clientsApi, invoicesApi } from '../lib/api';
import type { Company, Client, Invoice, PaymentMethod } from '../types';

const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'transfer', label: 'Transfer Bank' },
  { value: 'tunai', label: 'Tunai' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'lainnya', label: 'Lainnya' },
];

export function ReceiptFormPage() {
  const { id, invoiceId } = useParams<{ id?: string; invoiceId?: string }>();
  const isEdit = Boolean(id);
  const isFromInvoice = Boolean(invoiceId);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sourceInvoice, setSourceInvoice] = useState<Invoice | null>(null);

  const [companyId, setCompanyId] = useState<number | ''>('');
  const [clientId, setClientId] = useState<number | ''>('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [paymentFor, setPaymentFor] = useState('');
  const [notes, setNotes] = useState('');
  const [receivedByName, setReceivedByName] = useState('');
  const [receivedByTitle, setReceivedByTitle] = useState('');

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit || isFromInvoice);

  // Load data pendukung dropdown (hanya perlu untuk mode manual)
  useEffect(() => {
    if (isFromInvoice) return;
    companiesApi.getAll().then(setCompanies);
    clientsApi.getAll().then(setClients);
  }, [isFromInvoice]);

  // Mode edit: load kwitansi yang sudah ada
  useEffect(() => {
    if (!isEdit) return;
    receiptsApi.getOne(Number(id)).then((r) => {
      setCompanyId(r.company_id);
      setClientId(r.client_id);
      setReceiptDate(r.receipt_date.slice(0, 10));
      setAmount(r.amount);
      setPaymentMethod(r.payment_method);
      setPaymentFor(r.payment_for);
      setNotes(r.notes || '');
      setReceivedByName(r.received_by_name || '');
      setReceivedByTitle(r.received_by_title || '');
      setLoading(false);
    });
  }, [id, isEdit]);

  // Mode dari invoice: load invoice untuk auto-fill preview & payment_for
  useEffect(() => {
    if (!isFromInvoice) return;
    invoicesApi.getOne(Number(invoiceId)).then((inv) => {
      if (inv.status !== 'paid') {
        alert('Kwitansi hanya bisa dibuat dari invoice yang sudah berstatus Lunas.');
        navigate(-1);
        return;
      }
      setSourceInvoice(inv);
      setAmount(inv.total);
      const desc = inv.installment_label
        ? `Pembayaran ${inv.installment_label}`
        : `Pelunasan Invoice ${inv.invoice_number}`;
      setPaymentFor(inv.project_code ? `${desc} - Proyek ${inv.project_code}` : desc);
      setReceivedByName(inv.company.signature_name ?? '');
      setReceivedByTitle(inv.company.signature_title ?? '');
      setLoading(false);
    });
  }, [invoiceId, isFromInvoice, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFromInvoice) {
      try {
        setSaving(true);
        const created = await receiptsApi.createFromInvoice(Number(invoiceId), {
          receipt_date: receiptDate,
          amount: amount === '' ? undefined : amount,
          payment_method: paymentMethod,
          notes: notes || undefined,
          received_by_name: receivedByName || undefined,
          received_by_title: receivedByTitle || undefined,
        });
        navigate(`/receipts/${created.id}`);
      } catch (err) {
        console.error(err);
        alert('Gagal membuat kwitansi dari invoice.');
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!companyId || !clientId) {
      alert('Perusahaan dan Klien wajib diisi.');
      return;
    }
    if (!amount || amount <= 0) {
      alert('Jumlah pembayaran wajib diisi.');
      return;
    }
    if (!paymentFor.trim()) {
      alert('Keterangan pembayaran wajib diisi.');
      return;
    }

    const payload = {
      company_id: companyId,
      client_id: clientId,
      receipt_date: receiptDate,
      amount,
      payment_method: paymentMethod,
      payment_for: paymentFor,
      notes,
      received_by_name: receivedByName,
      received_by_title: receivedByTitle,
    };

    try {
      setSaving(true);
      if (isEdit) {
        await receiptsApi.update(Number(id), payload);
        navigate(`/receipts/${id}`);
      } else {
        const created = await receiptsApi.create(payload);
        navigate(`/receipts/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan kwitansi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-zinc-500">Memuat data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-zinc-900">
          {isEdit ? 'Edit Kwitansi' : isFromInvoice ? 'Buat Kwitansi dari Invoice' : 'Buat Kwitansi Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Info Sumber Invoice (read-only, hanya muncul mode dari-invoice) ── */}
        {isFromInvoice && sourceInvoice && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-1">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Dibuat dari Invoice</p>
            <p className="text-sm font-bold text-zinc-900">{sourceInvoice.invoice_number}</p>
            <p className="text-xs text-zinc-600">
              {sourceInvoice.client.name} — Rp {sourceInvoice.total.toLocaleString('id-ID')}
            </p>
          </div>
        )}

        {/* ── Perusahaan & Klien (hanya mode manual) ── */}
        {!isFromInvoice && (
          <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-800">Informasi Dasar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Perusahaan</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Pilih perusahaan</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Klien</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Pilih klien</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Detail Pembayaran ── */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-800">Detail Pembayaran</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Tanggal Kwitansi</label>
              <input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Jumlah Pembayaran</label>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Metode Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {!isFromInvoice && (
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Untuk Pembayaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Pelunasan Termin 2 - Proyek Website"
                  value={paymentFor}
                  onChange={(e) => setPaymentFor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Penerima ── */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-3">
          <h3 className="text-xs font-bold text-zinc-800">Yang Menerima</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nama (kosongkan untuk pakai nama perusahaan)"
              value={receivedByName}
              onChange={(e) => setReceivedByName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Jabatan"
              value={receivedByTitle}
              onChange={(e) => setReceivedByTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* ── Catatan ── */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5">
          <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Catatan</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* ── Submit ── */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <Save size={14} />
            {saving ? 'Menyimpan...' : 'Simpan Kwitansi'}
          </button>
        </div>
      </form>
    </div>
  );
}