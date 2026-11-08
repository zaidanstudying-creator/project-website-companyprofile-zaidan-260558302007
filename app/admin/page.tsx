"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eye, LogOut, Save, Upload } from "lucide-react";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function labelFor(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function setAtPath(source: SiteContent, path: (string | number)[], value: string): SiteContent {
  const result = structuredClone(source) as unknown as Record<string | number, unknown>;
  let target = result;
  for (const key of path.slice(0, -1)) target = target[key] as Record<string | number, unknown>;
  target[path[path.length - 1]] = value;
  return result as unknown as SiteContent;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(structuredClone(defaultSiteContent));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [locale, setLocale] = useState<"id" | "en">("id");

  async function loadDraft() {
    const response = await fetch("/api/cms/content?draft=1", { cache: "no-store" });
    if (!response.ok) throw new Error("Konten draft gagal dimuat.");
    setContent(await response.json() as SiteContent);
  }

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (result.authenticated) {
          setAuthenticated(true);
          await loadDraft();
        }
      })
      .catch(() => setError("Koneksi ke server admin gagal."))
      .finally(() => setChecking(false));
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Login gagal.");
      setAuthenticated(true); setPassword(""); await loadDraft();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Login gagal."); }
    finally { setBusy(false); }
  }

  async function saveDraft() {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/cms/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Draft gagal disimpan.");
      setMessage("Draft tersimpan di server lokal.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Draft gagal disimpan."); }
    finally { setBusy(false); }
  }

  async function publish() {
    if (!window.confirm("Terbitkan draft ini ke halaman publik?")) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const saved = await fetch("/api/cms/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      if (!saved.ok) throw new Error((await saved.json()).error || "Draft gagal disimpan.");
      const response = await fetch("/api/cms/publish", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Publish gagal.");
      setMessage("Konten berhasil diterbitkan.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Publish gagal."); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false); setMessage(""); setError("");
  }

  async function uploadImage(path: (string | number)[], file: File) {
    const form = new FormData(); form.set("file", file);
    const response = await fetch("/api/cms/upload", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload gagal.");
    setContent((current) => setAtPath(current, path, result.src));
    setMessage("Gambar diunggah. Simpan draft untuk menerapkan perubahan.");
  }

  function renderFields(value: JsonValue, path: (string | number)[]): React.ReactNode {
    if (typeof value === "string") {
      const key = String(path.at(-1) ?? "");
      const id = `field-${path.join("-")}`;
      return <label className="cms-field" htmlFor={id} key={id}><span>{labelFor(key)}</span>
        {key === "src" ? <><input id={id} value={value} onChange={(event) => setContent((current) => setAtPath(current, path, event.target.value))}/><span className="cms-upload"><Upload size={15}/> Unggah gambar<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(path, file).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Upload gagal.")); event.currentTarget.value = ""; }}/></span></> : <textarea id={id} rows={value.length > 120 ? 4 : 2} maxLength={6000} value={value} onChange={(event) => setContent((current) => setAtPath(current, path, event.target.value))}/>}
      </label>;
    }
    if (Array.isArray(value)) return <div className="cms-array" key={path.join("-")}>{value.map((item, index) => <details className="cms-group cms-item" key={`${path.join("-")}-${index}`}><summary>{labelFor(String(index + 1))}</summary><div className="cms-fields">{renderFields(item, [...path, index])}</div></details>)}</div>;
    if (value && typeof value === "object") return <div className="cms-fields" key={path.join("-")}>{Object.entries(value).map(([key, item]) => <details className="cms-group" key={`${path.join("-")}-${key}`}><summary>{labelFor(key)}</summary><div className="cms-fields">{renderFields(item, [...path, key])}</div></details>)}</div>;
    return null;
  }

  if (checking) return <main className="admin-shell"><p role="status">Memeriksa sesi admin…</p></main>;
  if (!authenticated) return <main className="admin-shell admin-login"><Link className="admin-back" href="/"><ArrowLeft size={17}/> Kembali ke situs</Link><div className="admin-login-layout"><section className="admin-login-story"><Link className="admin-login-mark" href="/">oneid <span>indonesia</span></Link><h2>Identitas Indonesia.</h2><p>Ruang editorial OneID untuk menjaga cerita, prinsip, dan arah ekosistem tetap terhubung.</p></section><div className="admin-login-panel"><h1>Masuk admin</h1><p>Gunakan kata sandi admin untuk melanjutkan.</p><form onSubmit={login}><label htmlFor="admin-password">Kata sandi</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)}/><button className="admin-primary" type="submit" disabled={busy}>{busy ? "Memeriksa…" : "Masuk"}</button></form>{error && <p className="admin-error" role="alert">{error}</p>}</div></div></main>;

  return <main className="admin-shell">
    <header className="admin-header"><div><Link className="admin-wordmark" href="/">oneid <small>indonesia / admin</small></Link><h1>Kelola konten</h1><p>Ubah draft, tinjau situs, lalu terbitkan saat siap.</p></div><div className="admin-header-actions"><Link href="/" className="admin-quiet"><ArrowLeft size={16}/> Situs publik</Link><button className="admin-quiet" onClick={logout}><LogOut size={16}/> Keluar</button></div></header>
    <section className="admin-workspace"><div className="admin-toolbar"><div className="admin-locale" role="group" aria-label="Bahasa konten"><button type="button" aria-pressed={locale === "id"} onClick={() => setLocale("id")}>Indonesia</button><button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>English</button></div><div className="admin-actions"><button type="button" className="admin-quiet" onClick={() => window.open("/?preview=draft", "_blank", "noopener,noreferrer")}><Eye size={16}/> Preview draft</button><button type="button" className="admin-quiet" onClick={() => void saveDraft()} disabled={busy}><Save size={16}/> Simpan draft</button><button type="button" className="admin-primary" onClick={() => void publish()} disabled={busy}><Check size={16}/> Terbitkan</button></div></div>
      <p className="admin-help">Klik judul bagian untuk membuka isinya. Teks dibatasi 6.000 karakter per kolom. Upload gambar menerima JPEG, PNG, dan WebP hingga 5 MB.</p>
      <div className="admin-content">{Object.entries(content).map(([key, value]) => <details className="cms-group cms-root" key={key} open={key === "translations"}><summary>{labelFor(key)}</summary><div className="cms-fields">{key === "translations" ? renderFields((value as unknown as Record<string, JsonValue>)[locale], [key, locale]) : renderFields(value as JsonValue, [key])}</div></details>)}</div>
      <div className="admin-feedback" aria-live="polite">{error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="admin-success" role="status">{message}</p>}</div>
    </section>
  </main>;
}
