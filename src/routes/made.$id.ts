import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/made/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { readPage } = await import("@/lib/pages.server");
        const html = await readPage(params.id);
        if (!html) return new Response("That page is not on this server.", { status: 404 });
        return new Response(html, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=300",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src https: data:; base-uri 'none'; form-action 'none'",
          },
        });
      },
    },
  },
});
