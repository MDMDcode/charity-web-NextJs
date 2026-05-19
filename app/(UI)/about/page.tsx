import Link from "next/link";
import { Target, Heart, Star, CheckCircle } from "lucide-react";

const API = "https://api-shamel.tmt3.sa/api/v1";

async function getAbout() {
  try {
    const res = await fetch(`${API}/about`, { next: { revalidate: 60 } });
    const json = await res.json();
    const items = json?.data?.data;
    return Array.isArray(items) && items.length > 0 ? items[0] : null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const data = await getAbout();

  if (!data) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">

      <section className="relative bg-[#009689] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-0 left-20 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            من نحن
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {data.title}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
          <div className="flex gap-3 justify-center mt-10">
            <Link href="/store" className="bg-white text-[#009689] px-8 py-3 rounded-xl font-black hover:bg-gray-100 transition">
              برامجنا
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-xl font-black hover:bg-white/10 transition">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-2">مبادئنا الأساسية</h2>
          <div className="w-16 h-1 bg-[#009689] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="w-14 h-14 bg-[#009689]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#009689] transition">
              <Heart size={24} className="text-[#009689] group-hover:text-white transition" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">رسالتنا</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{data.our_massage}</p>
          </div>

          <div className="bg-[#009689] rounded-3xl p-8 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
              <Target size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">رؤيتنا</h3>
            <p className="text-white/80 text-sm leading-relaxed">{data.our_vision}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="w-14 h-14 bg-[#009689]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#009689] transition">
              <Star size={24} className="text-[#009689] group-hover:text-white transition" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">قيمنا</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{data.our_values}</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-l from-[#009689] to-[#0b6e65] px-10 py-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">أهدافنا</h2>
              <p className="text-white/70 text-sm">ما نسعى إلى تحقيقه</p>
            </div>
          </div>
          <div className="p-10">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-[#009689] text-white font-black text-sm flex items-center justify-center mt-1">
                1
              </div>
              <p className="text-gray-600 leading-relaxed">{data.our_goals}</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}