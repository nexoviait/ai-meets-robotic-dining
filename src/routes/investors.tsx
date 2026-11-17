import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Download,
  Eye,
  FileText,
  Handshake,
  Landmark,
  Map,
  Network,
  Presentation,
  Scale,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import {
  ALLOCATION_CATEGORIES,
  AVERAGE_HUB_USD,
  BDT_PER_USD,
  DISTRICT_HUB_COUNT,
  GOVERNANCE_STRUCTURE,
  HUB_INFRASTRUCTURE,
  MIN_HUB_SQFT,
  NATIONAL_IMPACT,
  NATIONAL_INVESTMENT_USD,
  PARTNERSHIP_TYPES,
  PILOT_MAX_USD,
  PILOT_MIN_USD,
  PILOT_OPTIONS,
  REVENUE_STREAMS,
  ROADMAP,
  TOTAL_MIN_SQFT,
  crore,
  usdMillions,
  usdToBdtCrore,
} from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { PageHeader } from "@/components/SiteShell";
import { LeadForm } from "@/components/LeadForm";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investors — AI HUB BD USD 100 Million National Framework" },
      {
        name: "description",
        content:
          "AI HUB BD's proposed USD 100 Million national investment framework: 64 district AI Hubs, a USD 5–10 Million pilot and 512,000 sq ft of minimum innovation infrastructure.",
      },
      {
        property: "og:title",
        content: "AI HUB BD — National AI Innovation & Entrepreneurship Network",
      },
      {
        property: "og:description",
        content:
          "A proposed USD 100 Million investment framework for 64 AI Hubs across Bangladesh, beginning with a USD 5–10 Million pilot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestorsPage,
});

const bdtLabel = (usd: number) => `৳${crore(usdToBdtCrore(usd))} Crore`;

