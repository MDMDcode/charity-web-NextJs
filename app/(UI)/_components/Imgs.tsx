"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import apiClient from "@/app/lib/api";
// استيراد مكتبات Swiper الأساسية
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const PhotoGallery = ({ data }: { data?: any }) => {
    const [galleries, setGalleries] = useState<any[]>([]); // تخزين الألبومات كاملة
    const [activeAlbum, setActiveAlbum] = useState<any>(null); // الألبوم المختار حالياً
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:8000';
useEffect(() => {
    const fetchGalleries = async () => {
        try {
            // استخدام apiClient مباشرة مع المسار الصحيح
            const response = await apiClient.get(`galleries`);
            
            // في Axios، البيانات موجودة دائماً داخل response.data
            if (response && response.data) {
                const res = response.data;
                
                // التعديل: تصفية الألبومات التي تحتوي على صور فقط واستبعاد الفيديوهات
                // نتحقق من res.data لأن Laravel Resource يغلف المصفوفة عادةً
                const sourceData = res.data || res;

                const onlyPhotoAlbums = sourceData?.filter((album: any) => {
                    // نتحقق أن الألبوم يحتوي على صور وليس به روابط يوتيوب
                    const hasImages = album.images && album.images.length > 0;
                    const hasNoVideoLinks = !album.links || album.links.length === 0;
                    
                    return hasImages && hasNoVideoLinks;
                }) || [];

                setGalleries(onlyPhotoAlbums);
                
                if (onlyPhotoAlbums.length > 0) {
                    setActiveAlbum(onlyPhotoAlbums[0]);
                }
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchGalleries();
}, []);

    const buildImageUrl = (img: any) => {
        if (!img || !img.file_name || !img.folder_id) return null;
        return `${API_BASE_URL}/api/v1/fetch-secure-image?p=${img.folder_id}/${img.file_name}`;
    };

    if (loading) return (
        <div className="py-20 text-center bg-[#009689] h-[60vh] flex flex-col justify-center items-center">
            <div className="animate-spin inline-block w-10 h-10 border-4 border-black border-t-transparent rounded-full"></div>
            <p className="mt-4 font-bold text-black text-xl italic">جاري جلب ألبومات الصور...</p>
        </div>
    );

    if (galleries.length === 0) return null;

    return (
        <section className="relative py-16 overflow-hidden bg-gray-50" dir="rtl">
            {/* الخلفية الزخرفية */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex justify-around items-center overflow-hidden">
                <span className="text-[20rem] font-black -rotate-12 translate-x-20">شامل</span>
                <span className="text-[20rem] font-black rotate-12 -translate-x-20">شامل</span>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-black mb-3">
                        {data?.title }
                    </h2>
                    <p className="text-lg font-bold text-black/60 italic">
                        {data?.subtitle }
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* الجانب الأيمن: قائمة الألبومات */}
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
                                    {/* صورة مصغرة للألبوم (أول صورة فيه) */}
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                        {album.images?.[0] ? (
                                            <img 
                                                src={buildImageUrl(album.images[0]) || ""} 
                                                className="w-full h-full object-cover" 
                                                alt="album cover"
                                            />
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

                    {/* الجانب الأيسر: عرض صور الألبوم المختار */}
                    <div className="lg:col-span-8 bg-white p-3 rounded-2xl shadow-2xl relative min-h-[400px]">
                        {activeAlbum && activeAlbum.images?.length > 0 ? (
                            <Swiper 
                                key={activeAlbum.id} // لإعادة تهيئة السلايدر عند تغيير الألبوم
                                modules={[Navigation, Pagination, Autoplay, EffectFade]} 
                                effect="fade"
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                className="h-[400px] md:h-[550px] rounded-xl overflow-hidden shadow-inner"
                            >
                                {activeAlbum.images.map((img: any, i: number) => (
                                    <SwiperSlide key={`img-${activeAlbum.id}-${i}`}>
                                        <img 
                                            src={buildImageUrl(img) || ""} 
                                            className="w-full h-full object-cover" 
                                            alt={`${activeAlbum.title} - ${i}`} 
                                        />
                                        {/* عنوان الألبوم فوق الصورة */}
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
                .swiper-button-next, .swiper-button-prev { 
                    color: #000 !important; 
                    background: rgba(255,255,255,0.9); 
                    width: 45px !important; 
                    height: 45px !important; 
                    border-radius: 50%;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .swiper-button-next:after, .swiper-button-prev:after { font-size: 18px !important; font-weight: bold; }
                .swiper-pagination-bullet { background: #fff !important; opacity: 0.7; }
                .swiper-pagination-bullet-active { background: #0FAFA0 !important; width: 25px !important; border-radius: 5px !important; opacity: 1; }
            `}</style>
        </section>
    );
};

export default PhotoGallery;