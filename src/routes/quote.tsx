import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import hero from "@/assets/hero-excavator.jpg";
import { equipment } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { quoteSchema, submitQuote } from "@/lib/quote.functions";
import { PageHero } from "@/components/site/blocks";

export const Route = createFileRoute("/quote")({
  validateSearch: (s) => z.object({ equipment: z.string().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Request a Quote | Miller Piller" }, { name: "description", content: "Request a quote for heavy equipment rental or contracting works from Miller Piller." }, { property: "og:title", content: "Request a Quote | Miller Piller" }, { property: "og:description", content: "Request a quote for heavy equipment rental or contracting works from Miller Piller." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Quote,
});

function Quote() {
  const { t, lang } = useI18n();
  const { equipment: pre } = Route.useSearch();
  const send = useServerFn(submitQuote);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = quoteSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), true])));
      return;
    }
    setErrors({}); setState("sending");
    try { await send({ data: parsed.data }); setState("done"); } catch { setState("error"); }
  }

  const f = (name: string, label: string, props: Record<string, unknown> = {}) => (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-navy">{label}</span>
      <input name={name} className={`field ${errors[name] ? "border-destructive" : ""}`} {...props} />
      {errors[name] && <span className="text-xs text-destructive">{lang === "ar" ? "يرجى التحقق من هذا الحقل" : "Please check this field"}</span>}
    </label>
  );

  return (
    <>
      <PageHero title={t("quote")} text={t("ctaText")} image={hero} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        {state === "done" ? (
          <div className="card-surface p-10 text-center">
            <CheckCircle2 className="mx-auto text-success" size={56} />
            <h2 className="mt-4 text-3xl font-bold text-navy">{t("thanks")}</h2>
            <p className="mt-2 text-muted-foreground">{t("thanksSub")}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="card-surface grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            {f("full_name", t("fullName"), { autoComplete: "name" })}
            {f("company", t("company"))}
            {f("phone", t("phone"), { type: "tel", dir: "ltr", autoComplete: "tel" })}
            {f("email", t("email"), { type: "email", dir: "ltr", autoComplete: "email" })}
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-navy">{t("equipmentNeeded")}</span>
              <select name="equipment" defaultValue={pre ?? ""} className={`field ${errors["equipment"] ? "border-destructive" : ""}`}>
                <option value="">—</option>
                {equipment.map((e) => <option key={e.slug} value={e.slug}>{e.name[lang]}</option>)}
                <option value="other">{lang === "ar" ? "أخرى" : "Other"}</option>
              </select>
            </label>
            {f("location", t("location"))}
            {f("start_date", t("startDate"), { type: "date" })}
            {f("duration", t("duration"))}
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-semibold text-navy">{t("message")}</span>
              <textarea name="message" rows={4} maxLength={2000} className="field" />
            </label>
            {state === "error" && <p className="text-sm text-destructive sm:col-span-2">{lang === "ar" ? "تعذر الإرسال، حاول مرة أخرى." : "Could not send, please try again."}</p>}
            <button disabled={state === "sending"} className="btn btn-primary sm:col-span-2">{state === "sending" ? t("sending") : t("submit")}</button>
          </form>
        )}
      </section>
    </>
  );
}
