import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  FileText, 
  Building2, 
  Users, 
  Package, 
  LayoutDashboard, 
  Plus, 
  X, 
  ReceiptText
} from 'lucide-react';
import { ModernNavbar } from './Navbar';

const navigation = [
  { name: 'Ringkasan', href: '/', icon: LayoutDashboard },
  { name: 'Faktur / Invoice', href: '/invoices', icon: FileText },
  { name: 'Profil Perusahaan', href: '/companies', icon: Building2 },
  { name: 'Buku Kontak Klien', href: '/clients', icon: Users },
  { name: 'Katalog Produk & Jasa', href: '/products', icon: Package },
];

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col md:flex-row text-slate-900">
      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex">
          <div className="bg-zinc-950 text-zinc-200 w-72 h-full p-5 flex flex-col border-r border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5 font-bold text-white text-base">
                <div className="w-7 h-7 rounded-md bg-red-600 text-white flex items-center justify-center font-black shadow-xs">
                  <ReceiptText size={16} />
                </div>
                <span className="font-extrabold">Invoice<span className="text-red-500">Gen</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <Link
              to="/invoices/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-lg shadow-xs mb-5 text-xs transition-colors"
            >
              <Plus size={15} /> Buat Faktur Baru
            </Link>

            <nav className="space-y-1 flex-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-zinc-900 text-white border-l-2 border-red-500'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-red-500' : 'text-zinc-500'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-400 flex flex-col items-center gap-1 text-center">
              <div className="flex items-center gap-1 text-zinc-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                <span>InvoiceGen</span>
              </div>
              <div className="text-zinc-500 font-mono text-[9.5px]">
                © {new Date().getFullYear()} by <span className="text-zinc-300 font-medium">Bercisk Software Engineer</span>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-zinc-950 text-zinc-300 border-r border-zinc-800/80 z-30">
        <div className="p-5 border-b border-zinc-800/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black shadow-sm">
            <ReceiptText size={18} />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-tight leading-none">
              Invoice<span className="text-red-500">Gen</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              Sistem Faktur & Billing
            </div>
          </div>
        </div>

        <div className="p-3.5">
          <Link
            to="/invoices/new"
            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-2.5 rounded-lg text-xs transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>Buat Faktur Baru</span>
          </Link>
        </div>

        <div className="px-3.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Menu Utama
        </div>

        <nav className="px-3 py-1 space-y-0.5 flex-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white border-l-2 border-red-500 pl-2.5 shadow-xs'
                    : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-red-500' : 'text-zinc-500'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Modern Sidebar Footer & Copyright ── */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/90 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-300 font-semibold">Sistem Siap</span>
            </div>
            <span className="text-zinc-500 font-mono text-[9px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
              v1.2.0
            </span>
          </div>

          <div className="pt-1.5 border-t border-zinc-900/90 text-[9.5px] text-zinc-500 leading-tight">
            <span>© {new Date().getFullYear()} by </span>
            <span className="font-semibold text-zinc-300 hover:text-red-400 transition-colors">
              Bercisk Software Engineer
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 md:pl-60 flex flex-col min-h-screen">
        {/* Modern Top Navbar Component */}
        <ModernNavbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>

        {/* ── Modern Global Layout Footer ── */}
        <footer className="border-t border-zinc-200/80 bg-white/70 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              <span className="font-bold text-zinc-900">InvoiceGen</span>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <span className="text-zinc-500 text-[11px] hidden sm:inline">Platform Faktur & Invoice Profesional</span>
            </div>

            {/* Copyright Badge */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-zinc-400">Copyright © {new Date().getFullYear()}</span>
              <span className="font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 px-2 py-0.5 rounded-md transition-colors text-zinc-800">
                by <span className="text-red-600 font-extrabold">Bercisk</span> Software Engineer
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
