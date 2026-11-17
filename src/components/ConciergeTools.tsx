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

type T = (en: string, bn: string) => string;

/** Guided creative templates the concierge fills in with the visitor. */
export const TOOL_TEMPLATES = (t: T) => [
  {
    id: "business",
    icon: Briefcase,
    label: t("Business idea builder", "ব্যবসায়িক আইডিয়া তৈরি"),
    hint: t("Idea → plan → AI product", "আইডিয়া → পরিকল্পনা → এআই প্রোডাক্ট"),
    prompt: t(
      "Help me build a business idea with AI. My interest/skill is: ___. Give me 3 ideas for Bangladesh, then for the best one: target customers, AI product to build, automation, BDT startup cost, how AI HUB BD can help, and next 3 steps.",
      "এআই দিয়ে একটি ব্যবসায়িক আইডিয়া তৈরি করতে সাহায্য করুন। আমার আগ্রহ/দক্ষতা: ___। বাংলাদেশের জন্য ৩টি আইডিয়া দিন, তারপর সেরাটির জন্য: লক্ষ্য গ্রাহক, কোন এআই প্রোডাক্ট বানাবো, অটোমেশন, টাকায় শুরুর খরচ, AI HUB BD কীভাবে সাহায্য করবে এবং পরবর্তী ৩টি ধাপ।",
    ),
  },
  {
    id: "image",
    icon: ImageIcon,
    label: t("Image & logo creator", "ছবি ও লোগো ক্রিয়েটর"),
    hint: t("Get a ready image prompt", "প্রস্তুত ইমেজ প্রম্পট"),
    prompt: t(
      "I need an image for: ___ (logo / product photo / social post). Write 3 detailed AI image prompts with style, colours and layout, and tell me which AI HUB BD workstation tools I can use to create it.",
      "আমার একটি ছবি দরকার: ___ (লোগো / প্রোডাক্ট ছবি / সোশ্যাল পোস্ট)। স্টাইল, রং ও লেআউটসহ ৩টি বিস্তারিত এআই ইমেজ প্রম্পট লিখুন এবং AI HUB BD-র কোন টুল দিয়ে বানাতে পারি বলুন।",
    ),
  },
  {
    id: "video",
    icon: Film,
    label: t("Video script maker", "ভিডিও স্ক্রিপ্ট মেকার"),
    hint: t("Scenes, voiceover, captions", "দৃশ্য, ভয়েসওভার, ক্যাপশন"),
    prompt: t(
      "Create a 30-second promo video plan for: ___. Give scene-by-scene shots, voiceover lines, on-screen captions and music mood, plus how the AI HUB BD production studio can help produce it.",
      "এর জন্য ৩০ সেকেন্ডের প্রোমো ভিডিও পরিকল্পনা করুন: ___। দৃশ্যভিত্তিক শট, ভয়েসওভার, স্ক্রিন ক্যাপশন ও মিউজিকের মুড দিন, এবং AI HUB BD প্রোডাকশন স্টুডিও কীভাবে সাহায্য করবে।",
    ),
  },
  {
    id: "audio",
    icon: Music,
    label: t("Audio & jingle writer", "অডিও ও জিঙ্গেল লেখক"),
    hint: t("Podcast, ad or jingle", "পডকাস্ট, বিজ্ঞাপন বা জিঙ্গেল"),
    prompt: t(
      "Write audio content for: ___ (radio ad / jingle / podcast intro). Give the script, tone, voice style and timing.",
      "এর জন্য অডিও কনটেন্ট লিখুন: ___ (রেডিও বিজ্ঞাপন / জিঙ্গেল / পডকাস্ট ইন্ট্রো)। স্ক্রিপ্ট, টোন, কণ্ঠের ধরন ও সময় দিন।",
    ),
  },
];

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

export function ConciergeTools({ onTemplate }: { onTemplate: (prompt: string) => void }) {
  const { t } = useLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" aria-label={t("Open AI tools menu", "এআই টুলস মেনু খুলুন")}>
          <Sparkles className="text-secondary" />
          {t("AI tools", "এআই টুলস")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="z-[60] w-72">
        <DropdownMenuLabel>{t("Create with AI", "এআই দিয়ে তৈরি করুন")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TOOL_TEMPLATES(t).map((tool) => (
          <DropdownMenuItem key={tool.id} onSelect={() => onTemplate(tool.prompt)} className="items-start gap-3 py-2">
            <tool.icon className="mt-0.5 text-secondary" />
            <span>
              <span className="block font-semibold">{tool.label}</span>
              <span className="block text-xs text-muted-foreground">{tool.hint}</span>
            </span>
          </DropdownMenuItem>
        ))}
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
