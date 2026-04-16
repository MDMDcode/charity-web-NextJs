"use client";

import React, { useEffect, useState } from 'react';
import * as IconsFA from "react-icons/fa6";

const StoreStatisticsSection = ({ data }: { data?: any }) => {
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // تأكد من استخدام المسار الصحيح للمتجر
                const response = await fetch(`http://127.0.0.1:8000/api/v1/store_statistics?t=${Date.now()}`);
                const res = await response.json();
                setStats(res?.data || []);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchStats();
    }, []);

    const DynamicIcon = ({ name }: { name: string }) => {
        const IconComponent = (IconsFA as any)[name];
        if (!IconComponent) return <IconsFA.FaStore className="w-8 h-8 text-gray-800" />;
        return <IconComponent className="w-8 h-8 text-gray-800" />;
    };

    if (stats.length === 0) return null;

    return (
        <section className="py-10 bg-white border-y border-gray-100" dir="rtl">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    {stats.map((item, index) => (
                        <div 
                            key={item.id} 
                            className={`flex items-center justify-center gap-4 px-6 py-4 ${
                                // إضافة خط فاصل جانبي مثل التصميم (باستثناء العنصر الأخير)
                                index !== stats.length - 1 ? "md:border-l border-gray-200" : ""
                            }`}
                        >
                            {/* منطقة النص */}
                            <div className="text-right flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-[200px]">
                                    {/* هنا يمكنك استخدام الـ number كجزء من النص إذا أردت أو نص ثابت */}
                                    {item.number || "استمتع بتجربة آمنة وخصوصية تامة"}
                                </p>
                            </div>

                            {/* منطقة الأيقونة */}
                            <div className="flex-shrink-0">
                                <DynamicIcon name={item.icon} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StoreStatisticsSection;