import { env } from "@/lib/env.server";
import type { DomainCheck, DomainOffer, DomainState } from "@/lib/logicboxes-types";

export type { DomainOffer };

const TLD_ORDER = ["com", "net", "org", "us", "info", "biz", "co", "io"] as const;
const DEFAULT_PROXY = "https://secure.webhero.com/api/logicboxes.php";

type ProxyBody = {
  ok?: boolean;
  status?: number;
  data?: unknown;
  error?: string;
};

export function secondLevel(input: string): string | null {
  let host = input.trim().toLowerCase();
  host = host.replace(/^https?:\/\//, "");
  host = host.replace(/[/?#].*$/, "");
  host = host.replace(/:\d+$/, "");
  host = host.replace(/^www\./, "");
  if (!host || host.includes("..") || host.startsWith("-") || host.endsWith("-")) return null;
  const label = host.split(".")[0] ?? "";
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) return null;
  return label;
}

export function classifyOffer(domain: string, value: unknown): DomainOffer {
  if (typeof value === "string") {
    const status = value.toLowerCase();
    if (status === "available") return { domain, state: "available" };
    if (status === "regthroughus" || status === "regthroughothers") return { domain, state: "taken" };
    return { domain, state: "unknown" };
  }
  if (!value || typeof value !== "object") return { domain, state: "unknown" };
  const row = value as { status?: unknown; costHash?: unknown };
  const status = typeof row.status === "string" ? row.status.toLowerCase() : "";
  if (status === "available" && row.costHash != null && typeof row.costHash === "object") {
    return { domain, state: "premium" };
  }
  if (status === "available") return { domain, state: "available" };
  if (status === "regthroughus" || status === "regthroughothers") return { domain, state: "taken" };
  return { domain, state: "unknown" };
}

function offersFromData(name: string, data: unknown): DomainOffer[] {
  const rows = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  return TLD_ORDER.map((tld) => {
    const domain = `${name}.${tld}`;
    return classifyOffer(domain, rows[domain]);
  });
}

async function callProxy(token: string, params: Record<string, string[]>): Promise<unknown> {
  const url = env("LOGICBOXES_PROXY_URL") || DEFAULT_PROXY;
  let lastError = "The domain check did not answer.";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-Key": token,
        },
        body: JSON.stringify({
          env: "live",
          method: "GET",
          endpoint: "domains/available.json",
          params,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const json = (await response.json().catch(() => null)) as ProxyBody | null;
      if (response.status === 401) throw new Error("The domain check was refused.");
      if (response.status === 403) throw new Error("That domain check is not allowed.");
      if (response.status === 400) throw new Error("The domain check was rejected.");
      if (!response.ok || !json) {
        lastError = "The domain check did not answer.";
        continue;
      }
      const data = json.data;
      if (data && typeof data === "object" && "status" in data && (data as { status?: unknown }).status === "ERROR") {
        throw new Error("The registrar could not check that name.");
      }
      return data;
    } catch (error) {
      if (error instanceof Error && /refused|not allowed|rejected|could not check/.test(error.message)) throw error;
      lastError = "The domain check did not answer.";
    }
  }
  throw new Error(lastError);
}

export async function checkDomainAvailability(raw: string): Promise<DomainCheck> {
  const name = secondLevel(raw);
  if (!name) throw new Error("Enter a domain name, like northline.com.");
  const token = env("LOGICBOXES_PROXY_TOKEN");
  if (!token) {
    const sample: DomainState[] = ["taken", "available", "premium", "available", "taken", "available", "unknown", "available"];
    return {
      sample: true,
      note: "The token is not set. This is a sample, not a live check.",
      offers: TLD_ORDER.map((tld, index) => ({ domain: `${name}.${tld}`, state: sample[index] ?? "unknown" })),
    };
  }
  const data = await callProxy(token, {
    "domain-name": TLD_ORDER.map(() => name),
    tlds: [...TLD_ORDER],
  });
  return { sample: false, note: "", offers: offersFromData(name, data) };
}
