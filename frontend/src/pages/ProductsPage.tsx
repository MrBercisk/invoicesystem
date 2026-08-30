import { useState } from 'react';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { productsApi } from '../lib/api';

import type { Product } from '../types';

import ProductsHeader from '../components/products/ProductsHeader';
import ProductsSearch from '../components/products/ProductsSearch';
import ProductsTable from '../components/products/ProductsTable';
import ProductModal from '../components/products/ProductModal';

export function ProductsPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: products = [],
    isLoading,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<Partial<Product>>();

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Product>) => {
      const payload = {
        ...data,
        price: Number(data.price) || 0,
      };

      if (editingProduct) {
        return productsApi.update(
          editingProduct.id,
          payload
        );
      }

      return productsApi.create(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      productsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });

  function handleOpenModal(product?: Product) {
    if (product) {
      setEditingProduct(product);

      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        unit: product.unit,
      });
    } else {
      setEditingProduct(null);

      reset({
        name: '',
        description: '',
        price: 0,
        unit: 'paket',
      });
    }

    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  }

  function handleDelete(product: Product) {
    if (
      window.confirm(
        `Hapus produk ${product.name}?`
      )
    ) {
      deleteMutation.mutate(product.id);
    }
  }

  const filteredProducts = products.filter((product) => {
    const keyword = searchTerm.toLowerCase();

    return (
      product.name
        .toLowerCase()
        .includes(keyword) ||
      product.description
        ?.toLowerCase()
        .includes(keyword) ||
      product.unit
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <div className="space-y-6">

      <ProductsHeader
        onAdd={() => handleOpenModal()}
      />

      <ProductsSearch
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <ProductsTable
        products={filteredProducts}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <ProductModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={(data) =>
          saveMutation.mutate(data)
        }
        onClose={handleCloseModal}
        isSaving={saveMutation.isPending}
      />

    </div>
  );
}