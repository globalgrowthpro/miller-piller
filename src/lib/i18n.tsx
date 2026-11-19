import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
type Ctx = { lang: Lang; dir: "rtl" | "ltr"; setLang: (l: Lang) => void; t: (k: keyof typeof dict.en) => string };

export const dict = {
  en: {
    home: "Home", about: "About Us", services: "Services", equipment: "Equipment", sectors: "Sectors",
    projects: "Projects", quote: "Request a Quote", contact: "Contact Us",
    heroTitle1: "Heavy Equipment Rental", heroTitle2: "& Contracting Works",
    heroText: "Complete solutions for your projects — from equipment rental with skilled operators to excavation and site preparation.",
    browse: "Browse Equipment", modern: "Modern equipment", modernSub: "Ready for work",
    operators: "Professional operators", operatorsSub: "Experienced crews", support: "Ongoing support", supportSub: "Throughout the project",
    ourServices: "Our Services", categories: "Equipment Categories", featured: "Featured Equipment", viewAll: "View all",
    search: "Search equipment…", all: "All", category: "Category", noResults: "No equipment matches your search.",
    specs: "Specifications", details: "Details", requestQuote: "Request a quote", available: "Available", onRequest: "On request",
    whyUs: "Why Miller Piller", ctaTitle: "Need equipment for your next project?", ctaText: "Tell us what you need and our team will get back to you with a tailored quote.",
    fullName: "Full name", company: "Company (optional)", phone: "Phone", email: "Email", equipmentNeeded: "Equipment needed",
    location: "Project location", startDate: "Start date", duration: "Rental duration", message: "Additional details",
    submit: "Send request", sending: "Sending…", thanks: "Thank you! Your request has been received.", thanksSub: "Our team will review it and contact you shortly.",
    placeholderNote: "Sample content — to be replaced with verified company information.",
    rights: "All rights reserved.", quickLinks: "Quick links", getInTouch: "Get in touch",
  },
  ar: {
    home: "الرئيسية", about: "من نحن", services: "الخدمات", equipment: "المعدات", sectors: "القطاعات",
    projects: "المشاريع", quote: "طلب عرض سعر", contact: "تواصل معنا",
    heroTitle1: "تأجير المعدات الثقيلة", heroTitle2: "وأعمال المقاولات",
    heroText: "حلول متكاملة لمشاريعك من تأجير المعدات بالمشغلين إلى تنفيذ أعمال الحفر والتجهيز.",
    browse: "تصفح المعدات", modern: "معدات حديثة", modernSub: "وجاهزة للعمل",
    operators: "مشغلون محترفون", operatorsSub: "وذوو خبرة", support: "دعم فني مستمر", supportSub: "على مدار المشروع",
    ourServices: "خدماتنا", categories: "تصنيفات المعدات", featured: "معدات مميزة", viewAll: "عرض الكل",
    search: "ابحث عن معدة…", all: "الكل", category: "التصنيف", noResults: "لا توجد معدات مطابقة لبحثك.",
    specs: "المواصفات", details: "التفاصيل", requestQuote: "طلب عرض سعر", available: "متاحة", onRequest: "حسب الطلب",
    whyUs: "لماذا ميلر بيلر", ctaTitle: "تحتاج معدات لمشروعك القادم؟", ctaText: "أخبرنا باحتياجك وسيتواصل معك فريقنا بعرض سعر مناسب.",
    fullName: "الاسم الكامل", company: "الشركة (اختياري)", phone: "رقم الجوال", email: "البريد الإلكتروني", equipmentNeeded: "المعدة المطلوبة",
    location: "موقع المشروع", startDate: "تاريخ البدء", duration: "مدة التأجير", message: "تفاصيل إضافية",
    submit: "إرسال الطلب", sending: "جارٍ الإرسال…", thanks: "شكراً لك! تم استلام طلبك.", thanksSub: "سيقوم فريقنا بمراجعته والتواصل معك قريباً.",
    placeholderNote: "محتوى تجريبي — سيتم استبداله بمعلومات الشركة المعتمدة.",
    rights: "جميع الحقوق محفوظة.", quickLinks: "روابط سريعة", getInTouch: "تواصل معنا",
  },
} as const;

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  useEffect(() => {
    const saved = localStorage.getItem("mp-lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => { localStorage.setItem("mp-lang", l); setLangState(l); };
  return (
    <I18nContext.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, t: (k) => dict[lang][k] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}

/** Pick a bilingual value */
export type Bi = { en: string; ar: string };
