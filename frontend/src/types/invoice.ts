import type { Company } from './company';
import type { Client } from './client';

export interface InvoiceItem {
  id?: number;
  product_id?: number;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'cancelled';

export interface Invoice {
  id: number;
  invoice_number: string;

  company_id: number;
  client_id: number;

  company: Company;
  client: Client;

  items: InvoiceItem[];

  invoice_date: string;
  due_date: string;

  status: InvoiceStatus;

  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;

  notes?: string;
  terms?: string;

  created_at: string;
}