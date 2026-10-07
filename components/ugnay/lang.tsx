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

/** EN/FIL toggle scaffold. Hero + donate surfaces translate first; rest follows. */
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language / Wika"
      className="inline-flex items-center rounded-full border border-[#e5e7eb] p-0.5 text-xs font-semibold"
    >
      {(["en", "fil"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={
            lang === l
              ? "rounded-full bg-[#084989] px-2.5 py-1.5 text-white"
              : "rounded-full px-2.5 py-1.5 text-[#6b7280] hover:text-[#084989]"
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
