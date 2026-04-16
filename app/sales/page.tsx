"use client";

import { useEffect, useState } from "react";
// تصحيح: استيراد Link من next/link وليس lucide-react
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; // استخدام أيقونة سلة المحذوفات من lucide

interface CartItem {
  project_id: string;
  title: string;
  amount: number;
  image: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  // تحميل البيانات من LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("tmt_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("خطأ في قراءة السلة");
      }
    }
  }, []);

  // وظيفة الحذف من السلة
  const removeItem = (id: string) => {
    const updatedCart = items.filter(item => item.project_id !== id);
    setItems(updatedCart);
    localStorage.setItem("tmt_cart", JSON.stringify(updatedCart));
    
    // تحديث الهيدر
    window.dispatchEvent(new Event("cart-updated"));
  };

  // إجمالي التبرع
  const totalAmount = items.reduce((total, item) => total + item.amount, 0);

  // وظيفة الذهاب للدفع
  const handleGoToCheckout = () => {
    if (items.length === 0) return;
    // التحويل لصفحة الدفع مع تمرير المجموع
    router.push(`/checkout?amount=${totalAmount}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6" dir="rtl">
      <h1 className="text-3xl font-black mb-10 text-gray-800">سلة التبرعات</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 mb-6">سلة التبرعات فارغة حالياً..</p>
          <Link 
            href="/" 
            className="bg-[#009689] text-white px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 inline-block"
          >
            تصفح المشاريع
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
{/* نمرر الـ index كمعامل ثانٍ في دالة map */}
{items.map((item, index) => (
  <div 
    key={`${item.project_id}-${index}`} // دمج الـ ID مع الـ index لضمان التفرد
    className="flex items-center justify-between ..."
  >
              
              {/* القسم الأيمن: الصورة والاسم */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={item.image || '/placeholder.png'} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{item.title}</h3>
                  <span className="text-[#009689] font-black mt-1">{item.amount.toLocaleString()} ر.س</span>
                </div>
              </div>

              {/* القسم الأيسر: زر الحذف */}
              <button 
                onClick={() => removeItem(item.project_id)}
                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="حذف من السلة"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {/* ملخص السلة وزر الدفع */}
          <div className="mt-10 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-500">إجمالي مبلغ التبرع:</span>
              <div className="text-[#009689] flex items-baseline gap-1">
                <span className="text-3xl font-black">{totalAmount.toLocaleString()}</span>
                <span className="text-sm font-bold">ر.س</span>
              </div>
            </div>
            
            <button 
              onClick={handleGoToCheckout}
              className="w-full bg-[#009689] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#0b6e65] transition-all shadow-xl shadow-teal-100 active:scale-[0.98]"
            >
              إتمام التبرع للكل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}