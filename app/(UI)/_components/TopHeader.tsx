// app/(UI)/_components/TopHeader.tsx
"use client";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut, User, Home, History } from "lucide-react";

const API_BASE_URL = "https://api-shamel.tmt3.sa/api/v1";

function CartBadge() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("tmt_cart") || "[]");
        setCount(cart.length);
      } catch {
        setCount(0);
      }
    };
    setMounted(true);
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function TopHeader({ logo: initialLogo }: { logo?: string | null }) {
  const { user, loading, logout } = useAuth();
  const [logo, setLogo] = useState<string | null>(initialLogo || null);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLogo) return;
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((json) => setLogo(json?.data?.site_logo?.original || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div>
      <div dir="rtl" className="bg-[#F8F8F8] h-22 flex items-center justify-between px-8 border-b border-gray-200">

        {/* الشعار */}
        <div className="flex items-center">
          {logo ? (
            <Link href="https://demo-shamel.tmt3.sa/">
              <img src={logo} alt="شعار الجمعية" className="h-20 object-contain" />
            </Link>
          ) : (
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
          )}
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-3">

          {loading ? (
            <div className="flex gap-3">
              <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-md" />
              <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-md" />
            </div>
          ) : user ? (
            // ✅ مسجل دخول: الرئيسية + سجل التبرعات + سلة + اسم المستخدم
            <>
              <Link
                href="/"
                className="flex items-center gap-2 bg-[#009689] px-4 py-2 rounded-md hover:opacity-80 transition"
              >
                <Home size={18} className="text-white" />
                <span className="text-white text-sm font-bold">الرئيسية</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 bg-[#009689] px-4 py-2 rounded-md hover:opacity-80 transition"
              >
                <History size={18} className="text-white" />
                <span className="text-white text-sm font-bold">سجل التبرعات</span>
              </Link>

              <Link
                href="/sales"
                className="relative flex items-center gap-2 bg-[#009689] px-4 py-2 rounded-md hover:opacity-80 transition"
              >
                <FaShoppingCart size={20} className="text-white" />
                <CartBadge />
              </Link>

              {/* اسم المستخدم + Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 bg-[#009689] px-4 py-1.5 rounded-md hover:opacity-80 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                    <FaUser size={12} className="text-white" />
                  </div>
                  <span className="text-white text-sm font-bold">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {dropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User size={16} className="text-[#009689]" />
                      الملف الشخصي
                    </Link>
                    <button
                      onClick={() => { logout(); setDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      <LogOut size={16} />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // ❌ غير مسجل: السلة + زر تسجيل الدخول
            <>
              <Link
                href="/sales"
                className="relative flex items-center gap-2 bg-[#009689] px-4 py-2 rounded-md hover:opacity-80 transition"
              >
                <FaShoppingCart size={20} className="text-white" />
                <CartBadge />
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 bg-[#009689] px-4 py-1.5 rounded-md hover:opacity-80 transition"
              >
                <FaUser size={16} className="text-white" />
                <span className="text-white text-sm font-bold">تسجيل الدخول</span>
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}