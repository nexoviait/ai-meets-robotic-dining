import { createFileRoute } from "@tanstack/react-router";
import { Clock, Coffee, Mail, MapPin, MessageCircle } from "lucide-react";
import { HUB } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { PageHeader } from "@/components/SiteShell";
import { LeadForm } from "@/components/LeadForm";
import building from "@/assets/gawsia-twin-peak.jpg.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — AI HUB BD Dhaka Flagship" },
      { name: "description", content: `Visit AI HUB BD at ${HUB.address}. Open 6:00 AM – 11:00 PM, café 24/7. Corporate inquiries, feedback and WhatsApp.` },
      { property: "og:title", content: "Visit AI HUB BD in Dhaka" },
      { property: "og:description", content: `Find AI HUB BD at ${HUB.address}. Open 6 AM – 11 PM daily, robotic café 24/7.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  const info = [
    { icon: MapPin, label: t("Address", "ঠিকানা"), value: HUB.address },
    { icon: Clock, label: t("Hub hours", "হাবের সময়"), value: HUB.hours },
    { icon: Coffee, label: t("Café", "ক্যাফে"), value: HUB.cafe },
    { icon: Mail, label: "Email", value: HUB.email },
  ];
  return (
    <>
      <PageHeader kicker={t("Hub location & contact", "লোকেশন ও যোগাযোগ")} title={<>{t("Come build with us in", "আমাদের সাথে তৈরি করুন")} <span className="text-gradient">{t("Dhaka", "ঢাকায়")}</span></>} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <div className="overflow-hidden rounded-3xl border border-border"><img src={building.url} alt="Night-time exterior of Gawsia Twin Peak, showing its illuminated multi-storey facade and entrance at 30 N Circular Rd, Dhaka 1205" className="aspect-video w-full object-contain" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {info.map((i) => (
              <div key={i.label} className="glass rounded-2xl p-4"><i.icon className="h-5 w-5 text-secondary" /><p className="mt-2 text-xs text-muted-foreground">{i.label}</p><p className="font-semibold">{i.value}</p></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`https://wa.me/${HUB.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-success px-5 py-3 font-semibold text-primary-foreground"><MessageCircle className="h-4 w-4" />{t("Chat on WhatsApp", "WhatsApp-এ চ্যাট")}</a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HUB.address)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold"><MapPin className="h-4 w-4" />{t("Open in Maps", "ম্যাপে দেখুন")}</a>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-extrabold">{t("Send us a message", "বার্তা পাঠান")}</h2>
          <LeadForm kinds={[t("Corporate inquiry", "কর্পোরেট অনুসন্ধান"), t("Feedback", "মতামত"), t("General", "সাধারণ")]} cta={t("Send message", "বার্তা পাঠান")} />
        </div>
      </section>
    </>
  );
}
