import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Footer } from './Footer';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:pl-60 flex flex-col min-h-screen">
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}