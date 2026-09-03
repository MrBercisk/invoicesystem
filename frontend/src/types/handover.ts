//dokumen serah terima
export type HandoverStatus = 'draft' | 'completed' | 'cancelled';
export type HandoverItemType = 'barang' | 'pekerjaan';
import type { Company } from './company';
import type { Client } from './client';
import type { Invoice } from './invoice';

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

  items: HandoverDocumentItem[];

  created_at: string;
  updated_at: string;
}