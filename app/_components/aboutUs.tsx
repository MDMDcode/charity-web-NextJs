"use client";
import { FaHandHoldingHeart, FaUsers } from "react-icons/fa";

export default function AboutUs() {
  return (
    <div dir="rtl" className="flex items-center justify-between bg-[#f1fdfa] pt-20 px-10">

      {/* النص والأزرار */}
      <div className="flex flex-col justify-center w-full max-w-xl gap-4">
        <div>
          <p className="text-black text-[60px] font-bold leading-tight">معًا نُكرم الإنسان</p>
          <p className="text-[#009689] text-[60px] font-bold leading-tight">في آخر رحلاته</p>
        </div>

        <p className="text-[#4a5565] text-[20px] leading-relaxed">
          خدمات متكاملة لإكرام الموتى وفق الضوابط الشرعية، ودعمٌ صادق لأسرهم في لحظات الفقد.
        </p>

        <div className="flex items-center gap-4 mt-2">
          <button className="flex items-center gap-2 bg-[#009689] px-5 py-3 rounded-lg">
            <FaHandHoldingHeart size={20} className="text-white" />
            <span className="text-white">ساهم بتبرعك</span>
          </button>

          <button className="flex items-center gap-2 border border-[#009689] px-5 py-3 rounded-lg">
            <FaUsers size={20} className="text-[#009689]" />
            <span className="text-[#009689]">تسجيل مستفيد</span>
          </button>
        </div>
      </div>

      {/* الصورة */}
      <div className="flex justify-center items-center w-full">
        <img src="us.webp" alt="" className="w-[600px] rounded-lg object-cover" />
      </div>

    </div>
  );
}