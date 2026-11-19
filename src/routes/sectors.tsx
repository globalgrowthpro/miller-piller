import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import hero from "@/assets/hero-excavator.jpg";
import { sectors } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { CtaBand, PageHero } from "@/components/site/blocks";

export const Route = createFileRoute("/sectors")({
  head: () => ({ meta: [{ title: "Sectors We Serve | Miller Piller" }, { name: "description", content: "Construction, infrastructure, oil and gas, industrial and government sectors served by Miller Piller." }, { property: "og:title", content: "Sectors We Serve | Miller Piller" }, { property: "og:description", content: "Construction, infrastructure, oil and gas, industrial and government sectors served by Miller Piller." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Sectors,
});

function Sectors() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHero title={t("sectors")} image={hero} />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s) => (
          <div key={s.en} className="card-surface flex items-center gap-4 p-6">
            <span className="bg-gradient-primary grid h-12 w-12 shrink-0 place-items-center rounded-xl text-primary-foreground"><Building2 /></span>
            <h3 className="text-xl font-bold text-navy">{s[lang]}</h3>
          </div>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
