"use client";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function TopHeader() {
    const [logo, setLogo] = useState<string | null>(null);

useEffect(() => {
    axios.get(`${BASE_URL}/api/v1/settings`)
        .then((res) => {
            const logoPath = res.data?.data?.site_logo?.original;
            console.log("Logo Path:", logoPath);
            setLogo(logoPath || null);  // خلّي الـ URL كما هو من الـ API
        })
        .catch((err) => {
            console.error("API Error:", err);
        });
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
                    <Link href="/login" className="flex items-center gap-2 bg-[#009689] px-4 py-1.5 rounded-md hover:opacity-80 transition">
                        <FaUser size={16} className="text-white" />
                        <span className="text-white">تسجيل الدخول</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}