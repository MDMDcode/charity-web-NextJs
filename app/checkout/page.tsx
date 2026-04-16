"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, ShieldCheck, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import apiClient from "@/app/lib/api"; 

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const amountFromUrl = searchParams.get('amount') || "0";
  
  const [form, setForm] = useState({ donor_name: "", donor_phone: "" });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // جلب السلة والتأكد من البيانات
  useEffect(() => {
    const data = localStorage.getItem("tmt_cart");
    if (data) {
      const parsedData = JSON.parse(data);
      setCartItems(parsedData);
      console.log("المشاريع المحملة:", parsedData); // للتأكد في الكونسول
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donor_phone) return alert("رقم الجوال مطلوب");
    if (cartItems.length === 0) return alert("السلة لا تزال فارغة!");

    setLoading(true);
    try {
      
      // إرسال POST الحقيقي
      await apiClient.post(`donations`, {
        donor_name: form.donor_name || "فاعل خير",
        donor_phone: form.donor_phone,
        items: cartItems.map(item => ({
          project_id: item.project_id,
          amount: item.amount
        }))
      });

      setIsSuccess(true);
      localStorage.removeItem("tmt_cart");
    } catch (error) {
      alert("حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) return <SuccessView name={form.donor_name} />;

  return (
    <main className="min-h-screen bg-[#F8FAFB] py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* نموذج البيانات */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border shadow-sm">
          <h2 className="text-xl font-black mb-6">بيانات المتبرع</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input 
              type="text" placeholder="الاسم الكامل" 
              className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
              onChange={(e) => setForm({...form, donor_name: e.target.value})}
            />
            <input 
              type="tel" required placeholder="رقم الجوال (05xxxxxxxx)" 
              className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689] text-left"
              onChange={(e) => setForm({...form, donor_phone: e.target.value})}
            />
            <button className="w-full bg-[#009689] text-white py-5 rounded-2xl font-bold flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
              تأكيد التبرع بمبلغ {amountFromUrl} ر.س
            </button>
          </form>
        </div>

        {/* ملخص السلة مع الصور */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border shadow-sm h-fit">
          <h2 className="font-bold mb-4 border-b pb-2">محتويات السلة</h2>
          <div className="space-y-4">
            {cartItems.length > 0 ? cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                {/* عرض الصورة هنا */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-[#009689] font-black">{item.amount} ر.س</p>
                </div>
              </div>
            )) : <p className="text-gray-400 text-center py-4">السلة فارغة</p>}
          </div>
        </div>

      </div>
    </main>
  );
}

function SuccessView({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <CheckCircle2 size={80} className="text-[#009689] mb-4" />
      <h1 className="text-2xl font-bold">شكراً لك {name || "فاعل خير"}</h1>
      <p className="text-gray-500">تم تسجيل تبرعك بنجاح في قاعدة البيانات.</p>
      <Link href="/" className="mt-6 bg-[#009689] text-white px-8 py-3 rounded-xl font-bold">العودة للرئيسية</Link>
    </div>
  );
}