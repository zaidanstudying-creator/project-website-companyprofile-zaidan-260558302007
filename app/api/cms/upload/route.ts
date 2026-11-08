import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.slice(0, -1);
  if (!host || request.headers.get("origin") !== `${protocol}://${host}`) return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Sesi admin diperlukan." }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size < 1 || file.size > MAX_BYTES) return NextResponse.json({ error: "Pilih gambar dengan ukuran maksimal 5 MB." }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  let extension = "";
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) extension = "jpg";
  else if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) extension = "png";
  else if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") extension = "webp";
  if (!extension) return NextResponse.json({ error: "Format yang didukung: JPEG, PNG, atau WebP." }, { status: 415 });
  const name = `${randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), bytes, { flag: "wx", mode: 0o644 });
  return NextResponse.json({ src: `/uploads/${name}` });
}
