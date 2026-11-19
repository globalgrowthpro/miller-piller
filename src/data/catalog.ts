import telehandler from "@/assets/telehandler.jpg";
import loader from "@/assets/wheel-loader.jpg";
import excavator from "@/assets/hero-excavator.jpg";
import type { Bi } from "@/lib/i18n";

// NOTE: All specifications below are placeholders — replace with verified company data.
export type Category = { slug: string; name: Bi };
export const categories: Category[] = [
  { slug: "telehandlers", name: { en: "Telehandlers", ar: "تلي هاندلر" } },
  { slug: "forklifts", name: { en: "Forklifts", ar: "رافعات شوكية" } },
  { slug: "excavators", name: { en: "Excavators", ar: "حفارات" } },
  { slug: "loaders", name: { en: "Wheel Loaders", ar: "لوادر عجلات" } },
  { slug: "trucks", name: { en: "Trucks", ar: "شاحنات نقل" } },
];

export type Equipment = {
  slug: string; category: string; name: Bi; summary: Bi; images: string[];
  available: boolean; specs: { label: Bi; value: string }[];
};

export const equipment: Equipment[] = [
  {
    slug: "telehandler-17m", category: "telehandlers", available: true,
    name: { en: "Telehandler 17 m", ar: "تلي هاندلر 17 متر" },
    summary: { en: "Versatile lifting and placing of materials at height on rough terrain.", ar: "رفع ونقل المواد على ارتفاعات في المواقع الوعرة." },
    images: [telehandler, loader, excavator],
    specs: [
      { label: { en: "Max lift height", ar: "أقصى ارتفاع رفع" }, value: "17 m" },
      { label: { en: "Max capacity", ar: "الحمولة القصوى" }, value: "4,000 kg" },
      { label: { en: "Engine power", ar: "قدرة المحرك" }, value: "74 kW" },
      { label: { en: "Drive", ar: "نظام الدفع" }, value: "4x4" },
    ],
  },
  {
    slug: "wheel-loader-3m3", category: "loaders", available: true,
    name: { en: "Wheel Loader 3 m³", ar: "لودر عجلات 3 م³" },
    summary: { en: "Efficient loading, stockpiling and site clearing.", ar: "تحميل وتجميع المواد وتنظيف المواقع بكفاءة." },
    images: [loader, telehandler, excavator],
    specs: [
      { label: { en: "Bucket capacity", ar: "سعة الجرافة" }, value: "3 m³" },
      { label: { en: "Operating weight", ar: "الوزن التشغيلي" }, value: "15,000 kg" },
      { label: { en: "Engine power", ar: "قدرة المحرك" }, value: "125 kW" },
    ],
  },
  {
    slug: "hydraulic-excavator-30t", category: "excavators", available: false,
    name: { en: "Hydraulic Excavator 30 t", ar: "حفار هيدروليكي 30 طن" },
    summary: { en: "Heavy-duty excavation, trenching and demolition.", ar: "أعمال الحفر الثقيلة والخنادق والهدم." },
    images: [excavator, loader, telehandler],
    specs: [
      { label: { en: "Operating weight", ar: "الوزن التشغيلي" }, value: "30,000 kg" },
      { label: { en: "Max dig depth", ar: "أقصى عمق حفر" }, value: "7.3 m" },
      { label: { en: "Bucket capacity", ar: "سعة الجرافة" }, value: "1.6 m³" },
    ],
  },
];

export const services: { slug: string; title: Bi; text: Bi; image: string }[] = [
  { slug: "rental", title: { en: "Heavy Equipment Rental", ar: "تأجير المعدات الثقيلة" }, text: { en: "Daily, weekly and monthly rental with or without operators.", ar: "تأجير يومي وأسبوعي وشهري مع أو بدون مشغل." }, image: loader },
  { slug: "contracting", title: { en: "Contracting Works", ar: "أعمال المقاولات" }, text: { en: "Excavation, backfilling, grading and site preparation.", ar: "أعمال الحفر والردم والتسوية وتجهيز المواقع." }, image: excavator },
  { slug: "site-support", title: { en: "Site Support", ar: "دعم مواقع العمل" }, text: { en: "Material handling and logistics support on site.", ar: "مناولة المواد والدعم اللوجستي في الموقع." }, image: telehandler },
];

export const sectors: Bi[] = [
  { en: "Construction & Real Estate", ar: "البناء والعقارات" },
  { en: "Infrastructure & Roads", ar: "البنية التحتية والطرق" },
  { en: "Oil & Gas", ar: "النفط والغاز" },
  { en: "Industrial & Logistics", ar: "الصناعة والخدمات اللوجستية" },
  { en: "Government Projects", ar: "المشاريع الحكومية" },
  { en: "Events & Facilities", ar: "الفعاليات والمنشآت" },
];

export const projects: { title: Bi; place: Bi; image: string }[] = [
  { title: { en: "Residential compound earthworks", ar: "أعمال ترابية لمجمع سكني" }, place: { en: "Sample project", ar: "مشروع تجريبي" }, image: excavator },
  { title: { en: "Warehouse material handling", ar: "مناولة مواد لمستودعات" }, place: { en: "Sample project", ar: "مشروع تجريبي" }, image: telehandler },
  { title: { en: "Road site clearing", ar: "تنظيف موقع طريق" }, place: { en: "Sample project", ar: "مشروع تجريبي" }, image: loader },
];
