"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { ArrowLeft } from 'lucide-react';

export default function CreatePatientPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/patients/', data);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'ลงทะเบียนผู้ป่วยใหม่เรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      });
      router.push('/patients');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'บันทึกข้อมูลล้มเหลว',
        text: error.response?.data?.detail || 'เกิดข้อผิดพลาดขึ้น',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200 flex items-center">
        <Link href="/patients" className="mr-4 text-gray-500 hover:text-gray-900 border p-2 rounded hover:bg-gray-50">
           <ArrowLeft size={20} />
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">เพิ่มข้อมูลผู้ป่วยใหม่</h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">รหัสผู้ป่วย (HN) *</label>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="เช่น HN123456"
                {...register("hn", { required: true })}
              />
              {errors.hn && <span className="text-red-500 text-sm">กรุณากรอกรหัส HN</span>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">ชื่อ - นามสกุล *</label>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="ชื่อ นามสกุล"
                {...register("full_name", { required: true })}
              />
              {errors.full_name && <span className="text-red-500 text-sm">กรุณากรอกชื่อ-นามสกุล</span>}
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
                defaultValue=""
              >
                <option value="" disabled>เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
              {errors.gender && <span className="text-red-500 text-sm">กรุณาเลือกเพศ</span>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">เบอร์โทรศัพท์ติดต่อ</label>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="08x-xxx-xxxx"
                {...register("phone")}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">กรุ๊ปเลือด</label>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...register("blood_group")}
                defaultValue=""
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
            <label className="block mb-2 text-sm font-medium text-gray-900">ที่อยู่ปัจจุบัน</label>
            <textarea 
              rows={3}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="ที่อยู่ของผู้ป่วย"
              {...register("address")}
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">โรคประจำตัว (ถ้ามี)</label>
            <textarea 
              rows={2}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="เช่น เบาหวาน, ความดันโลหิตสูง ฯลฯ"
              {...register("congenital_disease")}
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => router.push('/patients')}
              className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลผู้ป่วย'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
