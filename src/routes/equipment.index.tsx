import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";
import hero from "@/assets/wheel-loader.jpg";
import { categories, equipment } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { EquipmentCard, PageHero } from "@/components/site/blocks";

const searchSchema = z.object({ q: z.string().optional(), category: z.string().optional() });

export const Route = createFileRoute("/equipment/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Equipment Catalog | Miller Piller" }, { name: "description", content: "Browse telehandlers, forklifts, excavators, loaders and trucks available for rental from Miller Piller." }, { property: "og:title", content: "Equipment Catalog | Miller Piller" }, { property: "og:description", content: "Browse telehandlers, forklifts, excavators, loaders and trucks available for rental from Miller Piller." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Catalog,
});

function Catalog() {
  const { t, lang } = useI18n();
  const { q = "", category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const term = q.trim().toLowerCase();
  const list = equipment.filter((e) => (!category || e.category === category) &&
    (!term || e.name.en.toLowerCase().includes(term) || e.name.ar.includes(term) || e.summary[lang].toLowerCase().includes(term)));
  const chip = (active: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`;
  return (
    <>
      <PageHero title={t("equipment")} text={t("heroText")} image={hero} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="relative mb-4">
          <Search className="absolute top-1/2 -translate-y-1/2 text-muted-foreground start-3" size={18} />
          <input value={q} onChange={(e) => navigate({ search: (s) => ({ ...s, q: e.target.value || undefined }), replace: true })}
            placeholder={t("search")} className="field ps-10" />
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          <Link to="/equipment" search={{ q: q || undefined, category: undefined }} className={chip(!category)}>{t("all")}</Link>
          {categories.map((c) => (
            <Link key={c.slug} to="/equipment" search={{ q: q || undefined, category: c.slug }} className={chip(category === c.slug)}>{c.name[lang]}</Link>
          ))}
        </div>
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <EquipmentCard key={e.slug} item={e} />)}</div>
        ) : <p className="card-surface p-10 text-center text-muted-foreground">{t("noResults")}</p>}
      </section>
    </>
  );
}
