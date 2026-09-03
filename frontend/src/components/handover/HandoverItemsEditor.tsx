import { Plus, Trash2, KeyRound, Sparkles } from 'lucide-react';
import type { HandoverDocumentItem, HandoverItemType } from '../../types';

interface Props {
  items: HandoverDocumentItem[];
  onChange: (items: HandoverDocumentItem[]) => void;
}

const emptyItem = (type: HandoverItemType): HandoverDocumentItem => ({
  type,
  name: '',
  description: '',
  quantity: 1,
  unit: type === 'barang' ? 'pcs' : '',
  condition: type === 'barang' ? 'Baik' : '',
  notes: '',
});

export function HandoverItemsEditor({ items, onChange }: Props) {
  const addItem = (type: HandoverItemType) => {
    onChange([...items, emptyItem(type)]);
  };

  const updateItem = (index: number, patch: Partial<HandoverDocumentItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const asetItems = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.type === 'barang');

  const fiturItems = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.type === 'pekerjaan');

  return (
    <div className="space-y-6">
      {/* ── Aset/Akses Section ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <KeyRound size={14} className="text-zinc-500" />
            Daftar Aset / Akses
          </h4>
          <button
            type="button"
            onClick={() => addItem('barang')}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <Plus size={13} /> Tambah Aset/Akses
          </button>
        </div>

        {asetItems.length === 0 && (
          <p className="text-[11px] text-zinc-400 italic">Belum ada aset/akses ditambahkan.</p>
        )}

        {asetItems.map(({ item, idx }) => (
          <div key={idx} className="grid grid-cols-12 gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
            <input
              type="text"
              placeholder="Nama aset/akses (misal: Domain, Hosting, Source Code)"
              value={item.name}
              onChange={(e) => updateItem(idx, { name: e.target.value })}
              className="col-span-12 sm:col-span-4 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              placeholder="Qty"
              min={0}
              value={item.quantity}
              onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
              className="col-span-4 sm:col-span-1 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Satuan"
              value={item.unit || ''}
              onChange={(e) => updateItem(idx, { unit: e.target.value })}
              className="col-span-4 sm:col-span-2 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Kondisi (Baik/Rusak)"
              value={item.condition || ''}
              onChange={(e) => updateItem(idx, { condition: e.target.value })}
              className="col-span-4 sm:col-span-2 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Catatan (opsional)"
              value={item.notes || ''}
              onChange={(e) => updateItem(idx, { notes: e.target.value })}
              className="col-span-10 sm:col-span-2 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="col-span-2 sm:col-span-1 flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Fitur Section ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <Sparkles size={14} className="text-zinc-500" />
            Daftar Fitur
          </h4>
          <button
            type="button"
            onClick={() => addItem('pekerjaan')}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <Plus size={13} /> Tambah Fitur
          </button>
        </div>

        {fiturItems.length === 0 && (
          <p className="text-[11px] text-zinc-400 italic">Belum ada fitur ditambahkan.</p>
        )}

        {fiturItems.map(({ item, idx }) => (
          <div key={idx} className="grid grid-cols-12 gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
            <input
              type="text"
              placeholder="Nama fitur (misal: Login, Dashboard, Payment Gateway)"
              value={item.name}
              onChange={(e) => updateItem(idx, { name: e.target.value })}
              className="col-span-12 sm:col-span-5 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              placeholder="Deskripsi fitur yang diselesaikan"
              value={item.description || ''}
              onChange={(e) => updateItem(idx, { description: e.target.value })}
              rows={1}
              className="col-span-9 sm:col-span-6 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="col-span-3 sm:col-span-1 flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}