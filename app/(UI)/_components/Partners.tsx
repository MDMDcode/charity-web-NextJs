"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import apiClient from "@/app/lib/api";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-shamel.tmt3.sa';

const PartnersFinal = ({ data }: { data?: any }) => {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('partners')
      .then(response => {
        const res = response.data;
        const dataArray = res?.data?.items || res?.data || [];
        setPartners(dataArray);
      })
      .catch(err => console.error("Partners Fetch Error:", err));
  }, []);

  if (partners.length === 0) return null;

  const title    = (data?.title    || "").trim();
  const subtitle = (data?.subtitle || "").trim();

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 relative">

        {/* العنوان */}
        <div className="text-center mb-10">
          {title && (
            <h3 className="text-2xl font-black text-slate-800">{title}</h3>
          )}
          {subtitle && (
            <p className="text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>

        <div className="relative px-12">
          <button className="partner-prev absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-300 hover:text-gray-600">
            <ChevronRight size={45} />
          </button>
          <button className="partner-next absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-300 hover:text-gray-600">
            <ChevronLeft size={45} />
          </button>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={2}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{ nextEl: '.partner-next', prevEl: '.partner-prev' }}
            breakpoints={{
              640:  { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {partners.map((partner) => {
              const rawPath  = partner.logo?.original || "";
              const cleanPath = rawPath.replace('/storage/', '');
              const imageUrl  = `${API_BASE_URL}/api/v1/news-image?path=${cleanPath}`;

              return (
                <SwiperSlide key={partner.id}>
                  <div className="flex flex-col items-center gap-3 py-4">

                    {/* الصورة */}
                    <div className="h-24 w-full flex items-center justify-center">
                      {rawPath ? (
                        <img
                          src={imageUrl}
                          alt={partner.name || "شريك"}
                          className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('direct=1')) {
                              target.src = `${API_BASE_URL}${rawPath}?direct=1`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 text-xs">لا توجد صورة</span>
                        </div>
                      )}
                    </div>

                    {/* الاسم تحت الصورة */}
                    {partner.name && (
                      <p className="text-sm font-bold text-gray-600 text-center line-clamp-1">
                        {partner.name}
                      </p>
                    )}

                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default PartnersFinal;