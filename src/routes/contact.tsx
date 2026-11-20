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
        <h2 className="mt-14 mb-5 text-3xl font-bold text-navy">{lang === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}</h2>
        <div className="space-y-3">
          {(lang === "ar" ? [
            ["هل تتوفر المعدات مع مشغل؟", "نعم، يمكن تأجير معظم المعدات مع مشغل محترف أو بدونه."],
            ["ما هي مدد التأجير المتاحة؟", "نوفر تأجيراً يومياً وأسبوعياً وشهرياً حسب احتياج المشروع."],
            ["كيف أحصل على عرض سعر؟", "املأ نموذج طلب عرض السعر وسيتواصل معك فريقنا."],
          ] : [
            ["Is equipment available with an operator?", "Yes, most equipment can be rented with or without a professional operator."],
            ["What rental periods do you offer?", "Daily, weekly and monthly rentals based on your project needs."],
            ["How do I get a quote?", "Fill in the quote request form and our team will contact you."],
          ]).map(([q, a]) => (
            <details key={q} className="card-surface group p-5">
              <summary className="cursor-pointer list-none font-bold text-navy">{q}</summary>
              <p className="mt-2 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
