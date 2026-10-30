import { useState, type ReactNode } from "react";
import type { ReimagineOk, TemplateName } from "@/lib/reimagine-types";

function Frame({ host, children }: { host: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </span>
        <p className="min-w-0 flex-1 truncate rounded-full bg-bg px-3 py-1 text-xs text-muted">{host}</p>
        <p className="hidden text-xs uppercase tracking-eyebrow text-faint sm:block">Grok Build</p>
      </div>
      {children}
    </div>
  );
}

function kickerText(kicker: string): string {
  const value = kicker.trim();
  if (!value) return "";
  if (/about\s*\.?\s*org|wordpress|\.org\b/i.test(value) && /about|wordpress|^[a-z0-9.-]+\.org$/i.test(value)) return "";
  if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) return "";
  return value;
}

function publicNav(items: string[]): string[] {
  return items.filter((item) => kickerText(item) && !MENU_WORD.test(item));
}

const MENU_WORD =
  /^(about wordpress|wordpress\.org|about\.org|documentation|learn wordpress|feedback|dashboard|howdy|log out|visit site)$/i;
function Photo({ src, className }: { src?: string; className?: string }) {
  if (!src) return <div className={className} style={{ background: "#1c1914" }} />;
  return <img src={src} alt="" className={className} />;
}

