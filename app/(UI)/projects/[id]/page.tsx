import Link from "next/link";
import DonationSection from "@/app/(UI)/_components/DonationSection";

const API = "https://api-shamel.tmt3.sa/api/v1";

async function getProject(id: string) {
  try {
    const res = await fetch(`${API}/projects/${id}`, { cache: 'no-store' });
    const json = await res.json();
    console.log('project data:', JSON.stringify(json));
    return json?.data || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">المشروع غير موجود</p>
          <Link href="/" className="text-[#009689] font-bold">العودة للرئيسية</Link>
        </div>
      </main>
    );
  }

  const goal       = Number(project.target?.goal_amount) || 0;
  const collected  = Number(project.target?.collected_amount) || 0;
  const percentage = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">

      <section className="bg-[#009689] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link href="/" className="hover:text-white transition">الرئيسية</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-white transition">المشاريع</Link>
            <span>/</span>
            <span className="text-white">{project.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">{project.title}</h1>
          {project.category && (
            <span className="mt-3 inline-block bg-white/20 text-white text-sm font-bold px-4 py-1 rounded-full">
              {project.category.name}
            </span>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            {project.image_url && (
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full object-cover max-h-96"
                />
              </div>
            )}

            {project.target?.has_target && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">تم جمع</p>
                    <p className="text-2xl font-black text-[#009689]">
                      {collected.toLocaleString('ar-SA')} ر.س
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 mb-1">المستهدف</p>
                    <p className="text-lg font-bold text-gray-700">
                      {goal.toLocaleString('ar-SA')} ر.س
                    </p>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#009689] rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-left text-sm font-bold text-[#009689] mt-2">{percentage}%</p>
              </div>
            )}

            {project.content && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-4">تفاصيل المشروع</h2>
                <div
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <DonationSection project={project} />
          </div>

        </div>
      </section>
    </main>
  );
}