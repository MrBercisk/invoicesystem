export interface Company {
  id: number;
  name: string;

  /**
   * Menentukan kamus label mana yang dipakai untuk item dokumen serah
   * terima — lihat frontend/src/lib/itemLabels.generated.ts (di-generate
   * dari App\Support\ItemLabels.php, jangan diedit manual).
   * Default backend: 'general'.
   */
  business_type: string;

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