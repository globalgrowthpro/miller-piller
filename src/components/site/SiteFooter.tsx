import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">Miller Piller · <span className="text-primary">ميلر بيلر</span></p>
          <p className="mt-3 text-sm text-navy-foreground/70">{t("heroText")}</p>
        </div>
        <div>
          <p className="mb-3 font-bold text-primary">{t("quickLinks")}</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-navy-foreground/80">
            <li><Link to="/about">{t("about")}</Link></li><li><Link to="/services">{t("services")}</Link></li>
            <li><Link to="/equipment">{t("equipment")}</Link></li><li><Link to="/sectors">{t("sectors")}</Link></li>
            <li><Link to="/projects">{t("projects")}</Link></li><li><Link to="/quote">{t("quote")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-bold text-primary">{t("getInTouch")}</p>
          <ul className="space-y-2 text-sm text-navy-foreground/80">
            <li className="flex items-center gap-2"><Phone size={16} /> <span dir="ltr">+000 000 0000</span></li>
            <li className="flex items-center gap-2"><Mail size={16} /> info@example.com</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> —</li>
          </ul>
          <p className="mt-3 text-xs text-navy-foreground/50">{t("placeholderNote")}</p>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10 py-4 text-center text-xs text-navy-foreground/60">
        © {new Date().getFullYear()} Miller Piller. {t("rights")}
      </div>
    </footer>
  );
}
