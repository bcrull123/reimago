import { createServerFn } from "@tanstack/react-start";
import type { ReimagineInput, ReimagineResult, SiteDraft } from "@/lib/reimagine-types";
import type { DomainCheck } from "@/lib/logicboxes-types";

export const reimagineSite = createServerFn({ method: "POST" })
  .validator((input: ReimagineInput) => {
    const url = typeof input?.url === "string" ? input.url.trim() : "";
    const notes = typeof input?.notes === "string" ? input.notes.trim().slice(0, 800) : "";
    const email = typeof input?.email === "string" ? input.email.trim() : "";
    if (!url || url.length > 300) {
      throw new Error("Enter a website address.");
    }
    if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)) {
      throw new Error("Enter an email so the studio can reply.");
    }
    return { url, notes, email, template: "yours" as const };
  })
  .handler(async ({ data }): Promise<ReimagineResult> => {
    const { runReimagine } = await import("./reimagine.server");
    return runReimagine(data);
  });

export const retryRendition = createServerFn({ method: "POST" })
  .validator((input: { draft?: SiteDraft }) => {
    const draft = input?.draft;
    if (!draft || typeof draft.name !== "string" || typeof draft.headline !== "string") {
      throw new Error("There is no rendering to try again.");
    }
    return {
      draft: {
        ...draft,
        name: draft.name.slice(0, 80),
        headline: draft.headline.slice(0, 160),
        subhead: (draft.subhead ?? "").slice(0, 400),
        action: (draft.action ?? "").slice(0, 40),
        nav: (draft.nav ?? []).slice(0, 7).map((item) => String(item).slice(0, 28)),
        points: (draft.points ?? []).slice(0, 4).map((point) => ({
          title: String(point.title ?? "").slice(0, 80),
          body: String(point.body ?? "").slice(0, 240),
        })),
      },
    };
  })
  .handler(async ({ data }) => {
    const { anotherRendition } = await import("./reimagine.server");
    const image = await anotherRendition(data.draft as SiteDraft);
    if (!image) return { ok: false as const, error: "Imagine did not return a new rendering." };
    return { ok: true as const, image };
  });

export const handOffToCursor = createServerFn({ method: "POST" })
  .validator((input: {
    host?: string;
    submitted?: string;
    url?: string;
    title?: string;
    description?: string;
    nav?: string[];
    headings?: string[];
    text?: string;
    notes?: string;
    image?: string;
  }) => {
    const image = typeof input?.image === "string" ? input.image : "";
    if (!image.startsWith("data:image/") && !image.startsWith("https://")) {
      throw new Error("The Imagine picture is not ready.");
    }
    if (image.length > 12_000_000) throw new Error("The Imagine picture is too large to hand off.");
    const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
    const list = (value: unknown, max: number) =>
      Array.isArray(value) ? value.map((item) => String(item).trim().slice(0, 80)).filter(Boolean).slice(0, max) : [];
    return {
      host: clip(input?.host, 200),
      submitted: clip(input?.submitted, 300),
      url: clip(input?.url, 300),
      title: clip(input?.title, 200),
      description: clip(input?.description, 400),
      nav: list(input?.nav, 8),
      headings: list(input?.headings, 16),
      text: clip(input?.text, 2500),
      notes: clip(input?.notes, 800),
      image,
    };
  })
  .handler(async ({ data }) => {
    const { sendToCursor } = await import("./reimagine.server");
    return sendToCursor(data);
  });

export const checkDomainName = createServerFn({ method: "POST" })
  .validator((input: { name?: string }) => {
    const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
    if (!name) throw new Error("Enter a domain name, like northline.com.");
    return { name };
  })
  .handler(async ({ data }): Promise<DomainCheck> => {
    const { checkDomainAvailability } = await import("./logicboxes.server");
    return checkDomainAvailability(data.name);
  });