import type { Company } from './company';
import type { Client } from './client';
import type { Invoice } from './invoice';

export type PaymentMethod =
  | 'transfer'
  | 'tunai'
  | 'ewallet'
  | 'lainnya';

export type ReceiptStatus =
  | 'issued'
  | 'void';

export interface Receipt {
  id: number;
  receipt_number: string;

  company_id: number;
  client_id: number;
  invoice_id?: number;

  company: Company;
  client: Client;
  invoice?: Invoice;

  receipt_date: string;
  amount: number;

  payment_method: PaymentMethod;
  payment_for: string;

  notes?: string;

  received_by_name?: string;
  received_by_title?: string;

  requires_stamp_duty: boolean;
  status: ReceiptStatus;

  amount_in_words: string;

  pdf_url?: string;

  created_at: string;
}