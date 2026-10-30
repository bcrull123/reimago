import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DIR = join(tmpdir(), "reimago-pages");

export async function savePage(html: string): Promise<string> {
  const id = randomBytes(8).toString("hex");
  await mkdir(DIR, { recursive: true });
  await writeFile(join(DIR, `${id}.html`), html, "utf8");
  return id;
}

export async function readPage(id: string): Promise<string | undefined> {
  if (!/^[a-f0-9]{16}$/.test(id)) return undefined;
  try {
    return await readFile(join(DIR, `${id}.html`), "utf8");
  } catch {
    return undefined;
  }
}
