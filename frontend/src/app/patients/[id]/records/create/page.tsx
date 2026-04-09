"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function CreateRecordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        patient_id: id
      };
      
      await api.post('/records/', payload);
      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        text: 'ประวัติการรักษาถูกเพิ่มลงในระบบเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      });
      router.push(`/patients/${id}`);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'บันทึกล้มเหลว',
        text: error.response?.data?.detail || 'เกิดข้อผิดพลาดในการบันทึก',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200 flex items-center bg-blue-50">
        <Link href={`/patients/${id}`} className="mr-4 text-gray-500 hover:text-gray-900 border p-2 rounded hover:bg-gray-50 bg-white">
           <ArrowLeft size={20} />
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">เพิ่มประวัติการรักษาใหม่</h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">วันที่ตรวจ *</label>
              <input 
                type="date" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                defaultValue={todayStr}
                {...register("exam_date", { required: true })}
              />
              {errors.exam_date && <span className="text-red-500 text-sm">กรุณากำหนดวันที่ตรวจ</span>}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">อาการเบื้องต้น (Symptoms) *</label>
            <textarea 
              rows={3}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="ผู้ป่วยมีอาการอะไรมาบ้าง"
              {...register("symptoms", { required: true })}
            ></textarea>
            {errors.symptoms && <span className="text-red-500 text-sm">กรุณากรอกอาการเบื้องต้นของคนไข้ค</span>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">ผลการวินิจฉัยโรค (Diagnosis) *</label>
            <textarea 
              rows={3}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="คำวินิจฉัยทางการแพทย์"
              {...register("diagnosis", { required: true })}
            ></textarea>
            {errors.diagnosis && <span className="text-red-500 text-sm">กรุณากรอกผลการวินิจฉัยโรค</span>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">การรักษา / การสั่งจ่ายยา (Treatment/Medications)</label>
            <textarea 
              rows={3}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="ยาที่ให้หรือแนวทางการรักษา"
              {...register("treatment")}
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">ข้อสังเกตเพิ่มเติม (Notes)</label>
            <textarea 
              rows={2}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="รายละเอียดอื่นๆ นัดหมายครั้งถัดไป ฯลฯ"
              {...register("note")}
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
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกประวัติการรักษา'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
