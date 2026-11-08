import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

type ContentRecord = { draft: SiteContent; published: SiteContent };
const file = path.join(process.cwd(), "data", "site-content.json");

async function readRecord(): Promise<ContentRecord> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as ContentRecord;
  } catch {
    return { draft: defaultSiteContent, published: defaultSiteContent };
  }
}

export async function readPublishedContent() {
  return (await readRecord()).published;
}

export async function readDraftContent() {
  return (await readRecord()).draft;
}

async function writeRecord(record: ContentRecord) {
  const dir = path.dirname(file);
  await mkdir(dir, { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(record, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temp, file);
}

export async function saveDraft(content: SiteContent) {
  const record = await readRecord();
  await writeRecord({ ...record, draft: content });
}

export async function publishDraft() {
  const record = await readRecord();
  await writeRecord({ draft: record.draft, published: record.draft });
}
