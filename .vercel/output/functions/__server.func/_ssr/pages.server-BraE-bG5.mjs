import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
//#region node_modules/.nitro/vite/services/ssr/assets/pages.server-BraE-bG5.js
var DIR = join(tmpdir(), "reimago-pages");
async function readPage(id) {
	if (!/^[a-f0-9]{16}$/.test(id)) return void 0;
	try {
		return await readFile(join(DIR, `${id}.html`), "utf8");
	} catch {
		return;
	}
}
//#endregion
export { readPage };
