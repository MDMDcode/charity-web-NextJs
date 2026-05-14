import HeroSection from "./_components/Hero";
import StatisticsSection from "./_components/Statistic";
import NewsSection from "./_components/Posts";
import PartnersSection from "./_components/Partners";
import PhotoGallery from "./_components/Imgs";
import Testimonial from "./_components/Testimonial";
import GalleryVideosCarousel from "./_components/Video";

const sectionMap: { [key: string]: React.ElementType } = {
  hero:         HeroSection,
  stats:        StatisticsSection,
  videos:       GalleryVideosCarousel,
  news:         NewsSection,
  gallery:      PhotoGallery,
  testimonials: Testimonial,
  partners:     PartnersSection,
};

async function getHomepageSections() {
  try {
    const res = await fetch("https://api-shamel.tmt3.sa/api/v1/homepage-sections", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const sections = await getHomepageSections();

  return (
    <div> {/* ← حذفنا space-y-12 */}
      {sections.map((section: any) => {
        const SectionComponent = sectionMap[section.section_key];
        if (!SectionComponent) return null;
        return <SectionComponent key={section.id} data={section} />; {/* ← section مباشرة */}
      })}
    </div>
  );
}