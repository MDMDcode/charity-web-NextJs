"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { Loader2, LogIn, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.email, form.password);
      // بعد نجاح تسجيل الدخول — أظهر شاشة التحميل
      setRedirecting(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ");
      setBusy(false);
    }
  };

  // شاشة التحميل بعد تسجيل الدخول
  if (redirecting) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        dir="rtl"
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
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
          <p className="text-[#009689] font-bold text-lg tracking-wide animate-pulse">
            جاري التحميل...
          </p>
        </div>

        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#009689] rounded-full animate-progress" />
        </div>

        <style jsx global>{`
          @keyframes progress {
            0%   { width: 0%; }
            60%  { width: 75%; }
            90%  { width: 90%; }
            100% { width: 90%; }
          }
          .animate-progress {
            animation: progress 2s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8">

      <button
        type="button"
        onClick={() => window.location.href = "https://demo-shamel.tmt3.sa"}
        className="flex items-center gap-2 text-gray-500 hover:text-[#009689] transition-colors mb-4"
      >
        <ArrowRight size={18} />
        العودة
      </button>

      <h1 className="text-2xl font-black mb-2 text-black">تسجيل الدخول</h1>
      <p className="text-sm mb-8 text-black">أهلاً بعودتك 👋</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="البريد الإلكتروني"
          className="w-full p-4 rounded-xl border text-black bg-gray-50 outline-none focus:border-[#009689]"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="كلمة المرور"
            className="w-full p-4 rounded-xl text-black border bg-gray-50 outline-none focus:border-[#009689] pr-12"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#009689] text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {busy ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
          دخول
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-sm text-center">
        <Link href="/forgot-password" className="text-[#009689]">
          نسيت كلمة المرور؟
        </Link>
        <p className="text-gray-500">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-[#009689] font-bold">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}