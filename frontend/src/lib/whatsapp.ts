import type { Invoice } from '../types';

export type WhatsAppTemplateType = 'standard' | 'reminder' | 'receipt' | 'short';

export interface WhatsAppMessageOptions {
  templateType?: WhatsAppTemplateType;
  customPhone?: string;
  includeBankInfo?: boolean;
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
 * Build clean formatted text for WhatsApp message
 */
export function generateWhatsAppMessage(invoice: Invoice, options: WhatsAppMessageOptions = {}): string {
  const { templateType = 'standard', includeBankInfo = true } = options;

  const clientName = invoice.client?.name || 'Bapak/Ibu';
  const companyName = invoice.company?.name || 'Perusahaan';
  const invoiceNumber = invoice.invoice_number;
  const invDate = formatDate(invoice.invoice_date);
  const dueDate = formatDate(invoice.due_date);
  const totalStr = formatRupiah(invoice.total);

  // Bank Account Info block
  let bankBlock = '';
  if (includeBankInfo && (invoice.company?.bank_name || invoice.company?.bank_account_number)) {
    bankBlock = `\n💳 *Informasi Rekening Pembayaran:*
• Bank: *${invoice.company.bank_name || '-'}*
• No. Rekening: *${invoice.company.bank_account_number || '-'}*
• Atas Nama: *${invoice.company.bank_account_name || invoice.company.name}*`;
  }

  // Items breakdown summary (max 4 items for readability)
  const itemsList = invoice.items && invoice.items.length > 0 
    ? invoice.items.slice(0, 4).map((it, idx) => `  ${idx + 1}. ${it.name || it.description || 'Item'} (${it.quantity} ${it.unit || 'x'}) = ${formatRupiah(it.total)}`).join('\n')
    : '';
  const itemSummary = itemsList ? `\n\n📋 *Ringkasan Tagihan:*\n${itemsList}${invoice.items.length > 4 ? `\n  ...dan ${invoice.items.length - 4} item lainnya` : ''}` : '';

  switch (templateType) {
    case 'reminder':
      return `Halo Yth. *${clientName}*,

Semoga Anda selalu dalam keadaan sehat dan lancar dalam menjalankan aktivitas.

Kami ingin menginformasikan pengingat tagihan faktur dari *${companyName}* dengan rincian sebagai berikut:

📄 *No. Faktur:* ${invoiceNumber}
📅 *Tanggal Faktur:* ${invDate}
⏰ *Jatuh Tempo:* *${dueDate}*
💰 *Total Tagihan:* *${totalStr}*${itemSummary}${bankBlock}

Mohon dapat melakukan konfirmasi apabila pembayaran telah dilakukan. Jika ada pertanyaan mengenai faktur ini, silakan hubungi kami.

Terima kasih banyak atas kerja sama yang baik! 🙏
*${companyName}*`;

    case 'receipt':
      return `Halo Yth. *${clientName}*,

Terima kasih banyak! Pembayaran untuk faktur berikut telah kami terima dan berstatus *LUNAS*:

📄 *No. Faktur:* ${invoiceNumber}
📅 *Tanggal Pelunasan:* ${formatDate(new Date().toISOString())}
💰 *Jumlah Diterima:* *${totalStr}*
✅ *Status:* *LUNAS / PAID*

Kwitansi dan bukti penerimaan ini diterbitkan secara sah oleh *${companyName}*.

Terima kasih atas kepercayaan dan kerja sama Anda bersama kami! 🙏
*${companyName}*`;

    case 'short':
      return `Halo Yth. *${clientName}*, berikut tagihan faktur *${invoiceNumber}* dari *${companyName}*.
Total: *${totalStr}* (Jatuh Tempo: *${dueDate}*).${bankBlock}

Terima kasih! 🙏`;

    case 'standard':
    default:
      return `Kepada Yth.
*${clientName}*

Berikut kami sampaikan rincian tagihan faktur dari *${companyName}*:

━━━━━━━━━━━━━━━━━━━━
📄 *FAKTUR PENAGIHAN*
━━━━━━━━━━━━━━━━━━━━
• No. Faktur : *${invoiceNumber}*
• Tanggal     : ${invDate}
• Jatuh Tempo : *${dueDate}*
• Total Bayar : *${totalStr}*${itemSummary}${bankBlock}

Dokumen tagihan resmi dapat diakses dan diunduh dalam bentuk PDF. Mohon konfirmasi apabila pembayaran telah selesai diproses.

Terima kasih atas kerja sama dan kepercayaan Anda.

Hormat kami,
*${companyName}*`;
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
