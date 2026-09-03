import { useState } from 'react';
import { FileText } from 'lucide-react';

import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import { terbilang } from '../../lib/terbilang';

import {
  getTemplatesForScope,
} from './InvoiceTextTemplates';

import type { InvoiceFormData } from '../../types';

interface InvoiceNotesSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  total: number;
}

export default function InvoiceNotesSection({
  register,
  setValue,
  watch,
  total,
}: InvoiceNotesSectionProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const projectCode = watch('project_code');
  const installmentLabel = watch('installment_label');
  const isInstallment = Boolean(projectCode || installmentLabel);

  const templates = getTemplatesForScope(isInstallment);

  const handleApplyTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (!templateId) return;

    const template = templates.find((item) => item.id === templateId);
    if (!template) return;

    const currentNotes = watch('notes');
    const currentTerms = watch('terms');

    const hasExistingContent =
      Boolean(currentNotes?.trim()) || Boolean(currentTerms?.trim());

    if (hasExistingContent) {
      const confirmed = window.confirm(
        'Catatan dan Syarat & Ketentuan yang sudah diisi akan ditimpa oleh template ini. Lanjutkan?',
      );

      if (!confirmed) {
        setSelectedTemplateId('');
        return;
      }
    }

    setValue('notes', template.notes, { shouldDirty: true });
    setValue('terms', template.terms, { shouldDirty: true });
  };

  return (
    <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">

      {/* Template Picker */}

      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 mb-1">
          <FileText size={12} className="text-slate-500" />
          Gunakan Template Siap Pakai
        </label>

        <select
          value={selectedTemplateId}
          onChange={(event) => handleApplyTemplate(event.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          <option value="">
            -- Pilih template Catatan & Syarat/Ketentuan --
          </option>

          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>

        <p className="mt-1 text-[10px] text-slate-400">
          {isInstallment
            ? 'Template disesuaikan untuk invoice termin/cicilan project.'
            : 'Template disesuaikan untuk invoice pembayaran penuh.'}{' '}
          Kamu tetap bisa mengedit teksnya secara manual setelah dipilih.
        </p>
      </div>

      {/* Notes */}

      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Catatan Tambahan (Notes)
        </label>

        <textarea
          rows={2}
          {...register('notes')}
          placeholder="Catatan untuk klien..."
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Terms */}

      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Syarat & Ketentuan (Terms &
          Conditions)
        </label>

        <textarea
          rows={2}
          {...register('terms')}
          placeholder="Ketentuan garansi, jatuh tempo..."
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Terbilang */}

      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="text-[9px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
          Teks Terbilang Otomatis
          (Rupiah)
        </div>

        <div className="text-xs font-medium text-slate-900 italic font-serif-invoice">
          # {terbilang(total)} #
        </div>
      </div>
    </div>
  );
}