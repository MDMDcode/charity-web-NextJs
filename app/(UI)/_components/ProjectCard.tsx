"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartToast from "./CartToast";
import { Project, Share } from "@/app/(UI)/types/project";

interface ProjectWithCategory extends Project {
  category?: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
  };
}

export default function ProjectCard({ project }: { project: ProjectWithCategory }) {
  const pricing  = project.pricing;
  const shares   = pricing?.shares || [];

  const [amount,        setAmount]       = useState<number | string>(pricing?.suggested_amount || pricing?.default_price || "");
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [showToast,     setShowToast]    = useState(false);
  const [toastError,    setToastError]   = useState(false); // 👈
  const [collected,     setCollected]    = useState(Number(project.target.collected_amount) || 0);
  const [navigating,    setNavigating]   = useState(false);
  const router = useRouter();

  const goal              = Number(project.target.goal_amount) || 0;
  const currentPercentage = goal > 0 ? Math.min(Math.floor((collected / goal) * 100), 100) : 0;
  const isCompleted       = goal > 0 && collected >= goal;

  const showError = () => {
    setToastError(true);
    setTimeout(() => setToastError(false), 3000);
  };

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail.project_id === project.id) {
        setCollected(prev => prev + e.detail.amount);
      }
    };
    window.addEventListener("donation-success", handler);
    return () => window.removeEventListener("donation-success", handler);
  }, [project.id]);

  const handleSelectShare = (share: Share) => {
    if (isCompleted) return;
    setSelectedShare(share);
    setAmount(share.price);
  };

  const handleAddToCart = () => {
    if (isCompleted) return;
    if (!amount || Number(amount) < 1) return showError(); // 👈
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
    if (isCompleted) return;
    if (!amount || Number(amount) < 1) return showError(); // 👈
    const directDonation = [{
      project_id: project.id,
      title:      project.title,
      image:      project.image_url,
      amount:     Number(amount),
    }];
    localStorage.setItem("tmt_cart", JSON.stringify(directDonation));
    router.push(`/checkout?amount=${amount}`);
  };

  const handleNavigate = () => {
    setNavigating(true);
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="relative flex-shrink-0 w-[300px]" dir="rtl">

      {navigating && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Toast نجاح */}
      <CartToast
        show={showToast}
        onClose={() => setShowToast(false)}
        product={{
          title:  project.title,
          image:  project.image_url,
          amount: Number(amount),
        }}
      />

      {/* Toast خطأ 👈 */}
      {toastError && (
        <div
          dir="rtl"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl shadow-lg"
        >
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="font-bold text-sm">يرجى إدخال مبلغ صحيح</span>
        </div>
      )}

      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">

        <div onClick={!isCompleted ? handleNavigate : undefined} className={isCompleted ? "cursor-default" : "cursor-pointer"}>
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
            <img
              src={project.image_url || "/de.jpg"}
              alt={project.title || "صورة المشروع"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {isCompleted && (
              <div className="absolute inset-0 bg-[#009689]/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-10 animate-fade-in">
                <span className="text-white text-base font-black leading-relaxed drop-shadow-sm">
                  بفضل الله ثم بدعمكم <br /> تم اكتمال المشروع
                </span>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm font-bold z-20">
              {project.category?.name || "عام"}
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">

          <div onClick={!isCompleted ? handleNavigate : undefined} className={isCompleted ? "cursor-default" : "cursor-pointer"}>
            <h3 className="text-lg font-bold text-black mb-4 line-clamp-1 hover:text-[#009689] transition-colors">
              {project.title}
            </h3>
          </div>

          {project.target.has_target && (
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-black">
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
              <div className="mt-1 text-left">
                <span className="text-[10px] text-black">
                  المستهدف: {goal.toLocaleString("ar-SA")} ر.س
                </span>
              </div>
            </div>
          )}

          {pricing?.has_shares && shares.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-black mb-2 font-medium">اختر نوع المساهمة</p>
              <div className="grid grid-cols-1 gap-2">
                {shares.map((share: Share, idx: number) => (
                  <button
                    key={idx}
                    disabled={isCompleted}
                    onClick={() => handleSelectShare(share)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all text-right ${
                      isCompleted
                        ? "border-gray-50 bg-gray-50/55 cursor-not-allowed opacity-60"
                        : selectedShare?.title === share.title
                          ? "border-[#009689] bg-[#009689]/5"
                          : "border-gray-100 hover:border-[#009689]/40"
                    }`}
                  >
                    <span className="font-bold text-black text-sm">{share.title}</span>
                    <span className="font-black text-[#009689] text-sm">{share.price} ر.س</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(pricing?.is_open_price || !pricing?.has_shares) && (
            <div className="mb-4">
              <label className="block text-xs text-black mb-2 font-medium italic">
                أدخل مبلغ المساهمة
              </label>
              <div className="relative">
                <input
                  type="number"
                  disabled={isCompleted}
                  value={isCompleted ? "" : amount}
                  onChange={e => setAmount(e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-center text-xl font-black outline-none transition-all placeholder:text-black/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    isCompleted
                      ? "border-gray-50 bg-gray-50/70 text-gray-400 cursor-not-allowed"
                      : "border-gray-50 focus:border-[#009689] bg-gray-50 focus:bg-white text-black"
                  }`}
                  placeholder={isCompleted ? "مكتمل" : "0.00"}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                  ر.س
                </span>
              </div>
            </div>
          )}

          {pricing?.has_shares && !pricing?.is_open_price && selectedShare && !isCompleted && (
            <div className="mb-4 p-3 bg-[#009689]/5 rounded-xl border border-[#009689]/20">
              <p className="text-center text-xs text-black">المبلغ المحدد</p>
              <p className="text-center text-xl font-black text-[#009689]">{amount} ر.س</p>
            </div>
          )}

          <div className="mt-auto flex gap-2">
            <button
              disabled={isCompleted}
              onClick={handleAddToCart}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isCompleted
                  ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                  : "bg-gray-100 text-[#009689] hover:bg-[#e6f0f0] active:scale-95"
              }`}
              title={isCompleted ? "المشروع مكتمل" : "أضف للسلة"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            <button
              disabled={isCompleted}
              onClick={handleDonateNow}
              className={`flex-1 font-bold py-3 rounded-xl transition-all shadow-md ${
                isCompleted
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-[#009689] text-white hover:bg-[#0b6e65] active:scale-[0.98] shadow-[#009689]/20"
              }`}
            >
              {isCompleted ? "تم اكتمال المشروع" : "تبرع الآن"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}