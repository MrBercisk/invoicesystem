import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';

import {
  invoicesApi,
  companiesApi,
  clientsApi,
  productsApi,
} from '../lib/api';

import type { InvoiceItem, InvoiceFormData } from '../types';

import InvoiceFormHeader  from '../components/invoices/InvoiceFormHeader';
import InvoiceEntitySection from '../components/invoices/InvoiceEntitySection';
import InvoiceItemsSection from '../components/invoices/InvoiceItemsSection';
import InvoiceNotesSection from '../components/invoices/InvoiceNotesSection';
import InvoiceTotalsSection from '../components/invoices/InvoiceTotalsSection';


export function InvoiceFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getAll(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  const {
    data: existingInvoice,
    isLoading: loadingExisting,
  } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => (id ? invoicesApi.getOne(Number(id)) : null),
    enabled: isEditing,
  });

  const today = new Date().toISOString().split('T')[0];

  const defaultDueDate = new Date(
    Date.now() + 14 * 24 * 3600 * 1000,
  )
    .toISOString()
    .split('T')[0];

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<InvoiceFormData>({
    defaultValues: {
      company_id: companies[0]?.id || 1,
      client_id: clients[0]?.id || 1,
      invoice_date: today,
      due_date: defaultDueDate,
      status: 'draft',
      tax_rate: 11,
      discount: 0,
      notes:
        'Pembayaran dapat ditransfer ke rekening bank tertera. Harap sertakan nomor invoice pada berita transfer.',
      terms:
        'Jatuh tempo pembayaran adalah 14 hari sejak invoice diterbitkan.',
      items: [
        {
          name: '',
          description: '',
          quantity: 1,
          unit: 'paket',
          price: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (existingInvoice) {
      reset({
        company_id: existingInvoice.company_id,
        client_id: existingInvoice.client_id,
        invoice_date: existingInvoice.invoice_date,
        due_date: existingInvoice.due_date,
        status: existingInvoice.status,
        tax_rate: existingInvoice.tax_rate,
        discount: existingInvoice.discount,
        notes: existingInvoice.notes || '',
        terms: existingInvoice.terms || '',

        items: existingInvoice.items.map((item: InvoiceItem) => ({
          product_id: item.product_id,
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          unit: item.unit || 'pcs',
          price: item.price,
        })),
      });
    }
  }, [existingInvoice, reset]);

  useEffect(() => {
    if (
      !isEditing &&
      companies.length > 0 &&
      !watch('company_id')
    ) {
      setValue('company_id', companies[0].id);
    }
  }, [
    companies,
    isEditing,
    setValue,
    watch,
  ]);

  const watchedItems = watch('items') || [];

  const watchedTaxRate =
    Number(watch('tax_rate')) || 0;

  const watchedDiscount =
    Number(watch('discount')) || 0;

  const subtotal = watchedItems.reduce(
    (acc, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;

      return acc + qty * price;
    },
    0,
  );

  const taxAmount =
    subtotal * (watchedTaxRate / 100);

  const total = Math.max(
    0,
    subtotal + taxAmount - watchedDiscount,
  );

  const handleProductSelect = (
    index: number,
    productId: number,
  ) => {
    const selected = products.find(
      (product) => product.id === Number(productId),
    );

    if (!selected) return;

    setValue(
      `items.${index}.product_id`,
      selected.id,
    );

    setValue(
      `items.${index}.name`,
      selected.name,
    );

    setValue(
      `items.${index}.description`,
      selected.description || '',
    );

    setValue(
      `items.${index}.price`,
      selected.price,
    );

    setValue(
      `items.${index}.unit`,
      selected.unit || 'pcs',
    );
  };

  const saveMutation = useMutation({
    mutationFn: (data: InvoiceFormData) => {
      const payload = {
        ...data,

        company_id: Number(data.company_id),
        client_id: Number(data.client_id),

        tax_rate: Number(data.tax_rate) || 0,
        discount: Number(data.discount) || 0,

        items: data.items.map((item) => ({
          ...item,

          quantity:
            Number(item.quantity) || 1,

          price:
            Number(item.price) || 0,

          total:
            (Number(item.quantity) || 1) *
            (Number(item.price) || 0),
        })),
      };

      if (isEditing && id) {
        return invoicesApi.update(
          Number(id),
          payload,
        );
      }

      return invoicesApi.create(payload);
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      navigate(`/invoices/${res.id}`);
    },
  });

  const onSubmit = (
    data: InvoiceFormData,
  ) => {
    if (data.items.length === 0) {
      alert(
        'Minimal harus ada 1 item dalam invoice',
      );

      return;
    }

    saveMutation.mutate(data);
  };

  if (
    isEditing &&
    loadingExisting
  ) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 font-medium">
        Memuat data faktur...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      <InvoiceFormHeader
        isEditing={isEditing}
        invoiceNumber={
          existingInvoice?.invoice_number
        }
        isSaving={saveMutation.isPending}
      />

      <InvoiceEntitySection
        register={register}
        companies={companies}
        clients={clients}
      />

      <InvoiceItemsSection
        register={register}
        fields={fields}
        products={products}
        watchedItems={watchedItems}
        append={append}
        remove={remove}
        onProductSelect={handleProductSelect}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <InvoiceNotesSection
          register={register}
          total={total}
        />

        <InvoiceTotalsSection
          register={register}
          subtotal={subtotal}
          taxAmount={taxAmount}
          total={total}
        />
      </div>
    </form>
  );
}