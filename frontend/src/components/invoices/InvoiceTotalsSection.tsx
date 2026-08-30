import {
  Calculator,
} from 'lucide-react';

import type {
  UseFormRegister,
} from 'react-hook-form';

import { formatRupiah } from '../../lib/terbilang';

import type { InvoiceFormData } from '../../types';

interface InvoiceTotalsSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export default function InvoiceTotalsSection({
  register,
  subtotal,
  taxAmount,
  total,
}: InvoiceTotalsSectionProps) {
  return (
    <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">

      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
        <Calculator
          size={15}
          className="text-slate-700"
        />

        <span>
          Perhitungan Total
        </span>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center text-xs text-slate-600">
        <span>
          Subtotal Barang/Jasa
        </span>

        <span className="font-mono font-medium text-slate-900">
          {formatRupiah(subtotal)}
        </span>
      </div>

      {/* PPN */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span>
            PPN (%)
          </span>

          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            {...register('tax_rate', {
              valueAsNumber: true,
            })}
            className="w-14 text-center text-xs bg-slate-50 border border-slate-200 rounded-md py-1 font-mono font-medium"
          />
        </div>

        <span className="font-mono font-medium text-slate-900">
          {formatRupiah(taxAmount)}
        </span>
      </div>

      {/* Discount */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span>
            Potongan Diskon (Rp)
          </span>
        </div>

        <input
          type="number"
          min="0"
          placeholder="0"
          {...register('discount', {
            valueAsNumber: true,
          })}
          className="w-28 text-right text-xs bg-slate-50 border border-slate-200 rounded-md p-1 font-mono font-medium"
        />
      </div>

      {/* Grand Total */}
      <div className="pt-3 border-t border-slate-900 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-900 uppercase">
          Total Tagihan
        </span>

        <span className="text-lg font-extrabold font-mono text-slate-950">
          {formatRupiah(total)}
        </span>
      </div>

    </div>
  );
}