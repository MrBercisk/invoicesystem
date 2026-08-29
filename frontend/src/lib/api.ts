import axios from 'axios';
import type { Client, Company, Invoice, InvoiceItem, InvoiceStatus, PaginatedResponse, Product } from '../types';
 
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const message = Object.values(errors).flat().join(', ');
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);
 
// Companies
export const companiesApi = {
  getAll: () => api.get<Company[]>('/companies').then(r => r.data),
  create: (data: Partial<Company>) => api.post<Company>('/companies', data).then(r => r.data),
  update: (id: number, data: Partial<Company>) => api.put<Company>(`/companies/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/companies/${id}`),
};
 
// Clients
export const clientsApi = {
  getAll: () => api.get<Client[]>('/clients').then(r => r.data),
  create: (data: Partial<Client>) => api.post<Client>('/clients', data).then(r => r.data),
  update: (id: number, data: Partial<Client>) => api.put<Client>(`/clients/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/clients/${id}`),
};
 
// Products
export const productsApi = {
  getAll: () => api.get<Product[]>('/products').then(r => r.data),
  create: (data: Partial<Product>) => api.post<Product>('/products', data).then(r => r.data),
  update: (id: number, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/products/${id}`),
};
 
// Invoices
export const invoicesApi = {
  getAll: (params?: { status?: string; search?: string; page?: number }) =>
    api.get<PaginatedResponse<Invoice>>('/invoices', { params }).then(r => r.data),
  getOne: (id: number) => api.get<Invoice>(`/invoices/${id}`).then(r => r.data),
  create: (data: Partial<Invoice> & { items: InvoiceItem[] }) =>
    api.post<Invoice>('/invoices', data).then(r => r.data),
  update: (id: number, data: Partial<Invoice> & { items?: InvoiceItem[] }) =>
    api.put<Invoice>(`/invoices/${id}`, data).then(r => r.data),
  updateStatus: (id: number, status: InvoiceStatus) =>
    api.patch<Invoice>(`/invoices/${id}/status`, { status }).then(r => r.data),
  delete: (id: number) => api.delete(`/invoices/${id}`),
};
