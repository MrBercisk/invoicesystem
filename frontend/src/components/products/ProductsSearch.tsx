import { Search } from 'lucide-react';

interface ProductsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductsSearch({
  value,
  onChange,
}: ProductsSearchProps) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs">

      <div className="relative max-w-md">

        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Cari nama produk, jasa, atau satuan..."
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
        />

      </div>

    </div>
  );
}