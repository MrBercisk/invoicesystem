import { useState, useMemo } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  ExternalLink,
  Receipt,
  BellRing,
  FileText,
  AlignLeft,
  Building2
} from 'lucide-react';
import type { Invoice } from '../types';
import { 
  generateWhatsAppMessage, 
  getWhatsAppUrl, 
  formatWhatsAppPhone,
  type WhatsAppTemplateType 
} from '../lib/whatsapp';

interface WhatsAppShareModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES: { id: WhatsAppTemplateType; label: string; icon: typeof FileText; desc: string }[] = [
  { id: 'standard', label: 'Tagihan Resmi', icon: FileText, desc: 'Format lengkap dengan rincian invoice & rekening' },
  { id: 'reminder', label: 'Pengingat Jatuh Tempo', icon: BellRing, desc: 'Pesan ramah untuk pengingat pembayaran' },
  { id: 'receipt', label: 'Konfirmasi Lunas', icon: Receipt, desc: 'Tanda terima & ucapan terima kasih atas pembayaran' },
  { id: 'short', label: 'Pesan Ringkas', icon: AlignLeft, desc: 'To-the-point untuk komunikasi cepat' },
];

export function WhatsAppShareModal({ invoice, isOpen, onClose }: WhatsAppShareModalProps) {
  // Pre-select template based on invoice status
  const defaultTemplate: WhatsAppTemplateType = invoice.status === 'paid' ? 'receipt' : 'standard';
  
  const [templateType, setTemplateType] = useState<WhatsAppTemplateType>(defaultTemplate);
  const [phone, setPhone] = useState(invoice.client?.phone || '');
  const [includeBankInfo, setIncludeBankInfo] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate message text dynamically
  const messageText = useMemo(() => {
    return generateWhatsAppMessage(invoice, {
      templateType,
      includeBankInfo,
    });
  }, [invoice, templateType, includeBankInfo]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppUrl(phone, messageText);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const cleanPhone = formatWhatsAppPhone(phone);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white border border-zinc-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="p-4 sm:px-6 sm:py-4.5 bg-zinc-950 text-white flex items-center justify-between border-b-2 border-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">Kirim Faktur via WhatsApp</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  1-Klik Cepat
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                No. Faktur: <span className="font-mono text-zinc-200 font-bold">{invoice.invoice_number}</span> • Klien: <span className="text-zinc-200 font-semibold">{invoice.client?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* 1. Target Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-800">
              Nomor WhatsApp Tujuan
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890 atau +6281234567890"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-mono font-semibold text-zinc-900 bg-zinc-50/50"
                />
              </div>
              {cleanPhone && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-2 rounded-lg font-semibold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  +{cleanPhone}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              {invoice.client?.phone 
                ? `Nomor otomatis diambil dari kontak klien ${invoice.client.name}`
                : 'Klien belum memiliki nomor telepon di data kontak, silakan ketik nomor tujuan.'}
            </p>
          </div>

          {/* 2. Choose Template Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-800">
              Pilih Format Template Pesan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = templateType === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setTemplateType(tmpl.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{tmpl.label}</span>
                        {isSelected && <span className="text-emerald-600 text-[10px] font-black">PILIHAN</span>}
                      </div>
                      <p className="text-[10.5px] text-zinc-500 leading-tight mt-0.5">{tmpl.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Message Options Checkbox */}
          <div className="flex items-center gap-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
            <input
              type="checkbox"
              id="includeBank"
              checked={includeBankInfo}
              onChange={(e) => setIncludeBankInfo(e.target.checked)}
              className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
            />
            <label htmlFor="includeBank" className="text-xs text-zinc-700 cursor-pointer select-none font-medium flex items-center gap-1.5">
              <Building2 size={13} className="text-zinc-500" />
              Sertakan info rekening bank penerbit ({invoice.company?.bank_name || 'Bank'} - {invoice.company?.bank_account_number || 'Rekening'})
            </label>
          </div>

          {/* 4. Live WhatsApp Bubble Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-600" />
                Pratinjau Pesan WhatsApp
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Draf Pesan Siap Kirim</span>
            </div>
            
            {/* WhatsApp Chat Style Container */}
            <div className="bg-[#EFEAE2] p-3 sm:p-4 rounded-xl border border-zinc-300/80 shadow-inner relative overflow-hidden">
              <div className="bg-white rounded-lg p-3.5 shadow-xs border border-zinc-200/60 max-w-lg space-y-2 relative">
                <div className="whitespace-pre-wrap font-sans text-xs text-zinc-900 leading-relaxed">
                  {messageText}
                </div>
                <div className="flex items-center justify-end gap-1 text-[9.5px] text-zinc-400 font-mono pt-1">
                  <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-emerald-600 font-bold">✓✓</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer Actions ── */}
        <div className="p-4 sm:px-6 bg-zinc-50 border-t border-zinc-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-xl font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-700 font-bold">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Salin Teks Pesan</span>
              </>
            )}
          </button>

          {/* Primary Open WhatsApp Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-transparent hover:bg-zinc-200 text-zinc-600 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Send size={15} className="stroke-[2.5]" />
              <span>Kirim via WhatsApp (1-Klik)</span>
              <ExternalLink size={13} className="opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
