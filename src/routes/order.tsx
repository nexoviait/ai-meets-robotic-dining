import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  Bot,
  Check,
  ChefHat,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  ShoppingCart,
  Smartphone,
  Trash2,
  ScanLine,
  CreditCard,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import {
  CATEGORY_LABEL,
  MENU,
  STATIONS,
  taka,
  type Category,
  type MenuItem,
  type StationId,
} from "@/lib/data";
import {
  EXTRAS,
  OPTIONS,
  STAGES,
  cartTotal,
  findItem,
  orderStage,
  prepDuration,
  unitPrice,
  type CartLine,
  type Order,
} from "@/lib/orders";
import { useLocalStorage, uid } from "@/lib/storage";
import { useLang } from "@/lib/i18n";
import { chime, click } from "@/lib/sound";
import { PayBadges } from "@/components/SiteShell";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { StationListbox } from "@/components/StationListbox";

const STATION_IDS: StationId[] = ["coffee", "snack", "meals", "integrated"];

export const Route = createFileRoute("/order")({
  validateSearch: (s: Record<string, unknown>): { station?: StationId } =>
    STATION_IDS.includes(s["station"] as StationId) ? { station: s["station"] as StationId } : {},
  head: () => ({
    meta: [
      { title: "Order — AI HUB BD Robotic Café" },
      {
        name: "description",
        content:
          "Order coffee, snacks, lunch and dinner from AI HUB BD's robotic stations. Pay with bKash, Nagad, card or QR and track your order live.",
      },
      { property: "og:title", content: "Order from the AI HUB BD Robotic Café" },
      {
        property: "og:description",
        content: "Coffee, snacks, lunch & dinner made by robots, 24/7. Pay with bKash or Nagad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderPage,
});

function useNow(ms = 1000) {
  // Start at 0 so the server render and hydration agree; the real clock starts after mount.
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(i);
  }, [ms]);
  return now;
}

function OrderPage() {
  const { station: initial } = Route.useSearch();
  const { t, lang } = useLang();
  const [station, setStation] = useState<StationId>(initial ?? "integrated");
  const [cat, setCat] = useState<Category | "all">("all");
  const [kiosk, setKiosk] = useState(false);
  const [storedCart, setCart] = useLocalStorage<CartLine[]>("aihub.cart", []);
  // Drop lines whose menu item no longer exists (e.g. a cart saved before a menu change).
  const cart = useMemo(
    () => (Array.isArray(storedCart) ? storedCart.filter((l) => findItem(l.itemId)) : []),
    [storedCart],
  );
  const [orders, setOrders] = useLocalStorage<Order[]>("aihub.orders", []);
  const [picked, setPicked] = useState<MenuItem | null>(null);
  const [checkout, setCheckout] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackId, setTrackId] = useState<string | null>(null);
  const now = useNow();

  useEffect(() => {
    if (initial) setStation(initial);
  }, [initial]);
  useEffect(() => {
    setCat("all");
  }, [station]);

  const st = STATIONS.find((s) => s.id === station)!;
  const items = MENU.filter(
    (m) => st.categories.includes(m.category) && (cat === "all" || m.category === cat),
  );
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const total = cartTotal(cart);
  const activeOrders = orders.filter((o) => orderStage(o, now).stage < 3);
  const queue = 4 + (now ? Math.floor(now / 15000) % 5 : 0) + activeOrders.length;

  const toggleKiosk = async () => {
    click();
    if (!kiosk) {
      setKiosk(true);
      await document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      setKiosk(false);
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
    }
  };
  useEffect(() => {
    const h = () => {
      if (!document.fullscreenElement) setKiosk(false);
    };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const addLine = (line: Omit<CartLine, "key">) => {
    setCart((prev) => {
      const key = line.itemId + JSON.stringify(line.options) + line.extras.slice().sort().join(",");
      const ex = prev.find((l) => l.key === key);
      return ex
        ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l))
        : [...prev, { ...line, key }];
    });
    click(1200);
    toast.success(t("Added to cart", "কার্টে যোগ হয়েছে"));
  };

  const placeOrder = (payment: string, customer: string, phone: string) => {
    const order: Order = {
      id: uid("ORD-"),
      token: `${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${100 + Math.floor(Math.random() * 900)}`,
      lines: cart,
      total,
      payment,
      customer,
      phone,
      createdAt: Date.now(),
      counter: 3,
      durationSec: prepDuration(cart),
    };
    setOrders((p) => [order, ...p].slice(0, 30));
    setCart([]);
    setCheckout(false);
    setCartOpen(false);
    setTrackId(order.id);
    chime();
  };

  const tracked = orders.find((o) => o.id === trackId) ?? null;

  const body = (
    <div className={cn("mx-auto max-w-7xl px-4", kiosk ? "py-6" : "py-10")}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 md:flex md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            {kiosk
              ? t("Hub touchscreen kiosk", "হাব টাচস্ক্রিন কিয়স্ক")
              : t("Customer mobile web order", "মোবাইল ওয়েব অর্ডার")}
          </p>
          <h1
            className={cn(
              "mt-1 font-extrabold tracking-tight",
              kiosk ? "text-4xl" : "text-3xl md:text-4xl",
            )}
          >
            {t("Order Your Food", "আপনার খাবার অর্ডার করুন")}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-success live-dot" />
              {queue} {t("orders in queue", "অর্ডার লাইনে")}
            </span>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1">
              <Bot className="h-4 w-4 text-secondary" />
              {t("6 robotic arms online", "৬টি রোবোটিক আর্ম সক্রিয়")}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <div className="flex rounded-xl border border-border p-1 text-xs font-semibold">
            <button
              onClick={() => kiosk && toggleKiosk()}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1.5",
                !kiosk && "bg-accent",
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
              {t("Mobile", "মোবাইল")}
            </button>
            <button
              onClick={() => !kiosk && toggleKiosk()}
              className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5", kiosk && "bg-accent")}
            >
              {kiosk ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
              {t("Kiosk", "কিয়স্ক")}
            </button>
          </div>
        </div>
      </div>

      {activeOrders[0] && !tracked && (
        <button
          onClick={() => setTrackId(activeOrders[0]!.id)}
          className="mt-6 flex w-full items-center justify-between rounded-2xl border border-secondary/50 bg-secondary/10 px-4 py-3 text-left text-sm"
        >
          <span>
            <b>
              {t("Order", "অর্ডার")} {activeOrders[0].token}
            </b>{" "}
            — {STAGES[orderStage(activeOrders[0], now).stage]}
          </span>
          <span className="font-semibold text-secondary">{t("Track", "ট্র্যাক")} →</span>
        </button>
      )}

      <StationListbox
        value={station}
        onChange={(next) => {
          click();
          setStation(next);
        }}
        kiosk={kiosk}
        className="mt-6 pb-1"
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {st.categories.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", ...st.categories] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    click();
                    setCat(c);
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold",
                    cat === c
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {c === "all" ? t("All", "সব") : CATEGORY_LABEL[c][lang === "bn" ? 1 : 0]}
                </button>
              ))}
            </div>
          )}
          <div
            className={cn(
              "grid gap-4",
              kiosk ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 md:grid-cols-3",
            )}
          >
            {items.map((i) => (
              <button
                key={i.id}
                onClick={() => {
                  click();
                  setPicked(i);
                }}
                className="glass group flex flex-col rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-glow"
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-xl bg-steel",
                    kiosk ? "h-32 text-6xl" : "h-24 text-5xl",
                  )}
                >
                  {i.emoji}
                </span>
                <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-gold">
                  {CATEGORY_LABEL[i.category][lang === "bn" ? 1 : 0]}
                </span>
                <span className={cn("font-bold", kiosk && "text-lg")}>
                  {lang === "bn" ? i.bn : i.name}
                </span>
                <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">{i.desc}</span>
                <span className="mt-auto flex items-center justify-between pt-3">
                  <span className="font-extrabold">{taka(i.price)}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-primary-foreground">
                    <Plus className="h-4 w-4" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="glass sticky top-24 rounded-2xl p-5">
            <CartPanel cart={cart} setCart={setCart} onCheckout={() => setCheckout(true)} />
          </div>
        </aside>
      </div>

      <OrderHistory orders={orders} now={now} onTrack={setTrackId} />

      {count > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-4 bottom-20 z-30 flex items-center justify-between rounded-2xl bg-gradient-brand px-5 py-4 font-semibold text-primary-foreground shadow-glow lg:hidden"
        >
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {count} {t("items", "আইটেম")}
          </span>
          <span>
            {taka(total)} · {t("View cart", "কার্ট দেখুন")}
          </span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {kiosk ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background grid-bg">{body}</div>
      ) : (
        body
      )}

      <ItemDialog item={picked} onClose={() => setPicked(null)} onAdd={addLine} />

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Your cart", "আপনার কার্ট")}</DialogTitle>
          </DialogHeader>
          <CartPanel
            cart={cart}
            setCart={setCart}
            onCheckout={() => {
              setCartOpen(false);
              setCheckout(true);
            }}
            hideTitle
          />
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        open={checkout}
        onClose={() => setCheckout(false)}
        total={total}
        onPaid={placeOrder}
      />

      <Dialog open={!!tracked} onOpenChange={(o) => !o && setTrackId(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto">
          {tracked && <Tracker order={tracked} now={now} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ItemDialog({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (l: Omit<CartLine, "key">) => void;
}) {
  const { t, lang } = useLang();
  const [opts, setOpts] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (!item) return;
    const o: Record<string, string> = {};
    (OPTIONS[item.category] ?? []).forEach(
      (g) =>
        (o[g.name] =
          g.values[
            Math.min(
              g.name === "Sugar level" || g.name === "Spice level" ? 2 : 0,
              g.values.length - 1,
            )
          ] ?? ""),
    );
    setOpts(o);
    setExtras([]);
    setQty(1);
  }, [item]);
  if (!item) return null;
  const price = unitPrice(item, opts, extras);
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-4xl">{item.emoji}</span>
            {lang === "bn" ? item.bn : item.name}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{item.desc}</p>
        {(OPTIONS[item.category] ?? []).map((g) => (
          <div key={g.name}>
            <p className="mb-2 text-sm font-semibold">{g.name}</p>
            <div className="flex flex-wrap gap-2">
              {g.values.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    click();
                    setOpts({ ...opts, [g.name]: v });
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm",
                    opts[g.name] === v ? "border-primary bg-primary/20" : "border-border",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
        {(EXTRAS[item.category] ?? []).length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold">{t("Sides & extras", "সাইড ও এক্সট্রা")}</p>
            <div className="grid gap-2">
              {(EXTRAS[item.category] ?? []).map((e) => {
                const on = extras.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      click();
                      setExtras(on ? extras.filter((x) => x !== e.id) : [...extras, e.id]);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                      on ? "border-secondary bg-secondary/15" : "border-border",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "grid h-4 w-4 place-items-center rounded border",
                          on && "bg-secondary",
                        )}
                      >
                        {on && <Check className="h-3 w-3 text-secondary-foreground" />}
                      </span>
                      {e.name}
                    </span>
                    <span>+{taka(e.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="rounded-lg border border-border p-2"
              aria-label={t("Decrease quantity", "পরিমাণ কমান")}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-bold" aria-live="polite">
              {qty}
            </span>
            <button
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="rounded-lg border border-border p-2"
              aria-label={t("Increase quantity", "পরিমাণ বাড়ান")}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => {
              onAdd({ itemId: item.id, qty, options: opts, extras, unitPrice: price });
              onClose();
            }}
            className="flex-1 rounded-xl bg-gradient-brand px-5 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            {t("Add", "যোগ করুন")} · {taka(price * qty)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CartPanel({
  cart,
  setCart,
  onCheckout,
  hideTitle,
}: {
  cart: CartLine[];
  setCart: (f: (p: CartLine[]) => CartLine[]) => void;
  onCheckout: () => void;
  hideTitle?: boolean;
}) {
  const { t, lang } = useLang();
  const total = cartTotal(cart);
  const change = (key: string, d: number) =>
    setCart((p) =>
      p.map((l) => (l.key === key ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0),
    );
  return (
    <div>
      {!hideTitle && (
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <ShoppingCart className="h-5 w-5 text-secondary" />
          {t("Your cart", "আপনার কার্ট")}
        </h2>
      )}
      {cart.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          <ChefHat className="mx-auto mb-2 h-10 w-10 opacity-40" />
          {t(
            "Your cart is empty. Tap any item to start.",
            "কার্ট খালি। শুরু করতে যেকোনো আইটেম ট্যাপ করুন।",
          )}
        </div>
      ) : (
        <>
          <ul className="mt-3 grid gap-3">
            {cart.map((l) => {
              const it = findItem(l.itemId);
              if (!it) return null;
              const extraNames = (EXTRAS[it.category] ?? [])
                .filter((e) => l.extras.includes(e.id))
                .map((e) => e.name);
              return (
                <li key={l.key} className="flex gap-3 border-b border-border pb-3">
                  <span className="text-2xl">{it.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{lang === "bn" ? it.bn : it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[...Object.values(l.options), ...extraNames].join(" · ")}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => change(l.key, -1)}
                        className="rounded border border-border p-0.5"
                        aria-label={`${l.qty === 1 ? t("Remove", "সরান") : t("Decrease", "কমান")}: ${lang === "bn" ? it.bn : it.name}`}
                      >
                        {l.qty === 1 ? (
                          <Trash2 className="h-3.5 w-3.5" />
                        ) : (
                          <Minus className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <span className="text-sm font-bold">{l.qty}</span>
                      <button
                        onClick={() => change(l.key, 1)}
                        className="rounded border border-border p-0.5"
                        aria-label={`${t("Increase", "বাড়ান")}: ${lang === "bn" ? it.bn : it.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="font-semibold">{taka(l.unitPrice * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-between text-lg font-extrabold">
            <span>{t("Total", "মোট")}</span>
            <span>{taka(total)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="mt-4 w-full rounded-xl bg-gradient-brand py-3 font-semibold text-primary-foreground shadow-glow"
          >
            {t("Checkout · Scan & Pay", "চেকআউট · স্ক্যান ও পে")}
          </button>
          <div className="mt-3 flex justify-center">
            <PayBadges />
          </div>
        </>
      )}
    </div>
  );
}

type Method = "bkash" | "nagad" | "card" | "qr";

function CheckoutDialog({
  open,
  onClose,
  total,
  onPaid,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  onPaid: (m: string, name: string, phone: string) => void;
}) {
  const { t } = useLang();
  const [method, setMethod] = useState<Method>("bkash");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wallet, setWallet] = useState("");
  const [pin, setPin] = useState("");
  const [card, setCard] = useState({ num: "", exp: "", cvv: "" });
  const [status, setStatus] = useState<"idle" | "verifying" | "done">("idle");
  const [err, setErr] = useState("");
  const [ref, setRef] = useState(() => uid("PAY"));

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setErr("");
      setPin("");
      setRef(uid("PAY"));
    }
  }, [open]);

  const validPhone = (p: string) =>
    /^01[3-9]\d{8}$/.test(p.replace(/\D/g, "").replace(/^880/, "0"));

  const pay = () => {
    setErr("");
    if (!name.trim())
      return setErr(t("Please enter your name for the pickup token.", "পিকআপের জন্য নাম দিন।"));
    if (!validPhone(phone))
      return setErr(
        t(
          "Enter a valid Bangladeshi mobile number (01XXXXXXXXX).",
          "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।",
        ),
      );
    if ((method === "bkash" || method === "nagad") && !validPhone(wallet))
      return setErr(t("Enter your wallet number.", "ওয়ালেট নম্বর দিন।"));
    if ((method === "bkash" || method === "nagad") && !/^\d{4,5}$/.test(pin))
      return setErr(t("Enter your 4–5 digit PIN.", "৪–৫ সংখ্যার পিন দিন।"));
    if (method === "card") {
      if (card.num.replace(/\s/g, "").length < 15)
        return setErr(t("Enter a valid card number.", "সঠিক কার্ড নম্বর দিন।"));
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.exp))
        return setErr(t("Expiry must be MM/YY.", "মেয়াদ MM/YY আকারে দিন।"));
      if (!/^\d{3,4}$/.test(card.cvv)) return setErr(t("Enter the CVV.", "CVV দিন।"));
    }
    click();
    setStatus("verifying");
    setTimeout(() => {
      setStatus("done");
      setTimeout(
        () =>
          onPaid(
            method === "bkash"
              ? "bKash"
              : method === "nagad"
                ? "Nagad"
                : method === "card"
                  ? "Card"
                  : "QR",
            name.trim(),
            phone,
          ),
        900,
      );
    }, 1800);
  };

  const methods: { id: Method; label: string; cls: string }[] = [
    { id: "bkash", label: "bKash", cls: "bg-bkash text-primary-foreground" },
    { id: "nagad", label: "Nagad", cls: "bg-nagad text-primary-foreground" },
    { id: "card", label: "Card", cls: "bg-muted" },
    { id: "qr", label: "QR Code", cls: "bg-muted" },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && status !== "verifying" && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("Scan & Pay", "স্ক্যান ও পে")} · {taka(total)}
          </DialogTitle>
        </DialogHeader>
        {status !== "idle" ? (
          <div className="grid place-items-center py-10 text-center">
            {status === "verifying" ? (
              <Loader2 className="h-12 w-12 animate-spin text-secondary" />
            ) : (
              <ShieldCheck className="h-12 w-12 text-success" />
            )}
            <p className="mt-4 font-semibold">
              {status === "verifying"
                ? t("Verifying payment…", "পেমেন্ট যাচাই হচ্ছে…")
                : t("Payment verified", "পেমেন্ট সফল")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Ref {ref}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm">
                {t("Name", "নাম")}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  className="rounded-lg border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                {t("Mobile", "মোবাইল")}
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  maxLength={14}
                  className="rounded-lg border border-input bg-background px-3 py-2"
                />
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    click();
                    setMethod(m.id);
                    setErr("");
                  }}
                  aria-pressed={method === m.id}
                  className={cn(
                    "rounded-xl py-3 text-xs font-extrabold ring-offset-2 ring-offset-background",
                    m.cls,
                    method === m.id ? "ring-2 ring-secondary" : "opacity-70",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {(method === "bkash" || method === "nagad") && (
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  {method === "bkash" ? "bKash" : "Nagad"} {t("number", "নম্বর")}
                  <input
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    inputMode="tel"
                    placeholder="01XXXXXXXXX"
                    maxLength={14}
                    className="rounded-lg border border-input bg-background px-3 py-2"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  PIN
                  <input
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    type="password"
                    inputMode="numeric"
                    maxLength={5}
                    className="rounded-lg border border-input bg-background px-3 py-2"
                  />
                </label>
              </div>
            )}
            {method === "card" && (
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Card number
                  </span>
                  <input
                    value={card.num}
                    onChange={(e) =>
                      setCard({ ...card, num: e.target.value.replace(/[^\d ]/g, "") })
                    }
                    inputMode="numeric"
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    className="rounded-lg border border-input bg-background px-3 py-2"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={card.exp}
                    onChange={(e) => setCard({ ...card, exp: e.target.value })}
                    aria-label={t("Expiry (MM/YY)", "মেয়াদ (MM/YY)")}
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                  <input
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })}
                    aria-label="CVV"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    placeholder="CVV"
                    maxLength={4}
                    type="password"
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
            {method === "qr" && (
              <div className="grid place-items-center gap-2 rounded-xl bg-steel p-4">
                <div className="rounded-lg bg-foreground p-2">
                  <QRCodeSVG value={`aihubbd://pay?ref=${ref}&amount=${total}`} size={150} />
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ScanLine className="h-4 w-4" />
                  {t(
                    "Scan with any bKash, Nagad or banking app",
                    "যেকোনো bKash, Nagad বা ব্যাংক অ্যাপে স্ক্যান করুন",
                  )}
                </p>
              </div>
            )}
            {err && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive"
              >
                {err}
              </p>
            )}
            <button
              onClick={pay}
              className="rounded-xl bg-gradient-brand py-3 font-semibold text-primary-foreground shadow-glow"
            >
              {method === "qr"
                ? t("I've scanned & paid", "স্ক্যান ও পেমেন্ট সম্পন্ন")
                : `${t("Pay", "পে করুন")} ${taka(total)}`}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              {t("Demo payment — no money is charged.", "ডেমো পেমেন্ট — কোনো টাকা কাটা হবে না।")}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Tracker({ order, now }: { order: Order; now: number }) {
  const { t } = useLang();
  const { stage, progress } = orderStage(order, now);
  const remain = Math.max(0, Math.ceil(order.durationSec - (now - order.createdAt) / 1000));
  const [notified, setNotified] = useState(stage === 3);
  useEffect(() => {
    if (stage === 3 && !notified) {
      chime();
      setNotified(true);
      toast.success(`${order.token} — ${t("ready for pickup!", "পিকআপের জন্য প্রস্তুত!")}`);
    }
  }, [stage, notified, order.token, t]);
  const icons = [Check, Bot, ShieldCheck, PackageCheck];
  return (
    <div>
      <DialogHeader>
        <DialogTitle>{t("Live preparation tracker", "লাইভ প্রস্তুতি ট্র্যাকার")}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl bg-steel p-4">
        <div className="rounded-lg bg-foreground p-2">
          <QRCodeSVG value={`aihubbd://pickup/${order.id}/${order.token}`} size={84} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t("Order token", "অর্ডার টোকেন")}</p>
          <p className="text-4xl font-extrabold text-gradient">{order.token}</p>
          <p className="text-xs text-muted-foreground">
            {order.customer} · {taka(order.total)} · {order.payment}
          </p>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-brand transition-all duration-1000"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-muted-foreground">
        {stage < 3 ? `~${remain}s ${t("remaining", "বাকি")}` : t("Done", "সম্পন্ন")}
      </p>
      <ol className="mt-3 grid gap-3">
        {STAGES.map((s, i) => {
          const Icon = icons[i] ?? Check;
          const done = i < stage || stage === 3;
          const current = i === stage && stage < 3;
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                current
                  ? "border-secondary bg-secondary/10"
                  : done
                    ? "border-success/40"
                    : "border-border opacity-50",
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full",
                  done
                    ? "bg-success text-primary-foreground"
                    : current
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted",
                )}
              >
                {current && i === 1 ? (
                  <Bot className="h-5 w-5 animate-arm" />
                ) : current ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </span>
              <span className="font-semibold">{i === 3 ? `${s} #${order.counter}` : s}</span>
            </li>
          );
        })}
      </ol>
      {stage === 3 && (
        <p className="mt-4 rounded-xl bg-success/15 p-3 text-center font-semibold text-success">
          {t("Show this token at Smart Counter", "স্মার্ট কাউন্টারে এই টোকেন দেখান")} #{order.counter}{" "}
          — {t("Collect your order", "আপনার অর্ডার সংগ্রহ করুন")}
        </p>
      )}
    </div>
  );
}

function OrderHistory({
  orders,
  now,
  onTrack,
}: {
  orders: Order[];
  now: number;
  onTrack: (id: string) => void;
}) {
  const { t } = useLang();
  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold">{t("Order history", "অর্ডার ইতিহাস")}</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {t("No orders yet. Your orders will appear here.", "এখনও কোনো অর্ডার নেই।")}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {orders.slice(0, 8).map((o) => {
            const st = orderStage(o, now).stage;
            return (
              <button
                key={o.id}
                onClick={() => onTrack(o.id)}
                className="glass flex items-center justify-between rounded-xl p-4 text-left"
              >
                <div className="min-w-0">
                  <p className="font-bold">
                    {o.token}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.lines.map((l) => `${l.qty}× ${findItem(l.itemId)?.name}`).join(", ")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold">{taka(o.total)}</p>
                  <p className={cn("text-xs", st === 3 ? "text-success" : "text-secondary")}>
                    {st === 3 ? t("Ready / collected", "প্রস্তুত") : STAGES[st]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
