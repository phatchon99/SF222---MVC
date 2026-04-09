"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Settings } from 'lucide-react';
import clsx from 'clsx';

import { useEffect, useState } from 'react';

const menuItems = [
  { name: 'หน้าหลัก (Dashboard)', icon: Home, path: '/dashboard' },
  { name: 'รายชื่อผู้ป่วย', icon: Users, path: '/patients' },
  { name: 'จัดการบุคลากร (Staff)', icon: Settings, path: '/users', adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    }
  }, [pathname]);

  return (
    <aside className="fixed top-0 left-0 hidden sm:flex z-20 flex-col w-64 h-full pt-16 min-h-screen border-r border-gray-200 bg-white transition-width duration-75">
      <div className="flex-1 px-3 space-y-1 bg-white divide-y space-y-2">
        <ul className="space-y-2 pb-2">
          {menuItems.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <li key={item.name}>
                <Link 
                  href={item.path} 
                  className={clsx(
                    "flex items-center p-2 text-base font-medium rounded-lg transition-colors group",
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <item.icon className={clsx("w-6 h-6 transition duration-75", isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-900")} />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
