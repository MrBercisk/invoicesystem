import {
  Building2,
  Users,
  FileCheck2,
} from 'lucide-react';

import { Link } from 'react-router-dom';

interface Company {
  id: number;
  name: string;
}

interface Client {
  id: number;
  name: string;
  city?: string;
}

interface InvoiceEntitySectionProps {
  register: any;
  companies: Company[];
  clients: Client[];
}

export default function InvoiceEntitySection({
  register,
  companies,
  clients,
}: InvoiceEntitySectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* ======================================================
          COMPANY
      ====================================================== */}

      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
          <Building2
            size={15}
            className="text-slate-700"
          />

          <span>Perusahaan Penerbit</span>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Pilih Profil Usaha
          </label>

          <select
            {...register('company_id', {
              required: true,
              valueAsNumber: true,
            })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {companies.map((company) => (
              <option
                key={company.id}
                value={company.id}
              >
                {company.name}
              </option>
            ))}
          </select>

          <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>
              Logo & Rekening terisi otomatis
            </span>

            <Link
              to="/companies"
              className="text-slate-900 hover:underline font-semibold"
            >
              Kelola
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================
          CLIENT
      ====================================================== */}

      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
          <Users
            size={15}
            className="text-slate-700"
          />

          <span>Klien Tujuan</span>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Pilih Klien / Perusahaan
          </label>

          <select
            {...register('client_id', {
              required: true,
              valueAsNumber: true,
            })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {clients.map((client) => (
              <option
                key={client.id}
                value={client.id}
              >
                {client.name}
                {client.city
                  ? ` (${client.city})`
                  : ''}
              </option>
            ))}
          </select>

          <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>
              Alamat & NPWP klien otomatis terisi
            </span>

            <Link
              to="/clients"
              className="text-slate-900 hover:underline font-semibold"
            >
              Kelola
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================
          INVOICE PARAMETERS
      ====================================================== */}

      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
          <FileCheck2
            size={15}
            className="text-slate-700"
          />

          <span>Parameter Faktur</span>
        </div>

        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1 uppercase">
              Tgl. Terbit
            </label>

            <input
              type="date"
              {...register('invoice_date')}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1 uppercase">
              Jatuh Tempo
            </label>

            <input
              type="date"
              {...register('due_date')}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-600 mb-1 uppercase">
            Status Awal
          </label>

          <select
            {...register('status')}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="draft">
              Draft (Konsep)
            </option>

            <option value="sent">
              Sent (Terkirim)
            </option>

            <option value="paid">
              Paid (Lunas)
            </option>

            <option value="cancelled">
              Cancelled (Batal)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}