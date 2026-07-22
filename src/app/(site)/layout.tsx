import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

// Header/Footer только у публичных страниц сайта — не у /admin.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="relative z-[1] flex-1">{children}</div>
      <Footer />
    </>
  );
}
