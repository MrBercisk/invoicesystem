import {
  Pencil,
  Trash2,
  Package,
} from 'lucide-react';

import { formatRupiah } from '../../lib/terbilang';

import type { Product } from '../../types';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">
          Memuat katalog...
        </div>
      ) : products.length === 0 ? (
        <ProductEmptyState />
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>

                <th className="py-3 px-4">
                  Nama Barang / Layanan Jasa
                </th>

                <th className="py-3 px-4">
                  Deskripsi
                </th>

                <th className="py-3 px-4 text-center">
                  Satuan
                </th>

                <th className="py-3 px-4 text-right">
                  Harga Satuan
                </th>

                <th className="py-3 px-4 text-right">
                  Aksi
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >

                  <td className="py-3.5 px-4 font-bold text-slate-950">
                    {product.name}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                    {product.description || '-'}
                  </td>

                  <td className="py-3.5 px-4 text-center">

                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {product.unit}
                    </span>

                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950">
                    {formatRupiah(product.price)}
                  </td>

                  <td className="py-3.5 px-4 text-right">

                    <div className="flex items-center justify-end gap-1">

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(product)
                        }
                        className="p-1.5 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(product)
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

function ProductEmptyState() {
  return (
    <div className="p-12 text-center">

      <Package
        size={36}
        className="mx-auto text-slate-300 mb-2.5"
      />

      <div className="text-sm font-bold text-slate-800">
        Katalog masih kosong
      </div>

      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Simpan produk atau paket jasa Anda agar bisa
        langsung dipilih saat membuat faktur.
      </p>

    </div>
  );
}