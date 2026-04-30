"use client";
import { useState } from "react";
import apiClient from "@/app/lib/api";

import Link from "next/link";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);
  const [error, setError] = useState("");
  const [busy,  setBusy]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ");
    } finally {
      setBusy(false);
    }
  };

  if (sent) return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8 text-center">
      <CheckCircle2 size={60} className="text-[#009689] mx-auto mb-4" />
      <h1 className="text-xl font-black mb-2">تحقق من بريدك</h1>
      <p className="text-gray-500 text-sm">
        أرسلنا رابط إعادة التعيين إلى{" "}
        <strong className="text-gray-700">{email}</strong>
      </p>
      <Link href="/login" className="mt-6 inline-block text-[#009689] font-bold text-sm underline">
        العودة لتسجيل الدخول
      </Link>
    </div>
  );

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8">
      <h1 className="text-2xl font-black mb-2">نسيت كلمة المرور؟</h1>
      <p className="text-gray-500 text-sm mb-8">سنرسل رابط إعادة التعيين على بريدك</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="البريد الإلكتروني"
          className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#009689] text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {busy ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
          إرسال الرابط
        </button>
      </form>

      <Link href="/login" className="mt-6 block text-sm text-center text-gray-400 underline">
        العودة لتسجيل الدخول
      </Link>
    </div>
  );
}