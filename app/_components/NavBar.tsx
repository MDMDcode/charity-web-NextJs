"use client";

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import * as IconsFA from "react-icons/fa6";

const NavBar = () => {
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/menu-items?location=header&t=${Date.now()}`, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                const res = await response.json();
                setMenuItems(res?.data || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const DynamicIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
        if (!iconName) return null;
        const IconComponent = (IconsFA as any)[iconName.trim()];
        if (!IconComponent) return null;
        return <IconComponent className={className} />;
    };

    if (loading) return <div className="h-12 bg-gray-50 animate-pulse w-full" />;

    return (
        <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-4 py-2">

                    {menuItems.map((item: any) => {
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <div key={item.id} className="relative group">

                                {/* ── المستوى الأول ── */}
                                <a
                                    href={item.url || '#'}
                                    target={item.target}
                                    className="flex items-center gap-2 px-3 py-2 text-[18px] font-semibold text-black hover:bg-[#009689] hover:text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                                >
                                    <DynamicIcon iconName={item.icon} className="opacity-60" />
                                    <span>{item.title}</span>
                                    {hasChildren && (
                                        <ChevronDown size={18} className="transition-transform duration-300 group-hover:rotate-180 text-gray-400" />
                                    )}
                                </a>

                                {/* ── Dropdown المستوى الثاني ── */}
                                {hasChildren && (
                                    <div className="absolute top-[110%] right-0 w-64 bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-2xl py-3
                                        opacity-0 invisible translate-y-4
                                        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                        transition-all duration-300 z-[1000] ring-1 ring-black/5">

                                        {/* مثلث أعلى */}
                                        <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-r border-gray-100" />

                                        <div className="flex flex-col gap-1 px-2">
                                            {item.children.map((child: any) => {
                                                const hasGrandchildren = child.children && child.children.length > 0;

                                                return (
                                                    // ── wrapper للمستوى الثاني مع group/child ──
                                                    <div key={child.id} className="relative group/child">
                                                        <a
                                                            href={child.url || '#'}
                                                            target={child.target}
                                                            className="flex items-center gap-3 px-4 py-3 text-[16px] font-semibold text-gray-800
                                                                hover:bg-[#009689] hover:text-white rounded-xl transition-all duration-200
                                                                group/item relative overflow-hidden"
                                                        >
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover/item:bg-white/20 transition-colors">
                                                                <DynamicIcon iconName={child.icon} className="text-[18px] opacity-70 group-hover/item:opacity-100" />
                                                            </div>
                                                            <span className="flex-1">{child.title}</span>

                                                            {/* سهم يشير لوجود قائمة فرعية ثانية */}
                                                            {hasGrandchildren
                                                                ? <IconsFA.FaChevronLeft className="text-[11px] opacity-50" />
                                                                : <IconsFA.FaChevronLeft className="text-[10px] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                                            }
                                                        </a>

                                                        {/* ── Dropdown المستوى الثالث ── */}
                                                        {hasGrandchildren && (
                                                            <div className="absolute top-0 right-full mr-2 w-56 bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-2xl py-3
                                                                opacity-0 invisible -translate-x-2
                                                                group-hover/child:opacity-100 group-hover/child:visible group-hover/child:translate-x-0
                                                                transition-all duration-300 z-[1001] ring-1 ring-black/5">

                                                                <div className="flex flex-col gap-1 px-2">
                                                                    {child.children.map((grandchild: any) => (
                                                                        <a
                                                                            key={grandchild.id}
                                                                            href={grandchild.url || '#'}
                                                                            target={grandchild.target}
                                                                            className="flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-gray-800
                                                                                hover:bg-[#009689] hover:text-white rounded-xl transition-all duration-200 group/grand"
                                                                        >
                                                                            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 group-hover/grand:bg-white/20 transition-colors">
                                                                                <DynamicIcon iconName={grandchild.icon} className="text-[16px] opacity-70 group-hover/grand:opacity-100" />
                                                                            </div>
                                                                            <span className="flex-1">{grandchild.title}</span>
                                                                            <IconsFA.FaChevronLeft className="text-[10px] opacity-0 -translate-x-2 group-hover/grand:opacity-100 group-hover/grand:translate-x-0 transition-all" />
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;