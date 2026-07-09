"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { CheckCircle2, ShieldCheck, Loader2, User, LogIn, Gift, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import apiClient from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

// دالة قراءة كوكي المسوق
function getMarketerCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)marketer_campaign_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function SuccessView({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <CheckCircle2 size={80} className="text-[#009689] mb-6" />
      <h1 className="text-2xl font-black text-gray-900 mb-2">
        بارك الله في عطائك {name || "فاعل خير"} ❤️
      </h1>
      <p className="text-base text-gray-600 mb-4">تم تسجيل تبرعك بنجاح</p>
      <p className="text-lg font-bold text-gray-900 mb-8">((ما نقصت صدقةٌ من مالٍ))</p>
      <div className="flex gap-3">
        <Link href="/store" className="bg-[#009689] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0b6e65] transition-colors">
          تبرع مجدداً
        </Link>
        <Link href="/" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
          الرئيسية
        </Link>
      </div>
    </div>
  );
}

function CheckoutForm() {
  const searchParams           = useSearchParams();
  const amountFromUrl          = searchParams.get('amount') || "0";
  const { user, loading: authLoading } = useAuth();

  const [form,      setForm]      = useState({ donor_name: "", donor_phone: "" });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isGift,      setIsGift]      = useState(false);
  const [giftName,    setGiftName]    = useState("");
  const [giftPhone,   setGiftPhone]   = useState("");
  const [giftMessage, setGiftMessage] = useState("");

useEffect(() => {
    const data = localStorage.getItem("tmt_cart");
    if (data) setCartItems(JSON.parse(data));

    // 🔍 تشخيص مؤقت - يطبع تلقائياً بدون أي تدخل يدوي
    alert("الكوكيز في صفحة الدفع: " + document.cookie);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user && !form.donor_phone) return alert("رقم الجوال مطلوب");
    if (cartItems.length === 0) return alert("السلة فارغة!");
    if (isGift && (!giftName || !giftPhone)) return alert("يرجى إدخال اسم ورقم هاتف المُهدى إليه");

    setLoading(true);
    try {
      const marketerCampaignId = getMarketerCookie();

      const body: any = {
        items: cartItems.map(item => ({
          project_id: item.project_id,
          amount:     item.amount,
        })),
        marketer_campaign_id: marketerCampaignId || null, // 👈 على مستوى الـ body الرئيسي
        ...(isGift && {
          is_gift:              true,
          gift_recipient_name:  giftName,
          gift_recipient_phone: giftPhone,
          gift_message:         giftMessage,
        }),
      };

      if (!user) {
        body.donor_name  = form.donor_name || "فاعل خير";
        body.donor_phone = form.donor_phone;
      }

      await apiClient.post("donations", body);

      cartItems.forEach(item => {
        window.dispatchEvent(new CustomEvent("donation-success", {
          detail: { project_id: item.project_id, amount: item.amount }
        }));
      });

      localStorage.removeItem("tmt_cart");
      window.dispatchEvent(new Event("cart-updated"));
      setIsSuccess(true);

    } catch {
      alert("حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isSuccess) return <SuccessView name={user?.name || form.donor_name} />;

  return (
    <main className="min-h-screen bg-[#F8FAFB] py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border shadow-sm">
          <h2 className="text-xl font-black mb-6 text-black">بيانات المتبرع</h2>

          {user ? (
            <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#009689] flex items-center justify-center shrink-0">
                <User size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-[#009689] mt-1">✓ سيُحفظ التبرع في سجلك تلقائياً</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-blue-700">سجّل دخولك لحفظ سجل تبرعاتك</p>
                <Link href="/login" className="flex items-center gap-1 text-sm font-bold text-[#009689] whitespace-nowrap">
                  <LogIn size={16} />
                  دخول
                </Link>
              </div>
              <input
                type="text"
                placeholder="الاسم الكامل (اختياري)"
                className="w-full text-black p-4 rounded-xl border bg-gray-50 outline-none focus:border-[#009689]"
                onChange={e => setForm({ ...form, donor_name: e.target.value })}
              />
              <input
                type="tel"
                required
                placeholder="رقم الجوال (05xxxxxxxx)"
                className="w-full p-4 text-black rounded-xl border bg-gray-50 outline-none focus:border-[#009689] text-left"
                onChange={e => setForm({ ...form, donor_phone: e.target.value })}
              />
            </div>
          )}

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsGift(!isGift)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                isGift
                  ? 'border-[#009689] bg-[#009689]/5 text-[#009689]'
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-[#009689]/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gift size={18} className={isGift ? 'text-[#009689]' : 'text-gray-400'} />
                <span>إهداء التبرع</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${isGift ? 'rotate-180 text-[#009689]' : 'text-gray-400'}`}
              />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isGift ? 'max-h-96 mt-3' : 'max-h-0'}`}>
              <div className="bg-[#009689]/5 border border-[#009689]/20 rounded-xl p-4 space-y-3">

                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">
                    اسم المُهدى إليه <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={giftName}
                    onChange={e => setGiftName(e.target.value)}
                    placeholder="أدخل الاسم"
                    className="w-full border border-gray-200 focus:border-[#009689] bg-white rounded-lg px-3 py-2 text-sm text-black outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">
                    رقم هاتف المُهدى إليه <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={giftPhone}
                    onChange={e => setGiftPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full border border-gray-200 focus:border-[#009689] bg-white rounded-lg px-3 py-2 text-sm text-black outline-none transition-all"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">
                    رسالة الإهداء (اختياري)
                  </label>
                  <textarea
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    rows={3}
                    className="w-full border border-gray-200 focus:border-[#009689] bg-white rounded-lg px-3 py-2 text-sm text-black outline-none transition-all resize-none"
                  />
                </div>

              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#009689] text-white py-5 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              تأكيد التبرع بمبلغ {amountFromUrl} ر.س
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border shadow-sm h-fit">
          <h2 className="font-bold mb-4 border-b pb-2 text-black">محتويات السلة</h2>
          <div className="space-y-4">
            {cartItems.length > 0 ? cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-[#009689] font-black">{item.amount} ر.س</p>
                </div>
              </div>
            )) : (
              <p className="text-black text-center py-4">السلة فارغة</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}