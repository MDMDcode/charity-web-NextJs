"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules';
import { ChevronRight, ChevronLeft, Calendar, ArrowLeft } from 'lucide-react';
import apiClient from "@/app/lib/api"; 

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const API_BASE_URL = 'http://localhost:8000';

const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path || path.trim() === '') return null;
    const cleaned = path.replace(/^\/?storage\//, '');
    return `${API_BASE_URL}/api/v1/news-image?path=/${cleaned}`;
};

const NewsSection = ({ data }: { data?: any }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
        const fetchPosts = async () => {
            try {
                // نستخدم apiClient.get مع اسم الـ Route فقط
                // أضفنا الباراميتر t لمنع الكاش كما في الكود الأصلي
                const response = await apiClient.get(`posts`, {
                    params: { t: Date.now() }
                });

                // في Axios، البيانات المستلمة تكون دائماً داخل response.data
                const res = response.data;
                
                // استخراج المصفوفة حسب هيكلة الـ API (نتحقق من كل الاحتمالات)
                const dataArray = res?.data?.items || res?.data?.data || res?.data || [];
                
                setPosts(dataArray);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPosts();
    }, []);

    if (loading) return (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#009689] border-t-transparent rounded-full animate-spin"></div>
            <div className="font-bold text-[#009689] animate-pulse text-lg">جاري تحميل الأخبار...</div>
        </div>
    );
    
    if (posts.length === 0) return null;

    return (
        <section className="py-24 bg-[#F9FAFB] overflow-hidden" dir="rtl">
            <div className="max-w-[1440px] mx-auto px-6">
                
                {/* Header Section with Animation */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-right animate-fadeInUp">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-2 h-10 bg-[#009689] rounded-full"></span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                {data?.title }
                            </h2>
                        </div>
                        {data?.subtitle && (
                            <p className="text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed">
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                    
                    {/* Custom Navigation Buttons */}
                    <div className="flex gap-3 self-start md:self-end">
                        <button className="news-prev-btn w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-slate-700 hover:bg-[#009689] hover:text-white hover:shadow-lg hover:shadow-[#009689]/20 transition-all duration-300 active:scale-90">
                            <ChevronRight size={28} />
                        </button>
                        <button className="news-next-btn w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-slate-700 hover:bg-[#009689] hover:text-white hover:shadow-lg hover:shadow-[#009689]/20 transition-all duration-300 active:scale-90">
                            <ChevronLeft size={28} />
                        </button>
                    </div>
                </div>

                {/* Swiper Container */}
                <div className="relative group">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation, FreeMode]}
                        spaceBetween={24}
                        slidesPerView={1.2}
                        grabCursor={true}
                        dir="rtl"
                        loop={posts.length > 3}
                        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        navigation={{ nextEl: '.news-next-btn', prevEl: '.news-prev-btn' }}
                        pagination={{ clickable: true, el: '.news-pagination-custom' }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="news-swiper-container !pb-16"
                    >
                        {posts.map((post, index) => {
                            const rawPath =
                                (post.image?.original && post.image.original !== '') ? post.image.original :
                                (post.gallery && post.gallery.length > 0 && post.gallery[0]?.original) ? post.gallery[0].original :
                                null;

                            const imageUrl = getImageUrl(rawPath);

                            return (
                                <SwiperSlide key={post.id} className="h-auto">
                                    <Link href={`/news/${post.id}`} className="block h-full">
                                        <div 
                                            className="group/card bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-[#009689]/5 transition-all duration-500 h-full flex flex-col"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            {/* Image Wrapper */}
                                            <div className="h-64 relative overflow-hidden">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                                        alt={post.title}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
                                                        لا توجد صورة
                                                    </div>
                                                )}
                                                {/* Date Badge */}
                                                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 text-[#009689] font-bold text-xs">
                                                    <Calendar size={14} />
                                                    {new Date(post.published_at || post.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' })}
                                                </div>
                                            </div>

                                            {/* Content Wrapper */}
                                            <div className="p-8 flex flex-col flex-grow">
                                                <h3 className="font-black text-slate-900 text-xl mb-4 line-clamp-2 leading-snug group-hover/card:text-[#009689] transition-colors duration-300">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                                                    {post.summary || post.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                                </p>
                                                
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="flex items-center gap-2 text-sm font-bold text-[#009689] group-hover/card:gap-4 transition-all duration-300">
                                                        اقرأ المزيد
                                                        <ArrowLeft size={18} />
                                                    </span>
                                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover/card:bg-[#009689] group-hover/card:text-white transition-colors duration-300">
                                                        <ChevronLeft size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Custom Pagination */}
                    <div className="news-pagination-custom flex justify-center gap-3 mt-4"></div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .news-swiper-container .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: #E5E7EB;
                    opacity: 1;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 10px;
                }
                .news-swiper-container .swiper-pagination-bullet-active {
                    background: #009689 !important;
                    width: 40px;
                }
                
                .news-swiper-container .swiper-slide {
                    transition: transform 0.5s ease;
                }
                
                /* Smooth scrolling for Swiper */
                .swiper-wrapper {
                    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
            `}</style>
        </section>
    );
};

export default NewsSection;
