import type { ReceiptStatus, PaymentMethod } from './receipt';

export interface ReceiptFormData {
  company_id: number;
  client_id: number;
  invoice_id?: number;

  receipt_date: string;
  amount: number;

  payment_method: PaymentMethod;
  payment_for: string;

  notes?: string;

  received_by_name?: string;
  received_by_title?: string;

  requires_stamp_duty?: boolean;
  status?: ReceiptStatus;
}

// Form khusus untuk generate kwitansi langsung dari invoice yang sudah lunas
// — field lebih sedikit karena sebagian besar di-auto-fill backend dari invoice.
export interface ReceiptFromInvoiceFormData {
  receipt_date?: string;
  amount?: number;
  payment_method?: PaymentMethod;
  notes?: string;
  received_by_name?: string;
  received_by_title?: string;
}