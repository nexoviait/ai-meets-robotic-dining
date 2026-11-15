import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { CalendarPlus, Cpu, Moon, Sun, Sunrise, Sunset, Ticket, Trash2, UserRound, Zap } from "lucide-react";
import { FOCUS, HUB, SLOTS, WORKSTATIONS, taka } from "@/lib/data";
import { useLocalStorage, uid } from "@/lib/storage";
import { buildIcs, downloadText } from "@/lib/ics";
import { useLang } from "@/lib/i18n";
import { chime, click } from "@/lib/sound";
import { PageHeader } from "@/components/SiteShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a BDT 100 Session — AI HUB BD Dhaka" },
      { name: "description", content: "Reserve an AI workstation, GPU pod or consultation booth at the AI HUB BD Dhaka flagship. Instant QR ticket and calendar export." },
      { property: "og:title", content: "Book your AI HUB BD session" },
      { property: "og:description", content: "BDT 100 entry. Choose a workstation, time slot and focus area — get your QR ticket instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

interface Booking {
  id: string; name: string; phone: string; date: string; slot: string; station: string; focus: string; total: number; createdAt: number;
}

const ICONS = { standard: Cpu, gpu: Zap, booth: UserRound } as const;
const SLOT_ICONS = { morning: Sunrise, afternoon: Sun, evening: Sunset, night: Moon } as const;

const todayStr = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

function BookPage() {
  const { t } = useLang();
  const [bookings, setBookings] = useLocalStorage<Booking[]>("aihub.bookings", []);
  const [station, setStation] = useState("standard");
  const [slot, setSlot] = useState("morning");
  const [focus, setFocus] = useState<string>(FOCUS[0]!);
  const [date, setDate] = useState(todayStr());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [ticket, setTicket] = useState<Booking | null>(null);

  const ws = WORKSTATIONS.find((w) => w.id === station)!;
  const total = ws.price;
  const slotObj = SLOTS.find((s) => s.id === slot)!;

  // Same-day slots that have already ended can't be booked.
  const slotPassed = useMemo(() => {
    if (date !== todayStr()) return () => false;
    const h = new Date().getHours();
    return (id: string) => {
      const s = SLOTS.find((x) => x.id === id)!;
      const end = s.id === "night" ? 30 : s.id === "evening" ? 23 : s.start + 5;
      return h >= end;
    };
  }, [date]);

  const submit = () => {
    setErr("");
    if (!name.trim()) return setErr(t("Please enter your name.", "আপনার নাম দিন।"));
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) return setErr(t("Enter a valid mobile number (01XXXXXXXXX).", "সঠিক মোবাইল নম্বর দিন।"));
    if (!date || date < todayStr()) return setErr(t("Pick today or a future date.", "আজ বা ভবিষ্যতের তারিখ বাছুন।"));
    if (slotPassed(slot)) return setErr(t("That time slot has already passed today.", "এই সময় আজ শেষ হয়ে গেছে।"));
    if (bookings.some((b) => b.date === date && b.slot === slot && b.phone === phone.trim())) return setErr(t("You already have a booking for this slot.", "এই সময়ে আপনার বুকিং আছে।"));
    const b: Booking = { id: uid("HUB-"), name: name.trim(), phone: phone.trim(), date, slot, station, focus, total, createdAt: Date.now() };
    setBookings((p) => [b, ...p]);
    setTicket(b);
    chime();
    toast.success(t("Ticket confirmed!", "টিকিট নিশ্চিত!"));
    setTimeout(() => document.getElementById("ticket")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const exportIcs = (b: Booking) => {
    const s = SLOTS.find((x) => x.id === b.slot)!;
    const start = new Date(`${b.date}T${String(s.start).padStart(2, "0")}:00:00`);
    downloadText(
      buildIcs({ id: b.id, title: `AI HUB BD session — ${WORKSTATIONS.find((w) => w.id === b.station)?.name}`, start, hours: 5, location: HUB.address, description: `Ticket ${b.id} · Focus: ${b.focus}` }),
      `${b.id}.ics`,
      "text/calendar",
    );
  };

  const upcoming = bookings.filter((b) => b.date >= todayStr());

  return (
    <>
      <PageHeader kicker={t("Workstation booking", "ওয়ার্কস্টেশন বুকিং")} title={<>{t("Book your", "বুক করুন আপনার")} <span className="text-gradient">৳100</span> {t("session", "সেশন")}</>} sub={t("Reserve a seat at the Dhaka flagship. Open 6:00 AM – 11:00 PM, Night Owl seats 24/7.", "ঢাকা ফ্ল্যাগশিপে সিট রিজার্ভ করুন।")} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-10">
          <Step n={1} title={t("Choose workstation type", "ওয়ার্কস্টেশন বাছুন")}>
            <div className="grid gap-3 md:grid-cols-3">
              {WORKSTATIONS.map((w) => {
                const I = ICONS[w.id as keyof typeof ICONS];
                return (
                  <button key={w.id} onClick={() => { click(); setStation(w.id); }} className={cn("glass rounded-2xl p-5 text-left transition", station === w.id && "ring-2 ring-primary shadow-glow")}>
                    <I className="h-6 w-6 text-secondary" />
                    <p className="mt-3 font-bold">{w.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{w.desc}</p>
                    <p className="mt-3 font-extrabold">{taka(w.price)}</p>
                  </button>
                );
              })}
            </div>
          </Step>
          <Step n={2} title={t("Pick date & time slot", "তারিখ ও সময় বাছুন")}>
            <input type="date" value={date} min={todayStr()} onChange={(e) => setDate(e.target.value)} className="mb-4 rounded-lg border border-input bg-background px-3 py-2 [color-scheme:dark]" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {SLOTS.map((s) => {
                const I = SLOT_ICONS[s.id as keyof typeof SLOT_ICONS];
                const passed = slotPassed(s.id);
                return (
                  <button key={s.id} disabled={passed} onClick={() => { click(); setSlot(s.id); }} className={cn("glass rounded-2xl p-4 text-left transition disabled:opacity-40", slot === s.id && !passed && "ring-2 ring-secondary shadow-cyan")}>
                    <I className="h-5 w-5 text-gold" />
                    <p className="mt-2 font-bold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{passed ? t("Ended today", "আজ শেষ") : s.time}</p>
                  </button>
                );
              })}
            </div>
          </Step>
          <Step n={3} title={t("Select focus area", "ফোকাস এরিয়া")}>
            <div className="flex flex-wrap gap-2">
              {FOCUS.map((f) => (
                <button key={f} onClick={() => { click(); setFocus(f); }} className={cn("rounded-full border px-4 py-2 text-sm font-semibold", focus === f ? "border-primary bg-primary/20" : "border-border text-muted-foreground")}>{f}</button>
              ))}
            </div>
          </Step>
          <Step n={4} title={t("Your details", "আপনার তথ্য")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={t("Full name", "পূর্ণ নাম")} className="rounded-lg border border-input bg-background px-3 py-2.5" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={11} inputMode="tel" placeholder="01XXXXXXXXX" className="rounded-lg border border-input bg-background px-3 py-2.5" />
            </div>
          </Step>
        </div>
        <aside>
          <div className="glass sticky top-24 rounded-2xl p-6">
            <h2 className="font-bold">{t("Summary", "সারসংক্ষেপ")}</h2>
            <dl className="mt-4 grid gap-2 text-sm">
              {[[t("Workstation", "ওয়ার্কস্টেশন"), ws.name], [t("Date", "তারিখ"), date], [t("Slot", "সময়"), `${slotObj.name} · ${slotObj.time}`], [t("Focus", "ফোকাস"), focus]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-extrabold"><span>{t("Total", "মোট")}</span><span>{taka(total)}</span></div>
            <p className="mt-1 text-xs text-muted-foreground">{t("Pay at check-in with bKash, Nagad, card or cash.", "চেক-ইনে bKash, Nagad, কার্ড বা ক্যাশে পরিশোধ করুন।")}</p>
            {err && <p className="mt-3 rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{err}</p>}
            <button onClick={submit} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 font-semibold text-primary-foreground shadow-glow"><Ticket className="h-4 w-4" />{t("Generate ticket", "টিকিট তৈরি করুন")}</button>
          </div>
        </aside>
      </div>

      {ticket && (
        <section id="ticket" className="mx-auto max-w-2xl animate-fade-up px-4">
          <div className="overflow-hidden rounded-3xl border border-primary/50 shadow-glow">
            <div className="bg-gradient-brand px-6 py-4 text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-widest">AI HUB BD · Dhaka Flagship</p>
              <p className="text-2xl font-extrabold">{t("Entry Ticket", "প্রবেশ টিকিট")}</p>
            </div>
            <div className="grid gap-6 bg-card p-6 sm:grid-cols-[auto_1fr]">
              <div className="mx-auto rounded-xl bg-foreground p-3"><QRCodeSVG value={`aihubbd://checkin/${ticket.id}`} size={140} /></div>
              <div className="grid gap-1 text-sm">
                <p className="text-2xl font-extrabold">{ticket.id}</p>
                <p>{ticket.name} · {ticket.phone}</p>
                <p className="text-muted-foreground">{WORKSTATIONS.find((w) => w.id === ticket.station)?.name}</p>
                <p className="text-muted-foreground">{ticket.date} · {SLOTS.find((s) => s.id === ticket.slot)?.time}</p>
                <p className="text-muted-foreground">{t("Focus", "ফোকাস")}: {ticket.focus}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => exportIcs(ticket)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold"><CalendarPlus className="h-4 w-4" />{t("Add to calendar", "ক্যালেন্ডারে যোগ")}</button>
                </div>
              </div>
            </div>
            <p className="bg-steel px-6 py-3 text-xs text-muted-foreground">{t("Show this QR at the entrance scanner. Arrive within 30 minutes of your slot start.", "প্রবেশপথে এই QR দেখান।")}</p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <h2 className="text-xl font-bold">{t("My bookings", "আমার বুকিং")}</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{t("No upcoming bookings yet.", "কোনো আসন্ন বুকিং নেই।")}</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {upcoming.map((b) => (
              <div key={b.id} className="glass flex items-center justify-between gap-3 rounded-xl p-4">
                <button onClick={() => setTicket(b)} className="min-w-0 text-left">
                  <p className="font-bold">{b.id}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.date} · {SLOTS.find((s) => s.id === b.slot)?.name} · {WORKSTATIONS.find((w) => w.id === b.station)?.name}</p>
                </button>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => exportIcs(b)} className="rounded-lg border border-border p-2" aria-label="Add to calendar"><CalendarPlus className="h-4 w-4" /></button>
                  <button onClick={() => { setBookings((p) => p.filter((x) => x.id !== b.id)); if (ticket?.id === b.id) setTicket(null); toast(t("Booking cancelled", "বুকিং বাতিল")); }} className="rounded-lg border border-border p-2 text-destructive" aria-label="Cancel booking"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 flex items-center gap-3 text-lg font-bold"><span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-sm text-primary-foreground">{n}</span>{title}</h2>
      {children}
    </div>
  );
}
