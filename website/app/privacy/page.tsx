import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Unknown Host collects, uses and protects your data." };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="October 1, 2026"
      sections={[
        {
          heading: "What we collect",
          body: (
            <p>
              Account details you give us (name, email, company), billing information processed by our payment provider, and operational data
              needed to run your services — such as server metrics, logs you choose to send us, and security events.
            </p>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <p>
              To provide and secure the platform, send the alerts and reports you configure, prevent abuse, and meet legal obligations. We do not
              sell personal data or use your workloads’ contents for advertising.
            </p>
          ),
        },
        {
          heading: "Security",
          body: (
            <p>
              Data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access by our staff is limited, requires hardware-key 2FA, and is recorded
              in an internal audit log.
            </p>
          ),
        },
        {
          heading: "Retention",
          body: <p>Audit logs are kept for 365 days. Account data is deleted within 30 days of closing your workspace, after a 7-day recovery window.</p>,
        },
        {
          heading: "Your rights",
          body: (
            <p>
              You can access, export, correct or delete your data at any time from the dashboard, or by emailing{" "}
              <a href="mailto:privacy@unknownhost.io" className="text-primary hover:underline">
                privacy@unknownhost.io
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