function SectionHeading({ kicker, title, body }: { kicker: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{kicker}</p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h2>
      {body && <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{body}</p>}
    </div>
  );
}

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-2.5 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InvestorsPage() {
  const { t } = useLang();
  const metrics = [
    { icon: Map, value: String(DISTRICT_HUB_COUNT), label: "Districts covered" },
    { icon: Network, value: String(DISTRICT_HUB_COUNT), label: "Proposed AI Hubs" },
    {
      icon: Building2,
      value: MIN_HUB_SQFT.toLocaleString("en-US"),
      label: "Minimum sq ft per hub",
    },
    { icon: Landmark, value: TOTAL_MIN_SQFT.toLocaleString("en-US"), label: "Total minimum sq ft" },
    {
      icon: Target,
      value: usdMillions(AVERAGE_HUB_USD).replace("USD ", "$"),
      label: "Average allocation per hub",
    },
  ];
  const conversionRows = [
    { name: "Pilot Round A", usd: PILOT_MIN_USD },
    { name: "Pilot Round B · Preferred", usd: PILOT_MAX_USD },
    { name: "National Expansion", usd: NATIONAL_INVESTMENT_USD },
  ];
  const documents = [
    {
      icon: FileText,
      name: "National Investment Framework",
      detail: "Investor memorandum · PDF · 16 pages",
      url: "/documents/ai-hub-bd-national-investment-framework.pdf",
      filename: "AI-HUB-BD-National-Investment-Framework.pdf",
    },
    {
      icon: Presentation,
      name: "National Investor Pitch Deck",
      detail: "Investor presentation · PDF · 20 slides",
      url: "/documents/ai-hub-bd-national-investor-pitch.pdf",
      filename: "AI-HUB-BD-National-Investor-Pitch.pdf",
    },
  ];

  return (
    <>
      <PageHeader
        kicker={t(
          "National investment framework · Bangladesh",
          "জাতীয় বিনিয়োগ কাঠামো · বাংলাদেশ",
        )}
        title={
          <>
            <span className="text-gradient">USD 100 Million</span>{" "}
            {t("for a national AI network", "জাতীয় এআই নেটওয়ার্কের জন্য")}
          </>
        }
        sub="A proposed National AI Innovation, Entrepreneurship & Technology Network: 64 modern AI Hubs across all 64 districts, beginning with a USD 5–10 Million pilot."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="glass relative overflow-hidden rounded-3xl border-primary/40 p-6 shadow-glow md:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary-glow">
                Recommended initial target
              </span>
              <Sparkles className="h-6 w-6 text-gold" />
            </div>
            <p className="mt-6 text-sm font-semibold text-muted-foreground">
              National AI Infrastructure · Pilot Investment
            </p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight">$10 Million</h2>
            <p className="mt-2 text-xl font-bold text-secondary">{bdtLabel(PILOT_MAX_USD)}</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Establish the initial district hubs, central technology backbone and commercial
              operating model before national expansion.
            </p>
          </article>
          <article className="glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                Long-term national expansion
              </span>
              <Network className="h-6 w-6 text-secondary" />
            </div>
            <p className="mt-6 text-sm font-semibold text-muted-foreground">
              64 Districts · 64 AI Hubs
            </p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight">$100 Million</h2>
            <p className="mt-2 text-xl font-bold text-secondary">
              {bdtLabel(NATIONAL_INVESTMENT_USD)}
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A connected national infrastructure, with a minimum 8,000 square feet at every
              district hub.
            </p>
          </article>
        </div>
        <p className="mt-5 rounded-2xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Planning basis:</strong> USD 100 Million is the
          national project investment requirement, not a company valuation or USD 1 Billion. Figures
          are preliminary and subject to feasibility, due diligence and definitive agreements.
        </p>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-8 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-4 text-center">
              <metric.icon className="mx-auto h-5 w-5 text-secondary" />
              <p className="mt-3 text-xl font-extrabold md:text-2xl">{metric.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading
          kicker="01 · Executive summary"
          title="AI access for every district, entrepreneur and business"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="glass rounded-3xl p-6 lg:col-span-2">
            <p className="leading-7 text-muted-foreground">
              AI HUB BD is a proposed nationwide AI innovation and entrepreneurship infrastructure
              designed to make Bangladesh more competitive, technology-driven and AI-powered.
              Entrepreneurs, startups, students, professionals, SMEs and established businesses
              would gain access to artificial intelligence, advanced technology, digital
              infrastructure, business automation and innovation resources.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Each AI Hub is planned as a physical workstation and innovation center of at least
              8,000 square feet. The pilot will establish the operating model, validate demand,
              develop revenue-generating services and demonstrate scalability before nationwide
              expansion.
            </p>
          </article>
          <article className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
            <BadgeCheck className="h-7 w-7 text-primary-glow" />
            <h3 className="mt-4 text-lg font-bold">Our mission</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Make AI technology accessible to every district, entrepreneur and business in
              Bangladesh — not only major cities or large corporations.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading
          kicker="02 · National hub infrastructure"
          title="One connected platform. Ten standard capabilities."
          body="Each proposed district center combines physical computing access, commercial services, skills development and startup support under one integrated national management and technology platform."
        />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {HUB_INFRASTRUCTURE.map((item, index) => (
            <li key={item} className="glass rounded-2xl p-5">
              <span className="text-xs font-extrabold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-sm font-bold leading-6">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading
          kicker="03 · Pilot investment strategy"
          title="Validate first. Scale with evidence."
          body="Two entry points establish a commercially viable, operationally scalable AI Hub model. The preferred initial national-scale pilot is USD 10 Million; USD 5 Million remains an alternative."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {PILOT_OPTIONS.map((option, index) => (
            <article
              key={option.name}
              className={`glass rounded-3xl p-6 ${index === 1 ? "ring-1 ring-primary" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-secondary">{option.name}</p>
                  <h3 className="mt-2 text-3xl font-extrabold">
                    {usdMillions(option.usd).replace("USD ", "$")}
                  </h3>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                  {option.share}
                </span>
              </div>
              <p className="mt-2 text-lg font-bold text-gold">{bdtLabel(option.usd)}</p>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">{option.note}</p>
              <div className="mt-5">
                <CheckList items={option.points} />
              </div>
            </article>
          ))}
        </div>
        <div className="glass mt-6 overflow-hidden rounded-3xl">
          <div className="border-b border-border p-5">
            <h3 className="font-bold">Indicative Bangladeshi Taka conversion</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              USD 1 = BDT {BDT_PER_USD} · Reference supplied for 16 November 2026 · Actual bank
              transaction rates may differ.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">Investment round</th>
                  <th className="px-5 py-4">USD</th>
                  <th className="px-5 py-4">Approximate BDT</th>
                </tr>
              </thead>
              <tbody>
                {conversionRows.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <td className="px-5 py-4 font-semibold">{row.name}</td>
                    <td className="px-5 py-4">{usdMillions(row.usd)}</td>
                    <td className="px-5 py-4 font-bold text-secondary">{bdtLabel(row.usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading
          kicker="04 · National expansion roadmap"
          title="A gated path from pilot to national ecosystem"
          body="The sequence is proposed and remains subject to funding, location selection and operational validation."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((phase) => (
            <article key={phase.phase} className="glass rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                {phase.phase}
              </p>
              <p className="mt-1 text-xs text-gold">{phase.when}</p>
              <h3 className="mt-3 font-bold">{phase.title}</h3>
              <div className="mt-4">
                <CheckList items={phase.points} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading
          kicker="05 · Business & revenue model"
          title="A multi-service technology and entrepreneurship platform"
          body="Revenue is proposed through subscriptions, service fees, memberships, enterprise contracts, training fees and partnerships. These are business-model categories, not financial forecasts."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {REVENUE_STREAMS.map((stream, index) => (
            <article key={stream.name} className="glass rounded-2xl p-5">
              <span className="text-lg font-extrabold text-gradient">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-bold">{stream.name}</h3>
              <div className="mt-4">
                <CheckList items={stream.items} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="glass rounded-3xl p-6">
            <Scale className="h-7 w-7 text-secondary" />
            <h2 className="mt-4 text-2xl font-extrabold">Investment allocation framework</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The USD 100 Million envelope will be planned across eight categories. Percentages and
              expenditure schedules follow technical feasibility, property assessments and vendor
              quotations.
            </p>
            <div className="mt-5">
              <CheckList items={ALLOCATION_CATEGORIES} />
            </div>
            <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              The average USD 1.5625 Million per hub is a national planning benchmark, not an
              independently approved facility budget.
            </p>
          </article>
          <article className="glass rounded-3xl p-6">
            <Handshake className="h-7 w-7 text-secondary" />
            <h2 className="mt-4 text-2xl font-extrabold">Technology & strategic partnerships</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Proposed partnerships will support technology access, knowledge transfer, research,
              training and business development.
            </p>
            <div className="mt-5">
              <CheckList items={PARTNERSHIP_TYPES} />
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border bg-card/40 p-6">
            <Users className="h-7 w-7 text-primary-glow" />
            <h2 className="mt-4 text-2xl font-extrabold">Governance & management</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A centralized management framework would connect national leadership with district
              operations and standardized controls.
            </p>
            <div className="mt-5">
              <CheckList items={GOVERNANCE_STRUCTURE} />
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Investor rights, equity participation, board representation, deployment conditions and
              exit provisions require separate investment agreements.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-card/40 p-6">
            <Sparkles className="h-7 w-7 text-gold" />
            <h2 className="mt-4 text-2xl font-extrabold">Expected national impact</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The proposed network aims to strengthen Bangladesh’s digital economy and
              district-level participation in the AI economy.
            </p>
            <div className="mt-5">
              <CheckList items={NATIONAL_IMPACT} />
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Employment, startup and economic-impact targets will be established through the pilot
              feasibility study and subsequent operating data.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="glass overflow-hidden rounded-3xl border-primary/30">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                The investment proposition
              </p>
              <h2 className="mt-3 text-3xl font-extrabold">
                Building Bangladesh’s AI-powered future, one district at a time.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                AI HUB BD invites strategic and institutional investors, technology partners and
                business groups to participate through mutually agreed equity, strategic partnership
                or other legally appropriate financing structures. Terms, valuation, shareholding,
                governance rights and expected returns are subject to due diligence and formal
                negotiation.
              </p>
              <a
                href="#investor-meeting"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow"
              >
                Discuss the pilot <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-5">
              <h3 className="font-bold">Before investor circulation</h3>
              <div className="mt-4">
                <CheckList
                  items={[
                    "Company valuation and equity structure",
                    "Initial pilot district locations",
                    "Five-year revenue, operating cost, EBITDA and cash-flow projections",
                    "Investor exit strategy and definitive terms",
                  ]}
                />
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                These items remain open; no guaranteed return or predetermined equity percentage is
                implied.
              </p>
            </div>
          </div>
          <p className="border-t border-border bg-card/50 p-5 text-xs leading-5 text-muted-foreground">
            <strong className="text-foreground">Investment disclaimer:</strong> This is a proposed
            business and investment framework for discussion purposes. Amounts, facility
            specifications, expansion plans and business models are preliminary planning
            assumptions. Implementation is subject to feasibility studies, regulatory approvals,
            investor due diligence, definitive agreements and financing availability. This is not a
            public offer of securities or a guarantee of investment returns.
          </p>
        </div>
      </section>

      <section
        id="investor-meeting"
        className="mx-auto grid max-w-7xl scroll-mt-24 gap-8 px-4 pt-20 lg:grid-cols-2"
      >
        <div className="grid content-start gap-4">
          <SectionHeading
            kicker="Investor documents"
            title="National framework & presentation"
            body="Both documents use the USD 100 Million national framework and the USD 5–10 Million pilot structure."
          />
          {documents.map((document) => (
            <div
              key={document.name}
              className="glass flex items-center justify-between gap-3 rounded-2xl p-5"
            >
              <span className="flex min-w-0 items-center gap-3">
                <document.icon className="h-8 w-8 shrink-0 text-secondary" />
                <span>
                  <p className="font-bold">{document.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{document.detail}</p>
                </span>
              </span>
              <span className="flex shrink-0 gap-2">
                <a
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View ${document.name}`}
                >
                  <Eye className="h-4 w-4" />
                </a>
                <a
                  href={document.url}
                  download={document.filename}
                  className="rounded-lg bg-gradient-brand p-2 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Download ${document.name}`}
                >
                  <Download className="h-4 w-4" />
                </a>
              </span>
            </div>
          ))}
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-extrabold">
            {t("Request an investor meeting", "বিনিয়োগকারী মিটিং অনুরোধ করুন")}
          </h2>
          <LeadForm
            source="investor"
            kinds={["Investor meeting"]}
            cta={t("Request investor meeting", "মিটিং অনুরোধ করুন")}
          />
        </div>
      </section>
    </>
  );
}