function Logo({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <p className="font-display text-2xl tracking-tight">{name}</p>;
  return (
    <img
      src={src}
      alt={name}
      className="h-9 w-auto max-w-[11rem] object-contain object-left"
      onError={() => setFailed(true)}
    />
  );
}

function Yours({ result }: { result: ReimagineOk }) {
  const draft = result.draft;
  return (
    <article className="bg-white text-[#161616]">
      <header className="flex items-center justify-between gap-4 border-b border-[#e7e7e7] px-5 py-3 sm:px-8">
        <Logo src={draft.logo} name={draft.name} />
        <nav className="hidden items-center gap-6 text-sm text-[#444] md:flex">
          {publicNav(draft.nav).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <span className="inline-flex min-h-10 items-center rounded-md bg-[#161616] px-4 text-sm font-medium text-white">
          {draft.action}
        </span>
      </header>
      <section className="grid items-center gap-8 px-5 py-12 sm:px-10 lg:grid-cols-2 lg:py-16">
        <div>
          {kickerText(draft.kicker) ? (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#777]">{kickerText(draft.kicker)}</p>
          ) : null}
          <h3 className="mt-3 max-w-xl font-display text-5xl leading-[1.02] sm:text-6xl">{draft.headline}</h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#444]">{draft.subhead}</p>
          <span className="mt-7 inline-flex min-h-12 items-center rounded-md bg-[#161616] px-5 text-sm font-medium text-white">
            {draft.action}
          </span>
        </div>
        <Photo src={draft.heroImage} className="h-72 w-full rounded-xl object-cover lg:h-96" />
      </section>
      <section className="grid border-t border-[#e7e7e7] sm:grid-cols-3">
        {draft.points.map((point) => (
          <div key={point.title} className="border-t border-[#e7e7e7] px-5 py-8 sm:border-t-0 sm:border-l sm:px-8">
            <h4 className="text-lg font-medium">{point.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#555]">{point.body}</p>
          </div>
        ))}
      </section>
      <section className="bg-[#161616] px-5 py-12 text-white sm:px-10">
        <p className="max-w-xl font-display text-4xl leading-tight">{draft.bandTitle}</p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">{draft.bandBody}</p>
      </section>
      <footer className="flex flex-col gap-3 border-t border-[#e7e7e7] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo src={draft.logo} name={draft.name} />
        <p className="text-sm text-[#666]">{draft.close}</p>
      </footer>
    </article>
  );
}

function Organization({ result }: { result: ReimagineOk }) {
  const draft = result.draft;
  const ink = "#1c1914";
  const paper = "#f3eee4";
  return (
    <article style={{ background: paper, color: ink }}>
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-display text-2xl italic">{draft.name}</p>
        <span className="rounded-full px-4 py-2 text-xs font-medium text-[#f3eee4]" style={{ background: ink }}>
          {draft.action}
        </span>
      </header>
      <div className="px-5 pb-8 sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8a3d32]">{kickerText(draft.kicker)}</p>
        <h3 className="mt-3 max-w-3xl font-display text-5xl leading-[0.95] sm:text-7xl">{draft.headline}</h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5c5348]">{draft.subhead}</p>
      </div>
      <Photo src={draft.heroImage} className="h-72 w-full object-cover sm:h-96" />
      <div className="grid gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8">
        {draft.points.map((point, index) => (
          <div key={point.title}>
            <p className="font-display text-sm text-[#8a3d32]">0{index + 1}</p>
            <h4 className="mt-2 font-display text-2xl">{point.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#5c5348]">{point.body}</p>
          </div>
        ))}
      </div>
      <div className="px-5 py-12 sm:px-8" style={{ background: ink, color: paper }}>
        <p className="max-w-xl font-display text-4xl">{draft.bandTitle}</p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#f3eee4]/75">{draft.bandBody}</p>
      </div>
    </article>
  );
}

function Technology({ result }: { result: ReimagineOk }) {
  const draft = result.draft;
  return (
    <article className="text-[#f4f1ea]" style={{ background: "#0c0e12" }}>
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="text-sm font-medium tracking-wide">{draft.name}</p>
        <nav className="hidden gap-6 text-xs text-[#f4f1ea]/60 sm:flex">
          {publicNav(draft.nav).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <span className="rounded-full bg-[#7ee0c6] px-4 py-2 text-xs font-medium text-[#0c0e12]">{draft.action}</span>
      </header>
      <div className="grid items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:py-16">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7ee0c6]">{kickerText(draft.kicker)}</p>
          <h3 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">{draft.headline}</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f4f1ea]/70">{draft.subhead}</p>
        </div>
        <Photo src={draft.heroImage} className="h-72 w-full rounded-2xl object-cover ring-1 ring-white/10 lg:h-80" />
      </div>
      <div className="grid border-t border-white/10 sm:grid-cols-3">
        {draft.points.map((point) => (
          <div key={point.title} className="border-t border-white/10 px-5 py-8 sm:border-t-0 sm:border-l sm:px-8">
            <h4 className="text-lg font-medium">{point.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#f4f1ea]/65">{point.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function Restaurant({ result }: { result: ReimagineOk }) {
  const draft = result.draft;
  return (
    <article style={{ background: "#f6f0e6", color: "#24180f" }}>
      <section className="relative min-h-[28rem]">
        <Photo src={draft.heroImage} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20" />
        <div className="relative flex min-h-[28rem] flex-col justify-end px-5 pb-10 text-[#f6f0e6] sm:px-10">
          <p className="font-display text-3xl italic">{draft.name}</p>
          <h3 className="mt-2 max-w-3xl font-display text-5xl leading-[0.95] sm:text-7xl">{draft.headline}</h3>
          <p className="mt-3 max-w-md text-sm text-[#f6f0e6]/80">{draft.subhead}</p>
        </div>
      </section>
      <div className="px-5 py-10 sm:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8d4b2a]">Tonight</p>
        <div className="mt-6 divide-y divide-[#24180f]/15">
          {draft.points.map((point) => (
            <div key={point.title} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:items-baseline">
              <h4 className="font-display text-2xl">{point.title}</h4>
              <p className="text-sm leading-relaxed text-[#5c4638]">{point.body}</p>
            </div>
          ))}
        </div>
        <span className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#24180f] px-5 text-sm text-[#f6f0e6]">
          {draft.action}
        </span>
      </div>
    </article>
  );
}

function Professional({ result }: { result: ReimagineOk }) {
  const draft = result.draft;
  return (
    <article style={{ background: "#f7f6f3", color: "#161616" }}>
      <header className="flex items-center justify-between border-b border-[#161616] px-5 py-4 sm:px-8">
        <p className="text-sm font-medium tracking-wide">{draft.name}</p>
        <p className="hidden text-xs uppercase tracking-[0.16em] text-[#666] sm:block">{draft.nav.slice(0, 3).join("   ")}</p>
      </header>
      <div className="grid gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#666]">{kickerText(draft.kicker)}</p>
          <h3 className="mt-4 max-w-xl font-display text-5xl leading-[0.96]">{draft.headline}</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#444]">{draft.subhead}</p>
        </div>
        <Photo src={draft.heroImage} className="h-64 w-full object-cover lg:h-72" />
      </div>
      <div className="border-t border-[#161616]">
        {draft.points.map((point, index) => (
          <div key={point.title} className="grid gap-2 border-b border-[#161616]/15 px-5 py-5 sm:grid-cols-[4rem_14rem_1fr] sm:px-8">
            <p className="text-xs text-[#888]">0{index + 1}</p>
            <h4 className="font-medium">{point.title}</h4>
            <p className="text-sm leading-relaxed text-[#444]">{point.body}</p>
          </div>
        ))}
      </div>
      <p className="px-5 py-8 font-display text-3xl sm:px-8">{draft.bandTitle}</p>
    </article>
  );
}

function Shop({ result }: { result: ReimagineOk }) {
  const draft = result.draft;
  const [lead, ...rest] = draft.points;
  return (
    <article style={{ background: "#f4f1ec", color: "#1a1614" }}>
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-display text-2xl">{draft.name}</p>
        <span className="text-xs uppercase tracking-[0.16em]">{draft.action}</span>
      </header>
      <div className="grid lg:grid-cols-2">
        <Photo src={draft.heroImage} className="h-80 w-full object-cover lg:h-full lg:min-h-[28rem]" />
        <div className="flex flex-col justify-center px-5 py-10 sm:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a3a]">{kickerText(draft.kicker)}</p>
          <h3 className="mt-3 font-display text-5xl leading-[0.95]">{draft.headline}</h3>
          <p className="mt-4 text-sm leading-relaxed text-[#5c5148]">{draft.subhead}</p>
          <span className="mt-6 inline-flex w-fit min-h-11 items-center bg-[#1a1614] px-5 text-sm text-[#f4f1ec]">{draft.action}</span>
        </div>
      </div>
      <div className="grid gap-3 px-5 py-8 sm:grid-cols-3 sm:px-8">
        {lead ? (
          <div className="relative min-h-52 overflow-hidden sm:col-span-1">
            <Photo src={draft.cardImage || draft.heroImage} className="absolute inset-0 h-full w-full object-cover" />
            <p className="absolute bottom-3 left-3 text-sm text-white">{lead.title}</p>
          </div>
        ) : null}
        {rest.map((point) => (
          <div key={point.title} className="bg-white p-5">
            <h4 className="font-display text-2xl">{point.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#5c5148]">{point.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function Local({ result }: { result: ReimagineOk }) {
  const draft = result.draft;
  return (
    <article style={{ background: "#f7f4ee", color: "#141414" }}>
      <header className="bg-[#141414] px-5 py-4 text-[#f7f4ee] sm:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{draft.name}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-[#f0c14a]">{draft.action}</p>
        </div>
      </header>
      <div className="px-5 py-10 sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a12]">{kickerText(draft.kicker)}</p>
        <h3 className="mt-3 max-w-3xl font-display text-5xl leading-[0.95] sm:text-6xl">{draft.headline}</h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#444]">{draft.subhead}</p>
      </div>
      <div className="grid gap-3 px-5 sm:grid-cols-3 sm:px-8">
        {draft.points.map((point) => (
          <div key={point.title} className="border border-[#141414] p-5">
            <h4 className="text-lg font-medium">{point.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#444]">{point.body}</p>
          </div>
        ))}
      </div>
      <Photo src={draft.heroImage} className="mt-8 h-64 w-full object-cover" />
      <div className="bg-[#f0c14a] px-5 py-8 sm:px-8">
        <p className="font-display text-3xl">{draft.bandTitle}</p>
        <p className="mt-2 max-w-lg text-sm">{draft.bandBody}</p>
      </div>
    </article>
  );
}

const LEGACY: Record<string, TemplateName> = {
  editorial: "organization",
  poster: "restaurant",
  ledger: "professional",
  signal: "technology",
};

export function DraftView({ result }: { result: ReimagineOk }) {
  const raw = result.draft.template ?? "organization";
  const template = (LEGACY[raw] ?? raw) as TemplateName;
  const body =
    template === "yours" ? (
      <Yours result={result} />
    ) : template === "technology" ? (
      <Technology result={result} />
    ) : template === "restaurant" ? (
      <Restaurant result={result} />
    ) : template === "professional" ? (
      <Professional result={result} />
    ) : template === "shop" ? (
      <Shop result={result} />
    ) : template === "local" ? (
      <Local result={result} />
    ) : (
      <Organization result={result} />
    );
  return <Frame host={result.host}>{body}</Frame>;
}
