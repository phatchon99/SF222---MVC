"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Users, FileText, UserPlus, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        const res = await api.get('/dashboard/stats');
        setStats(res);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">กำลังโหลดข้อมูลหน้าหลัก...</div>;
  }

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">หน้าหลัก (Dashboard)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ผู้ป่วยทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_patients || 0}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ผู้ป่วยใหม่วันนี้</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.new_patients_today || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ประวัติการรักษาทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_records || 0}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">สถานะระบบ</p>
            <p className="text-2xl font-bold text-gray-900">ออนไลน์</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">สัดส่วนผู้ป่วยแยกตามเพศ</h3>
          <div className="h-64">
             {stats?.gender_stats?.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={stats.gender_stats}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     outerRadius={80}
                     fill="#8884d8"
                     dataKey="count"
                     nameKey="gender"
                     label={({ name, percent }) => `${name === 'male' ? 'ชาย' : name === 'female' ? 'หญิง' : 'อื่นๆ'} ${((percent || 0) * 100).toFixed(0)}%`}
                   >
                     {stats.gender_stats.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                   <Legend formatter={(value) => value === 'male' ? 'ชาย' : value === 'female' ? 'หญิง' : 'อื่นๆ'} />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="flex justify-center items-center h-full text-gray-500">ยังไม่มีข้อมูล</div>
             )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">ผู้ป่วยที่เพิ่มล่าสุด</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">รหัสผู้ป่วย (HN)</th>
                  <th scope="col" className="px-6 py-3">ชื่อ - นามสกุล</th>
                  <th scope="col" className="px-6 py-3">วันที่ลงทะเบียน</th>
                </tr>
              </thead>
              <tbody>
                 {stats?.recent_patients?.length > 0 ? (
                   stats.recent_patients.map((patient: any) => (
                      <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{patient.hn}</td>
                        <td className="px-6 py-4">{patient.full_name}</td>
                        <td className="px-6 py-4">{format(new Date(patient.created_at), 'dd MMM yyyy')}</td>
                      </tr>
                   ))
                 ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">ไม่พบข้อมูลผู้ป่วย</td>
                    </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
