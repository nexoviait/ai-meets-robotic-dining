import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Send } from "lucide-react";
import { useLocalStorage, uid } from "@/lib/storage";
import { HUB } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Please add a short message").max(1000),
});

export interface Lead { id: string; kind: string; name: string; email: string; phone?: string | undefined; company?: string | undefined; message: string; createdAt: number }

export function LeadForm({ kinds, defaultKind, cta }: { kinds: string[]; defaultKind?: string; cta: string }) {
  const { t } = useLang();
  const [, setLeads] = useLocalStorage<Lead[]>("aihub.leads", []);
  const [kind, setKind] = useState(defaultKind ?? kinds[0] ?? "General");
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Lead | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    const lead: Lead = { id: uid("REQ-"), kind, ...r.data, createdAt: Date.now() };
    setLeads((p) => [lead, ...p]);
    setSent(lead);
    toast.success(t("Request received", "অনুরোধ গৃহীত"));
  };

  if (sent) {
    const wa = `https://wa.me/${HUB.whatsapp}?text=${encodeURIComponent(`Hi AI HUB BD, I just sent a ${sent.kind} request (${sent.id}). ${sent.message}`)}`;
    return (
      <div className="glass grid place-items-center gap-3 rounded-2xl p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <p className="text-lg font-bold">{t("Thank you", "ধন্যবাদ")}, {sent.name}!</p>
        <p className="text-sm text-muted-foreground">{t("Reference", "রেফারেন্স")} {sent.id}. {t("For a faster reply, send it on WhatsApp too.", "দ্রুত উত্তরের জন্য WhatsApp-এ পাঠান।")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <a href={wa} target="_blank" rel="noreferrer" className="rounded-lg bg-success px-4 py-2 text-sm font-semibold text-primary-foreground">WhatsApp</a>
          <button onClick={() => { setSent(null); setF({ name: "", email: "", phone: "", company: "", message: "" }); }} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">{t("Send another", "আরেকটি পাঠান")}</button>
        </div>
      </div>
    );
  }

  const field = (k: keyof typeof f, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="grid gap-1 text-sm">
      {label}
      <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2.5" {...props} />
      {errors[k] && <span className="text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} className="glass grid gap-4 rounded-2xl p-6" noValidate>
      {kinds.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button type="button" key={k} onClick={() => setKind(k)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${kind === k ? "border-primary bg-primary/20" : "border-border text-muted-foreground"}`}>{k}</button>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", t("Name", "নাম"), { maxLength: 100 })}
        {field("email", "Email", { type: "email", maxLength: 255 })}
        {field("phone", t("Phone (optional)", "ফোন (ঐচ্ছিক)"), { maxLength: 20, inputMode: "tel" })}
        {field("company", t("Company (optional)", "কোম্পানি (ঐচ্ছিক)"), { maxLength: 120 })}
      </div>
      <label className="grid gap-1 text-sm">
        {t("Message", "বার্তা")}
        <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} maxLength={1000} rows={4} className="rounded-lg border border-input bg-background px-3 py-2.5" />
        {errors["message"] && <span className="text-xs text-destructive">{errors["message"]}</span>}
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 font-semibold text-primary-foreground shadow-glow"><Send className="h-4 w-4" />{cta}</button>
    </form>
  );
}
