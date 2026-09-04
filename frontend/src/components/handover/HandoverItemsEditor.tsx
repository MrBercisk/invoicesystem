import { useState } from 'react';
import { Plus, Trash2, KeyRound, Sparkles, Tag, ChevronDown, ChevronRight } from 'lucide-react';
import type { HandoverDocumentItem, HandoverItemType, HandoverItemMetadata } from '../../types';
import { section, nameColumn, conditionLabel, hasCondition } from '../../lib/itemLabels.generated';

interface Props {
  items: HandoverDocumentItem[];
  onChange: (items: HandoverDocumentItem[]) => void;
  businessType?: string | null;
}

const emptyItem = (type: HandoverItemType): HandoverDocumentItem => ({
  type,
  name: '',
  description: '',
  quantity: 1,
  unit: type === 'barang' ? 'pcs' : '',
  condition: type === 'barang' ? 'Baik' : '',
  notes: '',
  metadata: {},
});

/** Ubah input teks jadi tipe yang paling sesuai (number/boolean/string). */
function coerceMetaValue(raw: string): string | number | boolean | null {
  if (raw === '') return '';
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw.trim() !== '' && !isNaN(Number(raw))) return Number(raw);
  return raw;
}

function metaValueToInput(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function MetadataEditor({
  metadata,
  onChange,
}: {
  metadata: HandoverItemMetadata | null | undefined;
  onChange: (metadata: HandoverItemMetadata) => void;
}) {
  const [open, setOpen] = useState(false);
  const entries = Object.entries(metadata || {});

  const updateEntry = (idx: number, key: string, rawValue: string) => {
    const next = [...entries];
    next[idx] = [key, coerceMetaValue(rawValue)];
    onChange(Object.fromEntries(next));
  };

  const updateKey = (idx: number, newKey: string) => {
    const next = [...entries];
    next[idx] = [newKey, next[idx][1]];
    onChange(Object.fromEntries(next));
  };

  const addEntry = () => {
    onChange({ ...(metadata || {}), '': '' });
  };

  const removeEntry = (idx: number) => {
    const next = entries.filter((_, i) => i !== idx);
    onChange(Object.fromEntries(next));
  };

  return (
    <div className="col-span-12">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-700 cursor-pointer"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Tag size={12} /> Detail tambahan {entries.length > 0 ? `(${entries.length})` : ''}
      </button>

      {open && (
        <div className="mt-2 space-y-1.5">
          {entries.map(([key, value], idx) => (
            <div key={idx} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Nama field (mis. expiry_date, access_url)"
                value={key}
                onChange={(e) => updateKey(idx, e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="Nilai"
                value={metaValueToInput(value)}
                onChange={(e) => updateEntry(idx, key, e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => removeEntry(idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer px-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addEntry}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <Plus size={12} /> Tambah field
          </button>
        </div>
      )}
    </div>
  );
}

export function HandoverItemsEditor({ items, onChange, businessType }: Props) {
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

  const asetItems = items.map((item, idx) => ({ item, idx })).filter(({ item }) => item.type === 'barang');
  const fiturItems = items.map((item, idx) => ({ item, idx })).filter(({ item }) => item.type === 'pekerjaan');

  // Dihitung LIVE dari businessType yang sedang dipilih di form — bukan dari
  // item.section_label (yang hanya terisi setelah item tersimpan di server).
  const asetSectionLabel = section(businessType, 'barang');
  const asetNameLabel = nameColumn(businessType, 'barang');
  const asetConditionLabel = conditionLabel(businessType, 'barang');
  const asetHasCondition = hasCondition(businessType, 'barang');

  const fiturSectionLabel = section(businessType, 'pekerjaan');
  const fiturNameLabel = nameColumn(businessType, 'pekerjaan');

  return (
    <div className="space-y-6">
      {/* ── Aset/Akses (atau Barang/Produk sesuai business_type) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <KeyRound size={14} className="text-zinc-500" />
            {asetSectionLabel}
          </h4>
          <button type="button" onClick={() => addItem('barang')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
            <Plus size={13} /> Tambah {asetNameLabel.replace('Nama ', '')}
          </button>
        </div>

        {asetItems.length === 0 && (
          <p className="text-[11px] text-zinc-400 italic">Belum ada item ditambahkan.</p>
        )}

        {asetItems.map(({ item, idx }) => (
          <div key={idx} className="grid grid-cols-12 gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
            <input
              type="text"
              placeholder={asetNameLabel}
              value={item.name}
              onChange={(e) => updateItem(idx, { name: e.target.value })}
              className={`col-span-12 sm:col-span-4 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500`}
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

            {/* TAMBAHAN: field kondisi hanya muncul kalau hasCondition true,
                label dinamis (mis. "Status" untuk web_dev, "Kondisi" untuk lainnya) */}
            {asetHasCondition && (
              <input
                type="text"
                placeholder={asetConditionLabel || 'Kondisi'}
                value={item.condition || ''}
                onChange={(e) => updateItem(idx, { condition: e.target.value })}
                className="col-span-4 sm:col-span-2 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            )}

            <input
              type="text"
              placeholder="Catatan (opsional)"
              value={item.notes || ''}
              onChange={(e) => updateItem(idx, { notes: e.target.value })}
              className={`col-span-10 ${asetHasCondition ? 'sm:col-span-2' : 'sm:col-span-4'} px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500`}
            />
            <button type="button" onClick={() => removeItem(idx)} className="col-span-2 sm:col-span-1 flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer">
              <Trash2 size={15} />
            </button>

            <MetadataEditor metadata={item.metadata} onChange={(metadata) => updateItem(idx, { metadata })} />
          </div>
        ))}
      </div>

      {/* ── Fitur/Pekerjaan/Jasa Section — tidak pernah punya condition, sesuai ItemLabels ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <Sparkles size={14} className="text-zinc-500" />
            {fiturSectionLabel}
          </h4>
          <button type="button" onClick={() => addItem('pekerjaan')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
            <Plus size={13} /> Tambah {fiturNameLabel.replace('Nama ', '')}
          </button>
        </div>

        {fiturItems.length === 0 && (
          <p className="text-[11px] text-zinc-400 italic">Belum ada item ditambahkan.</p>
        )}

        {fiturItems.map(({ item, idx }) => (
          <div key={idx} className="grid grid-cols-12 gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
            <input
              type="text"
              placeholder={fiturNameLabel}
              value={item.name}
              onChange={(e) => updateItem(idx, { name: e.target.value })}
              className="col-span-12 sm:col-span-5 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              placeholder={`Deskripsi ${fiturNameLabel.replace('Nama ', '').toLowerCase()} yang diselesaikan`}
              value={item.description || ''}
              onChange={(e) => updateItem(idx, { description: e.target.value })}
              rows={1}
              className="col-span-9 sm:col-span-6 px-2.5 py-1.5 text-xs border border-zinc-300 rounded-md outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <button type="button" onClick={() => removeItem(idx)} className="col-span-3 sm:col-span-1 flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer">
              <Trash2 size={15} />
            </button>

            <MetadataEditor metadata={item.metadata} onChange={(metadata) => updateItem(idx, { metadata })} />
          </div>
        ))}
      </div>
    </div>
  );
}