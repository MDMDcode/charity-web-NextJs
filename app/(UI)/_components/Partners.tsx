"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const PartnersFinal = ({ data, prefetched }: { data?: any, prefetched?: { items: any[] } }) => {
  const [partners, setPartners] = useState<any[]>(prefetched?.items || []);

  useEffect(() => {
    if (prefetched?.items?.length) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api-shamel.tmt3.sa'}/api/v1/partners`)
      .then(res => res.json())
      .then(json => setPartners(json?.data?.items || json?.data || []))
      .catch(err => console.error("Partners Fetch Error:", err));
  }, []);

  if (partners.length === 0) return null;

  const title    = (data?.title    || "").trim();
  const subtitle = (data?.subtitle || "").trim();

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 relative">

        <div className="text-center mb-10">
          {title && <h3 className="text-2xl font-black text-slate-800">{title}</h3>}
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
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
              const imageUrl = partner.logo?.original || "";
              const hasLink  = partner.website_url;

              const CardContent = (
                <div className={`flex flex-col items-center gap-3 py-4 rounded-xl transition-all duration-300 ${hasLink ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}`}>
                  <div className="h-24 w-full flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={partner.name || "شريك"}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 text-xs">لا توجد صورة</span>
                      </div>
                    )}
                  </div>
                  {partner.name && (
                    <p className="text-sm font-bold text-gray-600 text-center line-clamp-1">
                      {partner.name}
                    </p>
                  )}
                </div>
              );

              return (
                <SwiperSlide key={partner.id}>
                  {hasLink ? (
                    <a href={hasLink} target="_blank" rel="noopener noreferrer">
                      {CardContent}
                    </a>
                  ) : (
                    <div>{CardContent}</div>
                  )}
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