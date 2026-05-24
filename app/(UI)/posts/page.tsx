import Link from "next/link";
import { Calendar } from "lucide-react";

const API = "https://api-shamel.tmt3.sa/api/v1";
const API_BASE_URL = "https://api-shamel.tmt3.sa";

async function getPosts() {
  try {
    const res = await fetch(`${API}/posts`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data?.items || [];
  } catch {
    return [];
  }
}

async function getNewsSection() {
  try {
    const res = await fetch(`${API}/homepage-sections`, { cache: 'no-store' });
    const json = await res.json();
    const sections = json?.data || [];
    return sections.find((s: any) => s.section_key === 'news') || null;
  } catch {
    return null;
  }
}

const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path || path.trim() === '') return null;
  if (path.startsWith('http')) return path;
  const cleaned = path.replace(/^\/?storage\//, '');
  return `${API_BASE_URL}/api/v1/news-image?path=/${cleaned}`;
};

export default async function PostsPage() {
  const [posts, newsSection] = await Promise.all([
    getPosts(),
    getNewsSection(),
  ]);

  const title    = newsSection?.title?.trim()    || 'الأخبار';
  const subtitle = newsSection?.subtitle?.trim() || 'تابع آخر أخبار الجمعية وفعالياتها';

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">

      <section className="bg-[#009689] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{title}</h1>
          {subtitle && <p className="text-white/80 text-lg">{subtitle}</p>}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 py-20">لا توجد أخبار حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const rawPath = post.image?.original?.trim()
                ? post.image.original
                : post.gallery?.[0]?.original ?? null;
              const imageUrl = getImageUrl(rawPath);

              return (
                <Link href={`/news/${post.id}`} key={post.id} className="group block">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="h-56 relative overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          لا توجد صورة
                        </div>
                      )}
                      {post.is_featured && (
                        <span className="absolute top-4 right-4 bg-[#009689] text-white text-xs font-bold px-3 py-1 rounded-full">
                          مميز
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-[#009689] text-xs font-bold mb-3">
                        <Calendar size={13} />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('ar-SA', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </div>
                      <h2 className="font-black text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#009689] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed flex-grow">
                        {post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-[#009689] font-bold text-sm flex items-center gap-2">
                          اقرأ المزيد ←
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}