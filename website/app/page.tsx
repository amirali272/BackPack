import { SiteLayout } from "@/components/SiteLayout";
import { AccountSecurity } from "@/components/sections/AccountSecurity";
import { Contact } from "@/components/sections/Contact";
import { CTA } from "@/components/sections/CTA";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { Hero } from "@/components/sections/Hero";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { TelegramBot } from "@/components/sections/TelegramBot";

export default function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <Services />
      <SecuritySection />
      <TelegramBot />
      <DashboardPreview />
      <AccountSecurity />
      <Contact />
      <CTA />
    </SiteLayout>
  );
}
