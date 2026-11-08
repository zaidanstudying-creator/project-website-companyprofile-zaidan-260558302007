import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-session";
import { publishDraft } from "@/lib/cms-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.slice(0, -1);
  if (!host || request.headers.get("origin") !== `${protocol}://${host}`) return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Sesi admin diperlukan." }, { status: 401 });
  await publishDraft();
  return NextResponse.json({ published: true });
}
