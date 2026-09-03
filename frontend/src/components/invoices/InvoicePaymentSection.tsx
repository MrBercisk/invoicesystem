import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useQuery } from '@tanstack/react-query';

import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import { invoicesApi, type InvoiceProject } from '../../lib/api';

import type { InvoiceFormData } from '../../types';

interface InvoicePaymentSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  isEditing: boolean;
  onProjectSelect?: (project: InvoiceProject) => void;
}

type PaymentMode = 'full' | 'installment';
type ProjectMode = 'new' | 'existing';

export default function InvoicePaymentSection({
  register,
  watch,
  setValue,
  isEditing,
  onProjectSelect,
}: InvoicePaymentSectionProps) {
  const projectCode = watch('project_code');
  const installmentLabel = watch('installment_label');
  const projectTotalValue = watch('project_total_value');
  const companyId = Number(watch('company_id'));
  const clientId = Number(watch('client_id'));

  const [projectMode, setProjectMode] =
    useState<ProjectMode>(
      projectCode ? 'existing' : 'new',
    );

  const previousCompanyId = useRef(companyId);
  const previousClientId = useRef(clientId);

  const paymentMode: PaymentMode =
    projectMode === 'existing' ||
    Boolean(projectCode) ||
    Boolean(installmentLabel)
      ? 'installment'
      : 'full';

  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    isFetching: isFetchingProjects,
  } = useQuery({
    queryKey: [
      'invoice-projects',
      companyId,
      clientId,
    ],
    queryFn: () =>
      invoicesApi.getProjects(
        companyId,
        clientId,
      ),
    enabled:
      paymentMode === 'installment' &&
      projectMode === 'existing' &&
      companyId > 0 &&
      clientId > 0,
  });

  const selectedProject = useMemo(() => {
    if (!projectCode) {
      return undefined;
    }

    return projects.find(
      (project) =>
        project.project_code === projectCode,
    );
  }, [projects, projectCode]);

  // Sync project mode ketika data invoice edit
  // sudah dimuat secara async.
  useEffect(() => {
    if (isEditing && projectCode) {
      setProjectMode('existing');
    }
  }, [isEditing, projectCode]);

  // Reset project ketika company atau client
  // benar-benar berubah.
  useEffect(() => {
    const companyChanged =
      previousCompanyId.current !== companyId;

    const clientChanged =
      previousClientId.current !== clientId;

    if (!companyChanged && !clientChanged) {
      return;
    }

    previousCompanyId.current = companyId;
    previousClientId.current = clientId;

    setValue('project_code', '');

    if (projectMode === 'existing') {
      setValue('installment_label', '');
    }
  }, [
    companyId,
    clientId,
    projectMode,
    setValue,
  ]);

  const handlePaymentModeChange = (
    mode: PaymentMode,
  ) => {
    if (mode === 'full') {
      setValue('project_code', '');
      setValue('installment_label', '');
      setValue('project_total_value', undefined);
      setProjectMode('new');

      return;
    }

    if (!projectCode && !installmentLabel) {
      setProjectMode('new');

      setValue(
        'installment_label',
        'Termin 1 — Uang Muka',
      );
    }
  };

  const handleProjectModeChange = (
    mode: ProjectMode,
  ) => {
    setProjectMode(mode);

    if (mode === 'new') {
      setValue('project_code', '');

      if (!installmentLabel) {
        setValue(
          'installment_label',
          'Termin 1 — Uang Muka',
        );
      }

      return;
    }

    // Pindah ke "Lanjutkan Project": nilai kontrak hanya berlaku
    // untuk project baru (termin pertama), jadi kosongkan supaya
    // tidak tertukar dengan project yang sudah punya nilai kontrak sendiri.
    setValue('project_code', '');
    setValue('installment_label', '');
    setValue('project_total_value', undefined);
  };

  const handleProjectSelect = (
    value: string,
  ) => {
    setValue(
      'project_code',
      value,
    );

    const project = projects.find(
      (item) =>
        item.project_code === value,
    );

    if (project) {
      const nextInstallment =
        project.invoice_count + 1;

      setValue(
        'installment_label',
        `Termin ${nextInstallment}`,
      );

      onProjectSelect?.(project);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />
              <path d="M3 10h18" />
              <path d="M7 15h3" />
            </svg>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Pembayaran
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Tentukan apakah invoice ini
              pembayaran penuh atau bagian dari
              project bertahap.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Payment Mode */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Full */}
          <label
            className={`relative cursor-pointer rounded-xl border p-4 transition ${
              paymentMode === 'full'
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="payment_mode"
              value="full"
              checked={
                paymentMode === 'full'
              }
              onChange={() =>
                handlePaymentModeChange(
                  'full',
                )
              }
              className="sr-only"
            />

            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                  paymentMode === 'full'
                    ? 'border-slate-900'
                    : 'border-slate-300'
                }`}
              >
                {paymentMode === 'full' && (
                  <div className="h-2 w-2 rounded-full bg-slate-900" />
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Pembayaran Penuh
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Invoice digunakan untuk satu
                  pembayaran penuh tanpa termin
                  project.
                </p>
              </div>
            </div>
          </label>

          {/* Installment */}
          <label
            className={`relative cursor-pointer rounded-xl border p-4 transition ${
              paymentMode === 'installment'
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="payment_mode"
              value="installment"
              checked={
                paymentMode === 'installment'
              }
              onChange={() =>
                handlePaymentModeChange(
                  'installment',
                )
              }
              className="sr-only"
            />

            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                  paymentMode ===
                  'installment'
                    ? 'border-slate-900'
                    : 'border-slate-300'
                }`}
              >
                {paymentMode ===
                  'installment' && (
                  <div className="h-2 w-2 rounded-full bg-slate-900" />
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Termin / Cicilan Project
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Invoice merupakan bagian dari
                  pembayaran project bertahap.
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Installment */}
        {paymentMode ===
          'installment' && (
          <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {/* Project Mode */}
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Project
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Buat project baru atau
                  lanjutkan project yang sudah
                  memiliki invoice sebelumnya.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {/* New Project */}
                <label
                  className={`cursor-pointer rounded-xl border bg-white p-4 transition ${
                    projectMode === 'new'
                      ? 'border-slate-900 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="project_mode"
                    value="new"
                    checked={
                      projectMode === 'new'
                    }
                    onChange={() =>
                      handleProjectModeChange(
                        'new',
                      )
                    }
                    className="sr-only"
                  />

                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                        projectMode ===
                        'new'
                          ? 'border-slate-900'
                          : 'border-slate-300'
                      }`}
                    >
                      {projectMode ===
                        'new' && (
                        <div className="h-2 w-2 rounded-full bg-slate-900" />
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Project Baru
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Buat project baru dan
                        jadikan invoice ini sebagai
                        termin pertama.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Existing Project */}
                <label
                  className={`cursor-pointer rounded-xl border bg-white p-4 transition ${
                    projectMode === 'existing'
                      ? 'border-slate-900 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="project_mode"
                    value="existing"
                    checked={
                      projectMode ===
                      'existing'
                    }
                    onChange={() =>
                      handleProjectModeChange(
                        'existing',
                      )
                    }
                    className="sr-only"
                  />

                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                        projectMode ===
                        'existing'
                          ? 'border-slate-900'
                          : 'border-slate-300'
                      }`}
                    >
                      {projectMode ===
                        'existing' && (
                        <div className="h-2 w-2 rounded-full bg-slate-900" />
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Lanjutkan Project
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Pilih project yang sudah
                        memiliki invoice sebelumnya.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* New Project */}
            {projectMode === 'new' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Project Baru
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Kode project akan dibuat
                      otomatis saat invoice disimpan.
                      Kamu tidak perlu memasukkan kode
                      project secara manual.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <label
                    htmlFor="project_total_value"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Total Nilai Kontrak Project{' '}
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-medium text-slate-400">
                      Rp
                    </span>

                    <input
                      id="project_total_value"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="3500000"
                      {...register('project_total_value', {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Ini nilai kontrak keseluruhan project (bukan nominal
                    invoice ini saja). Termin berikutnya akan otomatis
                    menghitung sisa tagihan berdasarkan angka ini — jadi
                    isi dengan total harga project, misalnya total kontrak
                    pembuatan website Rp 3.500.000.
                  </p>

                  {Boolean(projectTotalValue) && (
                    <p className="mt-2 text-[11px] font-medium text-slate-600">
                      Nilai kontrak akan disimpan sebagai Rp{' '}
                      {Number(projectTotalValue).toLocaleString('id-ID')}.
                      Sisa tagihan akan tampil otomatis saat kamu membuat
                      invoice termin berikutnya untuk project ini.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Existing Project */}
            {projectMode ===
              'existing' && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="existing_project"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Pilih Project
                  </label>

                  <select
                    id="existing_project"
                    value={projectCode || ''}
                    onChange={(event) =>
                      handleProjectSelect(
                        event.target.value,
                      )
                    }
                    disabled={
                      isLoadingProjects ||
                      isFetchingProjects
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">
                      {isLoadingProjects ||
                      isFetchingProjects
                        ? 'Memuat project...'
                        : projects.length === 0
                          ? 'Belum ada project'
                          : 'Pilih project...'}
                    </option>

                    {projects.map(
                      (project) => (
                        <option
                          key={
                            project.project_code
                          }
                          value={
                            project.project_code
                          }
                        >
                          {project.project_code}
                        </option>
                      ),
                    )}
                  </select>

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Project yang ditampilkan
                    berdasarkan company dan client
                    yang dipilih di atas.
                  </p>
                </div>

                {/* No project */}
                {!isLoadingProjects &&
                  !isFetchingProjects &&
                  projects.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center">
                      <div className="text-sm font-medium text-slate-700">
                        Belum ada project
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Client ini belum memiliki
                        project yang bisa dilanjutkan.
                        Pilih Project Baru untuk
                        membuat project pertama.
                      </p>
                    </div>
                  )}

                {/* Selected project */}
                {selectedProject && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Project Terpilih
                      </div>

                      <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
                        {
                          selectedProject.project_code
                        }
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">
                          Total Project
                        </div>

                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Rp{' '}
                          {selectedProject.project_total.toLocaleString(
                            'id-ID',
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">
                          Sudah Dibayar
                        </div>

                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Rp{' '}
                          {selectedProject.paid_total.toLocaleString(
                            'id-ID',
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">
                          Sisa
                        </div>

                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Rp{' '}
                          {selectedProject.remaining_total.toLocaleString(
                            'id-ID',
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Invoice history */}
                    <div>
                      <div className="mb-2 text-xs font-semibold text-slate-700">
                        Invoice Sebelumnya
                      </div>

                      <div className="space-y-2">
                        {selectedProject.invoices.map(
                          (invoice) => (
                            <div
                              key={
                                invoice.id
                              }
                              className="flex flex-col gap-2 rounded-lg border border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <div className="text-xs font-medium text-slate-900">
                                  {
                                    invoice.invoice_number
                                  }
                                </div>

                                <div className="mt-0.5 text-[11px] text-slate-500">
                                  {invoice.installment_label ||
                                    'Tanpa label termin'}
                                </div>
                              </div>

                              <div className="text-xs font-semibold text-slate-900">
                                Rp{' '}
                                {invoice.total.toLocaleString(
                                  'id-ID',
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Installment Label */}
            <div>
              <label
                htmlFor="installment_label"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                Label Termin
              </label>

              <input
                id="installment_label"
                type="text"
                placeholder="Contoh: Termin 1 — Uang Muka (50%)"
                {...register(
                  'installment_label',
                )}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Contoh: Termin 1 — Uang Muka
                (50%), Termin 2 — Pelunasan
                (50%).
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}