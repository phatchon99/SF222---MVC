"use client";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { ArrowLeft } from 'lucide-react';

export default function EditPatientPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        // Remove non-updatable fields for form reset
        const { hn, id: _, created_at, updated_at, medical_records, ...editableParams } = res;
        reset(editableParams);
      } catch (error) {
        Swal.fire('ข้อผิดพลาด', 'ดึงข้อมูลผู้ป่วยล้มเหลว', 'error');
        router.push('/patients');
      } finally {
        setFetching(false);
      }
    };
    fetchPatient();
  }, [id, reset, router]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.put(`/patients/${id}`, data);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'อัปเดตข้อมูลผู้ป่วยสำเร็จ',
        timer: 1500,
        showConfirmButton: false
      });
      router.push(`/patients/${id}`);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'อัปเดตล้มเหลว',
        text: error.response?.data?.detail || 'เกิดข้อผิดพลาดขึ้น',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-10">กำลังโหลดฟอร์มข้อมูล...</div>;

  return (
    <div className="bg-white rounded-lg shadow max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200 flex items-center bg-amber-50">
        <Link href={`/patients/${id}`} className="mr-4 text-gray-500 hover:text-gray-900 border p-2 rounded hover:bg-gray-50 bg-white">
           <ArrowLeft size={20} />
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">แก้ไขข้อมูลผู้ป่วย</h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">ชื่อ - นามสกุล *</label>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                {...register("full_name", { required: true })}
              />
              {errors.full_name && <span className="text-red-500 text-sm">กรุณากรอกชื่อนามสกุล</span>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">วัน/เดือน/ปี เกิด *</label>
              <input 
                type="date" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                {...register("birth_date", { required: true })}
              />
              {errors.birth_date && <span className="text-red-500 text-sm">กรุณาระบุวันเกิด</span>}
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">เพศ *</label>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...register("gender", { required: true })}
              >
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">เบอร์ติดต่อ</label>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                {...register("phone")}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">กรุ๊ปเลือด</label>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...register("blood_group")}
              >
                <option value="" disabled>เลือกกรุ๊ปเลือด</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">ที่อยู่</label>
            <textarea 
              rows={3}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              {...register("address")}
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">โรคประจำตัว</label>
            <textarea 
              rows={2}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              {...register("congenital_disease")}
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => router.push(`/patients/${id}`)}
              className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="text-white bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-amber-400"
            >
              {loading ? 'กำลังบันทึก...' : 'อัปเดตข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
