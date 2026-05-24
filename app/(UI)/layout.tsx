import TopHeader from "./_components/TopHeader";
import NavBar from "./_components/NavBar";
import Footer from "./_components/Footer";
import WhatsAppWidget from "./_components/WhatsAppWidget";

import "../globals.css";

const API = "https://api-shamel.tmt3.sa/api/v1";

async function getSettings() {
  try {
    const res = await fetch(`${API}/settings`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function FrontEndLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const logo = settings?.site_logo?.original || null;
  const isMaintenance = settings?.system_status?.is_maintenance_mode || false;

  if (isMaintenance) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#009689] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-8xl mb-8">🔧</div>
          <h1 className="text-4xl font-black text-white mb-4">الموقع تحت الصيانة</h1>
          <p className="text-white/80 text-xl max-w-md mx-auto">
            {settings?.system_status?.maintenance_message || 'نعمل على تحسين الموقع، نعود قريباً.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <TopHeader logo={logo} />
      <NavBar />
      <main>
        {children}
      </main>
      <Footer />
       <WhatsAppWidget />
    </>
  );
}