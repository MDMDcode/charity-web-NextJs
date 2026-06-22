"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ChevronLeft } from 'lucide-react';
import * as IconsFA from "react-icons/fa6";
import Link from 'next/link';

const DynamicIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  if (!iconName) return null;
  const IconComponent = (IconsFA as any)[iconName.trim()];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export default function NavBar() {
  const [menuItems, setMenuItems]       = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [openItems, setOpenItems]       = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`https://api-shamel.tmt3.sa/api/v1/menu-items?location=header`, { cache: 'no-store' })
      .then(r => r.json())
      .then(json => setMenuItems(json.data || []))
      .catch(() => setMenuItems([]));
  }, []);

  // منع سكرول الصفحة عند فتح السايدبار
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4">

          {/* ── Desktop ── */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-y-4 gap-x-4 py-2">
            {menuItems.map((item: any) => {
              const hasChildren = item.children?.length > 0;
              return (
                <div key={item.id} className="relative group">
                  <Link
                    href={item.url || '#'}
                    target={item.target}
                    className="flex items-center gap-2 px-3 py-2 text-[18px] font-semibold text-black hover:bg-[#009689] hover:text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                  >
                    <DynamicIcon iconName={item.icon} className="opacity-60" />
                    <span>{item.title}</span>
                    {hasChildren && (
                      <ChevronDown size={18} className="transition-transform duration-300 group-hover:rotate-180 text-gray-400" />
                    )}
                  </Link>

                  {hasChildren && (
                    <div className="absolute top-[110%] right-0 w-64 bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-2xl py-3 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-[1000] ring-1 ring-black/5">
                      <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-r border-gray-100" />
                      <div className="flex flex-col gap-1 px-2">
                        {item.children.map((child: any) => {
                          const hasGrand = child.children?.length > 0;
                          return (
                            <div key={child.id} className="relative group/child">
                              <Link
                                href={child.url || '#'}
                                target={child.target}
                                className="flex items-center gap-3 px-4 py-3 text-[16px] font-semibold text-gray-800 hover:bg-[#009689] hover:text-white rounded-xl transition-all duration-200"
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover/child:bg-white/20 transition-colors">
                                  <DynamicIcon iconName={child.icon} className="text-[18px] opacity-70" />
                                </div>
                                <span className="flex-1">{child.title}</span>
                                {hasGrand && <IconsFA.FaChevronLeft className="text-[11px] opacity-50" />}
                              </Link>

                              {hasGrand && (
                                <div className="absolute top-0 right-full mr-2 w-56 bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-2xl py-3 opacity-0 invisible -translate-x-2 group-hover/child:opacity-100 group-hover/child:visible group-hover/child:translate-x-0 transition-all duration-300 z-[1001] ring-1 ring-black/5">
                                  <div className="flex flex-col gap-1 px-2">
                                    {child.children.map((grand: any) => (
                                      <Link
                                        key={grand.id}
                                        href={grand.url || '#'}
                                        target={grand.target}
                                        className="flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-gray-800 hover:bg-[#009689] hover:text-white rounded-xl transition-all duration-200"
                                      >
                                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50">
                                          <DynamicIcon iconName={grand.icon} className="text-[16px] opacity-70" />
                                        </div>
                                        <span className="flex-1">{grand.title}</span>
                                      </Link>
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

          {/* ── Mobile header bar ── */}
          <div className="flex md:hidden items-center justify-between py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="فتح القائمة"
            >
              <Menu size={26} />
            </button>
            {/* يمكنك وضع شعار هنا */}
            <span className="text-[#009689] font-black text-lg">القائمة</span>
          </div>

        </div>
      </nav>

      {/* ── Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[998] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl z-[999] flex flex-col transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* رأس السايدبار */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#009689]">
          <span className="text-white font-black text-lg">القائمة الرئيسية</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        {/* عناصر القائمة */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {menuItems.map((item: any) => {
            const hasChildren = item.children?.length > 0;
            const isOpen      = openItems[item.id];

            return (
              <div key={item.id} className="mb-1">
                <div className="flex items-center rounded-xl overflow-hidden">
                  <Link
                    href={hasChildren ? '#' : (item.url || '#')}
                    target={hasChildren ? undefined : item.target}
                    onClick={() => {
                      if (hasChildren) {
                        toggleItem(item.id);
                      } else {
                        setSidebarOpen(false);
                      }
                    }}
                    className="flex-1 flex items-center gap-3 px-4 py-3 text-[16px] font-semibold text-gray-800 hover:bg-[#009689]/10 rounded-xl transition-colors"
                  >
                    <DynamicIcon iconName={item.icon} className="text-[#009689] text-[18px]" />
                    <span>{item.title}</span>
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="px-3 py-3 text-gray-400 hover:text-[#009689] transition-colors"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {/* الأبناء */}
                {hasChildren && isOpen && (
                  <div className="mt-1 mr-4 border-r-2 border-[#009689]/20 pr-3 flex flex-col gap-1">
                    {item.children.map((child: any) => {
                      const hasGrand  = child.children?.length > 0;
                      const isChildOpen = openItems[child.id];

                      return (
                        <div key={child.id}>
                          <div className="flex items-center rounded-xl overflow-hidden">
                            <Link
                              href={hasGrand ? '#' : (child.url || '#')}
                              target={hasGrand ? undefined : child.target}
                              onClick={() => {
                                if (hasGrand) {
                                  toggleItem(child.id);
                                } else {
                                  setSidebarOpen(false);
                                }
                              }}
                              className="flex-1 flex items-center gap-3 px-3 py-2.5 text-[15px] font-semibold text-gray-700 hover:bg-[#009689]/10 rounded-xl transition-colors"
                            >
                              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50">
                                <DynamicIcon iconName={child.icon} className="text-[15px] opacity-70" />
                              </div>
                              <span className="flex-1">{child.title}</span>
                            </Link>
                            {hasGrand && (
                              <button
                                onClick={() => toggleItem(child.id)}
                                className="px-3 py-2.5 text-gray-400 hover:text-[#009689] transition-colors"
                              >
                                <ChevronDown
                                  size={16}
                                  className={`transition-transform duration-300 ${isChildOpen ? 'rotate-180' : ''}`}
                                />
                              </button>
                            )}
                          </div>

                          {/* الأحفاد */}
                          {hasGrand && isChildOpen && (
                            <div className="mt-1 mr-4 border-r-2 border-gray-100 pr-3 flex flex-col gap-1">
                              {child.children.map((grand: any) => (
                                <Link
                                  key={grand.id}
                                  href={grand.url || '#'}
                                  target={grand.target}
                                  onClick={() => setSidebarOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2 text-[14px] font-semibold text-gray-600 hover:bg-[#009689]/10 hover:text-[#009689] rounded-xl transition-colors"
                                >
                                  <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-50">
                                    <DynamicIcon iconName={grand.icon} className="text-[13px] opacity-70" />
                                  </div>
                                  <span>{grand.title}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}