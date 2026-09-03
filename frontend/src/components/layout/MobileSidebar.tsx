import { Link, useLocation } from 'react-router-dom';

import {
  FileText,
  Building2,
  Users,
  Package,
  LayoutDashboard,
  Plus,
  X,
  ReceiptText,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Faktur / Invoice', href: '/invoices', icon: FileText },
  { name: 'Dokumen Serah Terima', href: '/handovers', icon: ReceiptText },
  { name: 'Profil Perusahaan', href: '/companies', icon: Building2 },
  { name: 'Buku Kontak Klien', href: '/clients', icon: Users },
  { name: 'Katalog Produk & Jasa', href: '/products', icon: Package },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({
  open,
  onClose,
}: MobileSidebarProps) {
  const location = useLocation();

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex">
      <div className="bg-zinc-950 text-zinc-200 w-72 h-full p-5 flex flex-col border-r border-zinc-800 shadow-2xl">

        {/* Logo */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5 font-bold text-white text-base">
            <div className="w-7 h-7 rounded-md bg-red-600 text-white flex items-center justify-center font-black shadow-xs">
              <ReceiptText size={16} />
            </div>

            <span className="font-extrabold">
              Do<span className="text-red-500">Kuy</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Create Document */}
        <Link
          to="/invoices/new"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-lg shadow-xs mb-5 text-xs transition-colors"
        >
          <Plus size={15} />
          Buat Dokumen Baru
        </Link>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' &&
                location.pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white border-l-2 border-red-500'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon
                  size={16}
                  className={
                    isActive
                      ? 'text-red-500'
                      : 'text-zinc-500'
                  }
                />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-400 flex flex-col items-center gap-1 text-center">
          
          <div className="text-zinc-500 font-mono text-[9.5px]">
            © {new Date().getFullYear()} {' '}
            <span className="text-zinc-300 font-medium">
                 Developed by Moracraft - BeEs Software Engineer
            </span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className="flex-1"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
}