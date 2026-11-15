import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Cpu, Menu, Volume2, VolumeX, X, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useLocalStorage } from "@/lib/storage";
import { HUB } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ConciergeWidget } from "./ConciergeWidget";

const NAV = [
  { to: "/", en: "Home", bn: "হোম" },
  { to: "/order", en: "Order Food", bn: "খাবার অর্ডার" },
  { to: "/book", en: "Book a Seat", bn: "সিট বুকিং" },
  { to: "/solutions", en: "Solutions & ROI", bn: "সমাধান ও ROI" },
  { to: "/investors", en: "Investors", bn: "বিনিয়োগকারী" },
  { to: "/contact", en: "Contact", bn: "যোগাযোগ" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
        <Cpu className="h-5 w-5 text-primary-foreground" />
      </span>
      <span className="truncate text-lg font-extrabold tracking-tight">
        AI HUB <span className="text-gradient">BD</span>
      </span>
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLang();
  const [sound, setSound] = useLocalStorage("aihub.sound", true);
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="no-print sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:flex lg:justify-between">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-accent !text-foreground" }}
              >
                {t(n.en, n.bn)}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold"
              aria-label="Toggle language"
            >
              {lang === "en" ? "বাংলা" : "EN"}
            </button>
            <button
              onClick={() => setSound(!sound)}
              className="rounded-lg border border-border p-1.5"
              aria-label={sound ? "Mute kiosk sounds" : "Enable kiosk sounds"}
            >
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <Link to="/book" className="hidden rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow sm:inline-flex">
              {t("Book ৳100 Session", "৳১০০ সেশন বুক")}
            </Link>
            <button className="rounded-lg border border-border p-1.5 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-border px-4 py-3 lg:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium" activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "bg-accent" }}>
                {t(n.en, n.bn)}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="no-print mt-24 border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              {t("Bangladesh's first physical AI innovation hub.", "বাংলাদেশের প্রথম ফিজিক্যাল এআই ইনোভেশন হাব।")} Idea → AI → Product → Automation → Business
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">{t("Visit", "ঠিকানা")}</p>
            <p className="mt-2 text-muted-foreground">{HUB.address}</p>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(HUB.address)}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-secondary underline underline-offset-4">{t("Get directions", "দিকনির্দেশনা")}</a>
            <p className="mt-1 text-muted-foreground">{HUB.hours} · {HUB.cafe}</p>
          </div>
          <div className="grid content-start gap-2 text-sm">
            <p className="font-semibold">{t("Explore", "দেখুন")}</p>
            {NAV.slice(1).map((n) => (
              <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-foreground">{t(n.en, n.bn)}</Link>
            ))}
          </div>
        </div>
        <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 AI HUB BD · Dhaka, Bangladesh</p>
      </footer>
      <a
        href={`https://wa.me/${HUB.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className={cn("no-print fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-success text-primary-foreground shadow-cyan")}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <ConciergeWidget />
    </div>
  );
}

export function PageHeader({ kicker, title, sub }: { kicker: string; title: ReactNode; sub?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border grid-bg">
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">{sub}</p>}
      </div>
    </section>
  );
}

export function PayBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-md bg-bkash px-2 py-1 text-xs font-extrabold text-primary-foreground">bKash</span>
      <span className="rounded-md bg-nagad px-2 py-1 text-xs font-extrabold text-primary-foreground">Nagad</span>
      <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">Card</span>
      <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">QR</span>
    </div>
  );
}
