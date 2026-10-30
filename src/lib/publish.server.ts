import { getRequestHeader, getRequestUrl } from "@tanstack/react-start/server";
import { previewPathPrefix } from "@/lib/preview-path-prefix";
import { savePage } from "@/lib/pages.server";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}

export function fallbackHtml(draft: {
  name: string;
  headline: string;
  subhead: string;
  action: string;
  nav: string[];
  points: { title: string; body: string }[];
  rendition?: string;
}): string {
  const nav = draft.nav.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const points = draft.points
    .map((point) => `<article><h2>${escapeHtml(point.title)}</h2><p>${escapeHtml(point.body)}</p></article>`)
    .join("");
  const picture = draft.rendition ? `<img src="${draft.rendition.replace(/"/g, "")}" alt="">` : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(draft.name)}</title>
<style>
  body { margin: 0; font-family: Georgia, "Times New Roman", serif; color: #161616; background: #f7f4ee; }
  header { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px 28px; background: #fff; border-bottom: 1px solid #e4e0d8; }
  nav { display: flex; gap: 18px; font-family: system-ui, sans-serif; font-size: 14px; }
  .button { font-family: system-ui, sans-serif; background: #161616; color: #fff; text-decoration: none; padding: 10px 16px; border-radius: 6px; }
  main { max-width: 1100px; margin: 0 auto; padding: 28px; }
  img { width: 100%; border-radius: 16px; display: block; }
  h1 { font-size: 56px; line-height: 1.02; margin: 24px 0 8px; }
  .sub { font-family: system-ui, sans-serif; font-size: 18px; max-width: 40rem; color: #333; }
  .points { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 28px; }
  article { background: #fff; border-radius: 12px; padding: 18px; }
  h2 { font-size: 22px; margin: 0 0 8px; }
  article p { font-family: system-ui, sans-serif; margin: 0; line-height: 1.5; }
</style>
</head>
<body>
<header>
  <strong>${escapeHtml(draft.name)}</strong>
  <nav>${nav}</nav>
  <span class="button">${escapeHtml(draft.action)}</span>
</header>
<main>
  ${picture}
  <h1>${escapeHtml(draft.headline)}</h1>
  <p class="sub">${escapeHtml(draft.subhead)}</p>
  <p><span class="button">${escapeHtml(draft.action)}</span></p>
  <div class="points">${points}</div>
</main>
</body>
</html>`;
}

function cleanHtml(raw: string): string {
  let html = raw.trim();
  const fence = html.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) html = fence[1].trim();
  const start = html.search(/<!doctype html|<html[\s>]/i);
  if (start > 0) html = html.slice(start);
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/javascript:/gi, "");
  if (!/<html[\s>]/i.test(html)) {
    html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${html}</body></html>`;
  }
  return html;
}

export function publicBase(): string {
  try {
    const referer = getRequestHeader("referer");
    if (referer) {
      const ref = new URL(referer);
      const prefix = previewPathPrefix(ref.hostname, ref.pathname) ?? "";
      return `${ref.protocol}//${ref.host}${prefix}`;
    }
  } catch {
    // Fall through to the request URL.
  }
  const url = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
  const prefix = previewPathPrefix(url.hostname, url.pathname) ?? "";
  return `${url.protocol}//${url.host}${prefix}`;
}

export async function htmlFromRendition(image: string, name: string): Promise<string | undefined> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey || !image) return undefined;
  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: 7000,
        messages: [
          {
            role: "system",
            content:
              "You are Grok Build. Recreate the website in the image as one HTML document. Match the layout, colors, type, spacing, and visible words as closely as possible. Use a single style block in the head. No JavaScript. No markdown. Return only the document.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: `Build the HTML page for ${name}. Follow the picture, not a generic template.` },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      console.error("[publish] build", response.status, await response.text());
      return undefined;
    }
    const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) return undefined;
    return cleanHtml(text);
  } catch (error) {
    console.error("[publish] build failed", error instanceof Error ? error.message : error);
    return undefined;
  }
}

export async function hostPage(html: string): Promise<string> {
  const id = await savePage(html);
  return `${publicBase()}/made/${id}`;
}
