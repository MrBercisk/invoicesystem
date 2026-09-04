// dokumen serah terima
export type HandoverStatus = 'draft' | 'completed' | 'cancelled';
export type HandoverItemType = 'barang' | 'pekerjaan';

import type { Company } from './company';
import type { Client } from './client';
import type { Invoice } from './invoice';

/**
 * Field spesifik-bisnis yang sifatnya opsional & berubah-ubah
 * (expiry_date, access_url, demo_url, berat, dst), disimpan sebagai JSON
 * di kolom `metadata`. Value bisa string/number/boolean/null saja —
 * hindari nested object/array supaya gampang di-render generic di form.
 */
export type HandoverItemMetadata = Record<string, string | number | boolean | null>;

export interface HandoverDocumentItem {
  id?: number;
  handover_document_id?: number;
  type: HandoverItemType;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;
  condition?: string;
  notes?: string;
  sort_order?: number;
  metadata?: HandoverItemMetadata | null;
  section_label?: string;
  name_column_label?: string;
  condition_label?: string | null;
  has_condition?: boolean;
}

export interface HandoverDocument {
  id: number;
  document_number: string;

  company_id: number;
  client_id: number;
  invoice_id?: number | null;

  company: Company;
  client: Client;
  invoice?: Invoice | null;

  document_date: string;
  location?: string;
  status: HandoverStatus;

  handover_by_name?: string;
  handover_by_title?: string;
  received_by_name?: string;
  received_by_title?: string;

  notes?: string;
  terms?: string;

  /** Jumlah hari garansi sejak document_date. Null/undefined = tidak ada garansi. */
   warranty_days?: number | null;

  // Derived dari backend (accessor $appends di HandoverDocument model)
  warranty_expires_at?: string | null;
  is_under_warranty?: boolean;

  items: HandoverDocumentItem[];

  created_at: string;
  updated_at: string;
}