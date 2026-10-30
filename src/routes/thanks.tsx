import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/thanks")({
  component: ThanksPage,
});

function ThanksPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-faint">Sent</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">We got the brief.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          The site, your email, the note, and the picture are on their way to bob@reimago.ai. Nothing on the live
          site was changed.
        </p>
        <Link to="/" className="mt-8 inline-flex h-12 items-center text-sm font-medium text-primary hover:underline">
          Back to the draft
        </Link>
      </article>
    </SiteShell>
  );
}
