import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Clapperboard,
  Factory,
  HeartPulse,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
  Sparkles,
  MessageSquare,
  Briefcase,
  Film,
  Image as ImageIcon,
  Music,
  Mic,
  Check,
  Clock,
  Cpu,
  MapPin,
  Ticket,
  Users,
  Monitor,
  UserCheck,
  Globe,
} from "lucide-react";
import {
  ASSISTANT,
  CATEGORY_LABEL,
  JOURNEY,
  MENU,
  PACKAGES,
  SECTORS,
  STATIONS,
  ZONES,
  taka,
  type StationId,
} from "@/lib/data";
import { STATION_IMG } from "@/lib/station-media";
import { useLang } from "@/lib/i18n";
import { PayBadges } from "@/components/SiteShell";
import { openConcierge } from "@/lib/concierge-open";
import { WORKFLOWS } from "@/lib/concierge-workflows";
import conciergeAvatar from "@/assets/concierge.png";
import { click } from "@/lib/sound";
import heroImg from "@/assets/hero-ai-hub.jpg";
import floorConcept from "@/assets/hub-floor-concept.jpg";
import { cn } from "@/lib/utils";
import { KeyScrollRegion } from "@/components/KeyScrollRegion";
import { FloorZoneExplorer } from "@/components/FloorZoneExplorer";
import { StationListbox } from "@/components/StationListbox";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI HUB BD — Idea → AI → Product → Automation → Business" },
      {
        name: "description",
        content:
          "Chat with AI HUB BD's bilingual AI to turn ideas into businesses, plus a Dhaka flagship with 200+ workstations, human consultants and robotic café, with a vision for 64 district hubs.",
      },
      { property: "og:title", content: "AI HUB BD — Bangladesh's National AI Innovation Network" },
      {
        property: "og:description",
        content:
          "Explore the Dhaka flagship and AI HUB BD's proposed 64-district national AI innovation and entrepreneurship network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Section({
  id,
  kicker,
  title,
  sub,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 pt-24">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{kicker}</p>
      <h2 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Index() {
  const { t } = useLang();
  return (
    <>
      <Hero />
      <AiChatFeature />
      <StationExplorer />
      <Section
        kicker={t("The value proposition", "আমাদের মূল্য প্রস্তাব")}
        title={t(
          "Three layers that turn an idea into a business",
          "তিনটি স্তর যা আইডিয়াকে ব্যবসায় রূপ দেয়",
        )}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: Monitor,
              title: "AI Workstation",
              body: "Premium AI tools and local compute on 200+ seats — no subscriptions or hardware to buy.",
            },
            {
              n: "02",
              icon: UserCheck,
              title: "Human Consultant",
              body: "Experts review every AI output, design your solution and recommend the right package.",
            },
            {
              n: "03",
              icon: Globe,
              title: "Digital Platform",
              body: "Your projects, subscriptions and automations continue online after you leave the hub.",
            },
          ].map((v) => (
            <div
              key={v.n}
              className="glass group rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-extrabold text-gradient">{v.n}</span>
                <v.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="mt-6 text-xl font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section
        kicker={t("Product packages", "প্রোডাক্ট প্যাকেজ")}
        title={t("From first launch to enterprise AI", "প্রথম লঞ্চ থেকে এন্টারপ্রাইজ এআই")}
        sub="Fixed-scope packages priced for Bangladeshi businesses. Every package starts with a BDT 100 discovery session."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <div
              key={p.id}
              className={cn(
                "glass flex flex-col rounded-2xl p-6",
                i === 1 && "ring-1 ring-primary shadow-glow",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{p.name}</h3>
                {i === 1 && (
                  <span className="rounded-full bg-gradient-brand px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-2xl font-extrabold">
                {taka(p.range[0])} – {p.range[1] >= 5000000 ? "৳50 Lakh+" : taka(p.range[1])}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 grid gap-1.5 text-sm">
                {p.includes.map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    {x}
                  </li>
                ))}
              </ul>
              <Link
                to="/solutions"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-secondary"
              >
                Get a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Section>
      <Sectors />
      <FloorPlan />
      <Section
        kicker={t("Customer journey", "গ্রাহক যাত্রা")}
        title={t("Six steps from booking to growth", "বুকিং থেকে প্রবৃদ্ধি — ছয় ধাপ")}
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {JOURNEY.map(([title, body], i) => (
            <li key={title} className="glass relative rounded-2xl p-5">
              <span className="text-sm font-extrabold text-gold">0{i + 1}</span>
              <h3 className="mt-2 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Start with step 01 — Book <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/investors"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold"
          >
            Investor memorandum
          </Link>
        </div>
      </Section>
    </>
  );
}

function Hero() {
  const { t } = useLang();
  const badges = [
    { icon: MapPin, label: t("Dhaka Flagship", "ঢাকা ফ্ল্যাগশিপ") },
    { icon: Clock, label: t("24/7 Automated Service", "২৪/৭ স্বয়ংক্রিয় সেবা") },
    { icon: Ticket, label: t("BDT 100 Entry Ticket", "৳১০০ প্রবেশ টিকিট") },
    { icon: Cpu, label: t("200+ Workstations", "২০০+ ওয়ার্কস্টেশন") },
  ];
  return (
    <section className="relative overflow-hidden grid-bg">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-8 sm:py-16 md:py-24 lg:grid-cols-2">
        <div className="animate-fade-up">
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.label}
                className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success live-dot" />
                <b.icon className="h-3.5 w-3.5 text-secondary" />
                {b.label}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            {t("Bangladesh's first", "বাংলাদেশের প্রথম")}{" "}
            <span className="text-gradient">{t("physical AI hub", "ফিজিক্যাল এআই হাব")}</span>
          </h1>
          <p className="mt-3 text-base font-semibold text-gold sm:mt-4 sm:text-lg">
            Idea → AI → Product → Automation → Business
          </p>
          <p className="mt-3 max-w-xl text-[0.95rem] text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
            {t(
              "An 8,000 sq ft flagship in Dhaka with 200+ AI-enabled workstations, human consultants, a production studio and a robotic food café — connected to a digital platform that keeps your business growing.",
              "ঢাকায় ৮,০০০ বর্গফুটের ফ্ল্যাগশিপ — ২০০+ এআই ওয়ার্কস্টেশন, মানব কনসালট্যান্ট, প্রোডাকশন স্টুডিও ও রোবোটিক ফুড ক্যাফে।",
            )}
          </p>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow"
            >
              <Sparkles className="h-4 w-4" />{" "}
              {t(`Chat with ${ASSISTANT.name} — free`, `${ASSISTANT.nameBn}-এর সাথে চ্যাট — ফ্রি`)}
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 font-semibold"
            >
              {t("Book a ৳100 session", "৳১০০ সেশন বুক করুন")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-3 sm:mt-10 sm:gap-4">
            {[
              ["64", "district network vision"],
              ["8,000", "sq ft minimum / hub"],
              ["$100M", "national framework"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-xl font-extrabold sm:text-2xl">{v}</dt>
                <dd className="text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border shadow-glow sm:rounded-3xl">
            <img
              src={heroImg}
              alt="Entrepreneurs and consultants using AI workstations at AI HUB BD to turn ideas into AI products and automation"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full object-cover object-[50%_40%]"
            />
          </div>
          <div className="glass absolute -bottom-5 left-3 right-3 flex items-center gap-3 rounded-2xl px-3 py-2.5 sm:left-4 sm:right-auto sm:px-4 sm:py-3 md:-left-6">
            <Users className="h-5 w-5 shrink-0 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">
                {t("Use AI tools today", "আজই এআই ব্যবহার করুন")}
              </p>
              <p className="text-sm font-bold">Idea · AI · Product · Automation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FLOW_ICONS = { business: Briefcase, image: ImageIcon, video: Film, audio: Music };

function AiChatFeature() {
  const { t, lang } = useLang();
  return (
    <Section
      id="ai-chat"
      kicker={t(`Our main feature · ${ASSISTANT.name}`, `আমাদের প্রধান ফিচার · ${ASSISTANT.nameBn}`)}
      title={t(
        `Chat with ${ASSISTANT.name} — turn your idea into a business`,
        `${ASSISTANT.nameBn}-এর সাথে চ্যাট করুন — আইডিয়াকে ব্যবসায় রূপ দিন`,
      )}
      sub={t(
        "Ask anything in English or Bangla, type or speak, and use guided workflows to get a full business plan, image prompts, video storyboards and jingles in minutes.",
        "ইংরেজি বা বাংলায় যেকোনো প্রশ্ন করুন, লিখে বা বলে — আর ধাপে ধাপে ওয়ার্কফ্লো দিয়ে মিনিটেই পান ব্যবসায়িক পরিকল্পনা, ইমেজ প্রম্পট, ভিডিও স্টোরিবোর্ড ও জিঙ্গেল।",
      )}
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="glass relative flex flex-col overflow-hidden rounded-3xl p-6 shadow-glow lg:col-span-2">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
          <img
            src={conciergeAvatar}
            alt=""
            width={72}
            height={72}
            loading="lazy"
            className="relative h-[72px] w-[72px]"
          />
          <h3 className="relative mt-4 text-2xl font-extrabold">
            {t("Your AI co-founder, 24/7", "আপনার এআই কো-ফাউন্ডার, ২৪/৭")}
          </h3>
          <ul className="relative mt-4 grid gap-2 text-sm">
            {[
              [MessageSquare, t("Smart answers in English & Bangla", "ইংরেজি ও বাংলায় স্মার্ট উত্তর")],
              [Mic, t("Speak your question, hear the answer", "বলে প্রশ্ন করুন, শুনে উত্তর পান")],
              [Sparkles, t("Step-by-step guided workflows", "ধাপে ধাপে গাইডেড ওয়ার্কফ্লো")],
              [Check, t("Saved conversations in your browser", "আপনার ব্রাউজারে কথোপকথন সংরক্ষিত")],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Check;
              return (
                <li key={label as string} className="flex gap-2">
                  <I className="h-4 w-4 shrink-0 text-secondary" />
                  {label as string}
                </li>
              );
            })}
          </ul>
          <Link
            to="/chat"
            className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            <Sparkles className="h-4 w-4" /> {t("Start chatting", "চ্যাট শুরু করুন")}
          </Link>
          <p className="relative mt-3 text-center text-xs text-muted-foreground">
            {t(
              "Free online · go deeper at the hub with a ৳100 session",
              "অনলাইনে ফ্রি · হাবে ৳১০০ সেশনে আরও গভীরে যান",
            )}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {WORKFLOWS.map((w) => {
            const Icon = FLOW_ICONS[w.id];
            return (
              <button
                key={w.id}
                onClick={() => openConcierge(w.id)}
                className="glass group flex flex-col rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:shadow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold">{w.title[lang]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.hint[lang]}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t(
                    `${w.fields.length} quick questions → ${w.template.length}-part result`,
                    `${w.fields.length}টি ছোট প্রশ্ন → ${w.template.length} অংশের ফলাফল`,
                  )}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-secondary">
                  {t("Start workflow", "ওয়ার্কফ্লো শুরু")}{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function StationExplorer() {
  const { t, lang } = useLang();
  const [active, setActive] = useState<StationId>("coffee");
  const st = STATIONS.find((s) => s.id === active)!;
  const items = MENU.filter((m) => st.categories.includes(m.category));
  return (
    <Section
      id="stations"
      kicker={t("Food station & kiosk explorer", "ফুড স্টেশন ও কিয়স্ক")}
      title={t("Four robotic stations. One tap to order.", "চারটি রোবোটিক স্টেশন। এক ট্যাপে অর্ডার।")}
    >
      <StationListbox
        value={active}
        onChange={(station) => {
          click();
          setActive(station);
        }}
      />
      <div key={active} className="mt-6 grid animate-fade-up gap-6 lg:grid-cols-5">
        <div className="relative overflow-hidden rounded-3xl border border-border lg:col-span-3">
          <img
            src={STATION_IMG[active]}
            alt={st.name}
            className="aspect-[16/9] h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
              {st.tagline}
            </p>
            <h3 className="text-xl font-extrabold md:text-2xl">
              {lang === "bn" ? st.bn : st.name}
            </h3>
          </div>
        </div>
        <div className="glass flex flex-col rounded-3xl p-5 lg:col-span-2">
          <ul className="grid gap-2 text-sm">
            {st.features.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="h-4 w-4 text-success" />
                {f}
              </li>
            ))}
          </ul>
          <KeyScrollRegion
            label={t("Station menu list", "স্টেশন মেনু তালিকা")}
            positionLabel={(p) => t(`Menu scrolled to ${p}%`, `মেনু ${p}% পর্যন্ত স্ক্রল হয়েছে`)}
            className="mt-4 max-h-72 flex-1 overflow-y-auto pr-2"
          >
            {st.categories.map((c) => (
              <div key={c} className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gold">
                  {CATEGORY_LABEL[c][lang === "bn" ? 1 : 0]} {t("Menu", "মেনু")}
                </p>
                {items
                  .filter((i) => i.category === c)
                  .map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between border-b border-border/60 py-1.5 text-sm"
                    >
                      <span>
                        {i.emoji} {lang === "bn" ? i.bn : i.name}
                      </span>
                      <span className="font-semibold">{taka(i.price)}</span>
                    </div>
                  ))}
              </div>
            ))}
          </KeyScrollRegion>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <PayBadges />
            <Link
              to="/order"
              search={{ station: active }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              {t("Order now", "এখনই অর্ডার")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

// Explicit map: a wildcard lucide import pulls every icon into the home page bundle.
const SECTOR_ICONS: Record<string, LucideIcon> = {
  ShoppingBag,
  UtensilsCrossed,
  Briefcase,
  HeartPulse,
  Building2,
  Factory,
  Clapperboard,
};

function Sectors() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <Section
      kicker={t("Sector playbooks", "সেক্টর প্লেবুক")}
      title={t("Proven plays for your industry", "আপনার শিল্পের জন্য প্রমাণিত সমাধান")}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTORS.map((s, i) => {
          const Icon = SECTOR_ICONS[s.icon] ?? Sparkles;
          return (
            <button
              key={s.name}
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              className={cn(
                "glass rounded-2xl p-5 text-left transition",
                open === i && "ring-1 ring-secondary shadow-cyan",
              )}
            >
              <Icon className="h-6 w-6 text-secondary" />
              <h3 className="mt-3 font-bold">{s.name}</h3>
              {open === i ? (
                <ul className="mt-2 grid gap-1 text-sm text-muted-foreground animate-fade-up">
                  {s.plays.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">Tap to see the playbook</p>
              )}
            </button>
          );
        })}
        <Link
          to="/solutions"
          className="grid place-items-center rounded-2xl border border-dashed border-primary/60 p-5 text-center font-semibold text-primary-glow"
        >
          Calculate your ROI →
        </Link>
      </div>
    </Section>
  );
}

function FloorPlan() {
  const { t } = useLang();
  return (
    <Section
      kicker={t("Flagship hub experience", "ফ্ল্যাগশিপ হাব")}
      title={t("A zoned 8,000 sq ft floor in Dhaka", "ঢাকায় ৮,০০০ বর্গফুটের জোনভিত্তিক ফ্লোর")}
    >
      <figure className="mb-8">
        <img
          src={floorConcept}
          alt="Illustrative overhead concept of the AI HUB BD floor with workstation rows, consultation rooms, a production studio, training area and robotic café; not the actual office"
          loading="lazy"
          width={1536}
          height={1024}
          className="aspect-[3/2] w-full rounded-lg object-contain"
        />
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {t(
            "Sample floor concept · Illustrative only, not the actual office layout",
            "নমুনা ফ্লোর ধারণা · শুধুমাত্র চিত্রায়ন, প্রকৃত অফিসের বিন্যাস নয়",
          )}
        </figcaption>
      </figure>
      <FloorZoneExplorer />
    </Section>
  );
}
