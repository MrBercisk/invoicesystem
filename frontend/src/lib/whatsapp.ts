import type { Invoice } from '../types';

export type WhatsAppTemplateType = 'standard' | 'reminder' | 'receipt' | 'short';

export type InstallmentStage = 'dp' | 'progress' | 'final';

export interface WhatsAppMessageOptions {
  templateType?: WhatsAppTemplateType;
  customPhone?: string;
  includeBankInfo?: boolean;
  /**
   * Override eksplisit tahap termin. Berguna kalau `installment_label` di invoice
   * tidak cukup jelas untuk dideteksi otomatis, atau kalau UI sudah tahu pasti
   * (misal: ini invoice pertama project -> 'dp', ini invoice terakhir -> 'final').
   */
  installmentStage?: InstallmentStage;
  /**
   * Nilai total kontrak project. Dipakai untuk menghitung sisa tagihan pada
   * invoice DP/termin (project_total_value - total invoice ini).
   * Kalau tidak diisi, akan fallback ke invoice.project_total_value (kalau ada).
   */
  projectTotalValue?: number;
  /**
   * Link publik ke PDF invoice (misal invoice.pdf_url dari backend). Kalau diisi,
   * link ini akan disisipkan ke pesan WhatsApp supaya penerima bisa langsung
   * buka/cetak PDF-nya.
   */
  pdfUrl?: string;
}

/**
 * Format Indonesian phone number into clean WhatsApp international format (e.g. 6281234567890)
 */
export function formatWhatsAppPhone(phone?: string): string {
  if (!phone) return '';
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }

  if (!cleaned.startsWith('62') && cleaned.length > 5) {
    // If not starting with country code, assume Indonesian 62 if 9-13 digits
    cleaned = '62' + cleaned;
  }

  return cleaned;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return d;
  }
};

/**
 * Coba deteksi tahap termin dari data invoice, kalau tidak di-override lewat options.
 * Deteksi berbasis kata kunci di installment_label — sebaiknya tetap dianggap
 * sebagai fallback/nyaman saja; kalau UI kamu sudah tahu pasti tahapnya
 * (misal dari urutan invoice di project), lebih baik kirim `installmentStage` eksplisit.
 */
function resolveInstallmentStage(
  invoice: Invoice,
  options: WhatsAppMessageOptions,
): InstallmentStage | null {
  if (options.installmentStage) return options.installmentStage;

  const label = (invoice.installment_label || '').toLowerCase();

  if (!label && !invoice.project_code) return null;

  if (
    label.includes('lunas') ||
    label.includes('pelunasan') ||
    label.includes('akhir') ||
    label.includes('final')
  ) {
    return 'final';
  }

  if (
    label.includes('dp') ||
    label.includes('uang muka') ||
    label.includes('awal') ||
    label.includes('termin 1')
  ) {
    return 'dp';
  }

  // Ada project_code / installment_label tapi polanya tidak terdeteksi jelas
  // -> anggap termin di tengah (bukan DP, bukan pelunasan final)
  return 'progress';
}

/**
 * Build clean formatted text for WhatsApp message
 */
