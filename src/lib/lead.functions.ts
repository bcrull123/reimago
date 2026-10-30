import { createServerFn } from "@tanstack/react-start";

export const sendLeadEmail = createServerFn({ method: "POST" })
  .validator((input: { url?: string; email?: string; notes?: string }) => {
    const url = typeof input?.url === "string" ? input.url.trim() : "";
    const email = typeof input?.email === "string" ? input.email.trim() : "";
    const notes = typeof input?.notes === "string" ? input.notes.trim().slice(0, 800) : "";
    if (!url || url.length > 300) throw new Error("Enter a website address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      throw new Error("Enter an email so the studio can reply.");
    }
    return { url, email, notes };
  })
  .handler(async ({ data }) => {
    const { sendLead } = await import("./lead.server");
    return sendLead(data);
  });
