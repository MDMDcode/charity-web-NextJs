"use client";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import apiClient from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut, User } from "lucide-react";

export default function TopHeader() {
  const { user, loading, logout } = useAuth();
  const [logo,     setLogo]     = useState<string | null>(null);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiClient("/settings")
      .then(res => setLogo(res.data?.data?.site_logo?.original || null))
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
      <div dir="rtl" className="bg-[#F8F8F8] h-16 flex items-center justify-between px-8 border-b border-gray-200">

        {/* الشعار */}
        <div className="flex items-center">
          {logo ? (
            <img src={logo} alt="شعار الجمعية" className="h-20 object-contain" />
          ) : (
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
          )}
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-4">
          <Link href="/sales" className="flex items-center gap-2 bg-[#009689] px-4 py-2 rounded-md hover:opacity-80 transition">
            <FaShoppingCart size={20} className="text-white" />
          </Link>

          {/* انتظر تحميل الـ auth */}
          {loading ? (
            <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-md" />
          ) : user ? (
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
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[#009689] px-4 py-1.5 rounded-md hover:opacity-80 transition"
            >
              <FaUser size={16} className="text-white" />
              <span className="text-white">تسجيل الدخول</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}