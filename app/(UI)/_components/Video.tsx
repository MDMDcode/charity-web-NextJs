"use client";

import React, { useEffect, useState } from 'react';
import { Youtube, FileVideo } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = 'https://api-shamel.tmt3.sa';
const API = `${API_BASE_URL}/api/v1`;

const GalleryVideosCarousel = ({ data, prefetched }: { data?: any, prefetched?: { items: any[] } }) => {
    const [albums, setAlbums] = useState<any[]>([]);
    const [activeAlbum, setActiveAlbum] = useState<any>(null);

    useEffect(() => {
        const source = prefetched?.items || [];

        if (!source.length) {
            fetch(`${API}/video-galleries`)
                .then(res => res.json())
                .then(json => processItems(json?.data?.items || []))
                .catch(err => console.error(err));
            return;
        }

        processItems(source);
    }, [prefetched]);

    const processItems = (source: any[]) => {
        const featured = source.filter((album: any) => album.is_featured);
        setAlbums(featured);
        if (featured.length > 0) setActiveAlbum(featured[0]);
    };

    const getYoutubeEmbed = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    const getAlbumMedia = (album: any) => {
        const items: any[] = [];
        album?.videos?.forEach((v: any) => {
            const url = v.url?.startsWith('http') ? v.url : `${API_BASE_URL}${v.url}`;
            items.push({ url, type: 'video' });
        });
        album?.links?.forEach((link: string) => {
            if (link) items.push({ url: link, type: 'link' });
        });
        return items;
    };

    if (albums.length === 0) return null;

    const activeMedia = getAlbumMedia(activeAlbum);

    return (
        <section className="py-12 bg-white" dir="rtl">
            <div className="container mx-auto px-4 max-w-7xl">

                <div className="flex items-end justify-between mb-12">
                    <div className="text-right">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3 border-r-8 border-[#0FAFA0] pr-4">
                            {data?.title || "المعرض المرئي"}
                        </h2>
                        {data?.subtitle && (
                            <p className="text-gray-600 text-lg mr-6">{data.subtitle}</p>
                        )}
                    </div>

                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                    {albums.map((album) => (
                        <button
                            key={album.id}
                            onClick={() => setActiveAlbum(album)}
                            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                                activeAlbum?.id === album.id
                                ? 'bg-[#0FAFA0] text-white'
                                : 'border-2 border-gray-200 text-gray-500 hover:border-[#0FAFA0]'
                            }`}
                        >
                            {album.title}
                        </button>
                    ))}
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
                    {activeMedia.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="aspect-video bg-black relative">
                                {item.type === 'video' ? (
                                    <video controls className="w-full h-full object-cover" preload="metadata">
                                        <source src={item.url} type="video/mp4" />
                                    </video>
                                ) : (
                                    getYoutubeEmbed(item.url) && (
                                        <iframe
                                            className="w-full h-full"
                                            src={getYoutubeEmbed(item.url)!}
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    )
                                )}
                            </div>
                            <div className="p-4 bg-white flex items-center justify-between">
                                <span className="text-sm font-bold truncate max-w-[200px]">
                                    {activeAlbum?.title}
                                </span>
                                {item.type === 'video'
                                    ? <FileVideo className="text-[#0FAFA0]" size={20} />
                                    : <Youtube className="text-red-600" size={20} />
                                }
                            </div>
                        </div>
                    ))}
                </div>

                    <div className="flex justify-center mt-8">
  <Link
    href="/videos"
    className="px-8 py-3 rounded-full border-2 border-[#009689] text-[#009689] hover:bg-[#009689] hover:text-white font-bold text-sm transition-all duration-300"
    >
    عرض جميع الفيديو
  </Link>
   </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default GalleryVideosCarousel;