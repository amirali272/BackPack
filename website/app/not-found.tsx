import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-mono text-[13px] tracking-[0.2em] text-primary/90">ERROR 404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">Host not found.</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          The page you’re looking for doesn’t exist — or it’s so well hidden even we can’t find it.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" iconLeft={<ArrowLeft className="size-4" />}>
            Back to home
          </ButtonLink>
          <ButtonLink href="/status" variant="secondary">
            Check system status
          </ButtonLink>
        </div>
      </div>
    </SiteLayout>
  );
}
