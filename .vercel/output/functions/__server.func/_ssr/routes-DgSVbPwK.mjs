import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Wordmark, t as SiteShell } from "./site-shell-BoqbKgQz.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DgSVbPwK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var reimagineSite = createServerFn({ method: "POST" }).validator((input) => {
	const url = typeof input?.url === "string" ? input.url.trim() : "";
	const notes = typeof input?.notes === "string" ? input.notes.trim().slice(0, 800) : "";
	const email = typeof input?.email === "string" ? input.email.trim() : "";
	if (!url || url.length > 300) throw new Error("Enter a website address.");
	if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)) throw new Error("Enter an email so the studio can reply.");
	return {
		url,
		notes,
		email,
		template: "yours"
	};
}).handler(createSsrRpc("6ed31822d18ad0c4481c42f25ba62ff2a8d2db28eb723af9f31fd8e5f3ef507c"));
var retryRendition = createServerFn({ method: "POST" }).validator((input) => {
	const draft = input?.draft;
	if (!draft || typeof draft.name !== "string" || typeof draft.headline !== "string") throw new Error("There is no rendering to try again.");
	return { draft: {
		...draft,
		name: draft.name.slice(0, 80),
		headline: draft.headline.slice(0, 160),
		subhead: (draft.subhead ?? "").slice(0, 400),
		action: (draft.action ?? "").slice(0, 40),
		nav: (draft.nav ?? []).slice(0, 7).map((item) => String(item).slice(0, 28)),
		points: (draft.points ?? []).slice(0, 4).map((point) => ({
			title: String(point.title ?? "").slice(0, 80),
			body: String(point.body ?? "").slice(0, 240)
		}))
	} };
}).handler(createSsrRpc("fa82025bad8b1ecf85516c72e68caa5c319479cebebd0b86948ed1df6ce15422"));
var STORAGE_KEY = "reimago-reimagine-v2";
var REBUILDS = [
	["Website", "A new first impression. Structure, copy, and conversion — rebuilt from what you already have."],
	["Business", "Positioning, offers, and the story a stranger can understand in ten seconds."],
	["Customer Service", "Help that feels like the brand: clearer answers, calmer paths, fewer dead ends."],
	["Life", "Personal sites, practices, and reputations that should look like the work behind them."]
];
function isEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function briefMailto(email, url, notes, result) {
	const body = [
		email,
		"",
		`Website: ${url}`,
		`What should change: ${notes || "(not specified)"}`,
		"",
		`Read: ${result.diagnosis}`,
		`Draft headline: ${result.draft.headline}`
	].join("\n");
	return `mailto:marketing@reimago.ai?subject=${encodeURIComponent(result.host)}&body=${encodeURIComponent(body)}`;
}
var fieldClass = "mt-1.5 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint focus-visible:ring-2 focus-visible:ring-ring/70";
var FORMCARRY = "https://formcarry.com/s/NipZS0fF4w4";
var THANKS = "We got the brief. The site, your email, the note, and the picture were sent. Nothing on the live site was changed.";
function bareDomain(site) {
	try {
		const withProto = /^https?:\/\//i.test(site) ? site : `https://${site}`;
		return new URL(withProto).hostname.replace(/^www\./i, "");
	} catch {
		return site.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0] || site;
	}
}
async function pictureFile(image, domain) {
	const blob = await (await fetch(image)).blob();
	if (!blob.size) throw new Error("The picture was not ready.");
	const canvas = document.createElement("canvas");
	const bitmap = await createImageBitmap(blob);
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	const context = canvas.getContext("2d");
	if (!context) throw new Error("The picture could not be prepared.");
	context.drawImage(bitmap, 0, 0);
	bitmap.close();
	const png = await new Promise((resolve, reject) => {
		canvas.toBlob((next) => next ? resolve(next) : reject(/* @__PURE__ */ new Error("The picture could not be prepared.")), "image/png");
	});
	if (png.size >= 1e7) throw new Error("The picture is over 10 MB.");
	return new File([png], `${domain}.png`, { type: "image/png" });
}
async function submitFormcarry(fields) {
	const domain = bareDomain(fields.website);
	const data = new FormData();
	data.append("email", fields.email);
	data.append("website", domain);
	data.append("note", fields.note);
	data.append("_gotcha", fields.gotcha);
	if (!fields.image) throw new Error("The picture was not ready.");
	data.append("picture", await pictureFile(fields.image, domain));
	const json = await (await fetch(FORMCARRY, {
		method: "POST",
		headers: { Accept: "application/json" },
		body: data
	})).json().catch(() => null);
	if (json?.code !== 200) throw new Error(json?.message || "The form could not be sent. Try again.");
}
function HomePage() {
	const [url, setUrl] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	const [working, setWorking] = (0, import_react.useState)(false);
	const [retrying, setRetrying] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [mailed, setMailed] = (0, import_react.useState)("");
	const draftRef = (0, import_react.useRef)(null);
	const scrollOnResult = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const saved = JSON.parse(raw);
			if (!saved?.result?.ok) return;
			setUrl(saved.url || "");
			setEmail(saved.email || "");
			setNotes(saved.notes || "");
			setAgreed(true);
			setResult(saved.result);
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!scrollOnResult.current || !result) return;
		scrollOnResult.current = false;
		draftRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [result]);
	async function onSubmit(event) {
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
			const next = await reimagineSite({ data: {
				url: site,
				notes: notes.trim(),
				email: email.trim()
			} });
			if (!next.ok) {
				setError(next.error);
				return;
			}
			await submitFormcarry({
				email: email.trim(),
				website: site,
				note: notes.trim(),
				gotcha: typeof gotcha === "string" ? gotcha : "",
				image: next.draft.rendition
			});
			setMailed(THANKS);
			const saved = {
				url: site,
				email: email.trim(),
				notes: notes.trim(),
				result: next
			};
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
			} catch {
				const slim = {
					...saved,
					result: {
						...next,
						draft: {
							...next.draft,
							heroImage: void 0,
							cardImage: void 0,
							rendition: void 0
						}
					}
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
			const updated = {
				...result,
				draft: {
					...result.draft,
					rendition: next.image
				}
			};
			setResult(updated);
			try {
				const saved = {
					url,
					email,
					notes,
					result: updated
				};
				localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
			} catch {}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [working || retrying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-bg/50 backdrop-blur-[3px]",
		role: "status",
		"aria-live": "polite",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative size-48",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-3 rounded-full border border-fg/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "clock-sweep absolute top-1/2 left-[calc(50%-1.25rem)] h-20 w-10 origin-bottom",
						style: { marginTop: "-5rem" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "clock-digit absolute left-1/2 top-0 font-display text-5xl italic leading-none text-fg",
							children: "1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2 bg-fg" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-fg",
				children: "Building your site"
			})]
		})
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid w-full max-w-6xl grid-cols-[250px_minmax(0,1fr)] items-start gap-3 px-4 py-6 sm:gap-8 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-[250px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "size-[250px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-3 text-center font-display leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-4xl text-ink",
						children: "Let AI:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block whitespace-nowrap font-display text-[1.75rem] italic text-primary",
						children: "Reimagine Your Website"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit,
					className: "rounded-2xl border-2 border-primary bg-bg p-4 shadow-[0_18px_40px_-24px_rgba(0,104,232,0.85)] sm:p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								htmlFor: "site-url",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-fg",
									children: "Enter your website or pick a domain for a new one"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "site-url",
									name: "url",
									value: url,
									onChange: (event) => setUrl(event.target.value),
									inputMode: "url",
									autoCapitalize: "none",
									autoCorrect: "off",
									spellCheck: false,
									required: true,
									placeholder: "https://yourcompany.com",
									className: fieldClass
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									htmlFor: "site-email",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-fg",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "site-email",
										name: "email",
										value: email,
										onChange: (event) => setEmail(event.target.value),
										type: "email",
										autoComplete: "email",
										required: true,
										placeholder: "you@company.com",
										className: fieldClass
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									htmlFor: "site-notes",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-fg",
										children: "What should change?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "site-notes",
										name: "notes",
										value: notes,
										maxLength: 800,
										onChange: (event) => setNotes(event.target.value),
										rows: 2,
										placeholder: "Clearer offer. Faster. Feels like us.",
										className: "mt-1.5 flex min-h-16 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none placeholder:text-faint focus-visible:ring-2 focus-visible:ring-ring/70 sm:min-h-22"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								name: "_gotcha",
								tabIndex: -1,
								autoComplete: "off",
								defaultValue: "",
								"aria-hidden": "true",
								className: "pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-2.5 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: agreed,
									onChange: (event) => setAgreed(event.target.checked),
									className: "mt-1 size-4 shrink-0 accent-fg"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"I agree to the",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/terms",
										className: "text-fg underline-offset-4 hover:underline",
										children: "Terms of Service"
									}),
									" ",
									"and",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/privacy",
										className: "text-fg underline-offset-4 hover:underline",
										children: "Privacy Policy"
									}),
									"."
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: working,
								className: "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-ink transition-transform duration-150 ease-out hover:bg-accent/90 active:scale-[0.96] disabled:opacity-40 sm:w-auto",
								children: [working ? "Building the site…" : "Reimagine my site", working ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "size-4",
									"aria-hidden": true
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								role: "alert",
								children: error
							}) : null,
							mailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: mailed
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
								onClick: () => {
									setUrl("https://reimago.ai");
									setNotes("Retire the feature catalog. Make this a studio that reimagines a customer's website.");
								},
								children: "Try it on reimago.ai"
							})
						]
					})
				})
			})]
		}),
		result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			ref: draftRef,
			className: "scroll-mt-16 border-t border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 pt-8 sm:px-6",
				children: [result.draft.rendition ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
					className: "overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: result.draft.rendition,
						alt: `Imagine rendition of ${result.draft.name}`,
						className: "w-full"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-border bg-surface p-6 text-sm text-muted",
					children: "Imagine did not return a page. Try the site again."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void tryAgain(),
					disabled: retrying,
					className: "mt-4 inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-sm font-medium disabled:opacity-40",
					children: "Try Again"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[16rem_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-eyebrow text-faint",
						children: "What we read"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl italic leading-tight",
						children: result.foundTitle
					}),
					result.foundDescription ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: result.foundDescription
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: result.diagnosis
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: result.honored.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-l border-border pl-3 text-fg",
							children: item
						}, item))
					}),
					result.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-faint",
						children: result.note
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: briefMailto(email, url, notes, result),
						className: "inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-fg",
						children: "Email this brief"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void copyBrief(),
						className: "inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-sm",
						children: "Copy the draft"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						mailed || "The rendering is emailed to marketing@reimago.ai.",
						" ",
						"Nothing was changed on ",
						result.host,
						"."
					]
				})] })]
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "how-it-works",
			className: "scroll-mt-16 border-t border-primary/20 bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-6xl gap-10 px-4 pt-4 pb-16 sm:px-6 md:grid-cols-3",
				children: [
					[
						"01",
						"Enter your site",
						"URL, email, and what you want changed. That is the brief."
					],
					[
						"02",
						"We crawl it",
						"The Reimago bot reads public pages — titles, structure, voice — then Grok designs."
					],
					[
						"03",
						"Review the draft",
						"A new site, on screen. Call us when you want it built."
					]
				].map(([index, title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl italic text-accent tabular-nums",
						children: index
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-lg font-medium",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: body
					})
				] }, index))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl leading-tight sm:text-4xl",
						children: "Four things we rebuild"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						className: "hidden size-8 -rotate-45 text-accent sm:block",
						"aria-hidden": true
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2",
					children: REBUILDS.map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border-t-4 border-accent bg-bg p-6 sm:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl italic",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: body
						})]
					}, title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-ink text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-eyebrow text-accent",
					children: "Twenty years"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-3xl leading-tight sm:text-4xl",
					children: "We used to power the networks. Now we redesign the rest of the web."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-white/80 sm:text-base",
					children: "Reimago spent two decades shipping social software, community platforms, and enterprise sign-on — including work for clubs and brands that needed their own network, not a rented one. That market moved to Instagram, Facebook, and X. The craft stayed. Enter a URL. We will show you what your site should have been."
				})]
			})
		})
	] })] });
}
var SplitComponent = HomePage;
//#endregion
export { SplitComponent as component };
