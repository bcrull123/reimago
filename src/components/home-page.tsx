import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell, Wordmark } from "@/components/site-shell";
import { reimagineSite, retryRendition } from "@/lib/reimagine.functions";
import type { ReimagineOk } from "@/lib/reimagine-types";

const STORAGE_KEY = "reimago-reimagine-v2";

const REBUILDS = [
  ["Website", "A new first impression. Structure, copy, and conversion — rebuilt from what you already have."],
  ["Business", "Positioning, offers, and the story a stranger can understand in ten seconds."],
  ["Customer Service", "Help that feels like the brand: clearer answers, calmer paths, fewer dead ends."],
  ["Life", "Personal sites, practices, and reputations that should look like the work behind them."],
] as const;

type Saved = {
  url: string;
  email: string;
  notes: string;
  result: ReimagineOk;
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function briefMailto(email: string, url: string, notes: string, result: ReimagineOk): string {
  const body = [
    email,
    "",
    `Website: ${url}`,
    `What should change: ${notes || "(not specified)"}`,
    "",
    `Read: ${result.diagnosis}`,
    `Draft headline: ${result.draft.headline}`,
  ].join("\n");
  return `mailto:marketing@reimago.ai?subject=${encodeURIComponent(result.host)}&body=${encodeURIComponent(body)}`;
}

const fieldClass =
  "mt-1.5 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint focus-visible:ring-2 focus-visible:ring-ring/70";

const FORMCARRY = "https://formcarry.com/s/NipZS0fF4w4";
const THANKS = "We got the brief. The site, your email, the note, and the picture were sent. Nothing on the live site was changed.";

function bareDomain(site: string): string {
  try {
    const withProto = /^https?:\/\//i.test(site) ? site : `https://${site}`;
    return new URL(withProto).hostname.replace(/^www\./i, "");
  } catch {
    return site.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0] || site;
  }
}

async function pictureFile(image: string, domain: string): Promise<File> {
  const response = await fetch(image);
  const blob = await response.blob();
  if (!blob.size) throw new Error("The picture was not ready.");
  const canvas = document.createElement("canvas");
  const bitmap = await createImageBitmap(blob);
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The picture could not be prepared.");
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const png = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((next) => (next ? resolve(next) : reject(new Error("The picture could not be prepared."))), "image/png");
  });
  if (png.size >= 10_000_000) throw new Error("The picture is over 10 MB.");
  return new File([png], `${domain}.png`, { type: "image/png" });
}

async function submitFormcarry(fields: {
  email: string;
  website: string;
  note: string;
  gotcha: string;
  image?: string;
}): Promise<void> {
  const domain = bareDomain(fields.website);
  const data = new FormData();
  data.append("email", fields.email);
  data.append("website", domain);
  data.append("note", fields.note);
  data.append("_gotcha", fields.gotcha);
  if (!fields.image) throw new Error("The picture was not ready.");
  data.append("picture", await pictureFile(fields.image, domain));

  const response = await fetch(FORMCARRY, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: data,
  });
  const json = (await response.json().catch(() => null)) as { code?: number; message?: string } | null;
  if (json?.code !== 200) {
    throw new Error(json?.message || "The form could not be sent. Try again.");
  }
}

