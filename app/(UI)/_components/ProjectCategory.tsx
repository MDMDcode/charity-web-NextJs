"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/app/(UI)/_components/ProjectCard";
import { Project } from "@/app/(UI)/types/project";

const API = "https://api-shamel.tmt3.sa/api/v1";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface ProjectWithCategory extends Project {
  category: Category;
}

const ALL_TAB = "all";

export default function ProjectCategoriesSection() {
  const router = useRouter();
  const [categories,  setCategories] = useState<Category[]>([]);
  const [projects,    setProjects]   = useState<ProjectWithCategory[]>([]);
  const [activeTab,   setActiveTab]  = useState<string>(ALL_TAB);
  const [loading,     setLoading]    = useState(true);
  const [navigating,  setNavigating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsRes, projsRes] = await Promise.all([
          fetch(`${API}/project-categories`),
          fetch(`${API}/projects`),
        ]);
        const catsData  = await catsRes.json();
        const projsData = await projsRes.json();

        const cats: Category[]             = catsData?.data?.items  || [];
        const projs: ProjectWithCategory[] = projsData?.data?.items || [];

        const activeCats = cats.filter(cat => projs.some(p => p.category?.id === cat.id));

        setCategories(activeCats);
        setProjects(projs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleViewAll = () => {
    setNavigating(true);
    if (activeTab === ALL_TAB) {
      router.push("/categoryProject");
    } else {
      router.push(`/categoryProject?category=${activeTab}`);
    }
  };

  if (loading) return <div className="py-20 text-center">جاري التحميل...</div>;
  if (categories.length === 0) return null;

  const activeCategory = categories.find(c => c.id === activeTab);
  const activeProjects = activeTab === ALL_TAB
    ? projects
    : projects.filter(p => p.category?.id === activeTab);

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">مشاريع مميزة</h2>
          <p className="text-gray-500 text-lg italic">ساهموا معنا لخدمة ضيوف الرحمن</p>
        </div>

        {/* التبويبات */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveTab(ALL_TAB)}
            className={`px-6 py-2 rounded-lg border transition-all duration-300 font-medium ${
              activeTab === ALL_TAB
                ? "bg-[#E6F0F0] border-[#009689] text-[#009689]"
                : "bg-white border-gray-100 text-gray-400 hover:border-[#009689]"
            }`}
          >
            الكل
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-2 rounded-lg border transition-all duration-300 font-medium ${
                activeTab === cat.id
                  ? "bg-[#E6F0F0] border-[#009689] text-[#009689]"
                  : "bg-white border-gray-100 text-gray-400 hover:border-[#009689]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* المشاريع - Grid */}
        {activeProjects.length > 0 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* زر عرض الكل */}
            <div className="text-center">
              <button
                onClick={handleViewAll}
                disabled={navigating}
                className="inline-flex items-center gap-2 border-2 border-[#009689] text-[#009689] hover:bg-[#009689] hover:text-white font-bold px-10 py-3 rounded-full transition-all shadow-md disabled:opacity-70"
              >
                {navigating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  activeTab === ALL_TAB
                    ? `عرض كافة المشاريع (${activeProjects.length})`
                    : `عرض كافة مشاريع ${activeCategory?.name} (${activeProjects.length})`
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}