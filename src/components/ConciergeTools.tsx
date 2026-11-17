import { useEffect, useRef, useState } from "react";
import { Briefcase, Film, Image as ImageIcon, Mic, MicOff, Music, Sparkles, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLang } from "@/lib/i18n";
import { WORKFLOWS, type Workflow } from "@/lib/concierge-workflows";

const ICONS = { business: Briefcase, image: ImageIcon, video: Film, audio: Music };


type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getRecognition(): (new () => Recognition) | undefined {
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"]) as (new () => Recognition) | undefined;
}

export function ConciergeTools({ onPick }: { onPick: (w: Workflow) => void }) {
  const { t, lang } = useLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" aria-label={t("Open AI tools menu", "এআই টুলস মেনু খুলুন")}>
          <Sparkles className="text-secondary" />
          {t("AI tools", "এআই টুলস")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="z-[60] w-72">
        <DropdownMenuLabel>{t("Guided workflows", "ধাপে ধাপে ওয়ার্কফ্লো")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WORKFLOWS.map((w) => {
          const Icon = ICONS[w.id];
          return (
          <DropdownMenuItem key={w.id} onSelect={() => onPick(w)} className="items-start gap-3 py-2">
            <Icon className="mt-0.5 text-secondary" />
            <span>
              <span className="block font-semibold">{w.title[lang]}</span>
              <span className="block text-xs text-muted-foreground">{w.hint[lang]}</span>
            </span>
          </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Voice typing using the browser's speech recognition (English or Bangla). */
export function VoiceInputButton({ onText, disabled }: { onText: (text: string) => void; disabled?: boolean }) {
  const { t, lang } = useLang();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const rec = useRef<Recognition | null>(null);
  useEffect(() => {
    setSupported(!!getRecognition());
    return () => rec.current?.stop();
  }, []);
  if (!supported) return null;
  const toggle = () => {
    if (listening) return rec.current?.stop();
    const R = getRecognition();
    if (!R) return;
    const r = new R();
    r.lang = lang === "bn" ? "bn-BD" : "en-US";
    r.interimResults = false;
    r.continuous = false;
    r.onresult = (e) => {
      const text = Array.from(e.results).map((x) => x[0]?.transcript ?? "").join(" ").trim();
      if (text) onText(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };
  return (
    <Button
      type="button"
      variant={listening ? "default" : "outline"}
      size="icon-sm"
      disabled={disabled}
      onClick={toggle}
      aria-pressed={listening}
      aria-label={listening ? t("Stop voice input", "ভয়েস ইনপুট থামান") : t("Speak your message", "কথা বলে বার্তা দিন")}
      title={listening ? t("Listening…", "শুনছি…") : t("Voice input", "ভয়েস ইনপুট")}
    >
      {listening ? <MicOff /> : <Mic />}
    </Button>
  );
}

/** Speaks text aloud with the browser voice, in the current site language. */
export function speak(text: string, lang: "en" | "bn") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[#*_`>|[\]()]/g, "").slice(0, 3000);
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = lang === "bn" ? "bn-BD" : "en-US";
  window.speechSynthesis.speak(u);
}

export function ReadAloudToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const { t } = useLang();
  return (
    <Button
      type="button"
      variant={on ? "default" : "outline"}
      size="icon-sm"
      onClick={() => {
        if (on) window.speechSynthesis?.cancel();
        onChange(!on);
      }}
      aria-pressed={on}
      aria-label={on ? t("Turn off spoken replies", "কথ্য উত্তর বন্ধ") : t("Read replies aloud", "উত্তর পড়ে শোনান")}
      title={t("Voice replies", "ভয়েস উত্তর")}
    >
      {on ? <Volume2 /> : <VolumeX />}
    </Button>
  );
}
