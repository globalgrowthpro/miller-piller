import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/telehandler.jpg";
import { services } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { CtaBand, PageHero } from "@/components/site/blocks";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Services | Miller Piller" }, { name: "description", content: "Heavy equipment rental, contracting works and site support services from Miller Piller." }, { property: "og:title", content: "Services | Miller Piller" }, { property: "og:description", content: "Heavy equipment rental, contracting works and site support services from Miller Piller." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Services,
});

function Services() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHero title={t("services")} image={hero} />
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-14">
        {services.map((s, i) => (
          <div key={s.slug} className={`card-surface grid overflow-hidden md:grid-cols-2 ${i % 2 ? "md:[&>img]:order-2" : ""}`}>
            <img src={s.image} alt={s.title[lang]} loading="lazy" className="h-full max-h-80 w-full object-cover" />
            <div className="flex flex-col justify-center p-8">
              <h2 className="text-3xl font-bold text-navy">{s.title[lang]}</h2>
              <p className="mt-3 text-muted-foreground">{s.text[lang]}</p>
              <Link to="/quote" className="btn btn-primary mt-6 self-start">{t("requestQuote")}</Link>
            </div>
          </div>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
