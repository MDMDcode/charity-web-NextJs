"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Check } from "lucide-react";
import CartToast from "./CartToast";

export default function DonationSection({ project }: { project: any }) {
  const router  = useRouter();
  const pricing = project.pricing;
  const shares  = pricing?.shares || [];

  const [amount,        setAmount]        = useState<number | string>(pricing?.suggested_amount || "");
  const [selectedShare, setSelectedShare] = useState<any>(null);
  const [copied,        setCopied]        = useState(false);
  const [showToast,     setShowToast]     = useState(false);
  const [toastError,    setToastError]    = useState(false); // 👈

  const showError = () => {
    setToastError(true);
    setTimeout(() => setToastError(false), 3000);
  };

  const handleSelectShare = (share: any) => {
    setSelectedShare(share);
    setAmount(share.price);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: project.title, text: `ساهم معنا في: ${project.title}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const handleDonateNow = () => {
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

  const handleAddToCart = () => {
    if (!amount || Number(amount) < 1) return showError(); // 👈
    const cart = JSON.parse(localStorage.getItem("tmt_cart") || "[]");
    const existingIndex = cart.findIndex((item: any) => item.project_id === project.id);
    if (existingIndex > -1) {
      cart[existingIndex].amount += Number(amount);
    } else {
      cart.push({
        project_id: project.id,
        title:      project.title,
        image:      project.image_url,
        amount:     Number(amount),
      });
    }
    localStorage.setItem("tmt_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setShowToast(true);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">

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
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl shadow-lg animate-fade-in"
        >
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="font-bold text-sm">يرجى إدخال مبلغ صحيح</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-gray-900">تبرع الآن</h3>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-100 hover:border-[#009689] text-gray-500 hover:text-[#009689] transition-all text-sm font-bold"
          title="مشاركة المشروع"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
          {copied ? "تم النسخ" : "مشاركة"}
        </button>
      </div>

      {pricing?.has_shares && shares.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3 font-medium">اختر نوع المساهمة</p>
          <div className="grid grid-cols-1 gap-2">
            {shares.map((share: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSelectShare(share)}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-right ${
                  selectedShare?.title === share.title
                    ? 'border-[#009689] bg-[#009689]/5'
                    : 'border-gray-100 hover:border-[#009689]/40'
                }`}
              >
                <span className="font-bold text-gray-800">{share.title}</span>
                <span className="font-black text-[#009689]">{share.price} ر.س</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(pricing?.is_open_price || !pricing?.has_shares) && (
        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-2 font-medium">أدخل مبلغ المساهمة</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={pricing?.min_price || 1}
              className="w-full border-2 border-gray-100 focus:border-[#009689] bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-center text-2xl font-black text-black outline-none transition-all placeholder:text-black/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">ر.س</span>
          </div>
          {pricing?.min_price && (
            <p className="text-xs text-gray-400 mt-1 text-center">الحد الأدنى: {pricing.min_price} ر.س</p>
          )}
        </div>
      )}

      {pricing?.has_shares && !pricing?.is_open_price && selectedShare && (
        <div className="mb-6 p-3 bg-[#009689]/5 rounded-xl border border-[#009689]/20">
          <p className="text-center text-sm text-gray-500">المبلغ المحدد</p>
          <p className="text-center text-2xl font-black text-[#009689]">{amount} ر.س</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          className="w-12 h-12 rounded-xl bg-gray-100 text-[#009689] hover:bg-[#e6f0f0] flex items-center justify-center transition-all active:scale-95"
          title="أضف للسلة"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        <button
          onClick={handleDonateNow}
          className="flex-1 bg-[#009689] text-white font-bold py-3 rounded-xl hover:bg-[#0b6e65] transition-all active:scale-[0.98] shadow-lg shadow-[#009689]/20"
        >
          تبرع الآن
        </button>
      </div>

    </div>
  );
}