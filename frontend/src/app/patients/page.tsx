"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { Eye, Edit, Trash2, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res);
    } catch (error) {
      console.error("Failed to fetch patients", error);
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ป่วยได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "การลบข้อมูลจะไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ฉันต้องการลบ!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/patients/${id}`);
        Swal.fire('ลบสำเร็จ!', 'ข้อมูลผู้ป่วยถูกลบออกจากระบบแล้ว', 'success');
        fetchPatients();
      } catch (error: any) {
        Swal.fire('ข้อผิดพลาด!', error.response?.data?.detail || 'ล้มเหลวในการลบข้อมูลผู้ป่วย', 'error');
      }
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.hn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">รายชื่อผู้ป่วยทั้งหมด</h2>
          <Link href="/patients/create" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={18} className="mr-2" />
            เพิ่มผู้ป่วยใหม่
          </Link>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="ค้นหาตามชื่อ, รหัสผู้ป่วย (HN), หรือเบอร์โทรศัพท์..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        {loading ? (
          <div className="text-center py-10">กำลังโหลดผู้ป่วย...</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">รหัส (HN)</th>
                <th scope="col" className="px-6 py-3">ชื่อ - นามสกุล</th>
                <th scope="col" className="px-6 py-3">เพศ</th>
                <th scope="col" className="px-6 py-3">เบอร์ติดต่อ</th>
                <th scope="col" className="px-6 py-3">วันที่ลงทะเบียน</th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{patient.hn}</td>
                    <td className="px-6 py-4">{patient.full_name}</td>
                    <td className="px-6 py-4 capitalize">{patient.gender === 'male' ? 'ชาย' : patient.gender === 'female' ? 'หญิง' : 'อื่นๆ'}</td>
                    <td className="px-6 py-4">{patient.phone || '-'}</td>
                    <td className="px-6 py-4">{format(new Date(patient.created_at), 'dd MMM yyyy')}</td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                       <button onClick={() => router.push(`/patients/${patient.id}`)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="ดูรายละเอียด">
                         <Eye size={18} />
                       </button>
                       <button onClick={() => router.push(`/patients/${patient.id}/edit`)} className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50" title="แก้ไข">
                         <Edit size={18} />
                       </button>
                       <button onClick={() => handleDelete(patient.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="ลบข้อมูล">
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    ไม่พบรายชื่อผู้ป่วยที่ตรงกับการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
