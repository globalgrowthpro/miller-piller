import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Equipment } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="flex items-center gap-3 text-3xl font-bold text-navy"><span className="section-bar" />{children}</h2>
      {action}
    </div>
  );
}

export function PageHero({ title, text, image }: { title: string; text?: string; image: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-deep">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="bg-hero-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h1 className="text-4xl font-bold text-navy-foreground sm:text-5xl">{title}</h1>
        {text && <p className="mt-3 max-w-xl text-navy-foreground/80">{text}</p>}
      </div>
    </section>
  );
}

export function EquipmentCard({ item }: { item: Equipment }) {
  const { lang, t } = useI18n();
  return (
    <article className="card-surface group overflow-hidden">
      <Link to="/equipment/$slug" params={{ slug: item.slug }} className="block aspect-[4/3] overflow-hidden bg-muted">
        <img src={item.images[0]} alt={item.name[lang]} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-navy">{item.name[lang]}</h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${item.available ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
            {item.available ? t("available") : t("onRequest")}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.summary[lang]}</p>
        <div className="mt-4 flex gap-2">
          <Link to="/quote" search={{ equipment: item.slug }} className="btn btn-primary flex-1 py-2 text-sm">{t("requestQuote")}</Link>
          <Link to="/equipment/$slug" params={{ slug: item.slug }} className="btn btn-outline py-2 text-sm text-navy">
            {t("details")} <ArrowRight size={16} className="flip-rtl" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="bg-navy">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-navy-foreground">{t("ctaTitle")}</h2>
          <p className="mt-2 text-navy-foreground/75">{t("ctaText")}</p>
        </div>
        <Link to="/quote" className="btn btn-primary shrink-0">{t("quote")} <ArrowRight size={18} className="flip-rtl" /></Link>
      </div>
    </section>
  );
}
