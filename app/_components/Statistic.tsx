"use client";

import React, { useEffect, useState } from 'react';
import * as IconsFA from "react-icons/fa6";
import apiClient from "@/app/lib/api"; 

const StatisticsSection = ({ data }: { data?: any }) => {
    const [stats, setStats] = useState<any[]>([]);

useEffect(() => {
        const fetchStats = async () => {
            try {
                // استخدام apiClient مباشرة
                // أضفنا الباراميتر t للمنع من الكاش كما كنتِ تفعلين
                const response = await apiClient.get(`statistics`, {
                    params: { t: Date.now() }
                });

                // في Axios البيانات موجودة في response.data
                const res = response.data;
                
                // استخراج المصفوفة بناءً على هيكلة الـ API الخاص بكِ
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
        return <IconComponent className="w-10 h-10 text-white" />;
    };

    if (stats.length === 0) return null;

    return (
        <section className="py-12 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
            <div className="container mx-auto px-4 max-w-7xl">

                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                        {data?.title }
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {data?.subtitle }
                    </p>
                </div>

                <div className="flex flex-wrap justify-center grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((item, index) => (
                        <div key={item.id} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#009689] to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                            <div className="relative w-50 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 rounded-3xl group-hover:-translate-y-2">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4 p-4 bg-gradient-to-br from-[#009689] to-[#8fa1a0] rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <DynamicIcon name={item.icon} />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 font-medium">{item.title}</p>
                                    <h3 className="text-5xl font-bold bg-gradient-to-r from-[#009689] to-[#659490] bg-clip-text text-transparent mb-1">
                                        {item.number || item.count || 0}
                                    </h3>
                                    <p className="text-xs text-gray-500">{item.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default StatisticsSection;