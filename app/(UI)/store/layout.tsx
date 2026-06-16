"use client";

import { useEffect, useState } from "react";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        dir="rtl"
      >
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[#009689]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#009689] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#009689]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3"
              />
            </svg>
          </div>
        </div>

        <p className="text-[#009689] font-bold text-lg animate-pulse">
          جاري التحميل...
        </p>

        <div className="mt-4 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#009689] rounded-full"
            style={{ animation: "progress 2s ease-out forwards" }}
          />
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

  return <>{children}</>;
}