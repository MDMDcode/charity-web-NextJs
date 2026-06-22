"use client";
import { useEffect, useState } from "react";
import { X, CheckCircle2, ShoppingCart, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartToastProps {
  show: boolean;
  onClose: () => void;
  product: { title: string; image: string; amount: number };
}

export default function CartToast({ show, onClose, product }: CartToastProps) {
  const [progress, setProgress] = useState(100);
  const router = useRouter();

  useEffect(() => {
    if (show) {
      setProgress(100);
      const timer = setInterval(() => {
        setProgress((prev) => (prev > 0 ? prev - 1.25 : 0));
      }, 50);

      const hideTimer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => {
        clearInterval(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-5 left-5 z-[999] w-full max-w-[380px] animate-in slide-in-from-left duration-500" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden shadow-teal-900/10">
        
        {/* شريط التقدم العلوي */}
        <div className="h-1.5 bg-gray-50 w-full">
          <div 
            className="h-full bg-[#009689] transition-all duration-100 ease-linear" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-5">
          {/* رأس التنبيه */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[#009689] font-bold text-sm">
              <CheckCircle2 size={20} />
              <span>تمت الإضافة إلى سلة التسوق</span>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* تفاصيل المنتج المضاف */}
          <div className="flex items-center gap-4 mb-6">
             <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={product.image} alt="" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 text-right">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{product.title}</h4>
                <p className="text-[#009689] font-black text-lg">{product.amount} ر.س</p>
             </div>
          </div>

          {/* أزرار التحكم - نفس تصميم الصورة */}
          <div className="flex gap-3">
            <button 
              onClick={() => router.push("/sales")}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-100 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all text-sm"
            >
               عرض السلة <ShoppingCart size={18} />
            </button>
            <button 
              onClick={() => router.push("/checkout")}
              className="flex-1 flex items-center justify-center gap-2 bg-[#009689] text-white py-3 rounded-xl font-bold hover:bg-[#2a5a2a] transition-all text-sm"
            >
               إتمام التبرع <CreditCard size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}