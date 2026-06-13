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

  const handleGoToCheckout = () => {
    if (items.length === 0) return;
    router.push(`/checkout?amount=${totalAmount}`);
  };

  return (
    <div className="  bg-white mx-auto py-16 px-6 " dir="rtl ">
      <h1 className="text-3xl font-black mb-10 text-gray-800  ">سلة التبرعات</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">سلة التبرعات فارغة حالياً</p>
          <Link
            href="/store"
            className="bg-[#009689] text-white px-8 py-3 rounded-xl font-bold inline-block hover:bg-[#0b6e65] transition"
          >
            تصفح المشاريع
          </Link>
        </div>
      ) : (
        <div className="space-y-4 ">
          {items.map((item, index) => (
            <div
              key={`${item.project_id}-${index}`}
              className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
            >
              {/* الصورة والاسم */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-[#009689] font-black mt-1 block">
                    {item.amount.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
              </div>

              {/* زر الحذف */}
              <button
                onClick={() => removeItem(item.project_id)}
                className="p-3 text-black hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="حذف من السلة"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {/* ملخص وزر الدفع */}
          <div className="mt-10 p-8 bg-white text-black border border-gray-100 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-black ">إجمالي مبلغ التبرع:</span>
              <div className="text-[#009689] flex items-baseline gap-1">
                <span className="text-3xl text-black font-black">
                  {totalAmount.toLocaleString("ar-SA")}
                </span>
                <span className="text-sm font-bold text-black">ر.س</span>
              </div>
            </div>

            <button
              onClick={handleGoToCheckout}
              disabled={items.length === 0}
              className="w-full bg-[#009689] text-black py-5 rounded-2xl font-black text-xl hover:bg-[#0b6e65] transition-all shadow-xl shadow-teal-100 active:scale-[0.98] disabled:opacity-60"
            >
              إتمام التبرع
            </button>
          </div>
        </div>
      )}
    </div>
  );
}