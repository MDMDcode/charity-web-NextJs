import StoreHeroSlider from '../_components/StoreHero';
import ProjectCategoriesPage from '../_components/ProjectCategory';
import StoreStatisticsSection from '../_components/StoreStatistic';

const API = "https://api-shamel.tmt3.sa/api/v1";

async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`${API}/${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    console.log(`fetchData(${endpoint}):`, JSON.stringify(json?.data));
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
  const [storeSlides, storeStats, categories] = await Promise.all([
    fetchData('store-hero-slides'),
    fetchData('store-statistics'),
    fetchCategories(),
  ]);

  return (
    <>
      <StoreHeroSlider prefetched={{ slides: storeSlides }} />
      <StoreStatisticsSection prefetched={{ items: storeStats }} />
      <ProjectCategoriesPage prefetched={{ items: categories }} />
    </>
  );
}