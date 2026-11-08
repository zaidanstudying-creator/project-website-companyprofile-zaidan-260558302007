import type { Metadata } from "next";
import { readPublishedContent } from "@/lib/cms-store";
import "./globals.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPublishedContent();
  return { title: content.seo.id.title, description: content.seo.id.description };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
