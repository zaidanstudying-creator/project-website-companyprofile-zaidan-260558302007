import { copy } from "@/lib/translations";

export const defaultSiteContent = {
  translations: copy,
  seo: {
    id: {
      title: "OneID Indonesia — Berakar di Indonesia. Terhubung ke Dunia.",
      description: "Visi ekosistem identitas dan kredensial digital yang aman, praktis, dan interoperabel.",
    },
    en: {
      title: "OneID Indonesia — Rooted in Indonesia. Connected to the world.",
      description: "A vision for a secure, practical, interoperable digital identity and credential ecosystem.",
    },
  },
  links: { heroExplore: "#vision", heroLearn: "#ecosystem", headerExplore: "#vision" },
  media: [
    { src: "/images/raja-ampat-overlook-jpg.jpg", alt: { id: "Kepulauan karst dan perairan hijau kebiruan di Raja Ampat", en: "Karst islands and turquoise water in Raja Ampat" } },
    { src: "/images/jakarta-panorama.jpg", alt: { id: "Panorama pusat kota Jakarta dan Monumen Nasional", en: "Panoramic view of central Jakarta and the National Monument" } },
    { src: "/images/batik-trusmi-cirebon-31.jpg", alt: { id: "Perajin sedang memberi warna pada kain batik di Trusmi, Cirebon", en: "A craftsperson applying color to batik fabric in Trusmi, Cirebon" } },
    { src: "/images/batik-trusmi-cirebon-18.jpg", alt: { id: "Kain batik Trusmi bermotif warna-warni", en: "Colorful patterned Trusmi batik fabric" } },
  ],
};

export type SiteContent = typeof defaultSiteContent;

export function isValidSiteContent(value: unknown): value is SiteContent {
  const check = (candidate: unknown, shape: unknown, depth = 0): boolean => {
    if (depth > 12) return false;
    if (typeof shape === "string") return typeof candidate === "string" && candidate.length <= 6000;
    if (Array.isArray(shape)) return Array.isArray(candidate) && candidate.length === shape.length && shape.every((item, i) => check(candidate[i], item, depth + 1));
    if (shape && typeof shape === "object") {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
      const expected = Object.keys(shape);
      const actual = Object.keys(candidate);
      return actual.length === expected.length && expected.every((key) => key in candidate && check((candidate as Record<string, unknown>)[key], (shape as Record<string, unknown>)[key], depth + 1));
    }
    return typeof candidate === typeof shape;
  };
  if (!check(value, defaultSiteContent)) return false;
  const content = value as SiteContent;
  const validAnchors = new Set(["home", "problem", "vision", "wallet", "how", "ecosystem", "privacy", "technology", "roadmap", "about", "contact"]);
  const validLink = (href: string) => /^https?:\/\/[^\s]+$/.test(href) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href) || (href.startsWith("#") && validAnchors.has(href.slice(1)));
  const validImagePath = (src: string) => /^\/(?:images|uploads)\/[a-zA-Z0-9][a-zA-Z0-9/_\-.]*$/.test(src) && !src.includes("..");
  return Object.values(content.links).every(validLink) && content.media.every((media) => validImagePath(media.src));
}
