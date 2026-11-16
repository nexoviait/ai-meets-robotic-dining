import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, FileText, Presentation } from "lucide-react";
import { FUNDS, ROADMAP, RAISE_CR, BREAK_EVEN_MONTHLY_CR, cr } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { PageHeader } from "@/components/SiteShell";
import { LeadForm } from "@/components/LeadForm";
import memo from "@/assets/investor-memorandum.pdf.asset.json";
import deck from "@/assets/pitch-deck.pdf.asset.json";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investors — AI HUB BD BDT 12,200 Cr Launch Plan" },
      { name: "description", content: "AI HUB BD investor memorandum: BDT 12,200 Cr capital plan, use of funds, revenue ladder, café revenue and 12-month execution roadmap." },
      { property: "og:title", content: "Invest in AI HUB BD" },
      { property: "og:description", content: "BDT 12,200 Cr to launch Bangladesh's first physical AI hub. See the use of funds, revenue model and roadmap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestorsPage,
});

const COLORS = ["bg-primary", "bg-secondary", "bg-gold", "bg-primary-glow", "bg-success", "bg-muted-foreground"];

function InvestorsPage() {
  const { t } = useLang();
  const total = FUNDS.reduce((s, f) => s + f.value, 0);
  const ladder = [
    { step: "BDT 100 ticket", body: "Low-friction entry funnel: 3,000 seat-hours/day of discovery sessions.", value: "৳100 / session" },
    { step: "AI Food Automation Café", body: "Daily cash revenue and a live showcase of automation.", value: "৳8.1L – 46.2L / month" },
    { step: "Product packages", body: "Launch Kit to Enterprise AI — fixed-scope project revenue.", value: "৳5,000 – ৳50L+" },
    { step: "SME subscriptions", body: "Monthly subscription centre for tools, content and support.", value: "৳2,000 – 15,000 / mo" },
    { step: "Managed services", body: "Enterprise pilots, retainers and channel partnerships.", value: "Recurring retainers" },
  ];
  return (
    <>
      <PageHeader kicker={t("Investor memorandum", "বিনিয়োগকারী মেমোরান্ডাম")} title={<>{t("Raising", "সংগ্রহ")} <span className="text-gradient">BDT {cr(RAISE_CR)} Cr</span> {t("to launch the flagship", "ফ্ল্যাগশিপ চালুর জন্য")}</>} sub={`Planning scenario revenue of BDT ${cr(RAISE_CR)} Cr in Year 1, with break-even at roughly BDT ${cr(BREAK_EVEN_MONTHLY_CR)} Cr monthly revenue.`} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold">{t("Use of funds", "তহবিলের ব্যবহার")}</h2>
          <div className="mt-5 flex h-4 overflow-hidden rounded-full">
            {FUNDS.map((f, i) => <div key={f.name} className={COLORS[i]} style={{ width: `${(f.value / total) * 100}%` }} title={f.name} />)}
          </div>
          <ul className="mt-6 grid gap-3">
            {FUNDS.map((f, i) => (
              <li key={f.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2"><span className={`h-3 w-3 rounded-sm ${COLORS[i]}`} />{f.name}</span>
                <span className="font-bold">BDT {cr(f.value)} Cr <span className="font-normal text-muted-foreground">({Math.round((f.value / total) * 100)}%)</span></span>
              </li>
            ))}
            <li className="flex justify-between border-t border-border pt-3 font-extrabold"><span>Total</span><span>BDT {cr(total)} Cr</span></li>
          </ul>
        </div>
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold">{t("Revenue model ladder", "আয়ের মডেল")}</h2>
          <ol className="mt-5 grid gap-3">
            {ladder.map((l, i) => (
              <li key={l.step} className="flex gap-4 rounded-xl border border-border p-3" style={{ marginLeft: `${i * 8}px` }}>
                <span className="text-lg font-extrabold text-gold">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-2"><p className="font-bold">{l.step}</p><p className="text-sm font-semibold text-secondary">{l.value}</p></div>
                  <p className="text-xs text-muted-foreground">{l.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-extrabold">{t("12-month execution roadmap", "১২ মাসের রোডম্যাপ")}</h2>
        <p className="mt-1 text-muted-foreground">Build in gates. Scale only when the evidence is there.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((r) => (
            <div key={r.phase} className="glass rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">{r.phase}</p>
              <p className="text-xs text-muted-foreground">{r.when}</p>
              <h3 className="mt-2 font-bold">{r.title}</h3>
              <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">{r.points.map((p) => <li key={p}>• {p}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-16 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <h2 className="text-2xl font-extrabold">{t("Documents", "ডকুমেন্টস")}</h2>
          {[{ icon: FileText, name: "Investor Memorandum", file: memo }, { icon: Presentation, name: "Pitch Deck", file: deck }].map((d) => (
            <div key={d.name} className="glass flex items-center justify-between gap-3 rounded-2xl p-5">
              <span className="flex items-center gap-3"><d.icon className="h-8 w-8 text-secondary" /><span><p className="font-bold">{d.name}</p><p className="text-xs text-muted-foreground">PDF · {(d.file.size / 1024 / 1024).toFixed(1)} MB · Confidential</p></span></span>
              <span className="flex gap-2">
                <a href={d.file.url} target="_blank" rel="noreferrer" className="rounded-lg border border-border p-2" aria-label={`View ${d.name}`}><Eye className="h-4 w-4" /></a>
                <a href={d.file.url} download={d.file.original_filename} className="rounded-lg bg-gradient-brand p-2 text-primary-foreground" aria-label={`Download ${d.name}`}><Download className="h-4 w-4" /></a>
              </span>
            </div>
          ))}
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-extrabold">{t("Request a meeting", "মিটিং অনুরোধ")}</h2>
          <LeadForm source="investor" kinds={["Investor meeting"]} cta={t("Request investor meeting", "মিটিং অনুরোধ করুন")} />
        </div>
      </section>
    </>
  );
}
