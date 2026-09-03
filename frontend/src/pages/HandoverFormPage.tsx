import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { handoverApi } from '../lib/api';
import { companiesApi, clientsApi, invoicesApi } from '../lib/api';
import type { Company, Client, Invoice, HandoverDocumentItem } from '../types';
import { HandoverItemsEditor } from '../components/handover/HandoverItemsEditor';

export function HandoverFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [companyId, setCompanyId] = useState<number | ''>('');
  const [clientId, setClientId] = useState<number | ''>('');
  const [invoiceId, setInvoiceId] = useState<number | ''>('');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');

  const [handoverByName, setHandoverByName] = useState('');
  const [handoverByTitle, setHandoverByTitle] = useState('');
  const [receivedByName, setReceivedByName] = useState('');
  const [receivedByTitle, setReceivedByTitle] = useState('');

  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(
    'Barang/pekerjaan yang diserahkan telah diperiksa dan diterima dalam kondisi baik oleh pihak penerima.'
  );

  const [items, setItems] = useState<HandoverDocumentItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    companiesApi.getAll().then(setCompanies);
    clientsApi.getAll().then(setClients);
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    handoverApi.getOne(Number(id)).then((doc) => {
      setCompanyId(doc.company_id);
      setClientId(doc.client_id);
      setInvoiceId(doc.invoice_id || '');
      setDocumentDate(doc.document_date.slice(0, 10));
      setLocation(doc.location || '');
      setHandoverByName(doc.handover_by_name || '');
      setHandoverByTitle(doc.handover_by_title || '');
      setReceivedByName(doc.received_by_name || '');
      setReceivedByTitle(doc.received_by_title || '');
      setNotes(doc.notes || '');
      setTerms(doc.terms || '');
      setItems(doc.items);
      setLoading(false);
    });
  }, [id, isEdit]);

  // Load invoice list berdasarkan client yang dipilih (opsional, untuk kaitkan ke invoice)
  useEffect(() => {
    if (!clientId) {
      setInvoices([]);
      return;
    }
    invoicesApi.getAll({}).then((res) => {
      setInvoices(res.data.filter((inv) => inv.client_id === clientId));
    });
  }, [clientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId || !clientId) {
      alert('Perusahaan dan Klien wajib diisi.');
      return;
    }
    if (items.length === 0) {
        alert('Tambahkan minimal 1 aset/akses atau fitur.');
        return;
    }

    const payload = {
      company_id: companyId,
      client_id: clientId,
      invoice_id: invoiceId || null,
      document_date: documentDate,
      location,
      handover_by_name: handoverByName,
      handover_by_title: handoverByTitle,
      received_by_name: receivedByName,
      received_by_title: receivedByTitle,
      notes,
      terms,
      items,
    };

    try {
      setSaving(true);
      if (isEdit) {
        await handoverApi.update(Number(id), payload);
      } else {
        const created = await handoverApi.create(payload);
        navigate(`/handover-documents/${created.id}`);
        return;
      }
      navigate(`/handover-documents/${id}`);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan dokumen serah terima.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-zinc-500">Memuat data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-zinc-900">
          {isEdit ? 'Edit Dokumen Serah Terima' : 'Buat Dokumen Serah Terima'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Info Dasar ── */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-800">Informasi Dokumen</h3>

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

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                Kaitkan ke Invoice <span className="text-zinc-400 font-normal">(opsional)</span>
              </label>
              <select
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
                disabled={!clientId}
              >
                <option value="">Tidak dikaitkan</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.invoice_number}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Tanggal Serah Terima</label>
              <input
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Lokasi Serah Terima</label>
              <input
                type="text"
                placeholder="Contoh: Kantor Klien, Jakarta"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* ── Daftar Item ── */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5">
          <HandoverItemsEditor items={items} onChange={setItems} />
        </div>

        {/* ── Pihak Serah Terima ── */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-800">Pihak yang Terlibat</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Yang Menyerahkan</p>
              <input
                type="text"
                placeholder="Nama (kosongkan untuk pakai nama perusahaan)"
                value={handoverByName}
                onChange={(e) => setHandoverByName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="Jabatan"
                value={handoverByTitle}
                onChange={(e) => setHandoverByTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Yang Menerima</p>
              <input
                type="text"
                placeholder="Nama (kosongkan untuk pakai nama klien)"
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
        </div>

        {/* ── Catatan & Ketentuan ── */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Catatan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Syarat & Ketentuan</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
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
            {saving ? 'Menyimpan...' : 'Simpan Dokumen'}
          </button>
        </div>
      </form>
    </div>
  );
}