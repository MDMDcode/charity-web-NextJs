"use client";

import React, { useEffect, useState } from "react";
import * as IconsFA from "react-icons/fa6";
import apiClient from "@/app/lib/api";
import Link from "next/link";

const StatisticsSection = ({ data }: { data?: any }) => {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
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

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: "#009689" }}
      dir="rtl"
    >
      {/* نص خلفي زخرفي */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <p className="text-[180px] font-black text-white/10 whitespace-nowrap tracking-widest">
          جميعية تمتع للخدمات الاجتماعية 
        </p>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">

        {/* العنوان والوصف */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white mb-3">{title}</h2>
          {subtitle && (
            <p className="text-white/80 text-lg">{subtitle}</p>
          )}
        </div>

        {/* الكروت */}
        <div className="flex flex-wrap justify-center gap-10 mb-14">
          {stats.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center w-32">
              {/* الأيقونة */}
              <div className="text-white mb-3">
                <DynamicIcon name={item.icon} />
              </div>

              {/* اسم الإحصائية */}
              <p className="text-white/90 text-sm font-medium mb-1">
                {item.title}
              </p>

              {/* الرقم */}
              <h3 className="text-4xl font-black text-white">
                {(item.number || item.count || 0).toLocaleString("ar-SA")}
              </h3>

              {/* اسم صغير تحت */}
              <p className="text-white/70 text-xs mt-1">{item.title}</p>
            </div>
          ))}
        </div>

        {/* الأزرار */}
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