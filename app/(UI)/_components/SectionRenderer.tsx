"use client";

import HeroSection from "./Hero";
import StatisticsSection from "./Statistic";
import NewsSection from "./Posts";
import PartnersSection from "./Partners";
import PhotoGallery from "./Imgs";
import Testimonial from "./Testimonial";
import GalleryVideosCarousel from "./Video";

const sectionMap: { [key: string]: React.ElementType } = {
  hero:         HeroSection,
  stats:        StatisticsSection,
  videos:       GalleryVideosCarousel,
  news:         NewsSection,
  gallery:      PhotoGallery,
  testimonials: Testimonial,
  partners:     PartnersSection,
};

export default function SectionRenderer({ sections, dataMap, siteName }: {
  sections: any[];
  dataMap: { [key: string]: any };
  siteName: string;
}) {
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