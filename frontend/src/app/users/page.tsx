"use client";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { Trash2, UserPlus, Shield, User } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res);
    } catch (error: any) {
      if (error.response?.status === 403) {
        Swal.fire('ปฏิเสธการเข้าถึง', 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (เฉพาะ Admin)', 'error');
        router.push('/dashboard');
      } else {
        console.error("Failed to fetch users", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check role before fetching
    const userData = localStorage.getItem('user');
    if (userData) {
       const u = JSON.parse(userData);
       if (u.role !== 'admin') {
          router.push('/dashboard');
          return;
       }
    } else {
       router.push('/login');
       return;
    }
    
    fetchUsers();
  }, [router]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'ลบบัญชีผู้ใช้?',
      text: "การกระทำนี้ไม่สามารถย้อนกลับได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบข้อมูล'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        Swal.fire('สำเร็จ', 'บัญชีถูกลบแล้ว', 'success');
        fetchUsers();
      } catch (error: any) {
        Swal.fire('ข้อผิดพลาด!', error.response?.data?.detail || 'ล้มเหลวในการลบบัญชี', 'error');
      }
    }
  };

  const onSubmitNewUser = async (data: any) => {
    setAddingUser(true);
    try {
      await api.post('/users', data);
      Swal.fire('สำเร็จ', 'เพิ่มบัญชีบุคลากรใหม่เรียบร้อยแล้ว', 'success');
      setShowAddModal(false);
      reset();
      fetchUsers();
    } catch (error: any) {
      Swal.fire('ข้อผิดพลาด', error.response?.data?.detail || 'ล้มเหลวในการเพิ่มบัญชี', 'error');
    } finally {
      setAddingUser(false);
    }
  };

  if (loading) return <div className="p-10 text-center">กำลังโหลดข้อมูลบุคลากร...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
           <Shield className="mr-2 text-blue-600" /> จัดการบุคลากร (Staff Management)
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus size={18} className="mr-2" />
          เพิ่มบุคลากรใหม่
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-lg">ชื่อ - นามสกุล</th>
              <th scope="col" className="px-6 py-3">อีเมล</th>
              <th scope="col" className="px-6 py-3">บทบาท (Role)</th>
              <th scope="col" className="px-6 py-3">วันที่สร้างบัญชี</th>
              <th scope="col" className="px-6 py-3 rounded-tr-lg text-right">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                    <User size={16} className="mr-2 text-gray-400" />
                    {u.name}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {u.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'แพทย์/เจ้าหน้าที่ (User)'}
                     </span>
                  </td>
                  <td className="px-6 py-4">{format(new Date(u.created_at), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4 text-right">
                     <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="ลบบัญชี">
                       <Trash2 size={18} />
                     </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  ไม่พบบัญชีผู้ใช้งาน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                     <UserPlus className="mr-2" size={24} />
                     เพิ่มบัญชีบุคลากรใหม่
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">สร้างบัญชีสำหรับแพทย์หรือผู้ดูแลระบบ</p>
               </div>
               
               <div className="p-6">
                 <form onSubmit={handleSubmit(onSubmitNewUser)} className="space-y-5">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900">ชื่อ - นามสกุล</label>
                    <input 
                      type="text" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                      {...register("name", { required: true })}
                    />
                    {errors.name && <span className="text-red-500 text-xs">กรุณากรอกชื่อ</span>}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900">อีเมล (ใช้สำหรับล็อกอิน)</label>
                    <input 
                      type="email" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                      {...register("email", { required: true })}
                    />
                    {errors.email && <span className="text-red-500 text-xs">กรุณากรอกอีเมล</span>}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900">รหัสผ่านชั่วคราว</label>
                    <input 
                      type="password" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                      {...register("password", { required: true, minLength: 6 })}
                    />
                    {errors.password && <span className="text-red-500 text-xs">รหัสอย่างน้อย 6 ตัวอักษร</span>}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900">ระดับสิทธิ์ (Role)</label>
                    <select 
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                      {...register("role")}
                      defaultValue="user"
                    >
                      <option value="user">แพทย์ / เจ้าหน้าที่ทั่วไป</option>
                      <option value="admin">ผู้ดูแลระบบ</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end pt-5 mt-2 gap-3">
                     <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">ยกเลิก</button>
                     <button type="submit" disabled={addingUser} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white rounded-xl text-sm font-medium transition-all shadow-md disabled:bg-blue-400">
                        {addingUser ? 'กำลังสร้าง...' : 'ยืนยันการเพิ่มบัญชี'}
                     </button>
                  </div>
               </form>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
