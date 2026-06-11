"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/app/lib/api";
import { Loader2, KeyRound, CheckCircle2, XCircle } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") || "";

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [form,       setForm]       = useState({ password: "", password_confirmation: "" });
  const [error,      setError]      = useState("");
  const [busy,       setBusy]       = useState(false);
  const [done,       setDone]       = useState(false);

  useEffect(() => {
    if (!token) { setTokenValid(false); return; }
    apiClient.get(`/auth/verify-reset-token?token=${token}`)
      .then(() => setTokenValid(true))
      .catch(() => setTokenValid(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation)
      return setError("كلمة المرور غير متطابقة");
    setBusy(true);
    setError("");
    try {
      await apiClient.post("/auth/reset-password", { token, ...form });
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ");
    } finally {
      setBusy(false);
    }
  };

  if (tokenValid === null) return (
    <Loader2 className="animate-spin text-[#009689]" size={40} />
  );

  if (!tokenValid) return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8 text-center">
      <XCircle size={60} className="text-red-400 mx-auto mb-4" />
      <h1 className="text-xl font-black mb-2 text-black">الرابط غير صالح</h1>
      <p className="text-black text-sm">انتهت صلاحية الرابط أو تم استخدامه مسبقاً.</p>
    </div>
  );

  if (done) return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8 text-center">
      <CheckCircle2 size={60} className="text-[#009689] mx-auto mb-4" />
      <h1 className="text-xl font-black mb-2">تم تغيير كلمة المرور!</h1>
      <p className="text-black text-sm">جاري توجيهك لتسجيل الدخول...</p>
    </div>
  );

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8">
      <h1 className="text-2xl font-black mb-2 text-black">كلمة مرور جديدة</h1>
      <p className="text-black text-sm mb-8">اختر كلمة مرور قوية</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          required
          placeholder="كلمة المرور الجديدة"
          className="w-full p-4 text-black rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          required  
          placeholder="تأكيد كلمة المرور"
          className="w-full text-black p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
        />
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#009689] text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {busy ? <Loader2 className="animate-spin" size={20} /> : <KeyRound size={20} />}
          حفظ كلمة المرور
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin text-[#009689]" size={40} />}>
      <ResetForm />
    </Suspense>
  );
}