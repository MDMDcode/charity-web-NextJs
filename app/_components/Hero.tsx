import Link from 'next/link';
import manus from 'manus';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
  image: string | { original: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/hero-slides`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();
    return data?.data?.items || data?.data || [];
  } catch {
    return [];
  }
}

function getImageUrl(image: string | { original: string } | undefined): string {
  if (!image) return '';
  const path = typeof image === 'object' ? image.original : image;
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export default async function HeroSection() {
  const slides = await getSlides();
  if (!slides || slides.length === 0) return null;

  const first = slides[0];
  const imageUrl = getImageUrl(first.image);

  return (
    <section className="relative h-[98vh] w-full overflow-hidden bg-white" dir="rtl">
      {/* الخلفية */}
      <div className="absolute inset-0 z-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={first.title}
            className="w-full h-full object-cover opacity-100"
          />
        )}
      </div>

      {/* المحتوى */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 h-full flex flex-col justify-center text-center text-slate-900">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          {first.title}
        </h1>
        {first.subtitle && (
          <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            {first.subtitle}
          </p>
        )}
        {first.button_text && (
          <Link
            href={first.button_url || '#'}
            className="inline-block bg-emerald-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all mx-auto"
          >
            {first.button_text}
          </Link>
        )}
      </div>

      {/* نقاط التنقل - static للـ SSR */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all ${
                i === 0 ? 'w-8 h-3 bg-emerald-500' : 'w-3 h-3 bg-black/20'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}