"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/api";
import { Heart, Mail, Calendar, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [donations,     setDonations]     = useState<any[]>([]);
  const [donateLoading, setDonateLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    apiClient.get("/my-donations")
      .then(res => {
        const raw = res.data?.data?.items ?? res.data?.data?.data ?? [];
        setDonations(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setDonations([]))
      .finally(() => setDonateLoading(false));
  }, [user, authLoading]);

  if (authLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const totalAmount = donations.reduce(
    (sum, d) => sum + Number(d.total_amount || 0), 0
  );

  return (
    <main className="min-h-screen bg-[#F8FAFB] py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* بطاقة المستخدم */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#009689] flex items-center justify-center shrink-0">
              <span className="text-white text-3xl font-black">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Mail size={14} />
                {user.email}
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition text-sm font-bold"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart size={24} className="text-[#009689]" />
            </div>
            <h3 className="text-3xl font-black text-[#009689]">
              {donations.length}
            </h3>
            <p className="text-gray-500 text-sm mt-1">عدد التبرعات</p>
          </div>
          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-[#009689] font-black text-lg">ر.س</span>
            </div>
            <h3 className="text-3xl font-black text-[#009689]">
              {totalAmount.toLocaleString("ar-SA")}
            </h3>
            <p className="text-gray-500 text-sm mt-1">إجمالي التبرعات</p>
          </div>
        </div>

        {/* سجل التبرعات */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">
          <h2 className="text-xl text-black font-black mb-6">سجل التبرعات</h2>

          {donateLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#009689] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">لا توجد تبرعات بعد</p>
              
               <a href="/store"
                className="mt-4 inline-block bg-[#009689] text-white px-6 py-2 rounded-xl font-bold text-sm"
              >
                تبرع الآن
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 bg-gray-50 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <Heart size={18} className="text-[#009689]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Calendar size={11} />
                          {new Date(donation.date).toLocaleDateString("ar-SA", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-[#009689]">
                        {Number(donation.total_amount).toLocaleString("ar-SA")} ر.س
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        donation.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {donation.payment_status === "paid" ? "مدفوع" : "معلّق"}
                      </span>
                    </div>
                  </div>

                  {/* المشاريع */}
                  {donation.items?.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {donation.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white px-4 py-2 rounded-xl"
                        >
                          <p className="text-sm font-bold text-gray-700">
                            {item.project_name || "مشروع"}
                          </p>
                          <p className="text-sm font-black text-[#009689]">
                            {Number(item.amount).toLocaleString("ar-SA")} ر.س
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}