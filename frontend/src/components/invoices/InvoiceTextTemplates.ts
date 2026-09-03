export type TemplateScope = 'full' | 'installment' | 'any';

export interface NotesTermsTemplate {
  id: string;
  label: string;
  scope: TemplateScope;
  notes: string;
  terms: string;
}

export const notesTermsTemplates: NotesTermsTemplate[] = [
  // ── Pembayaran Penuh ──────────────────────────────────────────────
  {
    id: 'full-standard',
    label: 'Pembayaran Penuh — Standar',
    scope: 'full',
    notes:
      'Pembayaran dapat ditransfer ke rekening bank tertera. Harap sertakan nomor invoice pada berita transfer.',
    terms:
      'Jatuh tempo pembayaran adalah 14 hari sejak invoice diterbitkan.',
  },
  {
    id: 'full-cod',
    label: 'Pembayaran Penuh — Tunai di Tempat',
    scope: 'full',
    notes:
      'Pembayaran dilakukan secara tunai / transfer pada saat barang atau jasa diserahkan.',
    terms:
      'Barang atau jasa akan diserahkan setelah pembayaran diterima secara penuh.',
  },

  // ── Termin / Cicilan Project ──────────────────────────────────────
  {
    id: 'installment-dp-50',
    label: 'Termin — Uang Muka 50% (Skema 50/50)',
    scope: 'installment',
    notes:
      'Invoice ini merupakan pembayaran uang muka (DP) sebesar 50% dari total nilai project untuk memulai pengerjaan. Sisa pembayaran sebesar 50% akan ditagihkan melalui invoice pelunasan setelah project selesai dikerjakan.',
    terms:
      'Pengerjaan project akan dimulai setelah uang muka 50% diterima. Pelunasan 50% sisanya wajib dibayarkan sebelum hasil akhir project diserahkan sepenuhnya.',
  },
  {
    id: 'installment-final-50',
    label: 'Termin — Pelunasan 50% (Project Selesai)',
    scope: 'installment',
    notes:
      'Invoice ini merupakan pelunasan sisa pembayaran sebesar 50% dari total nilai project. Setelah pembayaran ini diterima, project dinyatakan LUNAS 100% dan seluruh nilai kontrak telah terbayar.',
    terms:
      'Hasil akhir pekerjaan (source code, aset, atau dokumen serah terima) akan diserahkan sepenuhnya setelah pelunasan 50% ini diterima dan project dinyatakan selesai.',
  },
  {
    id: 'installment-dp',
    label: 'Termin — Uang Muka (DP)',
    scope: 'installment',
    notes:
      'Invoice ini merupakan pembayaran uang muka (DP) untuk memulai pengerjaan project. Sisa pembayaran akan ditagihkan pada termin berikutnya sesuai progres pekerjaan.',
    terms:
      'Pengerjaan project akan dimulai setelah uang muka diterima. Pelunasan dilakukan sesuai jadwal termin yang telah disepakati sebelum hasil akhir diserahkan.',
  },
  {
    id: 'installment-progress',
    label: 'Termin — Pembayaran Bertahap (Progress)',
    scope: 'installment',
    notes:
      'Invoice ini merupakan pembayaran termin sesuai progres pengerjaan project yang telah disepakati. Rincian termin dapat dilihat pada bagian informasi project di atas.',
    terms:
      'Pembayaran termin ini wajib dilunasi sebelum pengerjaan dilanjutkan ke tahap berikutnya.',
  },
  {
    id: 'installment-final',
    label: 'Termin — Pelunasan Akhir',
    scope: 'installment',
    notes:
      'Invoice ini merupakan pelunasan sisa pembayaran project. Setelah pembayaran ini diterima, seluruh nilai kontrak project dinyatakan lunas.',
    terms:
      'Hasil akhir pekerjaan (source code, aset, atau dokumen serah terima) akan diserahkan sepenuhnya setelah pelunasan diterima.',
  },

  // ── Umum, berlaku untuk keduanya ──────────────────────────────────
  {
    id: 'any-revision',
    label: 'Tambahan — Ketentuan Revisi',
    scope: 'any',
    notes:
      'Invoice ini sudah termasuk ketentuan revisi sesuai kesepakatan awal.',
    terms:
      'Revisi di luar cakupan yang disepakati akan dikenakan biaya tambahan sesuai kesepakatan lebih lanjut.',
  },
];

export function getTemplatesForScope(
  isInstallment: boolean,
): NotesTermsTemplate[] {
  return notesTermsTemplates.filter(
    (template) =>
      template.scope === 'any' ||
      template.scope === (isInstallment ? 'installment' : 'full'),
  );
}