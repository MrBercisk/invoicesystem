import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  CreditCard,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

import type { Company } from '../../types';

interface CompanyCardProps {
  company: Company;
  onEdit: () => void;
  onDelete: () => void;
}

export function CompanyCard({
  company,
  onEdit,
  onDelete,
}: CompanyCardProps) {
  const initials = company.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const hasSignature =
    Boolean(company.signature);

  const hasStamp =
    Boolean(company.stamp);

  return (
    <div className="flex flex-col justify-between overflow-hidden transition-all bg-white border shadow-xs group border-slate-200 rounded-xl hover:border-slate-300">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
          <div className="flex items-center min-w-0 gap-3">
            {company.logo ? (
              <div className="flex items-center justify-center w-11 h-11 p-1 bg-white border rounded-lg shrink-0 border-slate-200">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-11 h-11 text-xs font-bold text-white rounded-lg bg-slate-900 shrink-0">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate text-slate-950">
                {company.name}
              </h3>

              {company.city && (
                <p className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                  <MapPin
                    size={11}
                    className="text-slate-400"
                  />
                  {company.city}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-all"
              title="Edit"
            >
              <Pencil size={14} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="Hapus"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3 sm:px-5 text-[10px]">
          {company.logo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
              <CheckCircle2 size={10} />
              Logo
            </span>
          )}

          {(hasSignature || hasStamp) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-md">
              <CheckCircle2 size={10} />

              {hasSignature && hasStamp
                ? 'Ttd & Stempel'
                : hasSignature
                  ? 'Ttd Digital'
                  : 'Stempel'}
            </span>
          )}

          {company.signature_name && (
            <span className="inline-flex items-center max-w-[180px] px-2 py-0.5 font-medium truncate bg-slate-100 text-slate-600 border border-slate-200 rounded-md">
              PIC: {company.signature_name}
            </span>
          )}

          {company.signature_title && (
            <span className="inline-flex items-center max-w-[180px] px-2 py-0.5 font-medium truncate bg-slate-50 text-slate-500 border border-slate-200 rounded-md">
              {company.signature_title}
            </span>
          )}
        </div>

        {/* Contact */}
        {(company.email ||
          company.phone ||
          company.website) && (
          <div className="px-4 pb-3 space-y-1 sm:px-5">
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-950 transition-colors truncate"
              >
                <Mail
                  size={12}
                  className="text-slate-400 shrink-0"
                />

                <span className="truncate">
                  {company.email}
                </span>
              </a>
            )}

            {company.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone
                  size={12}
                  className="text-slate-400 shrink-0"
                />

                <span>{company.phone}</span>
              </div>
            )}

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-950 transition-colors truncate"
              >
                <Globe
                  size={12}
                  className="text-slate-400 shrink-0"
                />

                <span className="truncate">
                  {company.website.replace(
                    /^https?:\/\//,
                    '',
                  )}
                </span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bank */}
      {company.bank_name && (
        <div className="flex items-center gap-2 p-2.5 mx-4 mb-4 sm:mx-5 bg-slate-50 rounded-lg border border-slate-200">
          <CreditCard
            size={13}
            className="text-slate-400 shrink-0"
          />

          <div className="min-w-0 text-xs">
            <p className="font-semibold truncate text-slate-900">
              {company.bank_name}

              {company.bank_account_number && (
                <span className="ml-1 font-bold font-mono text-slate-600">
                  {company.bank_account_number}
                </span>
              )}
            </p>

            {company.bank_account_name && (
              <p className="text-[10px] text-slate-500 truncate">
                A/N: {company.bank_account_name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}