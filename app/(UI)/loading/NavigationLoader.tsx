"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationLoader() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // تجاهل الروابط الخارجية أو الهاش
      if (
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("#") ||
        anchor.target === "_blank"
      ) return;

      // تجاهل لو نفس الصفحة
      if (href === pathname) return;

      setLoading(true);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      dir="rtl"
    >
      {/* اللوغو أو الأيقونة */}
      <div className="mb-8 flex flex-col items-center gap-4">
        {/* دائرة الـ spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#009689]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#009689] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
          </div>
        </div>
 
      </div>

      <style jsx global>{`
        @keyframes progress {
          0%   { width: 0%; }
          60%  { width: 75%; }
          90%  { width: 90%; }
          100% { width: 90%; }
        }
        .animate-progress {
          animation: progress 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}