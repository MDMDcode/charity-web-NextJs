import TopHeader from "./_components/TopHeader";
import NavBar from "./_components/NavBar";
import Footer from "./_components/Footer";
import "../globals.css";

const API = "https://api-shamel.tmt3.sa/api/v1";

async function getSettings() {
  try {
    const res = await fetch(`${API}/settings`, {  cache: 'no-store'  });
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function FrontEndLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const logo = settings?.site_logo?.original || null;

  return (
    <>
      <TopHeader logo={logo} />
      <NavBar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}