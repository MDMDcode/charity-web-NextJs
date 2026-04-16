"use client"; // نحتاج الحالة لإدارة التنقل بين التصنيفات

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectCard from "@/app/_components/ProjectCard";

// ... نفس الواجهات (Interfaces) دون تغيير
interface Project {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  pricing: { is_open_price: boolean; default_price: string };
  target: { has_target: boolean; goal_amount: string; collected_amount: string; percentage: number };
}

interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  projects?: Project[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ProjectCategoriesSection() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // جلب البيانات
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/project-categories`);
        const data = await res.json();
        const cats: ProjectCategory[] = data?.data?.items || [];

        const withProjects = await Promise.all(
          cats.map(async (cat) => {
            const res2 = await fetch(`${BASE_URL}/api/v1/project-categories/${cat.slug}`);
            const data2 = await res2.json();
            return data2?.data || cat;
          })
        );

        // تصفية التصنيفات التي تحتوي على مشاريع فقط
        const filtered = withProjects.filter(c => c.projects && c.projects.length > 0);
        setCategories(filtered);
        if (filtered.length > 0) setActiveTab(filtered[0].id); // تفعيل أول تبويب تلقائياً
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="py-20 text-center">جاري التحميل...</div>;
  if (categories.length === 0) return null;

  // الحصول على بيانات التصنيف النشط حالياً
  const activeCategory = categories.find(c => c.id === activeTab);

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* العناوين الثابتة في الأعلى */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">مشاريع مميزة</h2>
          <p className="text-gray-500 text-lg italic">ساهموا معنا لخدمة ضيوف الرحمن</p>
        </div>

        {/* قائمة التبويبات (أسماء التصنيفات) كما في الصورة */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-2 rounded-lg border transition-all duration-300 font-medium ${
                activeTab === category.id
                  ? "bg-[#E6F0F0] border-[#009689] text-[#009689]" // شكل الزر النشط
                  : "bg-white border-gray-100 text-gray-400 hover:border-[#009689]" // شكل الأزرار الأخرى
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* عرض المشاريع الخاصة بالتصنيف النشط فقط */}
        {activeCategory && (
          <div className="space-y-10">
            {/* المشاريع بتنسيق عرض عرضي (Scroll) أو Grid */}
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
              {activeCategory.projects?.map((project) => (
                <div key={project.id} className="min-w-[300px]">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* زر عرض الكل لهذا التصنيف تحديداً */}
            <div className="text-center">
              <Link
                href={`/projects?category=${activeCategory.slug}`}
                className="inline-block border-2 border-[#009689] text-[#009689] hover:bg-[#009689] hover:text-white font-bold px-10 py-3 rounded-full transition-all shadow-md"
              >
                عرض كافة مشاريع {activeCategory.name}
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}