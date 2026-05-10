"use client";
import Link from 'next/link';
import apiClient from "@/app/lib/api";
import { useState, useEffect } from "react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
  image: string | { original: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getImageUrl(image: string | { original: string } | undefined): string {
  if (!image) return '';
  const path = typeof image === 'object' ? image.original : image;
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    apiClient.get('hero-slides')
      .then(res => {
        const data = res.data;
        setSlides(data?.data?.items || data?.data || data || []);
      })
      .catch(() => setSlides([]));
  }, []);

  // تحرك تلقائي كل 5 ثواني
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const imageUrl = getImageUrl(slide.image);

  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent(p => (p + 1) % slides.length);

  return (
    <section className="relative h-[98vh] w-full overflow-hidden bg-white" dir="rtl">
      {/* الخلفية */}
      <div className="absolute inset-0 z-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* المحتوى */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 h-full flex flex-col justify-center text-center text-slate-900">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            {slide.subtitle}
          </p>
        )}
        {slide.button_text && (
          <Link
            href={slide.button_url || '#'}
            className="inline-block bg-emerald-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all mx-auto"
          >
            {slide.button_text}
          </Link>
        )}
      </div>

      {/* السهمين */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition"
          >
            ›
          </button>
          <button
            onClick={next}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition"
          >
            ‹
          </button>
        </>
      )}

      {/* النقاط */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`block rounded-full transition-all ${
                i === current ? 'w-8 h-3 bg-emerald-500' : 'w-3 h-3 bg-black/20'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}