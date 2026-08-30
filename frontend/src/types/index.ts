export interface Company {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  npwp?: string;
  logo?: string;
  signature?: string;
  stamp?: string;
  signer_name?: string;
  signer_title?: string;
  website?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  created_at: string;
}
 
export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  npwp?: string;
  pic_name?: string;
  created_at: string;
}
 
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  unit: string;
}
 
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
 
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled';
 
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
 
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
