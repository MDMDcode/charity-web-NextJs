"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from "@/app/lib/api"; 

export default function DynamicPage() {
    const params = useParams();
    const slug = params.slug;
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lbOpen, setLbOpen] = useState(false);
    const [lbIdx, setLbIdx] = useState(0);

useEffect(() => {
        if (!slug) return;

        setLoading(true); // لضمان ظهور حالة التحميل عند تغيير الـ slug

        apiClient.get(`pages/${slug}`)
            .then(response => {
                // في Axios، البيانات جاهزة في response.data
                // وبما أن Laravel يرجعها داخل data، نصل إليها عبر response.data.data
                if (response.data && response.data.data) {
                    setPage(response.data.data);
                } else {
                    setPage(response.data); // احتياطاً إذا كانت البيانات غير مغلفة
                }
            })
            .catch((err) => {
                console.error("Page fetch error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    const images = page?.images || [];
    const openLb = (i: number) => { setLbIdx(i); setLbOpen(true); };
    const moveLb = (d: number) => setLbIdx((lbIdx + d + images.length) % images.length);

    if (loading) return <div className="py-20 text-center text-slate-500">جاري التحميل...</div>;
    if (!page)   return <div className="py-20 text-center text-slate-500">الصفحة غير موجودة</div>;

    return (
        <main className="min-h-screen bg-white py-16" dir="rtl">
            <div className="max-w-4xl mx-auto px-6">

                {/* العنوان */}
                <div className="border-b pb-6 mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{page.title}</h1>
                    <span className="text-sm text-slate-400">{page.created_at}</span>
                </div>

                {/* المحتوى */}
                {page.content && (
                    <>
                        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100">المحتوى</p>
                        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed mb-12"
                            dangerouslySetInnerHTML={{ __html: page.content }} />
                    </>
                )}

                {/* الصور */}
                {images.length > 0 && (
                    <section className="mb-12">
                        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100">الصور</p>
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((img: any, i: number) => (
                                <img key={img.id} src={img.url} alt={img.name}
                                    onClick={() => openLb(i)}
                                    className={`w-full object-cover rounded-xl cursor-pointer hover:opacity-90 transition ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Lightbox */}
                {lbOpen && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center gap-4"
                        onClick={() => setLbOpen(false)}>
                        <button className="absolute top-4 left-4 text-white bg-white/10 rounded-full w-9 h-9 flex items-center justify-center text-lg"
                            onClick={() => setLbOpen(false)}>✕</button>
                        <img src={images[lbIdx]?.url} alt="" className="max-w-[90vw] max-h-[80vh] rounded-xl object-contain"
                            onClick={e => e.stopPropagation()} />
                        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                            <button onClick={() => moveLb(-1)} className="text-white bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-sm">→ السابق</button>
                            <span className="text-white text-sm">{lbIdx + 1} / {images.length}</span>
                            <button onClick={() => moveLb(1)} className="text-white bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-sm">التالي ←</button>
                        </div>
                    </div>
                )}

                {/* الفيديوهات */}
                {page.videos?.length > 0 && (
                    <section className="mb-12">
                        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100">الفيديوهات</p>
                        <div className="flex flex-col gap-4">
                            {page.videos.map((v: any) => (
                                <div key={v.id} className="rounded-xl overflow-hidden border border-slate-100">
                                    <video src={v.url} controls className="w-full bg-black max-h-80" />
                                    <div className="px-4 py-2 bg-slate-50 text-sm text-slate-500">{v.name}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ملفات PDF */}
                {page.attachments?.length > 0 && (
                    <section className="mb-12">
                        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100">الملفات المرفقة</p>
                        <div className="flex flex-col gap-2">
                            {page.attachments.map((f: any) => (
                                <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                                    <div className="w-10 h-10 bg-red-50 text-red-700 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">PDF</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 truncate">{f.name}</p>
                                        <p className="text-xs text-slate-400">{f.size}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </main>
    );
}