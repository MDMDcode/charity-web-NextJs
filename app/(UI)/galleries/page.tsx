import Link from "next/link";

const API = "https://api-shamel.tmt3.sa/api/v1";
const API_BASE_URL = "https://api-shamel.tmt3.sa";

async function getGalleries() {
  try {
    const res = await fetch(`${API}/photo-galleries`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data?.items || [];
  } catch {
    return [];
  }
}

async function getGallerySection() {
  try {
    const res = await fetch(`${API}/homepage-sections`, { cache: 'no-store' });
    const json = await res.json();
    const sections = json?.data || [];
    return sections.find((s: any) => s.section_key === 'gallery') || null;
  } catch {
    return null;
  }
}

const buildImageUrl = (img: any) => {
  if (!img) return null;
  const url = img.url || '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

export default async function GalleriesPage() {
  const [galleries, gallerySection] = await Promise.all([
    getGalleries(),
    getGallerySection(),
  ]);

  const title    = gallerySection?.title?.trim()    || 'معرض الصور';
  const subtitle = gallerySection?.subtitle?.trim() || 'تصفح جميع ألبومات الصور';

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">

      <section className="bg-[#009689] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{title}</h1>
          {subtitle && <p className="text-white/80 text-lg">{subtitle}</p>}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {galleries.length === 0 ? (
          <div className="text-center text-gray-400 py-20">لا توجد ألبومات حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((album: any) => {
              const cover = album.images?.[0];
              const coverUrl = buildImageUrl(cover);

              return (
                <div key={album.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        لا توجد صورة
                      </div>
                    )}
                    {album.is_featured && (
                      <span className="absolute top-4 right-4 bg-[#009689] text-white text-xs font-bold px-3 py-1 rounded-full">
                        مميز
                      </span>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {album.images?.length || 0} صورة
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-black text-gray-900 text-lg">{album.title}</h2>
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