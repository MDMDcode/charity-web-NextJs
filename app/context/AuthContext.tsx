"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/api";
import NavigationLoaderWrapper from "@/app/(UI)/loading/NavigationLoaderWrapper";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user,       setUser]       = useState<User | null>(null);
  const [token,      setToken]      = useState<string | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      try {
        setToken(t);
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // redirect بعد ظهور شاشة التحميل
  useEffect(() => {
    if (loggingOut) {
      const timer = setTimeout(() => {
        window.location.replace("https://demo-shamel.tmt3.sa/");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loggingOut]);

  const setAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${token}; path=/`;
  };

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    setAuth(data.data.user, data.data.token);
    router.push("/");
  };

  const logout = async () => {
    await apiClient.post("/auth/logout").catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; max-age=0; path=/";
    setLoggingOut(true);
  };

  // شاشة التحميل عند تسجيل الخروج
  if (loggingOut) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white" dir="rtl">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-[#009689]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#009689] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#009689]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3" />
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
    <AuthContext.Provider value={{ user, token, loading, login, logout, setAuth }}>
      <NavigationLoaderWrapper />
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};