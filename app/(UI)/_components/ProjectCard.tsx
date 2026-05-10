"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartToast from "./CartToast";

interface Project {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  pricing: { is_open_price: boolean; default_price: string };
  target: {
    has_target: boolean;
    goal_amount: string;
    collected_amount: string;
    percentage: number;
  };
}

export default function ProjectCard({ project }: { project: Project }) {
  const [amount,    setAmount]    = useState<number | string>(project.pricing.default_price || "");
  const [showToast, setShowToast] = useState(false);
  const [collected, setCollected] = useState(Number(project.target.collected_amount) || 0);
  const router = useRouter();

  const goal              = Number(project.target.goal_amount) || 0;
  const currentPercentage = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;

  // استمع لأي تبرع ناجح وحدّث الرقم فوراً
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail.project_id === project.id) {
        setCollected(prev => prev + e.detail.amount);
      }
    };
    window.addEventListener("donation-success", handler);
    return () => window.removeEventListener("donation-success", handler);
  }, [project.id]);

  const handleAddToCart = () => {
    if (!amount || Number(amount) < 1) return alert("يرجى إدخال مبلغ صحيح");

    const cart = JSON.parse(localStorage.getItem("tmt_cart") || "[]");
    const existingItemIndex = cart.findIndex((item: any) => item.project_id === project.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].amount += Number(amount);
    } else {
      cart.push({
        project_id: project.id,
        title:      project.title,
        image:      project.image_url,
        amount:     Number(amount),
      });
    }

    localStorage.setItem("tmt_cart", JSON.stringify(cart));
    setShowToast(true);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleDonateNow = () => {
    if (!amount || Number(amount) < 1) return alert("يرجى إدخال مبلغ صحيح");

    const directDonation = [{
      project_id: project.id,
      title:      project.title,
      image:      project.image_url,
      amount:     Number(amount),
    }];

    localStorage.setItem("tmt_cart", JSON.stringify(directDonation));
    router.push(`/checkout?amount=${amount}`);
  };

  return (
    <div className="relative flex-shrink-0 w-full sm:w-[350px]" dir="rtl">

      <CartToast
        show={showToast}
        onClose={() => setShowToast(false)}
        product={{
          title:  project.title,
          image:  project.image_url,
          amount: Number(amount),
        }}
      />

      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">

        {/* الصورة */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm font-bold">
            {project.title}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-1">{project.title}</h3>

          {/* شريط التقدم */}
          {project.target.has_target && (
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-400">
                  تم جمع{" "}
                  <span className="text-[#009689] font-bold">
                    {collected.toLocaleString("ar-SA")} ر.س
                  </span>
                </span>
                <span className="text-xs font-bold text-[#009689]">{currentPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#009689] transition-all duration-700 ease-out"
                  style={{ width: `${currentPercentage}%` }}
                />
              </div>
              <div className="mt-2 text-left">
                <span className="text-[10px] text-gray-400">
                  المبلغ المستهدف: {goal.toLocaleString("ar-SA")} ر.س
                </span>
              </div>
            </div>
          )}

          {/* حقل المبلغ */}
          <div className="mb-6">
            <label className="block text-xs text-gray-400 mb-2 font-medium italic">
              أدخل مبلغ المساهمة
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full border-2 border-gray-50 focus:border-[#009689] bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-center text-xl font-black outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                ر.س
              </span>
            </div>
          </div>

          {/* الأزرار */}
          <div className="mt-auto flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-[#009689] hover:bg-[#e6f0f0] active:scale-95 transition-all"
              title="أضف للسلة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            <button
              onClick={handleDonateNow}
              className="flex-1 bg-[#009689] text-white font-bold py-3 rounded-xl hover:bg-[#0b6e65] active:scale-[0.98] transition-all shadow-lg shadow-[#009689]/20"
            >
              تبرع الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}