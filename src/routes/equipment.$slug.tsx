import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { categories, equipment } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { CtaBand } from "@/components/site/blocks";

export const Route = createFileRoute("/equipment/$slug")({
  loader: ({ params }) => {
    const item = equipment.find((e) => e.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.item.name.en} for Rent | Miller Piller` : "Equipment not found | Miller Piller";
    const desc = loaderData?.item.summary.en ?? "This equipment could not be found.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }, ...(loaderData ? [] : [{ name: "robots", content: "noindex" }])] };
  },
  notFoundComponent: () => <div className="mx-auto max-w-7xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">404</h1><Link to="/equipment" className="text-primary">← Catalog</Link></div>,
  component: Details,
});

function Details() {
  const { item } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const [active, setActive] = useState(0);
  const cat = categories.find((c) => c.slug === item.category);
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2">
        <div>
          <div className="card-surface aspect-[4/3] overflow-hidden"><img src={item.images[active]} alt={item.name[lang]} className="h-full w-full object-cover" /></div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {item.images.map((src, i) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-[4/3] overflow-hidden rounded-lg border-2 ${i === active ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <nav className="mb-3 text-sm text-muted-foreground">
            <Link to="/equipment" className="hover:text-primary">{t("equipment")}</Link> / {cat?.name[lang]}
          </nav>
          <h1 className="text-4xl font-bold text-navy sm:text-5xl">{item.name[lang]}</h1>
          <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${item.available ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
            <CheckCircle2 size={16} /> {item.available ? t("available") : t("onRequest")}
          </span>
          <p className="mt-4 text-lg text-muted-foreground">{item.summary[lang]}</p>
          <h2 className="mt-8 mb-3 text-2xl font-bold text-navy">{t("specs")}</h2>
          <dl className="card-surface divide-y">
            {item.specs.map((s) => (
              <div key={s.label.en} className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted-foreground">{s.label[lang]}</dt><dd className="font-bold" dir="ltr">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">{t("placeholderNote")}</p>
          <Link to="/quote" search={{ equipment: item.slug }} className="btn btn-primary mt-6 w-full sm:w-auto">{t("requestQuote")}</Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
