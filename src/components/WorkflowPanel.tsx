import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { buildWorkflowPrompt, type Workflow } from "@/lib/concierge-workflows";
import { cn } from "@/lib/utils";

export function WorkflowPanel({ workflow, onCancel, onSubmit }: { workflow: Workflow; onCancel: () => void; onSubmit: (prompt: string) => void }) {
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const total = workflow.fields.length + 1;
  const field = workflow.fields[step];
  const value = field ? values[field.id] ?? "" : "";
  const blocked = !!field?.required && !value.trim();
  const next = () => !blocked && setStep((s) => Math.min(s + 1, total - 1));

  return (
    <section aria-label={workflow.title[lang]} className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-bold"><Sparkles className="h-4 w-4 shrink-0 text-secondary" />{workflow.title[lang]}</p>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {t(`Step ${step + 1} of ${total}`, `ধাপ ${step + 1} / ${total}`)}
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onCancel} aria-label={t("Close workflow", "ওয়ার্কফ্লো বন্ধ করুন")}><X /></Button>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-secondary" : "bg-muted")} />
        ))}
      </div>

      {field ? (
        <form className="mt-3" onSubmit={(e) => { e.preventDefault(); next(); }}>
          <label htmlFor={`wf-${field.id}`} className="text-sm font-semibold">
            {field.label[lang]} {field.required ? <span className="text-destructive">*</span> : <span className="text-xs font-normal text-muted-foreground">({t("optional", "ঐচ্ছিক")})</span>}
          </label>
          {field.options && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {field.options.map((o) => (
                <Button key={o.en} type="button" size="sm" variant={value === o[lang] ? "default" : "outline"} className="h-auto py-1.5" aria-pressed={value === o[lang]}
                  onClick={() => setValues((v) => ({ ...v, [field.id]: o[lang] }))}>
                  {o[lang]}
                </Button>
              ))}
            </div>
          )}
          <input
            id={`wf-${field.id}`}
            autoFocus
            value={value}
            maxLength={300}
            onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
            placeholder={field.options ? t("Or type your own…", "অথবা নিজে লিখুন…") : field.placeholder[lang]}
            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="mt-3 flex justify-between gap-2">
            <Button type="button" variant="outline" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ArrowLeft />{t("Back", "পেছনে")}</Button>
            <Button type="submit" size="sm" disabled={blocked}>{t("Next", "পরবর্তী")}<ArrowRight /></Button>
          </div>
        </form>
      ) : (
        <div className="mt-3">
          <p className="text-sm font-semibold">{t("Review — your result will include:", "পর্যালোচনা — ফলাফলে থাকবে:")}</p>
          <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
            {workflow.template.map((s) => <li key={s} className="flex gap-1.5"><Check className="h-3.5 w-3.5 shrink-0 text-success" />{s}</li>)}
          </ul>
          <dl className="mt-3 grid gap-1 rounded-lg bg-muted/50 p-2 text-xs">
            {workflow.fields.filter((f) => values[f.id]?.trim()).map((f) => (
              <div key={f.id} className="flex gap-1"><dt className="font-semibold">{f.label[lang]}:</dt><dd className="min-w-0 break-words">{values[f.id]}</dd></div>
            ))}
          </dl>
          <div className="mt-3 flex justify-between gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}><ArrowLeft />{t("Back", "পেছনে")}</Button>
            <Button type="button" size="sm" onClick={() => onSubmit(buildWorkflowPrompt(workflow, values, lang))}><Sparkles />{t("Generate", "তৈরি করুন")}</Button>
          </div>
        </div>
      )}
    </section>
  );
}
