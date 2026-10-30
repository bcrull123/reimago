import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reimagine.functions-CFV6c-YR.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var reimagineSite_createServerFn_handler = createServerRpc({
	id: "6ed31822d18ad0c4481c42f25ba62ff2a8d2db28eb723af9f31fd8e5f3ef507c",
	name: "reimagineSite",
	filename: "src/lib/reimagine.functions.ts"
}, (opts) => reimagineSite.__executeServer(opts));
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
}).handler(reimagineSite_createServerFn_handler, async ({ data }) => {
	const { runReimagine } = await import("./reimagine.server-OPdHpk2o.mjs");
	return runReimagine(data);
});
var retryRendition_createServerFn_handler = createServerRpc({
	id: "fa82025bad8b1ecf85516c72e68caa5c319479cebebd0b86948ed1df6ce15422",
	name: "retryRendition",
	filename: "src/lib/reimagine.functions.ts"
}, (opts) => retryRendition.__executeServer(opts));
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
}).handler(retryRendition_createServerFn_handler, async ({ data }) => {
	const { anotherRendition } = await import("./reimagine.server-OPdHpk2o.mjs");
	const image = await anotherRendition(data.draft);
	if (!image) return {
		ok: false,
		error: "Imagine did not return a new rendering."
	};
	return {
		ok: true,
		image
	};
});
//#endregion
export { reimagineSite_createServerFn_handler, retryRendition_createServerFn_handler };
