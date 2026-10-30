import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as LegalArticle, t as Clause } from "./legal-article-CtXp1feh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-BWWi8JG0.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalArticle, {
		kicker: "Legal notices",
		title: "Privacy",
		lede: "Users of REIMAGO are bound by the Catalog.com, Inc. privacy statement. This page states that incorporation and describes what this redesigned reimago.ai actually does with information.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Catalog.com privacy statement, incorporated by the",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/terms",
					className: "underline underline-offset-4",
					children: "Terms of Service"
				}),
				":",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "underline underline-offset-4",
					href: "http://hosting.catalog.com/privacy_policy.html",
					children: "http://hosting.catalog.com/privacy_policy.html"
				}),
				". Questions: sales@reimago.ai or (405) 753-5300. REIMAGO, Inc., a subsidiary of Catalog.com, Inc., 14000 Quail Springs Parkway, Suite 3600, Oklahoma City, OK 73134."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Clause, {
				heading: "What this site collects",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The Reimagine form asks for a website address, an email address, and a note about what you want changed. Submitting emails those three fields to marketing@reimago.ai. The subject is the website domain, and the email address you entered is the first line of the message. The website address and the note are also sent to REIMAGO’s server so the public pages can be fetched and a draft can be written. The email address is not sent to the model that writes the draft. “Email this brief” opens your own email program if you want to send a copy yourself." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "If you choose “Email this brief to sales,” your own mail program opens a message to sales@reimago.ai. That message is ordinary email. We do not run a separate mailing list from this page, and we do not sell the information you type here." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clause, {
				heading: "The crawl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "When you submit a website address, REIMAGO requests the public page, follows ordinary redirects on that site, and may request one related page on the same domain. The text of those pages is used to write the draft. Grok Build also makes two photographs for that draft from the same text. The pages, the draft, and the photographs are not kept as a customer database. A short-lived copy of a finished draft may be kept in server memory so the same address and the same note are not regenerated over and over. Your browser may also keep the last draft locally on your device until you clear site data." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clause, {
				heading: "Children",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Children under 13 are not permitted to join REIMAGO or to use this site. Do not submit a child’s personal information." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clause, {
				heading: "Cookies and the draft in your browser",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This marketing site does not set an advertising cookie and does not ask you to create an account. The last draft is stored with local storage in your browser, which you can clear. Standard server logs, kept by the host that serves the site, may include IP address and the page requested, the way any public website does." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clause, {
				heading: "Disclosure",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "As the terms already say, REIMAGO may access, preserve, and disclose account information and content if required by law or in a good-faith belief that it is reasonably necessary to comply with legal process or to enforce the Terms of Service. Subscriber email addresses held by REIMAGO are confidential. REIMAGO does not authorize harvesting of email addresses from the service." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clause, {
				heading: "Contact",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Privacy questions and copyright notices go to sales@reimago.ai, or by mail to the Oklahoma City address above. Copyright complaints follow the procedure linked from the terms. Disputes are governed by the laws of the State of Oklahoma, as the terms provide." })
			})
		]
	});
}
//#endregion
export { PrivacyPage as component };
