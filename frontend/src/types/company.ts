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
  website?: string;

  signature?: string;
  signature_name?: string;
  signature_title?: string;
  stamp?: string;

  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;

  created_at: string;
}