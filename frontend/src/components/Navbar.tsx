"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link href="/" className="text-xl font-bold flex items-center lg:ml-2.5">
              <span className="self-center whitespace-nowrap text-blue-600">ระบบจัดการผู้ป่วย</span>
            </Link>
          </div>
          <div className="flex items-center">
             {user ? (
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserIcon size={18} />
                    <span className="font-semibold">{user.name}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่'}</span>
                 </div>
                 <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="ออกจากระบบ">
                    <LogOut size={20} />
                 </button>
               </div>
             ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">เข้าสู่ระบบ</Link>
                </div>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
}
