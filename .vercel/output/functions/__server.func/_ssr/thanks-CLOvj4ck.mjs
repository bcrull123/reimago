import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SiteShell } from "./site-shell-BoqbKgQz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/thanks-CLOvj4ck.js
var import_jsx_runtime = require_jsx_runtime();
function ThanksPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-eyebrow text-faint",
				children: "Sent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl",
				children: "We got the brief."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base leading-relaxed text-muted",
				children: "The site, your email, the note, and the picture are on their way to bob@reimago.ai. Nothing on the live site was changed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-8 inline-flex h-12 items-center text-sm font-medium text-primary hover:underline",
				children: "Back to the draft"
			})
		]
	}) });
}
//#endregion
export { ThanksPage as component };
