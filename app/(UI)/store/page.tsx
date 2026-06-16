import { Suspense } from 'react';
import StoreHeroSlider from '../_components/StoreHero';
import ProjectCategoriesPage from '../_components/ProjectCategory';
import StoreStatisticsSection from '../_components/StoreStatistic';

const API = "https://api-shamel.tmt3.sa/api/v1";

async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`${API}/${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.items || json.data?.data || json.data || [];
  } catch {
    return [];
  }
}

async function fetchCategories() {
  try {
    const cats = await fetchData('project-categories');
    const withProjects = await Promise.all(
      cats.map(async (cat: any) => {
        try {
          const res = await fetch(`${API}/project-categories/${cat.id}`, { next: { revalidate: 60 } });
          const data = await res.json();
          return data?.data || cat;
        } catch {
          return cat;
        }
      })
    );
    return withProjects;
  } catch {
    return [];
  }
}

export default async function Store() {
  const [storeSlides, storeStats] = await Promise.all([
    fetchData('store-hero-slides'),
    fetchData('store-statistics'),
  ]);

  return (
    <>
      <Suspense fallback={null}>
        <StoreHeroSlider prefetched={{ slides: storeSlides }} />
      </Suspense>

      <Suspense fallback={
        <section className="py-10 bg-white border-y border-gray-100" dir="rtl">
          <div className="container mx-auto px-4 max-w-7xl" />
        </section>
      }>
        <StoreStatisticsSection prefetched={{ items: storeStats }} />
      </Suspense>

      <Suspense fallback={
        <section className="py-16 bg-white" dir="rtl">
          <div className="container mx-auto px-6 max-w-7xl" />
        </section>
      }>
        <ProjectCategoriesPage />
      </Suspense>
    </>
  );
}