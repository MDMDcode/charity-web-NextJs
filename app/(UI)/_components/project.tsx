"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectCard from "@/app/(UI)/_components/ProjectCard";
import Link from "next/link";
import { Project } from "@/app/(UI)/types/project";

const API_BASE_URL = "https://api-shamel.tmt3.sa/api/v1";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const categoryId   = searchParams.get("category") || "";

  const [projects, setProjects] = useState<Project[]>([]);
  const [catName,  setCatName]  = useState("");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    fetch(`${API_BASE_URL}/project-categories/${categoryId}`)
      .then(res => res.json())
      .then(json => {
        const data = json?.data;
        setCatName(data?.name || "");
        setProjects(data?.projects || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <section className="py-16 bg-gray-50 min-h-screen" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Link href="/" className="hover:text-[#009689] transition">الرئيسية</Link>
              <span>/</span>
              <span className="text-[#009689]">{catName}</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900">مشاريع {catName}</h1>
            <p className="text-gray-500 mt-2">{projects.length} مشروع متاح</p>
          </div>
          <Link href="/" className="border-2 border-[#009689] text-[#009689] hover:bg-[#009689] hover:text-white font-bold px-6 py-2.5 rounded-xl transition">
            العودة للرئيسية
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400 text-lg">لا توجد مشاريع في هذا التصنيف</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}