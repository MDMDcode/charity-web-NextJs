import NavigationLoaderWrapper from "@/app/(UI)/loading/NavigationLoaderWrapper";
import "../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationLoaderWrapper />
      <main className="min-h-screen flex items-center justify-center bg-[#F8FAFB] p-4" dir="rtl">
        {children}
      </main>
    </>
  );
}