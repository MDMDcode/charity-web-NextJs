import TopHeader from "./_components/TopHeader";
import NavBar from "./_components/NavBar";
import Footer from "./_components/Footer";
import "../globals.css";

export default function FrontEndLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     <TopHeader />
      <NavBar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}