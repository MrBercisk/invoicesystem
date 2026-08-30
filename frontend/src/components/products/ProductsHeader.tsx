import { Plus } from 'lucide-react';

interface ProductsHeaderProps {
  onAdd: () => void;
}

export default function ProductsHeader({
  onAdd,
}: ProductsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Katalog Produk & Layanan Jasa
        </h1>

        <p className="text-xs text-slate-500 mt-0.5">
          Kelola daftar item jasa, tarif satuan, dan paket
          pekerjaan agar pembuatan invoice otomatis dan instan.
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-all self-start sm:self-auto"
      >
        <Plus size={15} />

        Tambah Item Baru
      </button>

    </div>
  );
}