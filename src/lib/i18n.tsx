import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "./storage";

type Lang = "en" | "bn";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Lang>("aihub.lang", "en");
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  const t = (en: string, bn: string) => (lang === "bn" ? bn : en);
  return { lang, setLang, t };
}
