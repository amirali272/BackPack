import type { ReactNode } from "react";
import { Background } from "@/components/Background";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Background />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
