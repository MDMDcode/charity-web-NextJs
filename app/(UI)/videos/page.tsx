import Link from "next/link";
import { Youtube, FileVideo } from "lucide-react";

const API = "https://api-shamel.tmt3.sa/api/v1";
const API_BASE_URL = "https://api-shamel.tmt3.sa";

async function getVideos() {
  try {
    const res = await fetch(`${API}/video-galleries`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data?.items || [];
  } catch {
    return [];
  }
}

async function getVideoSection() {
  try {
    const res = await fetch(`${API}/homepage-sections`, { cache: 'no-store' });
    const json = await res.json();
    const sections = json?.data || [];
    return sections.find((s: any) => s.section_key === 'videos') || null;
  } catch {
    return null;
  }
}

const getYoutubeEmbed = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default async function VideosPage() {
  const [albums, videoSection] = await Promise.all([
    getVideos(),
    getVideoSection(),
  ]);

  const title    = videoSection?.title?.trim()    || 'معرض الفيديو';
  const subtitle = videoSection?.subtitle?.trim() || '';

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">

      <section className="bg-[#009689] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{title}</h1>
          {subtitle && <p className="text-white/80 text-lg">{subtitle}</p>}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {albums.length === 0 ? (
          <div className="text-center text-gray-400 py-20">لا توجد فيديوهات حالياً</div>
        ) : (
          <div className="space-y-16">
            {albums.map((album: any) => {
              const media: any[] = [];
              album.videos?.forEach((v: any) => {
                const url = v.url?.startsWith('http') ? v.url : `${API_BASE_URL}${v.url}`;
                media.push({ url, type: 'video' });
              });
              album.links?.forEach((link: string) => {
                if (link) media.push({ url: link, type: 'link' });
              });

              if (media.length === 0) return null;

              return (
                <div key={album.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-1 h-8 bg-[#0FAFA0] rounded-full" />
                    <h2 className="text-2xl font-black text-gray-900">{album.title}</h2>
                    {album.is_featured && (
                      <span className="bg-[#009689] text-white text-xs font-bold px-3 py-1 rounded-full">مميز</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {media.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="aspect-video bg-black">
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
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]">
                            {album.title}
                          </span>
                          {item.type === 'video'
                            ? <FileVideo className="text-[#0FAFA0]" size={20} />
                            : <Youtube className="text-red-600" size={20} />
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}