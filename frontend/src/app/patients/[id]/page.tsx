"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { ArrowLeft, User, Activity, FileText, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchPatientInfo = async () => {
    try {
      const pRes = await api.get(`/patients/${id}`);
      setPatient(pRes);
      
      const rRes = await api.get(`/records/patient/${id}`);
      setRecords(rRes);
    } catch (error) {
      console.error("Failed to fetch patient details", error);
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถค้นหาข้อมูลผู้ป่วยได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientInfo();
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    }
  }, [id]);

  const handleDeleteRecord = async (recordId: string) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "ลบประวัติการรักษานี้แล้วจะไม่สามารถนำกลับมาได้อีก!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบประวัติการรักษา',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/records/${recordId}`);
        Swal.fire('ลบสำเร็จ!', 'ลบข้อมูลประวัติการรักษานี้แล้ว', 'success');
        fetchPatientInfo();
      } catch (error: any) {
        Swal.fire('ข้อผิดพลาด!', error.response?.data?.detail || 'ลบไม่ได้ (เฉพาะ Admin เท่านั้น)', 'error');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">กำลังโหลดรายละเอียดผู้ป่วย...</div>;
  }

  if (!patient) return <div>ไม่พบผู้ป่วยในระบบ</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/patients" className="mr-4 text-gray-500 hover:text-gray-900 border p-2 rounded hover:bg-gray-50">
           <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">รายละเอียดผู้ป่วย</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 border rounded-lg bg-white shadow-sm overflow-hidden">
           <div className="bg-blue-50 p-6 flex flex-col items-center">
             <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-blue-600">
               <User size={48} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 text-center">{patient.full_name}</h3>
             <p className="text-sm font-medium text-gray-500 mt-1">รหัสผู้ป่วย (HN): {patient.hn}</p>
             <Link href={`/patients/${id}/edit`} className="mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 font-medium">
               แก้ไขข้อมูลส่วนตัว
             </Link>
           </div>
           
           <div className="p-6 space-y-4">
             <div className="border-b pb-4">
               <span className="block text-sm text-gray-500 mb-1">เพศ</span>
               <span className="font-medium text-gray-900 capitalize">{patient.gender === 'male' ? 'ชาย' : patient.gender === 'female' ? 'หญิง' : 'อื่นๆ'}</span>
             </div>
             <div className="border-b pb-4">
               <span className="block text-sm text-gray-500 mb-1">วัน/เดือน/ปี เกิด</span>
               <span className="font-medium text-gray-900">{format(new Date(patient.birth_date), 'dd MMM yyyy')}</span>
             </div>
             <div className="border-b pb-4">
               <span className="block text-sm text-gray-500 mb-1">เบอร์โทรติดต่อ</span>
               <span className="font-medium text-gray-900">{patient.phone || '-'}</span>
             </div>
             <div className="border-b pb-4">
               <span className="block text-sm text-gray-500 mb-1">กรุ๊ปเลือด</span>
               <span className="font-medium text-gray-900">{patient.blood_group || '-'}</span>
             </div>
             <div className="border-b pb-4">
               <span className="block text-sm text-gray-500 mb-1">ที่อยู่</span>
               <span className="font-medium text-gray-900">{patient.address || '-'}</span>
             </div>
             <div>
               <span className="block text-sm text-gray-500 mb-1 flex items-center"><Activity size={14} className="mr-1 text-red-500"/> โรคประจำตัว</span>
               <span className="font-medium text-gray-900">{patient.congenital_disease || 'ไม่มี'}</span>
             </div>
           </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FileText size={20} className="mr-2 text-blue-600" />
                ประวัติการรักษา
              </h3>
              {user?.role !== 'admin' && (
                <Link href={`/patients/${id}/records/create`} className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                  <Plus size={16} className="mr-1" />
                  เพิ่มประวัติการรักษา
                </Link>
              )}
            </div>
            
            <div className="p-0">
               {records.length > 0 ? (
                 <div className="divide-y divide-gray-200">
                    {records.map((record) => (
                      <div key={record.id} className="p-6 hover:bg-gray-50 transition w-full">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 text-lg">{format(new Date(record.exam_date), 'dd MMMM yyyy')}</h4>
                          <button onClick={() => handleDeleteRecord(record.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded" title="ลบประวัตินี้">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-gray-500 block">แพทย์ผู้ตรวจ: </span>
                          <span className="text-sm text-gray-900">{record.doctor_name || 'ไม่ระบุ'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-blue-50 p-3 rounded">
                            <span className="text-xs font-bold text-blue-800 uppercase block mb-1">อาการสำคัญ (Symptoms)</span>
                            <p className="text-sm text-gray-800">{record.symptoms}</p>
                          </div>
                          <div className="bg-amber-50 p-3 rounded">
                            <span className="text-xs font-bold text-amber-800 uppercase block mb-1">การวินิจฉัย (Diagnosis)</span>
                            <p className="text-sm text-gray-800">{record.diagnosis}</p>
                          </div>
                        </div>
                        {record.treatment && (
                          <div className="mt-4 bg-green-50 p-3 rounded">
                             <span className="text-xs font-bold text-green-800 uppercase block mb-1">การรักษา / การสั่งยา (Treatment/Medication)</span>
                             <p className="text-sm text-gray-800">{record.treatment}</p>
                          </div>
                        )}
                        {record.note && (
                          <div className="mt-4 bg-gray-100 p-3 rounded border border-gray-200">
                             <span className="text-xs font-bold text-gray-600 uppercase block mb-1">หมายเหตุเพิ่มเติม</span>
                             <p className="text-sm text-gray-800 italic">{record.note}</p>
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="p-10 text-center text-gray-500">
                   ไม่พบประวัติการรักษาของผู้ป่วยรายนี้ {user?.role !== 'admin' ? 'กดปุ่ม "เพิ่มประวัติการรักษา" เพื่อบันทึกข้อมูล' : ''}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
