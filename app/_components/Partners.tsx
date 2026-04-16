"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const PartnersFinal = ({ data }: { data?: any }) => {
    const [partners, setPartners] = useState<any[]>([]);
    const API_BASE_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/partners?t=${Date.now()}`)
            .then(res => res.json())
            .then(res => setPartners(res?.data?.items || res?.data || []))
            .catch(err => console.error(err));
    }, []);

    if (partners.length === 0) return null;

    return (
        <section className="py-16 bg-white" dir="rtl">
            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-slate-800">
                        {data?.title }
                    </h3>
                    {data?.subtitle && (
                        <p className="text-gray-500 mt-2">{data.subtitle}</p>
                    )}
                </div>

                <div className="relative px-12">
                    <button className="partner-prev absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-300 hover:text-gray-600"><ChevronRight size={45} /></button>
                    <button className="partner-next absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-300 hover:text-gray-600"><ChevronLeft size={45} /></button>

                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={30}
                        slidesPerView={2}
                        loop={true}
                        autoplay={{ delay: 4000 }}
                        navigation={{ nextEl: '.partner-next', prevEl: '.partner-prev' }}
                        breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}
                    >
                        {partners.map((partner) => {
                            const rawPath = partner.logo?.original || "";
                            const cleanPath = rawPath.replace('/storage/', '');
                            const imageUrl = `${API_BASE_URL}/api/v1/news-image?path=${cleanPath}`;

                            return (
                                <SwiperSlide key={partner.id}>
                                    <div className="h-32 w-full flex items-center justify-center">
                                        {rawPath ? (
                                            <img
                                                src={imageUrl}
                                                alt="Partner Logo"
                                                className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    if (!target.src.includes('direct=1')) {
                                                        target.src = `${API_BASE_URL}${rawPath}?direct=1`;
                                                    }
                                                }}
                                            />
                                        ) : null}
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