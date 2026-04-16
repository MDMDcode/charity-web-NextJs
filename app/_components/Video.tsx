"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Youtube, FileVideo } from 'lucide-react';

interface VideoFile {
  id: string;
  file_name: string;
  // أضفنا folder_id ليتوافق مع منطق الصور عندك
  folder_id?: string | number; 
}

interface GalleryVideosCarouselProps {
  title: string;
  videos?: VideoFile[];
  links?: string[];
}

const GalleryVideosCarousel: React.FC<GalleryVideosCarouselProps> = ({
  title,
}) => {
  const [allMedia, setAllMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/galleries`);
        if (response.ok) {
          const res = await response.json();
          let items: any[] = [];
          
          res.data?.forEach((gallery: any) => {
            // معالجة الفيديوهات المرفوعة لتستخدم رابط الـ API
            if (gallery.videos) {
              gallery.videos.forEach((v: any) => {
                items.push({ 
                  ...v, 
                  type: 'video',
                  // نستخدم المعرف (id) كاسم للمجلد كما هو متبع في Spatie Media
                  secure_url: `${API_BASE_URL}/api/v1/fetch-secure-image?p=${v.id}/${v.file_name}`
                });
              });
            }
            // معالجة روابط اليوتيوب
            if (gallery.links) {
              gallery.links.forEach((link: string) => items.push({ url: link, type: 'link' }));
            }
          });
          setAllMedia(items);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) return <div className="py-20 text-center font-bold">جاري جلب البيانات الخاصة...</div>;
  if (allMedia.length === 0) return null;

  return (
    <div className="w-full my-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 mb-8 border-r-8 border-[#0FAFA0] pr-4">
          {title}
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {allMedia.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="aspect-video bg-black relative">
                {item.type === 'video' ? (
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    preload="metadata"
                    crossOrigin="use-credentials" // مهم للمجلدات الخاصة
                  >
                    {/* هنا نستخدم الرابط المؤمن الجديد */}
                    <source src={item.secure_url} type="video/mp4" />
                  </video>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={getYoutubeEmbed(item.url) || ""}
                    allowFullScreen
                  ></iframe>
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
    </div>
  );
};

export default GalleryVideosCarousel;