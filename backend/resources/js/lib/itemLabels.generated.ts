// ============================================================
// FILE INI DI-GENERATE OTOMATIS. JANGAN EDIT MANUAL.
// Sumber: App\Support\ItemLabels.php
// Generate ulang dengan: php artisan item-labels:sync-ts
// ============================================================

export const DEFAULT_BUSINESS_TYPE = 'general';

export const ITEM_TYPE_BARANG = 'barang';
export const ITEM_TYPE_PEKERJAAN = 'pekerjaan';

export type ItemType = typeof ITEM_TYPE_BARANG | typeof ITEM_TYPE_PEKERJAAN;

export interface ItemLabelSet {
  section: string;
  name_column: string;
  condition_label: string | null;
}

export type ItemLabelsDict = Record<string, Record<ItemType, ItemLabelSet>>;

export const ITEM_LABELS: ItemLabelsDict = {
  "general": {
    "barang": {
      "section": "Daftar Barang",
      "name_column": "Nama Barang",
      "condition_label": "Kondisi"
    },
    "pekerjaan": {
      "section": "Daftar Pekerjaan",
      "name_column": "Nama Pekerjaan",
      "condition_label": null
    }
  },
  "web_dev": {
    "barang": {
      "section": "Daftar Aset/Akses",
      "name_column": "Nama Aset/Akses",
      "condition_label": "Status"
    },
    "pekerjaan": {
      "section": "Daftar Fitur",
      "name_column": "Nama Fitur",
      "condition_label": null
    }
  },
  "kue": {
    "barang": {
      "section": "Daftar Produk",
      "name_column": "Nama Produk",
      "condition_label": "Kondisi"
    },
    "pekerjaan": {
      "section": "Daftar Jasa",
      "name_column": "Nama Jasa",
      "condition_label": null
    }
  }
} as const;

export function forType(businessType: string | null | undefined, itemType: ItemType): ItemLabelSet {
  const group = (businessType && ITEM_LABELS[businessType]) || ITEM_LABELS[DEFAULT_BUSINESS_TYPE];
  return group[itemType] ?? ITEM_LABELS[DEFAULT_BUSINESS_TYPE][itemType];
}

export function section(businessType: string | null | undefined, itemType: ItemType): string {
  return forType(businessType, itemType).section;
}

export function nameColumn(businessType: string | null | undefined, itemType: ItemType): string {
  return forType(businessType, itemType).name_column;
}

export function conditionLabel(businessType: string | null | undefined, itemType: ItemType): string | null {
  return forType(businessType, itemType).condition_label;
}

export function hasCondition(businessType: string | null | undefined, itemType: ItemType): boolean {
  return conditionLabel(businessType, itemType) !== null;
}

export function availableBusinessTypes(): string[] {
  return Object.keys(ITEM_LABELS);
}