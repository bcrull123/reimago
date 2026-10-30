import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

export function LegalArticle({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-faint">{kicker}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{lede}</p>
        <div className="mt-10 space-y-8 text-sm leading-relaxed">{children}</div>
      </article>
    </SiteShell>
  );
}

export function Clause({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl leading-tight">{heading}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
