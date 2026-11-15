import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Calculator, Check, Clock, Download, FileText, Printer, Trash2, TrendingUp, Wallet } from "lucide-react";
import { HUB, PACKAGES, SECTORS, taka } from "@/lib/data";
import { estimateRoi } from "@/lib/roi";
import { useLocalStorage, uid } from "@/lib/storage";
import { downloadText } from "@/lib/ics";
import { useLang } from "@/lib/i18n";
import { click } from "@/lib/sound";
import { PageHeader } from "@/components/SiteShell";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Business Solutions & ROI Calculator — AI HUB BD" },
      { name: "description", content: "Estimate hours saved and revenue growth with AI HUB BD automation kits, compare packages and generate a printable quotation in BDT." },
      { property: "og:title", content: "AI HUB BD ROI Calculator & Quotations" },
      { property: "og:description", content: "See what AI automation could save your Bangladeshi business — then get an instant quote." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SolutionsPage,
});

interface QuoteLine { packageId: string; amount: number }
interface Quote { id: string; client: string; company: string; email: string; sector: string; lines: QuoteLine[]; total: number; createdAt: number }

function SolutionsPage() {
  const { t } = useLang();
  const [staff, setStaff] = useState(8);
  const [hours, setHours] = useState(12);
  const [rate, setRate] = useState(180);
  const [revenue, setRevenue] = useState(800000);
  const [pkgId, setPkgId] = useState("automation");
  const r = estimateRoi({ staff, manualHoursPerWeek: hours, hourlyCost: rate, monthlyRevenue: revenue, packageId: pkgId });

  return (
    <>
      <PageHeader kicker={t("Business solutions", "ব্যবসায়িক সমাধান")} title={<>{t("What could AI save", "এআই কত সাশ্রয় করতে পারে")} <span className="text-gradient">{t("your business?", "আপনার ব্যবসায়?")}</span></>} sub={t("Move the sliders to match your business. Estimates use typical automation rates from our packages.", "স্লাইডার দিয়ে আপনার ব্যবসার তথ্য দিন।")} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2">
        <div className="glass grid gap-7 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Calculator className="h-5 w-5 text-secondary" />{t("ROI calculator", "ROI ক্যালকুলেটর")}</h2>
          <SliderRow label={t("Staff doing manual/repetitive work", "ম্যানুয়াল কাজের কর্মী")} value={staff} display={`${staff}`} min={1} max={200} step={1} onChange={setStaff} />
          <SliderRow label={t("Manual hours per person / week", "প্রতি জন সাপ্তাহিক ম্যানুয়াল ঘণ্টা")} value={hours} display={`${hours} h`} min={1} max={40} step={1} onChange={setHours} />
          <SliderRow label={t("Average staff cost per hour", "গড় ঘণ্টাপ্রতি খরচ")} value={rate} display={taka(rate)} min={80} max={1500} step={10} onChange={setRate} />
          <SliderRow label={t("Current monthly revenue", "বর্তমান মাসিক আয়")} value={revenue} display={taka(revenue)} min={50000} max={20000000} step={50000} onChange={setRevenue} />
          <div>
            <p className="mb-2 text-sm font-semibold">{t("Package", "প্যাকেজ")}</p>
            <div className="flex flex-wrap gap-2">
              {PACKAGES.map((p) => (
                <button key={p.id} onClick={() => { click(); setPkgId(p.id); }} className={cn("rounded-full border px-3 py-1.5 text-sm font-semibold", pkgId === p.id ? "border-primary bg-primary/20" : "border-border text-muted-foreground")}>{p.name}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid content-start gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Stat icon={Clock} label={t("Hours saved / month", "মাসে সাশ্রয়কৃত ঘণ্টা")} value={Math.round(r.hoursSaved).toLocaleString("en-IN")} />
            <Stat icon={Wallet} label={t("Cost saved / month", "মাসিক খরচ সাশ্রয়")} value={taka(r.costSaved)} />
            <Stat icon={TrendingUp} label={t("Added revenue / month", "মাসিক বাড়তি আয়")} value={taka(r.revenueGain)} />
            <Stat icon={Check} label={t("Payback period", "বিনিয়োগ ফেরত")} value={Number.isFinite(r.paybackMonths) ? `${r.paybackMonths < 1 ? "< 1" : r.paybackMonths.toFixed(1)} mo` : "—"} />
          </div>
          <div className="rounded-3xl border border-primary/40 bg-primary/10 p-6">
            <p className="text-sm text-muted-foreground">{t("Estimated first-year return on", "প্রথম বছরের আনুমানিক রিটার্ন")} {r.pkg.name} ({taka(r.investment)} {t("typical", "সাধারণ")})</p>
            <p className="mt-1 text-5xl font-extrabold text-gradient">{Math.round(r.annualRoi).toLocaleString("en-IN")}%</p>
            <p className="mt-3 text-xs text-muted-foreground">{t("Illustrative estimate only. A consultant confirms real numbers after your discovery session.", "শুধু আনুমানিক হিসাব।")}</p>
          </div>
        </div>
      </section>
      <Comparison />
      <QuoteBuilder />
    </>
  );
}

function SliderRow({ label, value, display, min, max, step, onChange }: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="mb-3 flex justify-between gap-3 text-sm"><span>{label}</span><span className="font-bold text-secondary">{display}</span></div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0] ?? min)} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="h-5 w-5 text-gold" />
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Comparison() {
  const { t } = useLang();
  const rows = ["Brand & web presence", "AI chat / customer service", "Workflow automation", "CRM, HR & accounts", "Custom app development", "Managed services & SLA"];
  const has: Record<string, number> = { launch: 1, growth: 2, automation: 3, bizos: 4, studio: 5, enterprise: 6 };
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8">
      <h2 className="text-2xl font-extrabold">{t("Package comparison", "প্যাকেজ তুলনা")}</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted/60">
            <tr><th className="p-3 text-left">{t("Feature", "ফিচার")}</th>{PACKAGES.map((p) => <th key={p.id} className="p-3 text-center">{p.name}</th>)}</tr>
          </thead>
          <tbody>
            <tr className="border-t border-border"><td className="p-3 text-muted-foreground">{t("Price range", "মূল্য")}</td>{PACKAGES.map((p) => <td key={p.id} className="p-3 text-center text-xs font-semibold">{taka(p.range[0])}–{p.range[1] >= 5000000 ? "৳50L+" : taka(p.range[1])}</td>)}</tr>
            {rows.map((row, i) => (
              <tr key={row} className="border-t border-border">
                <td className="p-3">{row}</td>
                {PACKAGES.map((p) => <td key={p.id} className="p-3 text-center">{(has[p.id] ?? 0) > i ? <Check className="mx-auto h-4 w-4 text-success" /> : <span className="text-muted-foreground">—</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function QuoteBuilder() {
  const { t } = useLang();
  const [quotes, setQuotes] = useLocalStorage<Quote[]>("aihub.quotes", []);
  const [sel, setSel] = useState<Record<string, number>>({ growth: 60000 });
  const [form, setForm] = useState({ client: "", company: "", email: "", sector: SECTORS[0]!.name });
  const [err, setErr] = useState("");
  const [view, setView] = useState<Quote | null>(null);
  const total = Object.values(sel).reduce((s, v) => s + v, 0);

  const toggle = (id: string, min: number) => setSel((s) => { const n = { ...s }; if (id in n) delete n[id]; else n[id] = min; return n; });

  const generate = () => {
    setErr("");
    if (!form.client.trim()) return setErr("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setErr("Enter a valid email.");
    if (Object.keys(sel).length === 0) return setErr("Select at least one package.");
    const q: Quote = { id: uid("Q-"), ...form, client: form.client.trim(), lines: Object.entries(sel).map(([packageId, amount]) => ({ packageId, amount })), total, createdAt: Date.now() };
    setQuotes((p) => [q, ...p]);
    setView(q);
    toast.success("Quotation generated & saved");
    setTimeout(() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const quoteHtml = (q: Quote) => `<!doctype html><html><head><meta charset="utf-8"><title>${q.id}</title><style>body{font-family:sans-serif;padding:40px;color:#111}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left}h1{margin:0}</style></head><body><h1>AI HUB BD — Quotation</h1><p>${q.id} · ${new Date(q.createdAt).toLocaleDateString()}</p><p><b>${esc(q.client)}</b>${q.company ? " · " + esc(q.company) : ""}<br>${esc(q.email)}<br>Sector: ${esc(q.sector)}</p><table><tr><th>Package</th><th>Amount</th></tr>${q.lines.map((l) => `<tr><td>${PACKAGES.find((p) => p.id === l.packageId)?.name}</td><td>${taka(l.amount)}</td></tr>`).join("")}<tr><th>Total</th><th>${taka(q.total)}</th></tr></table><p style="margin-top:30px;font-size:12px">Valid for 30 days. Final scope confirmed after discovery session. ${HUB.address} · ${HUB.email}</p></body></html>`;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20">
      <h2 className="flex items-center gap-2 text-2xl font-extrabold"><FileText className="h-6 w-6 text-secondary" />{t("Quotation generator", "কোটেশন জেনারেটর")}</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-3">
          {PACKAGES.map((p) => {
            const on = p.id in sel;
            const step = p.range[1] > 1000000 ? 50000 : 5000;
            return (
              <div key={p.id} className={cn("glass rounded-2xl p-4", on && "ring-1 ring-primary")}>
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="flex items-center gap-3"><input type="checkbox" checked={on} onChange={() => toggle(p.id, p.range[0])} className="h-4 w-4 accent-primary" /><span className="font-semibold">{p.name}</span></span>
                  <span className="text-sm font-bold">{on ? taka(sel[p.id] ?? 0) : `${taka(p.range[0])}+`}</span>
                </label>
                {on && <div className="mt-4"><Slider value={[sel[p.id] ?? p.range[0]]} min={p.range[0]} max={p.range[1]} step={step} onValueChange={(v) => setSel({ ...sel, [p.id]: v[0] ?? p.range[0] })} /><p className="mt-2 text-xs text-muted-foreground">{t("Adjust for scope", "স্কোপ অনুযায়ী ঠিক করুন")}: {taka(p.range[0])} – {taka(p.range[1])}</p></div>}
              </div>
            );
          })}
        </div>
        <div className="glass grid content-start gap-3 rounded-2xl p-5">
          <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} maxLength={80} placeholder={t("Your name", "আপনার নাম")} className="rounded-lg border border-input bg-background px-3 py-2" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={100} placeholder={t("Company (optional)", "কোম্পানি (ঐচ্ছিক)")} className="rounded-lg border border-input bg-background px-3 py-2" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={120} placeholder="Email" className="rounded-lg border border-input bg-background px-3 py-2" />
          <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2">
            {SECTORS.map((s) => <option key={s.name}>{s.name}</option>)}
          </select>
          <div className="flex justify-between border-t border-border pt-3 text-lg font-extrabold"><span>{t("Total", "মোট")}</span><span>{taka(total)}</span></div>
          {err && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{err}</p>}
          <button onClick={generate} className="rounded-xl bg-gradient-brand py-3 font-semibold text-primary-foreground shadow-glow">{t("Generate quotation", "কোটেশন তৈরি")}</button>
        </div>
      </div>

      {view && (
        <div id="quote" className="mt-10 animate-fade-up">
          <div className="print-area rounded-3xl border border-border bg-card p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-2xl font-extrabold">AI HUB BD — Quotation</p><p className="text-sm text-muted-foreground">{view.id} · {new Date(view.createdAt).toLocaleDateString()}</p></div>
              <div className="text-right text-sm"><p className="font-semibold">{view.client}</p>{view.company && <p>{view.company}</p>}<p className="text-muted-foreground">{view.email}</p><p className="text-muted-foreground">{view.sector}</p></div>
            </div>
            <table className="mt-6 w-full text-sm">
              <tbody>
                {view.lines.map((l) => <tr key={l.packageId} className="border-b border-border"><td className="py-2">{PACKAGES.find((p) => p.id === l.packageId)?.name}</td><td className="py-2 text-right">{taka(l.amount)}</td></tr>)}
                <tr><td className="py-3 font-extrabold">Total</td><td className="py-3 text-right text-lg font-extrabold">{taka(view.total)}</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">Valid for 30 days. Final scope confirmed after your discovery session. {HUB.address}</p>
          </div>
          <div className="no-print mt-4 flex flex-wrap gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold"><Printer className="h-4 w-4" />Print / Save as PDF</button>
            <button onClick={() => downloadText(quoteHtml(view), `${view.id}.html`, "text/html")} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold"><Download className="h-4 w-4" />Download</button>
          </div>
        </div>
      )}

      <h3 className="mt-14 text-lg font-bold">{t("Saved quotes", "সংরক্ষিত কোটেশন")}</h3>
      {quotes.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{t("No saved quotes yet.", "কোনো কোটেশন নেই।")}</p>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {quotes.map((q) => (
            <div key={q.id} className="glass flex items-center justify-between gap-3 rounded-xl p-4">
              <button onClick={() => setView(q)} className="min-w-0 text-left"><p className="font-bold">{q.id} · {taka(q.total)}</p><p className="truncate text-xs text-muted-foreground">{q.client} · {q.lines.length} package(s) · {new Date(q.createdAt).toLocaleDateString()}</p></button>
              <button onClick={() => { setQuotes((p) => p.filter((x) => x.id !== q.id)); if (view?.id === q.id) setView(null); }} className="rounded-lg border border-border p-2 text-destructive" aria-label="Delete quote"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
