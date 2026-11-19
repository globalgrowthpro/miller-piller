import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import hero from "@/assets/telehandler.jpg";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/site/blocks";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us | Miller Piller" }, { name: "description", content: "Get in touch with Miller Piller for heavy equipment rental and contracting enquiries." }, { property: "og:title", content: "Contact Us | Miller Piller" }, { property: "og:description", content: "Get in touch with Miller Piller for heavy equipment rental and contracting enquiries." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Contact,
});

function Contact() {
  const { t, lang } = useI18n();
  const items = [
    [Phone, t("phone"), "+000 000 0000"], [Mail, t("email"), "info@example.com"],
    [MapPin, lang === "ar" ? "العنوان" : "Address", "—"], [Clock, lang === "ar" ? "ساعات العمل" : "Working hours", "—"],
  ] as const;
  return (
    <>
      <PageHero title={t("contact")} image={hero} />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, l, v]) => (
            <div key={l} className="card-surface p-6"><Icon className="text-primary" /><p className="mt-3 text-sm text-muted-foreground">{l}</p><p className="font-bold text-navy" dir="ltr">{v}</p></div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t("placeholderNote")}</p>
        <div className="card-surface mt-10 flex flex-col items-start justify-between gap-4 p-8 md:flex-row md:items-center">
          <p className="text-xl font-bold text-navy">{t("ctaTitle")}</p>
          <Link to="/quote" className="btn btn-primary">{t("quote")}</Link>
        </div>
      </section>
    </>
  );
}
