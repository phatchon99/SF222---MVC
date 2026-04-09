"use client";
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex pt-16 overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 sm:ml-64">
          <main className="min-h-screen pt-4 pb-20 px-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
