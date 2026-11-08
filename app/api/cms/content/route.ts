import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-session";
import { readDraftContent, readPublishedContent, saveDraft } from "@/lib/cms-store";
import { isValidSiteContent } from "@/lib/site-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.slice(0, -1);
  return !!forwardedHost && origin === `${forwardedProtocol}://${forwardedHost}`;
}

export async function GET(request: NextRequest) {
  const preview = request.nextUrl.searchParams.get("draft") === "1";
  if (preview && !(await hasAdminSession())) return NextResponse.json({ error: "Sesi admin diperlukan." }, { status: 401 });
  const content = preview ? await readDraftContent() : await readPublishedContent();
  return NextResponse.json(content, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Sesi admin diperlukan." }, { status: 401 });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 1_000_000) return NextResponse.json({ error: "Ukuran konten terlalu besar." }, { status: 413 });
  try {
    const content: unknown = await request.json();
    if (!isValidSiteContent(content)) return NextResponse.json({ error: "Struktur konten tidak valid. Periksa format dan panjang teks." }, { status: 422 });
    await saveDraft(content);
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Konten tidak dapat disimpan." }, { status: 400 });
  }
}
