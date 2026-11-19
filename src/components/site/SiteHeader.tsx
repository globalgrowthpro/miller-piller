import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/miller-piller-logo.png.asset.json";
import { useI18n } from "@/lib/i18n";

const nav = [
  ["/", "home"], ["/about", "about"], ["/services", "services"], ["/equipment", "equipment"],
  ["/sectors", "sectors"], ["/projects", "projects"], ["/contact", "contact"],
] as const;

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <Link to="/" className="shrink-0" aria-label="Miller Piller">
          <img src={logo.url} alt="Miller Piller — Contracting and Equipment Trade" className="h-14 w-auto sm:h-16" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([to, k]) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary"
              activeProps={{ className: "text-primary" }}>{t(k)}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="rounded-full border px-3 py-1.5 text-sm font-bold text-navy hover:border-primary">
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <Link to="/quote" className="btn btn-primary hidden text-sm sm:inline-flex">{t("quote")}</Link>
          <button className="rounded-lg bg-navy p-2 text-navy-foreground lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-card px-4 py-3 lg:hidden">
          {[...nav, ["/quote", "quote"] as const].map(([to, k]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 font-semibold hover:bg-muted">{t(k)}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
