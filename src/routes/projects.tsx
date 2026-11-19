import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/wheel-loader.jpg";
import { projects } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { CtaBand, PageHero } from "@/components/site/blocks";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects | Miller Piller" }, { name: "description", content: "A selection of earthworks, material handling and site preparation projects delivered by Miller Piller." }, { property: "og:title", content: "Projects | Miller Piller" }, { property: "og:description", content: "A selection of earthworks, material handling and site preparation projects delivered by Miller Piller." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Projects,
});

function Projects() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHero title={t("projects")} image={hero} />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <figure key={p.title.en} className="card-surface overflow-hidden">
              <img src={p.image} alt={p.title[lang]} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="p-4"><h3 className="text-xl font-bold text-navy">{p.title[lang]}</h3><p className="text-sm text-muted-foreground">{p.place[lang]}</p></figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{t("placeholderNote")}</p>
      </section>
      <CtaBand />
    </>
  );
}
