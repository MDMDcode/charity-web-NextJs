import HeroSection from "./_components/Hero";
import StatisticsSection from "./_components/Statistic";
import NewsSection from "./_components/Posts";
import PartnersSection from "./_components/Partners";
import PhotoGallery from "./_components/Imgs";
import ProjectCategoriesPage from "./_components/ProjectCategory";
import Testimonial from "./_components/Testimonial";
import GalleryVideosCarousel from "./_components/Video";

const sectionMap: { [key: string]: React.ElementType } = {
  hero:               HeroSection,
  stats:              StatisticsSection,
  videos:             GalleryVideosCarousel,
  news:               NewsSection,
  gallery:            PhotoGallery,
  testimonials:       Testimonial,
  partners:           PartnersSection,
};

async function getHomepageSections() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/homepage-sections", {
    cache: "no-store",
  } );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const sections = await getHomepageSections();

  return (
    <div className="space-y-12">
{sections.map((section: any) => {
  // جلب المكون من الخريطة
  const SectionComponent = sectionMap[section.section_key];
  if (!SectionComponent) return null;

  // إذا كان المكون هو GalleryVideosCarousel، نمرر له البيانات المفصلة
// Home.tsx

// داخل ملف Home.tsx في حلقة الـ map

// ابحث عن الجزء الذي يعالج قسم الفيديو داخل الـ Loop في Home.tsx
if (section.section_key === 'videos') {
    return (
        <GalleryVideosCarousel 
            key={section.id} 
            // تمرير الـ section بالكامل ليقرأ المكون منه الاسم والبيانات
            data={section} 
        />
    );
}

  // باقي الأقسام تعمل كالمعتاد
  return <SectionComponent key={section.id} data={section.data} />;
})}

    </div>
  );
}
