import { i as getRequestIP$1 } from "./ssr.mjs";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
//#region node_modules/.nitro/vite/services/ssr/assets/reimagine.server-Cd_m2_Zg.js
var TEMPLATES = /* @__PURE__ */ new Set([
	"yours",
	"organization",
	"technology",
	"restaurant",
	"professional",
	"shop",
	"local"
]);
var LEGACY_TEMPLATE = {
	editorial: "organization",
	poster: "restaurant",
	ledger: "professional",
	signal: "technology"
};
function chosenTemplate(value) {
	if (typeof value !== "string") return "organization";
	const key = value.toLowerCase().trim();
	if (TEMPLATES.has(key)) return key;
	return LEGACY_TEMPLATE[key] ?? "organization";
}
function withTemplate(value, template) {
	return {
		...value,
		draft: {
			...value.draft,
			template
		}
	};
}
var hits = /* @__PURE__ */ new Map();
var cache = /* @__PURE__ */ new Map();
var REIMAGO_HOSTS = /* @__PURE__ */ new Set(["reimago.ai", "www.reimago.ai"]);
var REIMAGO_SNAPSHOT = {
	title: "Reimago — Social Network Software, Community Software, Social Login and Enterprise Single Sign-On",
	description: "Reimago provides social network software, community software, social login, and enterprise single sign-on for brands and agencies.",
	headings: [
		"Features",
		"Activity Feed",
		"Blog Posts",
		"Photo Galleries",
		"Moderation and Permissions",
		"Customization",
		"Hosting Platform"
	],
	text: `Reimago is social networking software, community software, social login, and enterprise single sign-on. Features include an activity feed, blog posts, bookmarks, calendars and events, document management, extensible profiles, friending and following, photo galleries, a setup wizard with social registration, status and mood updates, and videos. Advanced user-generated content covers commenting, forums, loyalty rewards and badges, live chat, polls, private messaging, questions and answers, ratings, reviews, sharing, and wiki. Moderation includes age gateways, user permissions, spam and profanity filters, trigger-word actions, pre-moderation, and flagged content. Customization includes an advertisement module, asset manager, custom menus, custom templating, drag-and-drop layout, theming, and integration. Call (405) 753-5300 or email sales@reimago.ai. Reimago is for brands, agencies, and outsourcing any website. Copyright Reimago, Inc., a subsidiary of Catalog.com, Inc., Oklahoma City.`
};
function clip(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}
function blockedIp(ip) {
	const raw = ip.toLowerCase().replace(/^\[|\]$/g, "");
	let v4 = raw.startsWith("::ffff:") ? raw.slice(7) : raw;
	if (v4.includes(":")) {
		if (raw === "::1" || raw === "::") return true;
		if (raw.startsWith("fe80:") || raw.startsWith("fc") || raw.startsWith("fd")) return true;
		return false;
	}
	if (!isIP(v4)) return true;
	const parts = v4.split(".").map((n) => Number(n));
	const a = parts[0] ?? 0;
	const b = parts[1] ?? 0;
	if (a === 0 || a === 10 || a === 127) return true;
	if (a === 169 && b === 254) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && (b === 168 || b === 0)) return true;
	if (a === 100 && b >= 64 && b <= 127) return true;
	if (a >= 224) return true;
	return false;
}
async function assertPublic(url) {
	if (url.username || url.password) throw new Error("Remove any login from that address.");
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Use an http or https address.");
	if (url.port && url.port !== "80" && url.port !== "443") throw new Error("Only ordinary website addresses can be read.");
	const host = url.hostname.toLowerCase().replace(/\.$/, "");
	if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || host === "metadata.google.internal") throw new Error("That address cannot be crawled.");
	if (isIP(host)) {
		if (blockedIp(host)) throw new Error("That address cannot be crawled.");
		return;
	}
	let records = [];
	try {
		records = await lookup(host, {
			all: true,
			verbatim: true
		});
	} catch {
		throw new Error("That website address could not be found.");
	}
	if (records.length === 0 || records.some((record) => blockedIp(record.address))) throw new Error("That address cannot be crawled.");
}
function normalizeInput(raw) {
	const trimmed = raw.trim();
	const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	let url;
	try {
		url = new URL(withScheme);
	} catch {
		throw new Error("Enter a full website address, like https://example.com.");
	}
	url.hash = "";
	url.hostname = url.hostname.toLowerCase().replace(/\.$/, "");
	return url;
}
async function fetchPage(start, timeoutMs = 3e4) {
	const deadline = Date.now() + timeoutMs;
	let current = start;
	let hops = 0;
	let lastError;
	while (Date.now() < deadline && hops < 4) {
		const remaining = deadline - Date.now();
		if (remaining < 250) break;
		await assertPublic(current);
		try {
			const response = await fetch(current, {
				redirect: "manual",
				signal: AbortSignal.timeout(remaining),
				headers: {
					Accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5",
					"User-Agent": "ReimagoReimagine/1.0 (+https://reimago.ai)"
				}
			});
			if (response.status >= 300 && response.status < 400) {
				const location = response.headers.get("location");
				if (!location) throw new Error("That site redirected without a destination.");
				current = new URL(location, current);
				current.hash = "";
				hops += 1;
				if (hops >= 4) throw new Error("That site redirected too many times.");
				continue;
			}
			if (!response.ok) throw new Error(`That site responded with status ${response.status}.`);
			const type = response.headers.get("content-type") ?? "";
			if (type && !/text\/html|application\/xhtml\+xml|text\/plain/i.test(type)) throw new Error("That address did not return a web page.");
			const html = Buffer.from(await response.arrayBuffer()).subarray(0, 5e5).toString("utf8");
			if (!html.trim()) throw new Error("That site returned an empty page.");
			return {
				url: current.toString(),
				html
			};
		} catch (error) {
			lastError = error;
			const left = deadline - Date.now();
			if (left < 1e3) break;
			const message = error instanceof Error ? error.message : "";
			if (!/fetch failed|aborted|timeout|Timeout|ECONN|socket|network/i.test(message)) throw error;
			await new Promise((resolve) => setTimeout(resolve, Math.min(1500, left)));
		}
	}
	if (lastError instanceof Error) throw lastError;
	throw new Error("That site did not respond in time.");
}
function decode(text) {
	return text.replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/"/gi, "\"").replace(/&#39;|'/gi, "'").replace(/</gi, "<").replace(/>/gi, ">").replace(/&#(\d+);/g, (_, n) => {
		const code = Number(n);
		return code > 31 && code < 65535 ? String.fromCharCode(code) : " ";
	});
}
function stripTags(html) {
	return decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
function extract(html) {
	const title = stripTags((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1] ?? "");
	const description = stripTags((html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) ?? html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i))?.[1] ?? "");
	const cleaned = stripChrome(html).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
	const headings = [...cleaned.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((match) => stripTags(match[1] ?? "")).filter((heading) => heading.length > 1 && heading.length < 140).slice(0, 16);
	const text = stripTags(cleaned).slice(0, 7e3);
	return {
		title: title.slice(0, 180),
		description: description.slice(0, 300),
		headings,
		text
	};
}
function httpUrl(value, base) {
	try {
		const url = new URL(value, base);
		if (url.protocol !== "http:" && url.protocol !== "https:") return "";
		return url.toString();
	} catch {
		return "";
	}
}
function extractLogo(html, base) {
	const page = stripChrome(html);
	for (const tag of page.matchAll(/<img\b[^>]*>/gi)) {
		const raw = tag[0] ?? "";
		if (/avatar|emoji|gravatar|w-logo|wordpress-logo/i.test(raw)) continue;
		if (!/\blogo\b|class=["'][^"']*logo|src=["'][^"']*logo/i.test(raw)) continue;
		const src = raw.match(/\bsrc=["']([^"']+)["']/i)?.[1];
		const resolved = src ? httpUrl(src, base) : "";
		if (resolved) return resolved;
	}
	const icons = [];
	for (const tag of html.matchAll(/<link\b[^>]*>/gi)) {
		const raw = tag[0] ?? "";
		const rel = (raw.match(/\brel=["']([^"']+)["']/i)?.[1] ?? "").toLowerCase();
		const href = raw.match(/\bhref=["']([^"']+)["']/i)?.[1];
		if (!href) continue;
		let score = 0;
		if (rel.includes("apple-touch-icon")) score = 4;
		else continue;
		if (/svg|png/i.test(href)) score += 1;
		icons.push({
			href,
			score
		});
	}
	icons.sort((a, b) => b.score - a.score);
	return icons[0] ? httpUrl(icons[0].href, base) : "";
}
function stripChrome(html) {
	const open = /<([a-z0-9]+)[^>]*\bid=["']wpadminbar["'][^>]*>/i.exec(html);
	if (!open) return html.replace(/https?:\/\/wordpress\.org\/?/gi, " ").replace(/About WordPress/gi, " ");
	const tag = open[1] ?? "div";
	const tags = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
	tags.lastIndex = open.index;
	let depth = 0;
	let match;
	while (match = tags.exec(html)) {
		depth += match[0].startsWith("</") ? -1 : 1;
		if (depth === 0) return html.slice(0, open.index) + html.slice(tags.lastIndex);
	}
	return html.slice(0, open.index) + html.slice(open.index + open[0].length);
}
function scrubPlatform(value) {
	return value.replace(/\babout\s*\.?\s*org\b/gi, "").replace(/\babout\s+wordpress(?:\.org)?\b/gi, "").replace(/\bwordpress\.org\b/gi, "").replace(/\s*[|\-–—:]\s*just another wordpress site/gi, "").replace(/just another wordpress site\.?/gi, "").replace(/proudly powered by wordpress\.?/gi, "").replace(/\bpowered by wordpress\b\.?/gi, "").replace(/\blearn wordpress\b/gi, "").replace(/\bwordpress\b/gi, "").replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1").replace(/\s*\.\s*org\b/gi, "").trim();
}
function isWordPress(html) {
	return /wp-content\/|wp-includes\/|wpadminbar|generator["'][^>]*wordpress|wordpress[^"']*["'][^>]*generator/i.test(html);
}
var MENU_NOISE = /^(sample page|hello world!?|uncategorized|log in|login|sign in|sign up|register|my account|cart|checkout|wishlist|skip to content|search|shopping cart|about wordpress|wordpress\.org|about\.org|about \.org|documentation|learn wordpress|feedback|dashboard|updates|edit page|edit with elementor|howdy|log out|visit site|customize)$/i;
function usefulNav(labels) {
	return labels.map(scrubPlatform).filter((label) => label.length > 1 && !MENU_NOISE.test(label));
}
function extractNav(html) {
	const page = stripChrome(html);
	const start = page.search(/id=["']primary-menu["']/i);
	const labels = [...(start >= 0 ? page.slice(start, start + 8e3) : page.match(/<nav\b[\s\S]*?<\/nav>/i)?.[0] ?? "").matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => stripTags(match[1] ?? "")).filter((label) => label.length > 1 && label.length < 28 && !MENU_NOISE.test(label));
	return [...new Set(labels)].slice(0, 7);
}
function extractStory(html) {
	const page = stripChrome(html);
	const box = page.match(/class=["'][^"']*elementor-image-box[^"']*["'][\s\S]{0,2200}/i)?.[0] ?? page.match(/<h1\b[\s\S]{0,700}/i)?.[0] ?? "";
	const descParts = (box.match(/image-box-description[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "").split(/<br\s*\/?>/i).map((part) => stripTags(part)).filter((part) => part.length > 2 && !MENU_NOISE.test(part));
	const button = stripTags(box.match(/<a\b[^>]*class=["'][^"']*button[^"']*["'][^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? "");
	const h1 = stripTags(page.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
	const image = box.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] ?? "";
	return {
		headline: descParts[0] || h1,
		action: button || descParts[1] || h1,
		image
	};
}
function extractImage(html, base) {
	const content = (html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i)?.[0] ?? html.match(/<meta[^>]+name=["']og:image["'][^>]*>/i)?.[0] ?? "").match(/\bcontent=["']([^"']+)["']/i)?.[1] ?? "";
	return content ? httpUrl(content, base) : "";
}
function sameHostLinks(html, base) {
	const found = [];
	const seen = /* @__PURE__ */ new Set();
	for (const match of html.matchAll(/<a\s[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
		let next;
		try {
			next = new URL(match[1] ?? "", base);
		} catch {
			continue;
		}
		if (next.protocol !== "http:" && next.protocol !== "https:") continue;
		if (next.hostname !== base.hostname) continue;
		if (!/about|service|product|pricing|company|solution|work|studio/i.test(next.pathname)) continue;
		next.hash = "";
		next.search = "";
		const key = next.toString();
		if (seen.has(key) || key === base.origin + base.pathname) continue;
		seen.add(key);
		found.push(next);
		if (found.length >= 1) break;
	}
	return found;
}
function paletteOf(value) {
	const name = typeof value === "string" ? value.toLowerCase().trim() : "";
	return (/* @__PURE__ */ new Set([
		"copper",
		"forest",
		"harbor",
		"plum",
		"clay"
	])).has(name) ? name : "copper";
}
function pictureBrief(name, headline, offer) {
	return {
		heroPrompt: `Editorial photograph of ${name}. ${headline}. Specific place, natural light, no people, no text, no logo.`,
		cardPrompt: `Close editorial photograph of ${offer || name}. Natural light, no text, no logo.`
	};
}
function takeWords(value, count) {
	return value.replace(/[.!?]+$/, "").split(/\s+/).filter(Boolean).slice(0, count).join(" ");
}
function sentencesOf(text, title) {
	let body = text.replace(/\s+/g, " ").trim();
	if (title && body.toLowerCase().startsWith(title.toLowerCase())) body = body.slice(title.length).trim();
	return body.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length >= 28 && sentence.length <= 280);
}
function fallbackDraft(host, title, description, headings, notes, text) {
	const name = (title.replace(/\s*[|\-–—].*$/, "").trim() || host).slice(0, 60);
	const lines = sentencesOf(text, title);
	const lead = lines[0] || description || `${name} needs one sentence at the top of the page.`;
	const fromHeadings = headings.filter((heading) => heading.length > 2).slice(0, 3);
	const points = fromHeadings.length >= 2 ? fromHeadings.map((heading, index) => ({
		title: heading.slice(0, 60),
		body: lines[index + 1] || lines[index] || lead
	})) : lines.slice(0, 3).map((sentence) => ({
		title: takeWords(sentence, 5).slice(0, 60),
		body: sentence.slice(0, 220)
	}));
	while (points.length < 2) points.push({
		title: notes ? "The change" : "The next step",
		body: (notes || lead).slice(0, 220)
	});
	const extra = lines.slice(3, 6);
	const steps = (extra.length ? extra : lines.slice(0, 3)).slice(0, 3).map((sentence, index) => ({
		title: [
			"Start",
			"Shape",
			"Launch"
		][index] ?? "Next",
		body: sentence.slice(0, 180)
	}));
	const pictures = pictureBrief(name, takeWords(lead, 10), points[0]?.title || name);
	return {
		diagnosis: description ? `The live page introduces itself as “${title || host}.” ${description}` : `The live page is titled “${title || host}.” ${lead}`,
		honored: notes ? [notes.slice(0, 180)] : ["Lead with the sentence the page already uses, and drop everything that competes with it."],
		heroPrompt: pictures.heroPrompt,
		cardPrompt: pictures.cardPrompt,
		draft: {
			name,
			kicker: host,
			headline: takeWords(lead, 10).slice(0, 90),
			subhead: (lines[1] || description || notes || lead).slice(0, 280),
			action: "Start here",
			nav: [
				"Offer",
				"How it works",
				"Contact"
			],
			palette: "harbor",
			points: points.slice(0, 3),
			promise: (notes || lines[1] || lead).slice(0, 160),
			steps,
			bandTitle: notes ? "Built around what you asked to change" : "One page, one offer",
			bandBody: (notes || lead).slice(0, 360),
			close: `${name}. The next version of the site you already have.`
		}
	};
}
function shapeModel(raw, host, title, description, headings, notes, text) {
	const base = fallbackDraft(host, title, description, headings, notes, text);
	if (!raw || typeof raw !== "object") return base;
	const record = raw;
	const draftRaw = record.draft && typeof record.draft === "object" ? record.draft : {};
	const points = (Array.isArray(draftRaw.points) ? draftRaw.points : []).map((point) => {
		if (!point || typeof point !== "object") return null;
		const item = point;
		const pointTitle = clip(item.title, 60);
		const body = clip(item.body, 220);
		if (!pointTitle || !body) return null;
		return {
			title: pointTitle,
			body
		};
	}).filter((point) => Boolean(point)).slice(0, 3);
	const honored = (Array.isArray(record.honored) ? record.honored : []).map((item) => clip(item, 180)).filter(Boolean).slice(0, 3);
	const nav = (Array.isArray(draftRaw.nav) ? draftRaw.nav : []).map((item) => clip(item, 24)).filter(Boolean).slice(0, 4);
	const steps = (Array.isArray(draftRaw.steps) ? draftRaw.steps : []).map((point) => {
		if (!point || typeof point !== "object") return null;
		const item = point;
		const stepTitle = clip(item.title, 40);
		const body = clip(item.body, 160);
		if (!stepTitle || !body) return null;
		return {
			title: stepTitle,
			body
		};
	}).filter((point) => Boolean(point)).slice(0, 3);
	const pictures = pictureBrief(base.draft.name, base.draft.headline, base.draft.points[0]?.title || base.draft.name);
	return {
		diagnosis: clip(record.diagnosis, 420) || base.diagnosis,
		honored: honored.length ? honored : base.honored,
		heroPrompt: clip(draftRaw.heroPrompt, 400) || pictures.heroPrompt,
		cardPrompt: clip(draftRaw.cardPrompt, 400) || pictures.cardPrompt,
		draft: {
			name: clip(draftRaw.name, 60) || base.draft.name,
			kicker: clip(draftRaw.kicker, 48) || base.draft.kicker,
			headline: clip(draftRaw.headline, 110) || base.draft.headline,
			subhead: clip(draftRaw.subhead, 320) || base.draft.subhead,
			action: clip(draftRaw.action, 28) || base.draft.action,
			nav: nav.length ? nav : base.draft.nav,
			palette: paletteOf(record.palette),
			points: points.length >= 2 ? points : base.draft.points,
			promise: clip(draftRaw.promise, 180) || base.draft.promise,
			steps: steps.length >= 2 ? steps : base.draft.steps,
			bandTitle: clip(draftRaw.bandTitle, 80) || base.draft.bandTitle,
			bandBody: clip(draftRaw.bandBody, 360) || base.draft.bandBody,
			close: clip(draftRaw.close, 180) || base.draft.close
		}
	};
}
async function askGrok(payload) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("AI is not available");
	const body = {
		model: "grok-4.5",
		temperature: .5,
		max_tokens: 2200,
		messages: [{
			role: "system",
			content: "You are Grok Build, designing a finished homepage, not a wireframe. Reimago shows this draft to the customer. Return JSON only, no markdown. Shape: {\"diagnosis\":\"2 sentences grounded only in the crawl\",\"honored\":[\"up to 3 changes made because of the notes\"],\"palette\":\"copper|forest|harbor|plum|clay\",\"draft\":{\"name\":\"\",\"kicker\":\"short label\",\"headline\":\"under 10 words, a claim a stranger can repeat\",\"subhead\":\"under 36 words, specific to this business\",\"action\":\"2 or 3 words\",\"nav\":[\"\",\"\",\"\"],\"promise\":\"one sentence outcome\",\"points\":[{\"title\":\"a real part of the offer\",\"body\":\"under 28 words\"},{\"title\":\"\",\"body\":\"\"},{\"title\":\"\",\"body\":\"\"}],\"steps\":[{\"title\":\"2 words\",\"body\":\"under 18 words\"},{\"title\":\"\",\"body\":\"\"},{\"title\":\"\",\"body\":\"\"}],\"bandTitle\":\"\",\"bandBody\":\"2 sentences\",\"close\":\"one sentence\",\"heroPrompt\":\"one sentence, a photograph of the real place or product, no text in the picture\",\"cardPrompt\":\"one sentence, a close photograph of the main offer, no text in the picture\"}}. The three points must be three different parts of the business, not synonyms. The steps are how a customer starts, in order. If change notes exist, the headline and the first point must show that change. Use the customer's nouns. Never write elevate, seamless, cutting-edge, solutions, unlock, empower, or next-gen. Do not invent statistics, awards, client names, testimonials, prices, or compliance claims that are not in the crawl. Photographs must not contain letters, logos, or watermarks. Write in the customer's voice, not as Reimago or Grok. No emoji."
		}, {
			role: "user",
			content: JSON.stringify({
				url: payload.url,
				title: payload.title,
				description: payload.description,
				headings: payload.headings.slice(0, 12),
				text: payload.text.slice(0, 5e3),
				changeNotes: payload.notes || "(none — tighten the homepage anyway)",
				template: payload.template,
				instruction: payload.template === "yours" ? "Keep their business name, the headline already on the page, and their real navigation. Reorganize the content so the page is clearer and more compelling. Do not invent another company or domain. Never mention WordPress, the toolbar, themes, or powered-by." : payload.wordpress ? "The page was on WordPress. Never mention WordPress, themes, plugins, or powered-by. Ignore sample pages and theme chrome. Read the real content and reorganize it into a clearer homepage with one offer and the actual parts of the work. Keep the business name." : ""
			})
		}]
	};
	const call = async () => {
		const response = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(25e3)
		});
		if (!response.ok) {
			const err = /* @__PURE__ */ new Error(`xAI API error ${response.status}`);
			err.status = response.status;
			throw err;
		}
		return (await response.json()).choices?.[0]?.message?.content ?? "";
	};
	let text = "";
	try {
		text = await call();
	} catch (error) {
		const status = error.status ?? 0;
		if (status !== 429 && status < 500) throw error;
		text = await call();
	}
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("The draft came back unreadable.");
	return JSON.parse(text.slice(start, end + 1));
}
function rateLimited(key) {
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < 36e5);
	if (recent.length >= 6) {
		hits.set(key, recent);
		return true;
	}
	recent.push(now);
	hits.set(key, recent);
	return false;
}
var PHOTO = {
	yours: "A clear photograph of the place or product already described, daylight, no text.",
	organization: "Documentary photograph of a community room or people working together, natural light.",
	technology: "Product photograph of a matte device on a dark desk, cool light, screen glow with no readable text.",
	restaurant: "Editorial photograph of a plated dish and a warm dining room.",
	professional: "Quiet photograph of a conference table in a calm office, no readable papers.",
	shop: "Retail still life of one product on a clean surface, soft shadow.",
	local: "Daylight photograph of finished trade work or a small storefront, no signage text."
};
async function imagine(prompt, aspect, template, plain = false) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey || !prompt) return void 0;
	try {
		const response = await fetch("https://api.x.ai/v1/images/generations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-imagine-image-2.0",
				prompt: plain ? `${prompt} Plain white background. No border. No watermark.` : `${prompt} ${PHOTO[template]} No letters, no logo, no watermark.`,
				aspect_ratio: aspect,
				resolution: "1k",
				quality: "low",
				response_format: "b64_json",
				n: 1
			}),
			signal: AbortSignal.timeout(4e4)
		});
		if (!response.ok) return void 0;
		const encoded = (await response.json()).data?.[0]?.b64_json;
		if (!encoded) return void 0;
		return `data:image/jpeg;base64,${encoded}`;
	} catch {
		return;
	}
}
async function logoSource(url) {
	if (!url || url.startsWith("data:")) return url.startsWith("data:image/") ? url : void 0;
	try {
		const response = await fetch(url, {
			headers: { "User-Agent": "Reimago-reimagine/1.0" },
			signal: AbortSignal.timeout(3e4),
			redirect: "follow"
		});
		if (!response.ok) return void 0;
		const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
		if (!/^image\/(png|jpeg|jpg|webp|gif)$/.test(type)) return void 0;
		const bytes = Buffer.from(await response.arrayBuffer());
		if (bytes.length < 32 || bytes.length > 15e5) return void 0;
		return `data:${type === "image/jpg" ? "image/jpeg" : type};base64,${bytes.toString("base64")}`;
	} catch {
		return;
	}
}
async function imagineRendition(prompt, logoUrl) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey || !prompt) return void 0;
	const logo = logoUrl ? await logoSource(logoUrl) : void 0;
	const usingLogo = Boolean(logo);
	try {
		const response = await fetch(usingLogo ? "https://api.x.ai/v1/images/edits" : "https://api.x.ai/v1/images/generations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-imagine-image-2.0",
				prompt: usingLogo ? `${prompt} The source image is the site's real logo. Keep that logo exactly as it is, in the top-left of the header. Do not redraw, recolor, or replace the mark.` : prompt,
				...usingLogo ? { image: {
					url: logo,
					type: "image_url"
				} } : {},
				aspect_ratio: "16:9",
				resolution: "1k",
				quality: "low",
				response_format: "url",
				n: 1
			}),
			signal: AbortSignal.timeout(3e4)
		});
		if (!response.ok) {
			console.error("[reimagine] imagine", response.status, await response.text());
			if (!usingLogo) return void 0;
			return imagineRendition(prompt);
		}
		const url = (await response.json()).data?.[0]?.url;
		if (!url) return void 0;
		const image = await fetch(url, { signal: AbortSignal.timeout(2e4) });
		if (!image.ok) return url;
		const bytes = Buffer.from(await image.arrayBuffer());
		return `data:${image.headers.get("content-type") || "image/jpeg"};base64,${bytes.toString("base64")}`;
	} catch (error) {
		console.error("[reimagine] imagine failed", error instanceof Error ? error.message : error);
		if (usingLogo) return imagineRendition(prompt);
		return;
	}
}
async function anotherRendition(draft) {
	return imagineRendition(`${renditionPrompt(draft, draft.template ?? "yours")} A new composition, different from the last picture.`, draft.logo);
}
function renditionPrompt(draft, template) {
	const sections = draft.points.map((point) => `${point.title}: ${point.body}`).join(" ");
	const look = {
		yours: "Their own site, made clearer and more beautiful.",
		organization: "A warm nonprofit homepage with a mission and a join button.",
		technology: "A dark, precise product homepage.",
		restaurant: "A restaurant homepage with food photography and a short menu.",
		professional: "A calm white firm homepage with thin rules.",
		shop: "A shop homepage with a large product and a buy button.",
		local: "A local-service homepage with a bold headline and three services."
	};
	const change = draft.change?.trim();
	const asked = change ? ` What should change: ${change}. Show that change in the page.` : "";
	return `A beautiful finished website homepage, full frame, the page itself, not a laptop and not a wireframe. ${look[template]} Name: ${draft.name}. Navigation: ${draft.nav.join(", ")}. Headline: ${draft.headline}. Supporting line: ${draft.subhead}. Button: ${draft.action}. Sections: ${sections}.${asked} Use those words. No WordPress. No lorem ipsum. No watermark.`;
}
async function runReimagine(input) {
	try {
		let ip = "anonymous";
		try {
			ip = getRequestIP$1({ xForwardedFor: true }) ?? "anonymous";
		} catch {
			ip = "anonymous";
		}
		if (rateLimited(ip)) return {
			ok: false,
			error: "Too many drafts from this network in the last hour. Try again shortly."
		};
		const startUrl = normalizeInput(input.url);
		await assertPublic(startUrl);
		let note;
		const template = chosenTemplate(input.template);
		const cacheKey = `${startUrl.toString()}|${input.notes.toLowerCase()}|v8`;
		let live = true;
		let finalUrl = startUrl.toString();
		let title = "";
		let description = "";
		let headings = [];
		let text = "";
		let logo = "";
		let ownImage = "";
		let crawledNav = [];
		let wordpress = false;
		let story = {
			headline: "",
			action: "",
			image: ""
		};
		try {
			const page = await fetchPage(startUrl, 3e4);
			finalUrl = page.url;
			const main = extract(page.html);
			title = main.title;
			description = main.description;
			headings = [...main.headings];
			text = main.text;
			logo = extractLogo(page.html, page.url);
			ownImage = extractImage(page.html, page.url);
			crawledNav = extractNav(page.html);
			story = extractStory(page.html);
			if (story.image) {
				const picture = httpUrl(story.image, page.url);
				if (picture && picture !== logo) ownImage = picture;
			}
			wordpress = isWordPress(page.html);
			title = scrubPlatform(title);
			description = scrubPlatform(description);
			headings = headings.map(scrubPlatform).filter((heading) => heading.length > 1 && !MENU_NOISE.test(heading) && !/shopping cart/i.test(heading));
			text = scrubPlatform(text);
			crawledNav = usefulNav(crawledNav);
			if (wordpress && /wp-includes|wordpress\.org|w-logo|wordpress-logo/i.test(logo)) logo = "";
			const extra = sameHostLinks(page.html, new URL(page.url))[0];
			if (extra) try {
				const more = extract((await fetchPage(extra, 3e4)).html);
				if (more.headings.length) headings = [...headings, ...more.headings].slice(0, 16);
				if (more.text) text = `${text}\n${more.text}`.slice(0, 7e3);
			} catch {}
		} catch (error) {
			if (!REIMAGO_HOSTS.has(startUrl.hostname)) throw error;
			live = false;
			title = REIMAGO_SNAPSHOT.title;
			description = REIMAGO_SNAPSHOT.description;
			headings = REIMAGO_SNAPSHOT.headings;
			text = REIMAGO_SNAPSHOT.text;
			note = "reimago.ai did not answer in time, so this draft uses the public homepage copy already on file. Nothing on the live domain was changed.";
		}
		if (text.length < 40 && !REIMAGO_HOSTS.has(startUrl.hostname)) return {
			ok: false,
			error: "That page did not include enough public text to draft from."
		};
		if (text.length < 40 && REIMAGO_HOSTS.has(startUrl.hostname)) {
			title = REIMAGO_SNAPSHOT.title;
			description = REIMAGO_SNAPSHOT.description;
			headings = REIMAGO_SNAPSHOT.headings;
			text = REIMAGO_SNAPSHOT.text;
			live = false;
			note = "The live page had almost no readable text, so this draft uses the public homepage copy already on file.";
		}
		const host = new URL(finalUrl).hostname;
		let source = "grok";
		let shaped;
		try {
			shaped = shapeModel(await askGrok({
				url: finalUrl,
				title,
				description,
				headings,
				text,
				notes: input.notes,
				template,
				wordpress
			}), host, title, description, headings, input.notes, text);
		} catch (error) {
			console.error("[reimagine] grok failed", error instanceof Error ? error.message : error);
			source = "crawl";
			shaped = fallbackDraft(host, title, description, headings, input.notes, text);
			note = note ? `${note} The writing model did not accept the request, so the draft was composed from the page text.` : "The writing model did not accept the request, so this draft was composed from the page text.";
		}
		shaped.diagnosis = scrubPlatform(shaped.diagnosis);
		shaped.honored = shaped.honored.map(scrubPlatform).filter(Boolean);
		const draft = shaped.draft;
		draft.name = scrubPlatform(draft.name);
		draft.kicker = scrubPlatform(draft.kicker);
		draft.headline = scrubPlatform(draft.headline);
		draft.subhead = scrubPlatform(draft.subhead);
		draft.action = scrubPlatform(draft.action);
		draft.bandTitle = scrubPlatform(draft.bandTitle);
		draft.bandBody = scrubPlatform(draft.bandBody);
		draft.close = scrubPlatform(draft.close);
		if (draft.promise) draft.promise = scrubPlatform(draft.promise);
		draft.nav = usefulNav(draft.nav);
		draft.points = draft.points.map((point) => ({
			title: scrubPlatform(point.title),
			body: scrubPlatform(point.body)
		})).filter((point) => point.title && point.body);
		draft.steps = (draft.steps ?? []).map((step) => ({
			title: scrubPlatform(step.title),
			body: scrubPlatform(step.body)
		})).filter((step) => step.title && step.body);
		if (logo) shaped.draft.logo = logo;
		if (template === "yours") {
			const brand = scrubPlatform(title.split(/\s+[|\-–—]\s+/)[0] ?? "").slice(0, 60);
			const tagline = scrubPlatform(title.split(/\s+[|\-–—]\s+/).slice(1).join(" — ")).slice(0, 80);
			if (brand) shaped.draft.name = brand;
			if (story.headline) shaped.draft.headline = story.headline.slice(0, 110);
			if (story.action) shaped.draft.action = story.action.slice(0, 28);
			if (crawledNav.length >= 2) shaped.draft.nav = crawledNav.slice(0, 5);
			const domainOnly = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(shaped.draft.kicker.trim());
			if (tagline && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(tagline)) shaped.draft.kicker = tagline;
			else if (domainOnly || /about\.org/i.test(shaped.draft.kicker)) shaped.draft.kicker = "";
			if (ownImage) shaped.draft.heroImage = ownImage;
		} else if (crawledNav.length >= 2 && !wordpress) shaped.draft.nav = shaped.draft.nav.length ? shaped.draft.nav : crawledNav;
		const logoJob = template === "yours" && !logo ? imagine(`A simple horizontal wordmark. The only text is "${(shaped.draft.name || host).replace(/"/g, "")}". Black letters on white. One line. No icon. No slogan.`, "16:9", "yours", true) : Promise.resolve(void 0);
		if (input.notes.trim()) shaped.draft.change = input.notes.trim().slice(0, 800);
		const [rendition, made] = await Promise.all([imagineRendition(`${renditionPrompt(shaped.draft, template)} A new composition. Variation ${Date.now()}.`, logo || void 0), logoJob]);
		if (rendition) shaped.draft.rendition = rendition;
		if (made) shaped.draft.logo = made;
		const value = {
			ok: true,
			source,
			live,
			finalUrl,
			host,
			foundTitle: title || host,
			foundDescription: description,
			diagnosis: shaped.diagnosis,
			honored: shaped.honored,
			draft: shaped.draft,
			note
		};
		cache.set(cacheKey, {
			at: Date.now(),
			value
		});
		return withTemplate(value, template);
	} catch (error) {
		const message = error instanceof Error ? error.message : "The draft could not be made.";
		if (/fetch failed|aborted|timeout|Timeout/i.test(message)) return {
			ok: false,
			error: "That site did not respond in time. Check the address and try again."
		};
		return {
			ok: false,
			error: message
		};
	}
}
//#endregion
export { anotherRendition, runReimagine };
