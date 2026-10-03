import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Service", description: "The terms that govern your use of Unknown Host." };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="October 1, 2026"
      sections={[
        {
          heading: "Using the service",
          body: <p>You’re responsible for the workloads you run and for keeping your credentials, API keys and bot tokens secret.</p>,
        },
        {
          heading: "Acceptable use",
          body: (
            <p>
              No attacks on other networks, malware distribution, spam, or content that is illegal where it is hosted. We may suspend resources
              that put the platform or other customers at risk, and we’ll tell you why.
            </p>
          ),
        },
        {
          heading: "Availability",
          body: <p>We target 99.99% monthly uptime. If we miss it, service credits apply as described in the SLA for your plan.</p>,
        },
        {
          heading: "Billing",
          body: <p>Usage is billed monthly in arrears. Trials convert only after you add a payment method and confirm.</p>,
        },
        {
          heading: "Ending the agreement",
          body: <p>You can close your workspace any time from Settings. You can export your data before the 7-day recovery window ends.</p>,
        },
      ]}
    />
  );
}
