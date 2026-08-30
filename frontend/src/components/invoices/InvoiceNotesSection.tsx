import type {
  UseFormRegister,
} from 'react-hook-form';

import { terbilang } from '../../lib/terbilang';


import type { InvoiceFormData } from '../../types';

interface InvoiceNotesSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  total: number;
}

export default function InvoiceNotesSection({
  register,
  total,
}: InvoiceNotesSectionProps) {
  return (
    <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">

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