import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Timer, Wrench } from "lucide-react";
import hero from "@/assets/hero-excavator.jpg";
import { useI18n } from "@/lib/i18n";
import { CtaBand, PageHero, SectionTitle } from "@/components/site/blocks";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us | Miller Piller" }, { name: "description", content: "Learn about Miller Piller, a contracting and equipment trade company serving construction and industrial projects." }, { property: "og:title", content: "About Us | Miller Piller" }, { property: "og:description", content: "Learn about Miller Piller, a contracting and equipment trade company serving construction and industrial projects." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: About,
});

function About() {
  const { t, lang } = useI18n();
  const ar = lang === "ar";
  const values = [
    [ShieldCheck, ar ? "السلامة أولاً" : "Safety first", ar ? "معايير سلامة صارمة في كل موقع." : "Strict safety standards on every site."],
    [Timer, ar ? "الالتزام بالمواعيد" : "On-time delivery", ar ? "تسليم المعدات في الوقت المحدد." : "Equipment delivered when you need it."],
    [Wrench, ar ? "صيانة دورية" : "Maintained fleet", ar ? "أسطول يخضع لصيانة منتظمة." : "A regularly serviced fleet."],
  ] as const;
  return (
    <>
      <PageHero title={t("about")} image={hero} />
      <section className="mx-auto max-w-4xl px-4 py-14">
        <SectionTitle>{ar ? "مؤسسة ميلر بيلر للمقاولات العامة وتجارة المعدات" : "Miller Piller Contracting & Equipment Trade"}</SectionTitle>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {ar ? "نقدم خدمات تأجير المعدات الثقيلة وأعمال المقاولات العامة لقطاعات البناء والبنية التحتية والصناعة، مع فريق من المشغلين ذوي الخبرة." : "We provide heavy equipment rental and general contracting services to construction, infrastructure and industrial sectors, backed by a team of experienced operators."}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{t("placeholderNote")}</p>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-14 md:grid-cols-3">
        {values.map(([Icon, h, p]) => (
          <div key={h} className="card-surface p-6"><Icon className="text-primary" size={32} /><h3 className="mt-3 text-xl font-bold text-navy">{h}</h3><p className="mt-1 text-muted-foreground">{p}</p></div>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