export function generateWhatsAppMessage(invoice: Invoice, options: WhatsAppMessageOptions = {}): string {
  const { templateType = 'standard', includeBankInfo = true, pdfUrl } = options;

  const clientName = invoice.client?.name || 'Bapak/Ibu';
  const companyName = invoice.company?.name || 'Perusahaan';
  const invoiceNumber = invoice.invoice_number;
  const invDate = formatDate(invoice.invoice_date);
  const dueDate = formatDate(invoice.due_date);
  const totalStr = formatRupiah(invoice.total);

  const stage = resolveInstallmentStage(invoice, options);
  const projectTotal = options.projectTotalValue ?? invoice.project_total_value ?? undefined;
  const projectLine = invoice.project_code ? `\n- Project: ${invoice.project_code}` : '';

  // Blok link PDF, dipakai di semua template kalau pdfUrl tersedia
  const pdfBlock = pdfUrl ? `\n\nLihat / Cetak Invoice (PDF):\n${pdfUrl}` : '';
  const pdfBlockShort = pdfUrl ? `\n\nCetak/lihat PDF: ${pdfUrl}` : '';

  // Bank Account Info block
  let bankBlock = '';
  if (includeBankInfo && (invoice.company?.bank_name || invoice.company?.bank_account_number)) {
    bankBlock = `\nInformasi Rekening Pembayaran:
- Bank: ${invoice.company.bank_name || '-'}
- No. Rekening: ${invoice.company.bank_account_number || '-'}
- Atas Nama: ${invoice.company.bank_account_name || invoice.company.name}`;
  }

  // Items breakdown summary (max 4 items for readability)
  const itemsList = invoice.items && invoice.items.length > 0 
    ? invoice.items.slice(0, 4).map((it, idx) => `  ${idx + 1}. ${it.name || it.description || 'Item'} (${it.quantity} ${it.unit || 'x'}) = ${formatRupiah(it.total)}`).join('\n')
    : '';
  const itemSummary = itemsList ? `\n\n Ringkasan Tagihan:\n${itemsList}${invoice.items.length > 4 ? `\n  ...dan ${invoice.items.length - 4} item lainnya` : ''}` : '';

  switch (templateType) {
    case 'reminder': {
      const stageNote =
        stage === 'dp'
          ? '\n\nCatatan: Ini adalah tagihan uang muka (DP) untuk memulai project. Sisa pembayaran akan ditagihkan terpisah setelah project selesai.'
          : stage === 'final'
          ? '\n\nCatatan: Ini adalah tagihan pelunasan akhir. Setelah pembayaran ini diterima, project dinyatakan selesai secara penuh.'
          : '';

      return `Halo Yth. ${clientName},

Semoga Anda selalu dalam keadaan sehat dan lancar dalam menjalankan aktivitas.

Kami ingin menginformasikan pengingat tagihan faktur dari ${companyName} dengan rincian sebagai berikut:

No. Faktur: ${invoiceNumber}${projectLine}
Tanggal Faktur: ${invDate}
Jatuh Tempo: ${dueDate}
Total Tagihan: ${totalStr}${itemSummary}${bankBlock}${stageNote}${pdfBlock}

Mohon dapat melakukan konfirmasi apabila pembayaran telah dilakukan. Jika ada pertanyaan mengenai faktur ini, silakan hubungi kami.

Terima kasih banyak atas kerja sama yang baik!
${companyName}`;
    }

    case 'receipt': {
      const paidDate = formatDate(new Date().toISOString());

      // Bukan bagian dari project bertermin -> pembayaran penuh, perilaku lama
      if (!stage) {
        return `Halo Yth. ${clientName},

Terima kasih banyak! Pembayaran untuk invoice berikut telah kami terima dan berstatus LUNAS:

- No. Invoice: ${invoiceNumber}
- Tanggal Pelunasan: ${paidDate}
- Jumlah Diterima: ${totalStr}
- Status: LUNAS / PAID${pdfBlock}

Bukti penerimaan ini diterbitkan secara sah oleh ${companyName}.

Terima kasih atas kepercayaan dan kerja sama Anda bersama kami! 🙏
${companyName}`;
      }

      // Pelunasan akhir -> project selesai 100%
      if (stage === 'final') {
        return `Halo Yth. ${clientName},

Terima kasih banyak! Pembayaran pelunasan untuk invoice berikut telah kami terima:

- No. Invoice: ${invoiceNumber}${projectLine}
- Tanggal Pelunasan: ${paidDate}
- Jumlah Diterima: ${totalStr}
- Status: LUNAS 100% — Project Selesai${pdfBlock}

Dengan diterimanya pembayaran ini, seluruh nilai project telah dilunasi secara penuh. Hasil akhir pekerjaan akan segera kami serahkan sesuai kesepakatan yang telah disetujui bersama.

Bukti penerimaan ini diterbitkan secara sah oleh ${companyName}.

Terima kasih atas kepercayaan dan kerja sama Anda bersama kami selama project ini berlangsung! 🙏
${companyName}`;
      }

      // DP / termin di tengah -> belum lunas total project
      const remaining =
        projectTotal !== undefined ? Math.max(0, projectTotal - invoice.total) : undefined;

      const remainingBlock =
        remaining !== undefined
          ? `\n- Sisa Tagihan Project: ${formatRupiah(remaining)} (akan ditagihkan melalui invoice pelunasan setelah project selesai)`
          : '\n- Sisa tagihan akan kami sampaikan melalui invoice pelunasan setelah project selesai.';

      const stageLabel = stage === 'dp' ? 'Uang Muka (DP)' : 'termin';

      return `Halo Yth. ${clientName},

Terima kasih banyak! Pembayaran ${stageLabel} untuk invoice berikut telah kami terima:

- No. Invoice: ${invoiceNumber}${projectLine}
- Tanggal Diterima: ${paidDate}
- Jumlah Diterima: ${totalStr}
- Status: DITERIMA (belum pelunasan akhir)${remainingBlock}${pdfBlock}

Pengerjaan project akan berjalan sesuai kesepakatan. Kami akan mengirimkan invoice pelunasan setelah project selesai dikerjakan.

Terima kasih atas kepercayaan dan kerja sama Anda! 🙏
${companyName}`;
    }

    case 'short': {
      const stageTag = stage === 'dp' ? ' (DP)' : stage === 'final' ? ' (Pelunasan)' : '';
      return `Halo Yth. ${clientName}, berikut tagihan faktur ${invoiceNumber}${stageTag} dari ${companyName}.
Total: ${totalStr} (Jatuh Tempo: ${dueDate}).${bankBlock}${pdfBlockShort}

Terima kasih! 🙏`;
    }

    case 'standard':
    default: {
      const stageHeader =
        stage === 'dp'
          ? '📄 *FAKTUR UANG MUKA (DP)*'
          : stage === 'final'
          ? '📄 *FAKTUR PELUNASAN*'
          : stage === 'progress'
          ? '📄 *FAKTUR TERMIN*'
          : '📄 *FAKTUR PENAGIHAN*';

      const pdfLine = pdfUrl
        ? `\n\nDokumen tagihan resmi dapat diunduh/dicetak melalui link berikut:\n${pdfUrl}`
        : '\n\nDokumen tagihan resmi dapat diakses dan diunduh dalam bentuk PDF.';

      return `Kepada Yth.
${clientName}

Berikut kami sampaikan rincian tagihan faktur dari ${companyName}:

━━━━━━━━━━━━━━━━━━━━
${stageHeader}
━━━━━━━━━━━━━━━━━━━━
- No. Faktur : ${invoiceNumber}${projectLine ? `\n• Project     : ${invoice.project_code}` : ''}
- Tanggal     : ${invDate}
- Jatuh Tempo : ${dueDate}
- Total Bayar : ${totalStr}${itemSummary}${bankBlock}${pdfLine}

Mohon konfirmasi apabila pembayaran telah selesai diproses.

Terima kasih atas kerja sama dan kepercayaan Anda.

Hormat kami,
${companyName}`;
    }
  }
}

/**
 * Generate click-to-chat WhatsApp direct URL
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}