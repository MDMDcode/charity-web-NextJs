"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const PhotoGallery = ({ data, prefetched }: { data?: any, prefetched?: { items: any[] } }) => {
    const [galleries, setGalleries] = useState<any[]>([]);
    const [activeAlbum, setActiveAlbum] = useState<any>(null);

    const API_BASE_URL = 'https://api-shamel.tmt3.sa';

    useEffect(() => {
        const source = prefetched?.items || [];
        const onlyPhotoAlbums = source.filter((album: any) => {
            const hasImages = album.images && album.images.length > 0;
            const hasNoVideoLinks = !album.links || album.links.length === 0;
            return hasImages && hasNoVideoLinks;
        });
        setGalleries(onlyPhotoAlbums);
        if (onlyPhotoAlbums.length > 0) setActiveAlbum(onlyPhotoAlbums[0]);
    }, [prefetched]);

    const buildImageUrl = (img: any) => {
        if (!img || !img.file_name || !img.folder_id) return null;
        return `${API_BASE_URL}/api/v1/fetch-secure-image?p=${img.folder_id}/${img.file_name}`;
    };

    if (galleries.length === 0) return null;

    return (
        <section className="relative py-16 overflow-hidden bg-gray-50" dir="rtl">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex justify-around items-center overflow-hidden">
                <span className="text-[20rem] font-black -rotate-12 translate-x-20">شامل</span>
                <span className="text-[20rem] font-black rotate-12 -translate-x-20">شامل</span>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-black mb-3">{data?.title}</h2>
                    <p className="text-lg font-bold text-black/60 italic">{data?.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="mb-4 border-r-4 border-[#0FAFA0] pr-4">
                            <h3 className="text-2xl font-black text-gray-800">الألبومات</h3>
                            <p className="text-sm font-bold text-gray-500 italic">اختر ألبوماً لعرض صوره</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pl-2 custom-scrollbar">
                            {galleries.map((album) => (
                                <button
                                    key={album.id}
                                    onClick={() => setActiveAlbum(album)}
                                    className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-right group ${
                                        activeAlbum?.id === album.id
                                        ? "border-[#0FAFA0] bg-white shadow-md scale-[1.02]"
                                        : "border-transparent bg-white/50 hover:bg-white hover:border-gray-300"
                                    }`}
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                        {album.images?.[0] ? (
                                            <img src={buildImageUrl(album.images[0]) || ""} className="w-full h-full object-cover" alt="album cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">لا صور</div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold transition-colors ${activeAlbum?.id === album.id ? "text-[#0FAFA0]" : "text-gray-700"}`}>
                                            {album.title}
                                        </h4>
                                        <p className="text-xs text-gray-400">{album.images?.length || 0} صورة</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white p-3 rounded-2xl shadow-2xl relative min-h-[400px]">
                        {activeAlbum && activeAlbum.images?.length > 0 ? (
                            <Swiper
                                key={activeAlbum.id}
                                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                                effect="fade"
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                className="h-[400px] md:h-[550px] rounded-xl overflow-hidden shadow-inner"
                            >
                                {activeAlbum.images.map((img: any, i: number) => (
                                    <SwiperSlide key={`img-${activeAlbum.id}-${i}`}>
                                        <img src={buildImageUrl(img) || ""} className="w-full h-full object-cover" alt={`${activeAlbum.title} - ${i}`} />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white text-right">
                                            <p className="text-lg font-bold">{activeAlbum.title}</p>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p className="text-xl font-bold">لا توجد صور في هذا الألبوم</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #0FAFA0; border-radius: 10px; }
                .swiper-button-next, .swiper-button-prev { color: #000 !important; background: rgba(255,255,255,0.9); width: 45px !important; height: 45px !important; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .swiper-button-next:after, .swiper-button-prev:after { font-size: 18px !important; font-weight: bold; }
                .swiper-pagination-bullet { background: #fff !important; opacity: 0.7; }
                .swiper-pagination-bullet-active { background: #0FAFA0 !important; width: 25px !important; border-radius: 5px !important; opacity: 1; }
            `}</style>
        </section>
    );
};

export default PhotoGallery;