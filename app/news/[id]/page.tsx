"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_BASE_URL = 'http://localhost:8000';

const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path || path.trim() === '') return null;
    const cleaned = path.replace(/^\/?storage\//, '');
    return `${API_BASE_URL}/api/v1/news-image?path=/${cleaned}`;
};

const NewsDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number>(0);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                const res = await response.json();
                setPost(res.data);
            } catch (err) {
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPostDetail();
    }, [id]);

    useEffect(() => {
        if (!lightboxImg) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxImg(null);
            if (e.key === 'ArrowLeft') handleNext();
            if (e.key === 'ArrowRight') handlePrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxImg, lightboxIndex]);

    if (loading) return <div className="py-20 text-center font-bold text-[#009689] animate-pulse">جاري تحميل الخبر...</div>;
    if (!post) return <div className="py-20 text-center text-red-500 font-bold">الخبر غير موجود</div>;

    // ✅ الصورة الرئيسية - يبحث في image أولاً ثم أول صورة في gallery
    const rawPath =
        (post.image?.original && post.image.original !== '') ? post.image.original :
        (post.gallery && post.gallery.length > 0 && post.gallery[0]?.original) ? post.gallery[0].original :
        null;

    const imageUrl = getImageUrl(rawPath);

    // ✅ الصور الفرعية
    const galleryImages = (post.gallery || [])
        .map((item: any) => ({
            id: item.id || Math.random(),
            src: getImageUrl(item.original) || '',
        }))
        .filter((img: any) => img.src !== '');

    const handleNext = () => {
        const next = (lightboxIndex + 1) % galleryImages.length;
        setLightboxIndex(next);
        setLightboxImg(galleryImages[next].src);
    };

    const handlePrev = () => {
        const prev = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        setLightboxIndex(prev);
        setLightboxImg(galleryImages[prev].src);
    };

    return (
        <main className="min-h-screen bg-white py-16" dir="rtl">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{post.title}</h1>
                <div className="text-gray-400 text-sm mb-10 border-b pb-6">
                    نُشر في: {new Date(post.published_at || post.created_at).toLocaleDateString('ar-SA')}
                </div>

                {/* الصورة الرئيسية */}
                {imageUrl && (
                    <div className="w-full h-[450px] rounded-3xl overflow-hidden mb-12 shadow-xl border border-gray-100">
                        <img src={imageUrl} className="w-full h-full object-cover" alt={post.title} />
                    </div>
                )}

                {/* المحتوى */}
                <div
                    className="prose prose-lg max-w-none text-gray-800 leading-loose text-right mb-16"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* ✅ معرض الصور الفرعية */}
                {galleryImages.length > 0 && (
                    <div className="mt-14 pt-10 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-black text-slate-900">صور الخبر</h2>
                            <span className="bg-[#009689] text-white text-sm font-bold px-3 py-0.5 rounded-full">
                                {galleryImages.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {galleryImages.map((img: any, index: number) => (
                                <div
                                    key={img.id}
                                    className="aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:scale-105 transition-all duration-300 relative group"
                                    onClick={() => { setLightboxImg(img.src); setLightboxIndex(index); }}
                                >
                                    <img src={img.src} className="w-full h-full object-cover" alt={`صورة ${index + 1}`} />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl">🔍</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-20 pt-10 border-t text-center">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#009689] transition-all shadow-xl active:scale-95"
                    >
                        العودة للأخبار
                    </button>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxImg && (
                <div
                    className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-6"
                    onClick={() => setLightboxImg(null)}
                >
                    <button
                        className="absolute top-5 left-5 text-white w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 transition-colors flex items-center justify-center text-xl"
                        onClick={() => setLightboxImg(null)}
                    >
                        ✕
                    </button>

                    {galleryImages.length > 1 && (
                        <div className="absolute top-5 right-5 text-white text-sm bg-white/10 px-3 py-1 rounded-full">
                            {lightboxIndex + 1} / {galleryImages.length}
                        </div>
                    )}

                    <div
                        className="relative max-w-5xl w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {galleryImages.length > 1 && (
                            <button
                                className="absolute -right-16 text-white w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 transition-colors flex items-center justify-center text-2xl hidden lg:flex"
                                onClick={handlePrev}
                            >
                                ›
                            </button>
                        )}

                        <img
                            src={lightboxImg}
                            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
                            alt="عرض كامل"
                        />

                        {galleryImages.length > 1 && (
                            <button
                                className="absolute -left-16 text-white w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 transition-colors flex items-center justify-center text-2xl hidden lg:flex"
                                onClick={handleNext}
                            >
                                ‹
                            </button>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default NewsDetailPage;