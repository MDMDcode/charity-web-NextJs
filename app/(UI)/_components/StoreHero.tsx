'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface SlideImage {
  original: string;
  mobile?: string;
  thumb?: string;
}

interface HeroSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_url: string | null;
  image: SlideImage;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

interface ApiResponse {
  data: HeroSlide[] | { items: HeroSlide[] };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const INTERVAL = 5000;

function imgUrl(image: SlideImage | undefined, size: 'original' | 'mobile' = 'original'): string {
  if (!image) return '';
  const path = image[size] || image.original || '';
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function fetchSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/store-hero-slides`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const json: ApiResponse = await res.json();
    const raw = json?.data;
    return Array.isArray(raw) ? raw : (raw as { items: HeroSlide[] })?.items ?? [];
  } catch {
    return [];
  }
}

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={dir === 'prev' ? 'السابق' : 'التالي'}
      className={`
        absolute top-1/2 -translate-y-1/2 z-20
        ${dir === 'prev' ? 'right-4 md:right-8' : 'left-4 md:left-8'}
        w-10 h-10 rounded-full bg-white/80 hover:bg-white active:scale-95
        flex items-center justify-center shadow-md transition-all duration-200
      `}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={2.2} stroke="#1e293b"
        className={`w-4 h-4 ${dir === 'prev' ? '' : 'rotate-180'}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>
  );
}

function Dots({ count, current, onSelect }: { count: number; current: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            onSelect(i);
          }}
          aria-label={`الشريحة ${i + 1}`}
          className={`rounded-full transition-all duration-300
            ${i === current ? 'w-6 h-3 bg-white' : 'w-3 h-3 bg-white/40 hover:bg-white/70'}`}
        />
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="relative w-full bg-slate-800 animate-pulse" style={{ aspectRatio: '16/7' }}>
      <div className="absolute inset-0 bg-gradient-to-l from-slate-700 to-slate-800" />
    </div>
  );
}

export default function StoreHero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchSlides().then(data => {
      setSlides(data);
      setLoading(false);
    });
  }, []);

  const goTo = useCallback((i: number) => setCurrent(i), []);
  const goPrev = useCallback(() => {
    setCurrent(c => (slides.length > 0 ? (c - 1 + slides.length) % slides.length : 0));
  }, [slides.length]);
  const goNext = useCallback(() => {
    setCurrent(c => (slides.length > 0 ? (c + 1) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setTimeout(goNext, INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused, slides.length, goNext]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const d = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(d) > 50) d > 0 ? goPrev() : goNext();
    touchX.current = null;
  };

  // Preload images to prevent flickering
  useEffect(() => {
    if (slides.length > 0) {
      slides.forEach(slide => {
        const img = new Image();
        img.src = imgUrl(slide.image, 'original');
        const imgMob = new Image();
        imgMob.src = imgUrl(slide.image, 'mobile');
      });
    }
  }, [slides]);

  if (loading) return <Skeleton />;
  if (!slides.length) return null;

  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden select-none bg-slate-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="عروض المتجر"
      style={{ aspectRatio: '16/7', minHeight: '300px' }}
    >
      <div className="relative w-full h-full">
        {slides.map((slide, i) => {
          const bg = imgUrl(slide.image, 'original');
          const bgMob = imgUrl(slide.image, 'mobile');
          const isActive = i === current;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Images */}
              {bg && (
                <picture>
                  <source media="(max-width: 768px)" srcSet={bgMob || bg} />
                  <img
                    src={bg}
                    alt={slide.title ?? ''}
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </picture>
              )}

              {/* Gradient Overlay - RTL Optimized */}
              <div className="absolute inset-0 bg-gradient-to-l from-[#0b2e45]/90 via-[#0b2e45]/40 to-transparent" />

              {/* Content - RTL Positioned */}
              <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-24">
                <div
                  className={`max-w-xl text-right transition-all duration-700 delay-300 ${
                    isActive ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }`}
                >
                  {slide.title && (
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-sm md:text-lg text-white/90 leading-relaxed mb-8 max-w-lg">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.button_text && (
                    <Link
                      href={slide.button_url || '#'}
                      className="inline-flex items-center gap-3
                        bg-[#1a6fa8] hover:bg-[#1585cc] active:scale-95
                        text-white font-bold px-8 py-4 rounded-xl text-sm md:text-base
                        transition-all duration-200 shadow-lg hover:shadow-[#1a6fa8]/40"
                    >
                      {slide.button_text}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <Arrow dir="prev" onClick={goPrev} />
          <Arrow dir="next" onClick={goNext} />
          <Dots count={slides.length} current={current} onSelect={goTo} />
        </>
      )}

      <style jsx global>{`
        @keyframes rtlFadeIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}