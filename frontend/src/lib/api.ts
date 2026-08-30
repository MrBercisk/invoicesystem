import axios from 'axios';
import type { Client, Company, Invoice, InvoiceItem, InvoiceStatus, PaginatedResponse, Product } from '../types';

// Base URL Laravel tanpa "/api/v1" - dipakai khusus untuk endpoint sanctum/csrf-cookie.
// Dibuat robust: strip trailing "/api/v1" kalau env var-nya kebetulan sudah menyertakan itu,
// supaya tetap benar baik VITE_API_URL diisi "http://host:port" maupun "http://host:port/api/v1".
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_URL = RAW_API_URL.replace(/\/api\/v1\/?$/, '');

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // wajib: supaya cookie session & XSRF-TOKEN ikut terkirim
});

// Instance terpisah untuk hit root domain (dipakai ambil csrf cookie & login lewat /sanctum)
const rootApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Ambil nilai cookie by name. Dipakai manual attach XSRF token,
// supaya tidak bergantung pada dukungan "withXSRFToken" di versi axios tertentu
// (opsi itu baru ada di axios >= 1.6, dan untuk request cross-origin/beda port
// axios versi lama tidak otomatis mengirim header X-XSRF-TOKEN tanpa opsi itu).
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

api.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    // Pakai .set() (bukan bracket assignment) - lebih reliable karena
    // config.headers di axios v1.x adalah instance AxiosHeaders, bukan plain object.
    if (typeof config.headers.set === 'function') {
      config.headers.set('X-XSRF-TOKEN', token);
    } else {
      config.headers['X-XSRF-TOKEN'] = token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const message = Object.values(errors).flat().join(', ');
      return Promise.reject(new Error(message));
    }

    if (error.response?.status === 401) {
      // Session habis / belum login - biarkan komponen pemanggil yang redirect ke halaman login
      return Promise.reject(new Error('Unauthenticated'));
    }

    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  // Wajib dipanggil sekali sebelum login (Sanctum SPA cookie-based auth)
  getCsrfCookie: () => rootApi.get('/sanctum/csrf-cookie'),

  login: async (email: string, password: string) => {
    await authApi.getCsrfCookie();
    const res = await api.post('/login', { email, password });
    return res.data;
  },

  logout: () => api.post('/logout').then(r => r.data),

  me: () => api.get('/me').then(r => r.data),
};

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