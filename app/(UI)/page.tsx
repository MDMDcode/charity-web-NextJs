import HeroSection from "./_components/Hero";
import StatisticsSection from "./_components/Statistic";
import NewsSection from "./_components/Posts";
import PartnersSection from "./_components/Partners";
import PhotoGallery from "./_components/Imgs";
import Testimonial from "./_components/Testimonial";
import GalleryVideosCarousel from "./_components/Video";

const API = "https://api-shamel.tmt3.sa/api/v1";

async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`${API}/${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.items || json.data?.data || json.data || [];
  } catch {
    return [];
  }
}

async function getHomepageSections() {
  try {
    const res = await fetch(`${API}/homepage-sections`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${API}/settings`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data || {};
  } catch {
    return {};
  }
}

export default async function Home() {
  const [sections, heroSlides, stats, news, partners, gallery, testimonials, videos, settings] = await Promise.all([
    getHomepageSections(),
    fetchData('hero-slides'),
    fetchData('statistics'),
    fetchData('posts'),
    fetchData('partners'),
    fetchData('photo-galleries'),
    fetchData('testimonials'),
    fetchData('video-galleries'),
    getSettings(),
  ]);

  const siteName = settings?.site_name || '';

  if (settings?.system_status?.is_maintenance_mode) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#009689] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-8xl mb-8">🔧</div>
          <h1 className="text-4xl font-black text-white mb-4">  {settings?.system_status?.maintenance_message || 'نعمل على تحسين الموقع، نعود قريباً.'} </h1>

        </div>
      </main>
    );
  }

  const dataMap: { [key: string]: any } = {
    hero:         { slides: heroSlides },
    stats:        { items: stats },
    videos:       { items: videos },
    news:         { items: news },
    gallery:      { items: Array.isArray(gallery) ? gallery : gallery?.data || gallery || [] },
    testimonials: { items: testimonials },
    partners:     { items: partners },
  };

  const sectionMap: { [key: string]: React.ElementType } = {
    hero:         HeroSection,
    stats:        StatisticsSection,
    videos:       GalleryVideosCarousel,
    news:         NewsSection,
    gallery:      PhotoGallery,
    testimonials: Testimonial,
    partners:     PartnersSection,
  };

  return (
    <div>
      {sections.map((section: any) => {
        const SectionComponent = sectionMap[section.section_key];
        if (!SectionComponent) return null;
        return (
          <SectionComponent
            key={section.id}
            data={section}
            prefetched={dataMap[section.section_key]}
            siteName={siteName}
          />
        );
      })}
    </div>
  );
}