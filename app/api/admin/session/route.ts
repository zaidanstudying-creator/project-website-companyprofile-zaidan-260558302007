import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, hasAdminSession, setAdminSession, verifyPassword } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.slice(0, -1);
  return !!forwardedHost && origin === `${forwardedProtocol}://${forwardedHost}`;
}

export async function GET() {
  return NextResponse.json({ authenticated: await hasAdminSession() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: "Atur ADMIN_PASSWORD dan ADMIN_SESSION_SECRET di .env.local untuk mengaktifkan admin." }, { status: 503 });
  let password = "";
  try {
    const body = await request.json();
    if (typeof body.password === "string" && body.password.length <= 256) password = body.password;
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  if (!verifyPassword(password)) return NextResponse.json({ error: "Kata sandi tidak cocok." }, { status: 401 });
  await setAdminSession();
  return NextResponse.json({ authenticated: true });
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  await clearAdminSession();
  return NextResponse.json({ authenticated: false });
}
