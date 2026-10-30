import { createServerFn } from "@tanstack/react-start";
import type { ReimagineInput, ReimagineResult, SiteDraft } from "@/lib/reimagine-types";

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