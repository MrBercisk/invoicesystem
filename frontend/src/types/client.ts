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