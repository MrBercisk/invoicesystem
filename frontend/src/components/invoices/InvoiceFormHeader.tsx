import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InvoiceFormHeaderProps {
  isEditing: boolean;
  invoiceNumber?: string;
  isSaving: boolean;
}

export default function InvoiceFormHeader({
  isEditing,
  invoiceNumber,
  isSaving,
}: InvoiceFormHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <Link
          to="/invoices"
          className="p-2 text-slate-600 hover:text-slate-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          aria-label="Kembali ke daftar invoice"
        >
          <ArrowLeft size={16} />
        </Link>

        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isEditing
              ? `Edit Faktur: ${invoiceNumber || ''}`
              : 'Formulir Faktur / Invoice'}
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi profil penerbit, informasi klien,
            rincian biaya, dan syarat pembayaran.
          </p>
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
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50 transition-all"
        >
          <Save size={14} />

          <span>
            {isSaving
              ? 'Menyimpan...'
              : 'Simpan & Lihat Dokumen'}
          </span>
        </button>
      </div>
    </div>
  );
}