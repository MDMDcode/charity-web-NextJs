"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProjectCard from "@/app/(UI)/_components/ProjectCard";

const API = "https://api-shamel.tmt3.sa/api/v1";

function CategoryContent() {
  const searchParams = useSearchParams();
  const categoryId   = searchParams.get("category") || "";

  const [projects,   setProjects]   = useState<any[]>([]);
  const [catName,    setCatName]    = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    fetch(`${API}/project-categories`)
      .then(res => res.json())
      .then(json => setCategories(json?.data?.items || []));
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API}/project-categories/${categoryId}`)
      .then(res => res.json())
      .then(json => {
        const data = json?.data;
        setCatName(data?.name || "");
        setProjects(data?.projects || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">

      <section className="bg-[#009689] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {catName || "المشاريع"}
          </h1>
          <p className="text-white/80 text-lg">ساهم في مشاريعنا الخيرية</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/projects"
              className="px-5 py-2 rounded-full font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-[#009689] hover:text-[#009689] transition-all"
            >
              الكل
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categoryProject?category=${cat.id}`}
                className={`px-5 py-2 rounded-full font-bold text-sm border-2 transition-all ${
                  cat.id === categoryId
                    ? 'bg-[#009689] text-white border-[#009689]'
                    : 'border-gray-200 text-gray-600 hover:border-[#009689] hover:text-[#009689]'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-400 py-20">لا توجد مشاريع في هذا التصنيف</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function CategoryProjectPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}