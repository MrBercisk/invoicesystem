import { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Plus, Building2 } from 'lucide-react';

import { companiesApi } from '../lib/api';
import type { Company } from '../types';

import { CompanyCard } from '../components/companies/CompanyCard';
import { CompanyModal } from '../components/companies/CompanyModal';

export function CompaniesPage() {
  const [modal, setModal] = useState<{
    open: boolean;
    company?: Company;
  }>({
    open: false,
  });

  const queryClient = useQueryClient();

  const {
    data: companies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: companiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
  });

  const openCreateModal = () => {
    setModal({
      open: true,
    });
  };

  const openEditModal = (company: Company) => {
    setModal({
      open: true,
      company,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
    });
  };

  const handleDelete = (company: Company) => {
    const confirmed = window.confirm(
      `Hapus entitas "${company.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(company.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 pb-3 border-b sm:flex-row sm:items-center sm:justify-between border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Profil Perusahaan & Entitas
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Kelola identitas penerbit invoice, logo,
            legalitas, tanda tangan, stempel, dan rekening
            pembayaran.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center self-start gap-2 px-4 py-2.5 text-xs font-bold text-white transition-all rounded-lg shadow-xs bg-slate-900 hover:bg-slate-800 sm:self-auto"
        >
          <Plus size={15} />
          Tambah Perusahaan
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 bg-white border rounded-xl border-slate-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="p-8 text-center bg-white border rounded-xl border-rose-200">
          <div className="text-sm font-bold text-rose-700">
            Gagal memuat data perusahaan
          </div>

          <p className="mt-1 text-xs text-rose-500">
            Silakan coba muat ulang halaman.
          </p>
        </div>
      )}

      {/* Cards */}
      {!isLoading &&
        !isError &&
        companies.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onEdit={() => openEditModal(company)}
                onDelete={() => handleDelete(company)}
              />
            ))}
          </div>
        )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        companies.length === 0 && (
          <div className="p-12 text-center bg-white border rounded-xl border-slate-200">
            <Building2
              size={36}
              className="mx-auto mb-2.5 text-slate-300"
            />

            <div className="text-sm font-bold text-slate-800">
              Belum ada perusahaan
            </div>

            <p className="max-w-sm mx-auto mt-1 text-xs text-slate-500">
              Tambahkan profil perusahaan Anda untuk
              menampilkan identitas, logo, tanda tangan,
              stempel, dan rekening pembayaran pada invoice.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-xs font-bold text-white transition-colors rounded-lg bg-slate-900 hover:bg-slate-800"
            >
              <Plus size={14} />
              Tambah Sekarang
            </button>
          </div>
        )}

      {/* Modal */}
      {modal.open && (
        <CompanyModal
          company={modal.company}
          onClose={closeModal}
        />
      )}
    </div>
  );
}