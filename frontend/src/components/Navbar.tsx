import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  Calendar, 
  Menu, 
  X,
  FileText,
  Users,
  Package,
  Command,
  Sparkles
} from 'lucide-react';
import { invoicesApi, clientsApi, productsApi } from '../lib/api';
import { UserProfileMenu } from './UserProfileMenu';

interface ModernNavbarProps {
  onOpenMobileMenu?: () => void;
}

export function Navbar({ onOpenMobileMenu }: ModernNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Format date in Indonesian format
  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(now);
    setCurrentDate(formatted);
  }, []);

  // Global keyboard shortcut (Ctrl+K or Cmd+K) to toggle quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') {
      return [{ label: 'Ringkasan', href: '/' }];
    }
    if (path === '/invoices') {
      return [{ label: 'Faktur & Tagihan', href: '/invoices' }];
    }
    if (path === '/invoices/new') {
      return [
        { label: 'Faktur', href: '/invoices' },
        { label: 'Buat Faktur Baru', href: '/invoices/new' }
      ];
    }
    if (path.startsWith('/invoices/') && path.endsWith('/edit')) {
      return [
        { label: 'Faktur', href: '/invoices' },
        { label: 'Edit Faktur', href: path }
      ];
    }
    if (path.startsWith('/invoices/')) {
      return [
        { label: 'Faktur', href: '/invoices' },
        { label: 'Detail & Cetak', href: path }
      ];
    }
    if (path === '/companies') {
      return [{ label: 'Profil Perusahaan', href: '/companies' }];
    }
    if (path === '/clients') {
      return [{ label: 'Buku Kontak Klien', href: '/clients' }];
    }
    if (path === '/products') {
      return [{ label: 'Katalog Produk & Jasa', href: '/products' }];
    }
    return [{ label: 'InvoiceGen', href: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  // Search Results fetching with TanStack Query
  const { data: invoicesData } = useQuery({
    queryKey: ['navbar-invoices', searchQuery],
    queryFn: () => invoicesApi.getAll({ search: searchQuery.trim() || undefined }),
    enabled: searchOpen && searchQuery.trim().length > 0,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['navbar-clients'],
    queryFn: () => clientsApi.getAll(),
    enabled: searchOpen,
  });

  const { data: productsData } = useQuery({
    queryKey: ['navbar-products'],
    queryFn: () => productsApi.getAll(),
    enabled: searchOpen,
  });

  const invoices = invoicesData?.data || [];
  const clients = (clientsData || []).filter(c => 
    searchQuery.trim() ? (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : false
  ).slice(0, 3);

  const products = (productsData || []).filter(p => 
    searchQuery.trim() ? (
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : false
  ).slice(0, 3);

  return (
    <>
      {/* ── Modern Top Navbar ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-zinc-200/90 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            
            {/* Left: Mobile Trigger & Dynamic Breadcrumbs */}
            <div className="flex items-center gap-3">
              {onOpenMobileMenu && (
                <button
                  onClick={onOpenMobileMenu}
                  className="md:hidden p-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                  aria-label="Buka Menu"
                >
                  <Menu size={19} />
                </button>
              )}

              {/* Breadcrumbs Navigation */}
              <nav className="flex items-center text-xs font-semibold" aria-label="Breadcrumb">
                <Link
                  to="/"
                  className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                  <span className="hidden sm:inline">InvoiceGen</span>
                </Link>

                {breadcrumbs.map((crumb, idx) => (
                  <div key={idx} className="flex items-center">
                    <ChevronRight size={13} className="text-zinc-300 mx-1.5 shrink-0" />
                    {idx === breadcrumbs.length - 1 ? (
                      <span className="text-zinc-900 font-bold truncate max-w-[140px] sm:max-w-[220px]">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.href}
                        className="text-zinc-500 hover:text-zinc-900 transition-colors truncate"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Center: Quick Search Trigger Button */}
            <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-400 bg-zinc-50 hover:bg-zinc-100 hover:text-zinc-600 border border-zinc-200/90 rounded-lg transition-all shadow-2xs group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search size={14} className="text-zinc-400 group-hover:text-red-600 transition-colors" />
                  <span className="font-normal text-zinc-500">Cari nomor faktur, klien...</span>
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-500 font-semibold shadow-2xs">
                  <Command size={10} /> K
                </kbd>
              </button>
            </div>

            {/* Right: Actions, Date, Status, Quick Create */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Search button on smaller screens */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                title="Pencarian Cepat (Ctrl+K)"
              >
                <Search size={17} />
              </button>

              {/* Live Date Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200/80 rounded-md text-[11px] font-medium text-zinc-600">
                <Calendar size={12} className="text-red-600" />
                <span>{currentDate}</span>
              </div>


              {/* Subtle divider */}
              <div className="h-5 w-px bg-zinc-200" />

              {/* User Profile on the Far Right */}
              <UserProfileMenu />
            </div>

          </div>
        </div>
      </header>

      {/* ── Quick Search Modal (Command Palette) ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
          <div 
            className="bg-white border border-zinc-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-3.5 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
              <Search size={18} className="text-red-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nomor invoice, nama klien, atau produk..."
                className="w-full bg-transparent border-none outline-hidden text-sm text-zinc-900 placeholder:text-zinc-400 font-medium"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Suggestions & Results */}
            <div className="p-3 max-h-80 overflow-y-auto space-y-3 text-xs">
              {!searchQuery.trim() ? (
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-red-600" />
                    Pintasan Navigasi Cepat
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <button
                      onClick={() => { navigate('/invoices/new'); setSearchOpen(false); }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-zinc-800 hover:text-red-700 text-left transition-colors font-semibold cursor-pointer"
                    >
                      <Plus size={14} className="text-red-600" />
                      Buat Faktur Baru
                    </button>
                    <button
                      onClick={() => { navigate('/invoices'); setSearchOpen(false); }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 text-zinc-800 text-left transition-colors font-semibold cursor-pointer"
                    >
                      <FileText size={14} className="text-zinc-600" />
                      Daftar Faktur
                    </button>
                    <button
                      onClick={() => { navigate('/clients'); setSearchOpen(false); }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 text-zinc-800 text-left transition-colors font-semibold cursor-pointer"
                    >
                      <Users size={14} className="text-zinc-600" />
                      Kontak Klien
                    </button>
                    <button
                      onClick={() => { navigate('/products'); setSearchOpen(false); }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 text-zinc-800 text-left transition-colors font-semibold cursor-pointer"
                    >
                      <Package size={14} className="text-zinc-600" />
                      Katalog Produk
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Invoices match */}
                  {invoices.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-1">
                        Faktur ({invoices.length})
                      </div>
                      <div className="space-y-1">
                        {invoices.slice(0, 4).map((inv) => (
                          <button
                            key={inv.id}
                            onClick={() => { navigate(`/invoices/${inv.id}`); setSearchOpen(false); }}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-red-600 shrink-0" />
                              <div>
                                <div className="font-bold text-zinc-900 font-mono">{inv.invoice_number}</div>
                                <div className="text-[11px] text-zinc-500">{inv.client.name}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono font-semibold text-zinc-900">
                              Rp {inv.total.toLocaleString('id-ID')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clients match */}
                  {clients.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-1">
                        Klien ({clients.length})
                      </div>
                      <div className="space-y-1">
                        {clients.map((client) => (
                          <button
                            key={client.id}
                            onClick={() => { navigate('/clients'); setSearchOpen(false); }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer"
                          >
                            <Users size={14} className="text-zinc-600 shrink-0" />
                            <div>
                              <div className="font-bold text-zinc-900">{client.name}</div>
                              <div className="text-[11px] text-zinc-500">{client.email || client.city || 'Klien'}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products match */}
                  {products.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-1">
                        Produk & Jasa ({products.length})
                      </div>
                      <div className="space-y-1">
                        {products.map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => { navigate('/products'); setSearchOpen(false); }}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Package size={14} className="text-zinc-600 shrink-0" />
                              <div className="font-semibold text-zinc-900">{prod.name}</div>
                            </div>
                            <span className="font-mono text-zinc-700">
                              Rp {prod.price.toLocaleString('id-ID')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {invoices.length === 0 && clients.length === 0 && products.length === 0 && (
                    <div className="py-6 text-center text-zinc-400">
                      Tidak ditemukan hasil untuk <span className="font-semibold text-zinc-700">"{searchQuery}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 text-[10px] text-zinc-400 flex items-center justify-between px-3">
              <span>Tekan <kbd className="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-zinc-600 font-semibold">ESC</kbd> untuk menutup</span>
              <span className="text-zinc-400">Pencarian Pintar</span>
            </div>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)} />
        </div>
      )}
    </>
  );
}
