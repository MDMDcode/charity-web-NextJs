"use client";

import React, { useEffect, useState } from "react";
import * as IconsFA from "react-icons/fa6";
import apiClient from "@/app/lib/api";
import Link from "next/link";

const StatisticsSection = ({ data, prefetched, siteName }: { data?: any, prefetched?: { items: any[], siteName?: string }, siteName?: string }) => {
  const [stats, setStats] = useState<any[]>(prefetched?.items || []);

  useEffect(() => {
    if (prefetched?.items?.length) return;
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("statistics");
        const res = response.data;
        const dataArray = res?.data?.items || res?.data || [];
        setStats(dataArray);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchStats();
  }, []);

  const DynamicIcon = ({ name }: { name: string }) => {
    const cleanName = name ? name.trim() : "";
    const IconComponent = (IconsFA as any)[cleanName];
    if (!IconComponent) return null;
    return <IconComponent className="w-10 h-10" />;
  };

  if (stats.length === 0) return null;

  const title    = data?.title?.trim()    || data?.name || "الإحصائيات";
  const subtitle = data?.subtitle?.trim() || "";
  const bgText   = siteName || prefetched?.siteName || 'جمعية خيرية';

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: "#009689" }}
      dir="rtl"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <p className="text-[180px] font-black text-white/10 whitespace-nowrap tracking-widest">
          {bgText}
        </p>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white mb-3">{title}</h2>
          {subtitle && (
            <p className="text-white/80 text-lg">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-10 mb-14">
          {stats.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center w-32">
              <div className="text-white mb-3">
                <DynamicIcon name={item.icon} />
              </div>
              <p className="text-white/90 text-2xl font-medium mb-1">
                {item.title}
              </p>
              <h3 className="text-4xl font-black text-white">
                {(item.number || item.count || 0).toLocaleString("ar-SA")}
              </h3>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/about"
            className="px-8 py-3 rounded-xl font-bold text-[#009689] bg-white hover:bg-gray-100 transition"
          >
            نبذة عنا
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 rounded-xl font-bold text-white border-2 border-white hover:bg-white/10 transition"
          >
            اتصل بنا
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;