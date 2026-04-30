"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [form,  setForm]  = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy,  setBusy]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.email, form.password);
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8">
      <h1 className="text-2xl font-black mb-2">تسجيل الدخول</h1>
      <p className="text-gray-500 text-sm mb-8">أهلاً بعودتك 👋</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="البريد الإلكتروني"
          className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          required
          placeholder="كلمة المرور"
          className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

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