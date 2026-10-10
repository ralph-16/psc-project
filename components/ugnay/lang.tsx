"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { t, type Lang, type StringKey } from "@/lib/mock/strings";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("ugnay-lang", l);
      document.documentElement.lang = l === "fil" ? "fil" : "en";
    } catch {
      /* persistence is best-effort */
    }
  }, []);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  const { lang } = useLang();
  return (key: StringKey) => t(key, lang);
}
