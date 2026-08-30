import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Building2,
  Users,
  Package,
  LayoutDashboard,
  Plus,
  ReceiptText,
} from 'lucide-react';

const navigation = [
  { name: 'Ringkasan', href: '/', icon: LayoutDashboard },
  { name: 'Faktur / Invoice', href: '/invoices', icon: FileText },
  { name: 'Profil Perusahaan', href: '/companies', icon: Building2 },
  { name: 'Buku Kontak Klien', href: '/clients', icon: Users },
  { name: 'Katalog Produk & Jasa', href: '/products', icon: Package },
];

export function Sidebar() {
  const location = useLocation();

  return (
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

      <nav className="px-3 py-1 space-y-2 flex-1">
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
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white border-l-2 border-red-500 pl-2.5 shadow-xs'
                  : 'text-zinc-300 hover:bg-zinc-900/80 hover:text-zinc-200'
              }`}
            >
              <Icon
                size={16}
                className={
                  isActive ? 'text-red-500' : 'text-zinc-500'
                }
              />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/90 flex flex-col gap-1.5">
       

        <div className="pt-1.5 border-t border-zinc-900/90 text-[9.5px] text-zinc-500 leading-tight">
          <span>© {new Date().getFullYear()} by </span>

          <span className="font-semibold text-zinc-300 hover:text-red-400 transition-colors">
            Bercisk Software Engineer
          </span>
        </div>
      </div>
    </aside>
  );
}