import Link from "next/link";
import ProjectView from "@/app/(UI)/_components/ProjectView";
import { getProject } from "@/app/lib/getProject";

export default async function MarketerProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  return <ProjectView project={project} isMarketerLanding={true} />;
}