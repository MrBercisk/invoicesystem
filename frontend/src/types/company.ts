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