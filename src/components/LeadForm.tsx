import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, Send } from "lucide-react";
import { inquirySchema, type InquiryInput } from "@/lib/inquiry-schema";
import { submitInquiry } from "@/lib/inquiries.functions";
import { Button } from "@/components/ui/button";
import { HUB } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export interface Lead { id: string; kind: string; name: string; email: string; phone?: string | undefined; company?: string | undefined; message: string; createdAt: number }

export function LeadForm({ kinds, defaultKind, cta, source = "contact" }: { kinds: string[]; defaultKind?: string; cta: string; source?: InquiryInput["source"] }) {
  const { t } = useLang();
  const saveInquiry = useServerFn(submitInquiry);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [kind, setKind] = useState(defaultKind ?? kinds[0] ?? "General");
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Lead | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    const r = inquirySchema.safeParse({ ...f, kind, source });
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setSubmitError("");
    setPending(true);
    try {
      const result = await saveInquiry({ data: r.data });
      setSent({ ...r.data, ...result });
      toast.success(t("Request received", "অনুরোধ গৃহীত"));
    } catch {
      setSubmitError(t("Your request could not be saved. Please try again.", "অনুরোধ সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setPending(false);
    }
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
          <Button variant="outline" onClick={() => { setSent(null); setF({ name: "", email: "", phone: "", company: "", message: "" }); }}>{t("Send another", "আরেকটি পাঠান")}</Button>
        </div>
      </div>
    );
  }

  const field = (k: keyof typeof f, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
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
             <Button variant="outline" type="button" key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className={kind === k ? "border-primary bg-primary/20" : "text-muted-foreground"}>{k}</Button>
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
      {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
      <Button type="submit" disabled={pending} className="h-12 bg-gradient-brand font-semibold shadow-glow"><Send className="h-4 w-4" />{pending ? t("Sending…", "পাঠানো হচ্ছে…") : cta}</Button>
    </form>
  );
}
