"use client";

import React from 'react';
// تأكدي من إضافة الصور (الخريطة والشعار) إلى مجلد public/images
import Image from 'next/image'; 

const AboutSection = () => {
    // هذه البيانات يمكن جلبها لاحقاً من الـ API
    const aboutData = {
        title: "منصة منافع الغير ربحية لخدمة الاوقاف والجمعيات والشركات الغير ربحية",
        description: "",
        // يمكنك إضافة نقاط إضافية هنا إذا قمتِ بتوسيع القسم مستقبلاً
    };

    return (
        <section className="py-16 bg-white" dir="rtl">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    
                    {/* الجانب الأيمن: المحتوى النصي */}
                    <div className="space-y-6 text-right order-2 md:order-1">
                        {/* خط مزخرف علوي صغير باللون الذهبي */}
                        <div className="w-16 h-1 bg-[#F9C95B] rounded-full mb-4 md:mr-0 mr-auto"></div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight drop-shadow-sm">
                            {aboutData.title}
                        </h2>
                        
                        <p className="text-lg md:text-xl text-black/80 leading-relaxed max-w-2xl font-medium">
                            {aboutData.description}
                        </p>
                        
                        {/* أزرار اختيارية مستوحاة من التصميم العام */}
                        <div className="pt-6 flex gap-4 justify-start">
                            <button className="bg-[#F9C95B] text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-black hover:text-[#F9C95B] transition-all shadow active:scale-95">
                                المزيد عن الجمعية
                            </button>
                            <button className="bg-gray-100 text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all active:scale-95">
                                أهدافنا
                            </button>
                        </div>
                    </div>

                    {/* الجانب الأيسر: الخريطة والشعار */}
                    <div className="relative flex justify-center items-center order-1 md:order-2">
                        {/* تأثير خلفية دائري ذهبي خفيف (اختياري، يضيف عمقاً) */}
                        <div className="absolute w-72 h-72 bg-[#F9C95B]/10 rounded-full blur-3xl z-0"></div>

                        <div className="relative z-10 w-full max-w-lg transform hover:scale-105 transition-transform duration-500">
                            {/* خريطة المملكة كخلفية للجزء الأيسر */}
                            <img 
                                src="about.jpeg" // ضعي مسار خريطة السعودية هنا
                                alt="خريطة منطقة الرياض"
                                className="w-full h-auto opacity-90"
                            />
                            
                            {/* شعار الجمعية مدمج داخل الخريطة (أو فوقها) */}
                            <div className="absolute inset-0 flex justify-center items-center p-12">
                                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform -rotate-3 hover:rotate-0 transition-transform">
 
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;