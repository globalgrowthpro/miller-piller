import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, HardHat, Headphones, Search } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-excavator.jpg";
import { categories, equipment, projects, sectors, services } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { CtaBand, EquipmentCard, SectionTitle, StatsBand } from "@/components/site/blocks";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Miller Piller | Heavy Equipment Rental & Contracting" }, { name: "description", content: "Miller Piller rents heavy equipment with skilled operators and delivers excavation and site preparation works." }, { property: "og:title", content: "Miller Piller | Heavy Equipment Rental & Contracting" }, { property: "og:description", content: "Miller Piller rents heavy equipment with skilled operators and delivers excavation and site preparation works." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const features = [[Clock, "modern", "modernSub"], [HardHat, "operators", "operatorsSub"], [Headphones, "support", "supportSub"]] as const;
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="bg-hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <h1 className="max-w-2xl text-5xl font-bold leading-tight text-navy-foreground sm:text-6xl">
            {t("heroTitle1")}<br /><span className="text-primary">{t("heroTitle2")}</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-navy-foreground/85">{t("heroText")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quote" className="btn btn-primary">{t("quote")} <ArrowRight size={18} className="flip-rtl" /></Link>
            <Link to="/equipment" className="btn btn-outline text-navy-foreground">{t("browse")}</Link>
          </div>
        </div>
      </section>
      <section className="bg-navy">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-navy-foreground/15 px-4 sm:grid-cols-3 sm:divide-x rtl:sm:divide-x-reverse">
          {features.map(([Icon, a, b]) => (
            <div key={a} className="flex items-center justify-center gap-3 py-5 text-navy-foreground">
              <Icon className="text-primary" size={30} />
              <div><p className="font-bold">{t(a)}</p><p className="text-sm text-navy-foreground/70">{t(b)}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/equipment", search: { q, category: undefined } }); }}
          className="card-surface relative mb-14 flex gap-2 p-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 text-muted-foreground start-3" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="field ps-10" />
          </div>
          <button className="btn btn-primary">{lang === "ar" ? "بحث" : "Search"}</button>
        </form>

        <SectionTitle>{t("ourServices")}</SectionTitle>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s) => (
            <Link key={s.slug} to="/services" className="card-surface group overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden"><img src={s.image} alt={s.title[lang]} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" /></div>
              <div className="flex items-center justify-between p-4"><h3 className="text-xl font-bold text-navy">{s.title[lang]}</h3><ArrowRight className="flip-rtl text-primary" size={20} /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle>{t("categories")}</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link key={c.slug} to="/equipment" search={{ category: c.slug, q: undefined }}
                className="card-surface p-5 text-center font-bold text-navy transition hover:-translate-y-1 hover:border-primary">{c.name[lang]}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionTitle action={<Link to="/equipment" className="font-semibold text-primary">{t("viewAll")}</Link>}>{t("featured")}</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{equipment.map((e) => <EquipmentCard key={e.slug} item={e} />)}</div>
        <p className="mt-6 text-xs text-muted-foreground">{t("placeholderNote")}</p>
      </section>
      <StatsBand />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionTitle action={<Link to="/sectors" className="font-semibold text-primary">{t("viewAll")}</Link>}>{t("sectors")}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {sectors.map((s) => (
            <div key={s.en} className="card-surface flex items-center gap-3 p-4">
              <Building2 className="shrink-0 text-primary" /><span className="font-bold text-navy">{s[lang]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle action={<Link to="/projects" className="font-semibold text-primary">{t("viewAll")}</Link>}>{t("projects")}</SectionTitle>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.title.en} to="/projects" className="group relative block aspect-[4/3] overflow-hidden rounded-xl">
                <img src={p.image} alt={p.title[lang]} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="bg-hero-overlay absolute inset-0 opacity-80" />
                <p className="absolute bottom-4 start-4 end-4 text-xl font-bold text-navy-foreground">{p.title[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
