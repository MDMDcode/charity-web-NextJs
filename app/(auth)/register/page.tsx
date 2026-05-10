"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/api";
import Link from "next/link";
import { Loader2, Send, UserPlus, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const { setAuth } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name:                  "",
    email:                 "",
    phone:                 "",
    password:              "",
    password_confirmation: "",
    otp:                   "",
  });

  const [otpSent,     setOtpSent]     = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error,       setError]       = useState("");
  const [otpLoading,  setOtpLoading]  = useState(false);
  const [busy,        setBusy]        = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // إرسال OTP
  const sendOtp = async () => {
    if (!form.email) return setError("أدخل البريد الإلكتروني أولاً");
    setOtpLoading(true);
    setError("");
    try {
      await apiClient.post("/auth/send-otp", { email: form.email });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ في الإرسال");
    } finally {
      setOtpLoading(false);
    }
  };

  // التحقق من OTP
  const verifyOtp = () => {
    if (!form.otp) return setError("أدخل رمز التحقق");
    if (form.otp.length < 6) return setError("الرمز يجب أن يكون 6 أرقام");
    setError("");
    setOtpVerified(true);
  };

  // إنشاء الحساب
  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent)    return setError("أرسل رمز التحقق أولاً");
    if (form.password !== form.password_confirmation)
      return setError("كلمة المرور غير متطابقة");

    setBusy(true);
    setError("");
    try {
      const { data } = await apiClient.post("/auth/register", {
        name:                  form.name,
        email:                 form.email,
        phone:                 form.phone,
        password:              form.password,
        password_confirmation: form.password_confirmation,
        otp:                   form.otp,
      });
      setAuth(data.data.user, data.data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ");
      setOtpVerified(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-sm p-8">
      <h1 className="text-2xl font-black mb-2">إنشاء حساب</h1>
      <p className="text-gray-500 text-sm mb-8">أهلاً! سجّل بياناتك للانضمام إلينا</p>

      <form onSubmit={register} className="space-y-4">

        {/* الاسم */}
        <input
          type="text"
          name="name"
          required
          placeholder="الاسم الكامل"
          value={form.name}
          className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          onChange={handleChange}
        />

        {/* الجوال */}
        <input
          type="tel"
          name="phone"
          required
          placeholder="رقم الجوال (05xxxxxxxx)"
          value={form.phone}
          className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689] text-left"
          onChange={handleChange}
        />

        {/* البريد + زر إرسال OTP */}
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder="البريد الإلكتروني"
            value={form.email}
            className="flex-1 p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={otpLoading || otpSent}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#009689] text-white text-sm font-bold disabled:opacity-60 flex items-center gap-1 whitespace-nowrap"
          >
            {otpLoading
              ? <Loader2 size={16} className="animate-spin" />
              : otpSent
              ? <CheckCircle2 size={16} />
              : <Send size={16} />
            }
            {otpSent ? "أُرسل" : "إرسال"}
          </button>
        </div>

        {/* حقل OTP + زر التحقق */}
        {otpSent && (
          <div className="flex gap-2">
            <input
              type="text"
              name="otp"
              required
              placeholder="رمز التحقق (6 أرقام)"
              maxLength={6}
              inputMode="numeric"
              value={form.otp}
              className={`flex-1 p-4 rounded-xl border bg-gray-50 outline-none text-center tracking-[0.4em] text-xl font-bold transition ${
                otpVerified
                  ? "border-green-400 bg-green-50"
                  : "focus:border-[#009689]"
              }`}
              onChange={e => {
                setForm({ ...form, otp: e.target.value });
                setOtpVerified(false);
              }}
            />
            <button
              type="button"
              onClick={verifyOtp}
              disabled={otpVerified || form.otp.length < 6}
              className="shrink-0 px-4 py-2 rounded-xl border-2 border-[#009689] text-[#009689] text-sm font-bold disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
            >
              {otpVerified
                ? <CheckCircle2 size={16} className="text-green-500" />
                : null
              }
              {otpVerified ? "تم" : "تحقق"}
            </button>
          </div>
        )}

        {/* رسالة نجاح OTP */}
        {otpVerified && (
          <p className="text-green-600 text-sm bg-green-50 p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} />
            رمز التحقق صحيح ✓
          </p>
        )}

        {/* كلمة المرور */}
        <input
          type="password"
          name="password"
          required
          placeholder="كلمة المرور (8 أحرف على الأقل)"
          value={form.password}
          className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password_confirmation"
          required
          placeholder="تأكيد كلمة المرور"
          value={form.password_confirmation}
          className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
          onChange={handleChange}
        />

        {/* الخطأ */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
        )}

        {/* زر الإنشاء */}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#009689] text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {busy
            ? <Loader2 className="animate-spin" size={20} />
            : <UserPlus size={20} />
          }
          إنشاء الحساب
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-500">
        لديك حساب؟{" "}
        <Link href="/login" className="text-[#009689] font-bold">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}