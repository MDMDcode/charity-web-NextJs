"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProjectCard from "@/app/(UI)/_components/ProjectCard";
import { Project } from "@/app/(UI)/types/project";

const API = "https://api-shamel.tmt3.sa/api/v1";

interface Category {
  id: string;
  name: string;
}

interface ProjectWithCategory extends Project {
  category: Category;
}

// شاشة التحميل المشتركة
function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white" dir="rtl">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-[#009689]/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#009689] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#009689]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3" />
          </svg>
        </div>
      </div>
      <p className="text-[#009689] font-bold text-lg animate-pulse">جاري التحميل...</p>
      <div className="mt-4 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#009689] rounded-full" style={{ animation: "progress 2s ease-out forwards" }} />
      </div>
      <style>{`
        @keyframes progress {
          0%   { width: 0%; }
          60%  { width: 75%; }
          90%  { width: 90%; }
          100% { width: 90%; }
        }
      `}</style>
    </div>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const categoryId   = searchParams.get("category") || "";

  const [projects,   setProjects]   = useState<ProjectWithCategory[]>([]);
  const [catName,    setCatName]    = useState("");
  const [loading,    setLoading]    = useState(true);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const projsRes  = await fetch(`${API}/projects`);
        const projsData = await projsRes.json();
        const allProjects: ProjectWithCategory[] = projsData?.data?.items || [];

        const matchedProject = allProjects.find(p => p.category?.id === categoryId);
        if (matchedProject) setCatName(matchedProject.category.name);

        const filtered = categoryId
          ? allProjects.filter(p => p.category?.id === categoryId)
          : allProjects;

        setProjects(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categoryId]);

  const handleBack = () => {
    setNavigating(true);
    router.push("https://demo-shamel.tmt3.sa/store");
  };

  // شاشة تحميل كاملة بدل الـ spinner الصغير
  if (loading || navigating) return <FullScreenLoader />;

  return (
    <section className="py-16 bg-gray-50 min-h-screen" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* الهيدر */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span
                onClick={handleBack}
                className="hover:text-[#009689] transition cursor-pointer"
              >
                الرئيسية
              </span>
              <span>/</span>
              <span className="text-[#009689]">{catName}</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900">
              {catName ? `مشاريع ${catName}` : "جميع المشاريع"}
            </h1>
            <p className="text-gray-500 mt-2">{projects.length} مشروع متاح</p>
          </div>

          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 border-2 border-[#009689] text-[#009689] hover:bg-[#009689] hover:text-white font-bold px-6 py-2.5 rounded-xl transition"
          >
            العودة للرئيسية
          </button>
        </div>

        {/* المشاريع */}
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400 text-lg">لا توجد مشاريع في هذا التصنيف</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <ProjectsContent />
    </Suspense>
  );
}