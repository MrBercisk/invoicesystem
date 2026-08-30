import type { ImageValue } from './image';
export interface CompanyFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  npwp: string;
  website: string;

  logo?: ImageValue;

  signature_name: string;
  signature_title: string;
  signature?: ImageValue;
  stamp?: ImageValue;

  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
}
