import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "./storage";

type Lang = "en" | "bn";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Lang>("aihub.lang", "en");
  // Keep <html lang> in sync so screen readers and hyphenation use the right language.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  const t = (en: string, bn: string) => (lang === "bn" ? bn : en);
  return { lang, setLang, t };
}
