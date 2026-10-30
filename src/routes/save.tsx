import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/save")({
  component: SavePage,
});

function SavePage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-faint">Website, domain, and email</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">See how you save money</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          The expensive part of a website is not the first sketch. It is paying someone to build it, then paying
          again every time it has to be maintained. Reimago puts the site, the domain, and the email in one place
          so that work is not three vendors and a redesign contract.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl leading-tight">Building the site</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              A typical rebuild starts blank. You pay for discovery, a sitemap, copy, design, and a developer
              before there is a page you can reject. Reimago starts from the site you already have. Enter the
              address. The public pages are read, and Imagine draws a new version you can see on the screen.
            </p>
            <p>
              That first picture is the draft, not a finished launch. You are not buying a studio engagement just
              to find out whether a new direction is worth it. If the picture is wrong, Try Again asks for
              another one. If you do not have a site yet, pick a domain and start from that name instead of
              commissioning a build with nothing to point at.
            </p>
            <p>
              The words on the new page come from the site that is already live: the name, the navigation, and
              the headline. You are not paying a copywriter to invent a company you already described.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl leading-tight">Maintaining it</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              After launch, the bill is the edits. A new phone number, a retired offer, a page that no longer
              matches the work. When the site, the domain, and the email are split across a host, a registrar,
              and a mailbox vendor, a small change waits on whoever still remembers how the last version was
              built.
            </p>
            <p>
              Keeping those three together means maintenance is one account, not a chain of tickets. The domain
              points at the site you are actually using. Email uses that same name, so you are not paying one
              company for the address and another company to make the address work.
            </p>
            <p>
              Nothing on the live site changes when you submit the form. The rendering is a draft you review.
              You publish when the page is the one you want, instead of paying for a rebuild because the last
              design aged out.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl leading-tight">Where the money usually goes</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            <li>A redesign project before anyone has seen a page.</li>
            <li>A retainer so someone can change a headline.</li>
            <li>Separate invoices for hosting, the domain, and email.</li>
            <li>Another full rebuild a few years later, because the last one cannot be maintained.</li>
          </ul>
        </section>

        <p className="mt-12">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-fg"
          >
            Reimagine a site
          </Link>
        </p>
      </article>
    </SiteShell>
  );
}
