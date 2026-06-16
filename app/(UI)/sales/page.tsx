"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingCart } from "lucide-react";

interface CartItem {
  project_id: string;
  title: string;
  amount: number;
  image: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("tmt_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const removeItem = (project_id: string) => {
    const updated = items.filter(item => item.project_id !== project_id);
    setItems(updated);
    localStorage.setItem("tmt_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  // إعادة تفعيل دالة الانتقال لصفحة الدفع
  const handleGoToCheckout = () => {
    if (items.length === 0) return;
    router.push(`/checkout?amount=${totalAmount}`);
  };

  return (
    <div className="bg-[#F8FAFB] min-h-screen py-10 px-4 md:px-6" dir="rtl">
      {/* مسار الصفحة العلوي (Breadcrumbs) */}
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-400 mb-6 font-medium">
        <div className="flex gap-1.5">
          <a href="/" className="hover:text-gray-600">الرئيسية</a> /
          <span className="text-gray-500 font-bold">سلة التبرعات</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        

        
        {/* القسم الأيسر: بطاقة حساب المستخدم الترحيبية الثابتة */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center">
            <div className="bg-[#E6F0F0] p-6 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-[#009689] flex items-center justify-center text-gray-300 mb-2">
                <svg className="w-8 h-8 text-[#009689]/75" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-3-8-3z" />
                </svg>
              </div>
            </div>
            
            <div className="divide-y divide-gray-50 text-right text-sm">
              <a href="/login" className="flex items-center gap-2.5 p-4 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                <span className="text-[#009689] text-base">👤</span>
                <span>تسجيل الدخول أو جديد</span>
              </a>
              <div className="flex items-center justify-between p-4 bg-slate-50/50 border-r-4 border-[#009689] text-[#009689] font-bold">
                <div className="flex items-center gap-2.5">
                  <span>🛒</span>
                  <span>سلة التبرعات</span>
                </div>
                <span className="bg-[#009689] text-white text-xs px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
            </div>
          </div>
        </div>


        {/* القسم الأيمن: السلة والجدول الرئيسي */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* عنوان السلة */}
          <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-white">
            <ShoppingCart size={22} className="text-[#009689]" />
            <h1 className="text-lg font-black text-slate-800">سلة التبرعات</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white">
              <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 mb-6 font-medium">سلة التبرعات فارغة حالياً</p>
              <a
                href="/store"
                className="bg-[#009689] text-white px-8 py-3 rounded-xl font-bold inline-block hover:bg-[#0b6e65] transition-all"
              >
                تصفح المشاريع
              </a>
            </div>
          ) : (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-sm">
                  <thead>
                    <tr className="bg-[#E6F0F0] text-[#009689] font-bold text-xs">
                      <th className="p-4 rounded-r-xl">الصورة</th>
                      <th className="p-4">المشروع</th>
                      <th className="p-4 text-center">المبلغ</th>
                      <th className="p-4 text-center">الكمية</th>
                      <th className="p-4 text-center">الإجمالي</th>
                      <th className="p-4 text-center rounded-l-xl">الخيارات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-slate-700">
                    {items.map((item, index) => (
                      <tr key={`${item.project_id}-${index}`} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 w-24">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            <img
                              src={item.image || '/de.jpg'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-900 max-w-xs">
                          {item.title}
                        </td>
                        <td className="p-4 text-center font-bold text-gray-400 whitespace-nowrap">
                          {item.amount.toLocaleString("ar-SA")} ر.س
                        </td>
                        {/* تعديل الكمية لتظهر رقم عادي 1 كالعادة في السلات بدون علامة الصح الزائدة */}
                        <td className="p-4 text-center w-24">
                          <div className="inline-block bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 font-bold text-slate-800 text-sm">
                            1
                          </div>
                        </td>
                        <td className="p-4 text-center font-black text-[#009689] whitespace-nowrap">
                          {item.amount.toLocaleString("ar-SA")} ر.س
                        </td>
                        <td className="p-4 text-center w-16">
                          <button
                            onClick={() => removeItem(item.project_id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* الجزء السفلي المعاد ترتيبه: الإجمالي + زر الإتمام الفعلي */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* عرض الإجمالي الإجمالي */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">المبلغ الإجمالي هو:</span>
                  <span className="text-2xl font-black text-slate-900">
                    {totalAmount.toLocaleString("ar-SA")}
                  </span>
                  <span className="text-xs font-bold text-gray-400">ر.س</span>
                </div>

                {/* زر إتمام التبرع الأساسي الذي حُذف خطأً */}
                <button
                  onClick={handleGoToCheckout}
                  disabled={items.length === 0}
                  className="bg-[#009689] text-white px-10 py-3 py-3.5 rounded-xl font-black text-base hover:bg-[#0b6e65] transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  إتمـام التبـرع
                </button>

              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}