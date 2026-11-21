import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { contact } from "@/lib/contact";
import logo from "@/assets/miller-piller-logo.png.asset.json";

export function SiteFooter() {
  const { t, lang } = useI18n();
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-3">
        <div>
          <Link to="/" className="inline-block rounded-xl bg-card p-2"><img src={logo.url} alt="Miller Piller — Contracting and Equipment Trade" className="h-12 w-auto" loading="lazy" /></Link>
          <p className="mt-2 text-sm text-navy-foreground/70">{t("heroText")}</p>
        </div>
        <div>
          <p className="mb-2 font-bold text-primary">{t("quickLinks")}</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-navy-foreground/80">
            <li><Link to="/about">{t("about")}</Link></li><li><Link to="/services">{t("services")}</Link></li>
            <li><Link to="/equipment">{t("equipment")}</Link></li><li><Link to="/sectors">{t("sectors")}</Link></li>
            <li><Link to="/projects">{t("projects")}</Link></li><li><Link to="/quote">{t("quote")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-bold text-primary">{t("getInTouch")}</p>
          <ul className="space-y-1.5 text-sm text-navy-foreground/80">
            <li className="flex items-center gap-2"><Phone size={16} /> <a href={contact.phoneHref} dir="ltr" className="hover:text-primary">{contact.phoneDisplay}</a></li>
            <li className="flex items-center gap-2"><Mail size={16} /> <a href={contact.emailHref} dir="ltr" className="hover:text-primary">{contact.email}</a></li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> <span>{contact.address[lang]}</span></li>
          </ul>
          <p className="mt-2 text-xs text-navy-foreground/50">{t("placeholderNote")}</p>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10 py-3 text-center text-xs text-navy-foreground/60">
        © {new Date().getFullYear()} Miller Piller. {t("rights")}
      </div>
    </footer>
  );
}