export function HomePage() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [working, setWorking] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReimagineOk | null>(null);
  const [mailed, setMailed] = useState<string>("");
  const draftRef = useRef<HTMLElement>(null);
  const scrollOnResult = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Saved;
      if (!saved?.result?.ok) return;
      setUrl(saved.url || "");
      setEmail(saved.email || "");
      setNotes(saved.notes || "");
      setAgreed(true);
      setResult(saved.result);
    } catch {
      // Ignore a bad local draft.
    }
  }, []);

  useEffect(() => {
    if (!scrollOnResult.current || !result) return;
    scrollOnResult.current = false;
    draftRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const site = url.trim();
    if (!site || site === "https://" || site === "http://") {
      setError("Enter the website you want reimagined.");
      return;
    }
    if (!isEmail(email.trim())) {
      setError("Enter an email so sales can follow up.");
      return;
    }
    if (!agreed) {
      setError("Agree to the terms before we fetch the site.");
      return;
    }
    setWorking(true);
    setMailed("");
    const gotcha = new FormData(event.currentTarget).get("_gotcha");
    try {
      const next = await reimagineSite({ data: { url: site, notes: notes.trim(), email: email.trim() } });
      if (!next.ok) {
        setError(next.error);
        return;
      }
      await submitFormcarry({
        email: email.trim(),
        website: site,
        note: notes.trim(),
        gotcha: typeof gotcha === "string" ? gotcha : "",
        image: next.draft.rendition,
      });
      setMailed(THANKS);
      const saved: Saved = { url: site, email: email.trim(), notes: notes.trim(), result: next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch {
        const slim: Saved = {
          ...saved,
          result: { ...next, draft: { ...next.draft, heroImage: undefined, cardImage: undefined, rendition: undefined } },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
      }
      scrollOnResult.current = true;
      setResult(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The draft could not be made.");
    } finally {
      setWorking(false);
    }
  }

  async function tryAgain() {
    if (!result) return;
    setRetrying(true);
    setError("");
    try {
      const next = await retryRendition({ data: { draft: result.draft } });
      if (!next.ok) {
        setError(next.error);
        return;
      }
      const updated = { ...result, draft: { ...result.draft, rendition: next.image } };
      setResult(updated);
      try {
        const saved: Saved = { url, email, notes, result: updated };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch {
        // The new picture is still on screen if storage is full.
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Imagine did not return a new rendering.");
    } finally {
      setRetrying(false);
    }
  }

  async function copyBrief() {
    if (!result) return;
    const text = `${result.draft.name}\n${result.draft.headline}\n${result.draft.subhead}\n\n${result.diagnosis}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Copy failed in this browser. Use the email link instead.");
    }
  }

  return (
    <SiteShell>
      {working || retrying ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/50 backdrop-blur-[3px]"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center">
            <div className="relative size-48" aria-hidden>
              <div className="absolute inset-3 rounded-full border border-fg/30" />
              <div
                className="clock-sweep absolute top-1/2 left-[calc(50%-1.25rem)] h-20 w-10 origin-bottom"
                style={{ marginTop: "-5rem" }}
              >
                <span className="clock-digit absolute left-1/2 top-0 font-display text-5xl italic leading-none text-fg">
                  1
                </span>
                <span className="absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2 bg-fg" />
              </div>
              <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" />
            </div>
            <p className="mt-6 text-sm text-fg">Building your site</p>
          </div>
        </div>
      ) : null}
      <main>
        <section className="mx-auto grid w-full max-w-6xl grid-cols-[250px_minmax(0,1fr)] items-start gap-3 px-4 py-6 sm:gap-8 sm:px-6">
          <div className="w-[250px]">
            <Wordmark className="size-[250px]" />
            <h1 className="mt-3 text-center font-display leading-tight">
              <span className="block text-4xl text-ink">Let AI:</span>
              <span className="mt-1 block whitespace-nowrap font-display text-[1.75rem] italic text-primary">
                Reimagine Your Website
              </span>
            </h1>
          </div>
          <div className="min-w-0">
            <form onSubmit={onSubmit} className="rounded-2xl border-2 border-primary bg-bg p-4 shadow-[0_18px_40px_-24px_rgba(0,104,232,0.85)] sm:p-6">
              <div className="space-y-4">
                <label className="block" htmlFor="site-url">
                  <span className="text-sm font-medium text-fg">Enter your website or pick a domain for a new one</span>
                  <input
                    id="site-url"
                    name="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    placeholder="https://yourcompany.com"
                    className={fieldClass}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block" htmlFor="site-email">
                    <span className="text-sm font-medium text-fg">Email</span>
                    <input
                      id="site-email"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block" htmlFor="site-notes">
                    <span className="text-sm font-medium text-fg">What should change?</span>
                    <textarea
                      id="site-notes"
                      name="notes"
                      value={notes}
                      maxLength={800}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={2}
                      placeholder="Clearer offer. Faster. Feels like us."
                      className="mt-1.5 flex min-h-16 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none placeholder:text-faint focus-visible:ring-2 focus-visible:ring-ring/70 sm:min-h-22"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
                />
                <label className="flex items-start gap-2.5 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-1 size-4 shrink-0 accent-fg"
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms" className="text-fg underline-offset-4 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-fg underline-offset-4 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={working}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-ink transition-transform duration-150 ease-out hover:bg-accent/90 active:scale-[0.96] disabled:opacity-40 sm:w-auto"
                >
                  {working ? "Building the site…" : "Reimagine my site"}
                  {working ? null : <ArrowRight className="size-4" aria-hidden />}
                </button>
                {error ? (
                  <p className="text-sm text-danger" role="alert">
                    {error}
                  </p>
                ) : null}
                {mailed ? <p className="text-sm text-muted">{mailed}</p> : null}
                <button
                  type="button"
                  className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
                  onClick={() => {
                    setUrl("https://reimago.ai");
                    setNotes(
                      "Retire the feature catalog. Make this a studio that reimagines a customer's website.",
                    );
                  }}
                >
                  Try it on reimago.ai
                </button>
              </div>
            </form>
          </div>
        </section>

        {result ? (
          <section ref={draftRef} className="scroll-mt-16 border-t border-border">
            <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
              {result.draft.rendition ? (
                <figure className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
                  <img
                    src={result.draft.rendition}
                    alt={`Imagine rendition of ${result.draft.name}`}
                    className="w-full"
                  />
                </figure>
              ) : (
                <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
                  Imagine did not return a page. Try the site again.
                </p>
              )}
              <button
                type="button"
                onClick={() => void tryAgain()}
                disabled={retrying}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-sm font-medium disabled:opacity-40"
              >
                Try Again
              </button>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[16rem_1fr]">
              <aside>
                <p className="text-xs font-medium uppercase tracking-eyebrow text-faint">What we read</p>
                <p className="mt-3 font-display text-2xl italic leading-tight">{result.foundTitle}</p>
                {result.foundDescription ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{result.foundDescription}</p>
                ) : null}
                <p className="mt-4 text-sm leading-relaxed text-muted">{result.diagnosis}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {result.honored.map((item) => (
                    <li key={item} className="border-l border-border pl-3 text-fg">
                      {item}
                    </li>
                  ))}
                </ul>
                {result.note ? <p className="mt-4 text-sm leading-relaxed text-faint">{result.note}</p> : null}
              </aside>
              <div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={briefMailto(email, url, notes, result)}
                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-fg"
                  >
                    Email this brief
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyBrief()}
                    className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-sm"
                  >
                    Copy the draft
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {mailed || "The rendering is emailed to marketing@reimago.ai."}{" "}
                  Nothing was changed on {result.host}.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section id="how-it-works" className="scroll-mt-16 border-t border-primary/20 bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-4 pb-16 sm:px-6 md:grid-cols-3">
            {[
              ["01", "Enter your site", "URL, email, and what you want changed. That is the brief."],
              ["02", "We crawl it", "The Reimago bot reads public pages — titles, structure, voice — then Grok designs."],
              ["03", "Review the draft", "A new site, on screen. Call us when you want it built."],
            ].map(([index, title, body]) => (
              <div key={index}>
                <p className="font-display text-2xl italic text-accent tabular-nums">{index}</p>
                <h2 className="mt-3 text-lg font-medium">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">Four things we rebuild</h2>
              <ArrowRight className="hidden size-8 -rotate-45 text-accent sm:block" aria-hidden />
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {REBUILDS.map(([title, body]) => (
                <article key={title} className="border-t-4 border-accent bg-bg p-6 sm:p-8">
                  <h3 className="font-display text-2xl italic">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-ink text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-eyebrow text-accent">Twenty years</p>
              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                We used to power the networks. Now we redesign the rest of the web.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-white/80 sm:text-base">
              Reimago spent two decades shipping social software, community platforms, and enterprise sign-on —
              including work for clubs and brands that needed their own network, not a rented one. That market
              moved to Instagram, Facebook, and X. The craft stayed. Enter a URL. We will show you what your site
              should have been.
            </p>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
