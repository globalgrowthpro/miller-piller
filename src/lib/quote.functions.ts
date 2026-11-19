import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const quoteSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,19}$/),
  email: z.string().trim().email().max(255),
  equipment: z.string().trim().min(1).max(120),
  location: z.string().trim().min(2).max(200),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  duration: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => quoteSchema.parse(d))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const sb = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      global: { fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      } },
    });
    const { error } = await sb.from("quote_requests").insert({
      ...data,
      company: data.company || null, start_date: data.start_date || null,
      duration: data.duration || null, message: data.message || null,
    });
    if (error) throw new Error("Could not save request");
    return { ok: true };
  });
