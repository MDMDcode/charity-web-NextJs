"use client";

import React, { useEffect, useState } from 'react';
import { Youtube, FileVideo } from 'lucide-react';

const GalleryVideosCarousel = ({ data, prefetched }: { data?: any, prefetched?: { items: any[] } }) => {
    const [allMedia, setAllMedia] = useState<any[]>([]);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-shamel.tmt3.sa';

    useEffect(() => {
        const source = prefetched?.items || [];
        const items: any[] = [];
        source.forEach((gallery: any) => {
            if (gallery.videos && Array.isArray(gallery.videos)) {
                gallery.videos.forEach((v: any) => {
                    items.push({
                        ...v,
                        type: 'video',
                        secure_url: `${API_BASE_URL}/api/v1/fetch-secure-image?p=${v.id}/${v.file_name}`
                    });
                });
            }
            if (gallery.links && Array.isArray(gallery.links)) {
                gallery.links.forEach((link: string) => {
                    if (link) items.push({ url: link, type: 'link' });
                });
            }
        });
        setAllMedia(items);
    }, [prefetched]);

    const getYoutubeEmbed = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    if (allMedia.length === 0) return null;

    return (
        <section className="py-12 bg-white" dir="rtl">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-right mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3 border-r-8 border-[#0FAFA0] pr-4">
                        {data?.title || data?.name || "المعرض المرئي"}
                    </h2>
                    {(data?.subtitle || data?.data?.subtitle) && (
                        <p className="text-gray-600 text-lg mr-6">
                            {data?.subtitle || data?.data?.subtitle}
                        </p>
                    )}
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
                    {allMedia.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="aspect-video bg-black relative">
                                {item.type === 'video' ? (
                                    <video controls className="w-full h-full object-cover" preload="metadata" crossOrigin="use-credentials">
                                        <source src={item.secure_url} type="video/mp4" />
                                    </video>
                                ) : (
                                    getYoutubeEmbed(item.url) && (
                                        <iframe className="w-full h-full" src={getYoutubeEmbed(item.url)!} allowFullScreen loading="lazy"></iframe>
                                    )
                                )}
                            </div>
                            <div className="p-4 bg-white flex items-center justify-between">
                                <span className="text-sm font-bold truncate max-w-[200px]">
                                    {item.type === 'video' ? item.file_name : 'فيديو يوتيوب'}
                                </span>
                                {item.type === 'video' ? <FileVideo className="text-[#0FAFA0]" size={20} /> : <Youtube className="text-red-600" size={20} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GalleryVideosCarousel;