"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      localStorage.setItem('token', response.access_token);
      
      // Fetch user data
      const userRes = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(userRes));
      
      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        showConfirmButton: false,
        timer: 1500
      });
      router.push('/dashboard');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบล้มเหลว',
        text: error.response?.data?.detail || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <Link href="/" className="flex items-center mb-6 text-2xl font-bold text-blue-600">
        ระบบจัดการผู้ป่วย
      </Link>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            เข้าสู่ระบบบัญชีของคุณ
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">อีเมล</label>
              <input 
                type="email" 
                id="email" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                placeholder="name@company.com" 
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-500 text-sm">กรุณากรอกอีเมล</span>}
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">รหัสผ่าน</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                {...register("password", { required: true })}
              />
              {errors.password && <span className="text-red-500 text-sm">กรุณากรอกรหัสผ่าน</span>}
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
            <p className="text-sm font-light text-gray-500">
              ยังไม่มีบัญชีผู้ใช้? <Link href="/register" className="font-medium text-blue-600 hover:underline">สมัครสมาชิก</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
