"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import apiClient from "@/app/lib/api"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const PartnersFinal = ({ data }: { data?: any }) => {
    const [partners, setPartners] = useState<any[]>([]);

useEffect(() => {
        // نستخدم apiClient وليس fetch
        apiClient.get('partners', {
            params: { t: Date.now() } // منع الكاش بطريقة Axios
        })
        .then(response => {
            // ملاحظة: Axios يضع النتيجة في response.data
            // وإذا كان Laravel Resource يضعها في data، تصبح النتيجة في response.data.data
            const res = response.data;
            const dataArray = res?.data?.items || res?.data || [];
            setPartners(dataArray);
        })
        .catch(err => {
            console.error("Partners Fetch Error:", err);
        });
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