import type { InvoiceStatus } from './invoice';

export interface InvoiceFormItem {
  product_id?: number;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface InvoiceFormData {
  company_id: number;
  client_id: number;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  tax_rate: number;
  discount: number;
  notes?: string;
  terms?: string;
  items: InvoiceFormItem[];
}