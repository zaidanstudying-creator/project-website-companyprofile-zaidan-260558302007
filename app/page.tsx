import HomeClient from "@/app/home-client";
import { hasAdminSession } from "@/lib/admin-session";
import { readDraftContent, readPublishedContent } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Page({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  const canPreviewDraft = preview === "draft" && await hasAdminSession();
  const initialContent = canPreviewDraft ? await readDraftContent() : await readPublishedContent();
  return <HomeClient initialContent={initialContent} />;
}
