/**
 * UI copy for hero / donate / totals surfaces. EN default + FIL scaffold.
 * Keep copy HERE — not hardcoded deep in components — so translation later
 * means editing this file, not hunting through JSX.
 */

export type Lang = "en" | "fil";

const STRINGS = {
  "hero.tagline": {
    en: "Every Need Verified. Every Donation Traced. Every Impact Accounted For.",
    fil: "Bawat Pangangailangan Beripikado. Bawat Donasyon Nasusubaybayan. Bawat Epekto May Pananagutan.",
  },
  "hero.subline": {
    en: "Right Need. Right Donation. Real Impact.",
    fil: "Tamang Pangangailangan. Tamang Donasyon. Tunay na Epekto.",
  },
  "action.quick_donate": { en: "Quick Donate", fil: "Mag-donate Agad" },
  "action.view_campaigns": { en: "View Active Campaigns", fil: "Tingnan ang mga Kampanya" },
  "action.track": { en: "Track My Donation", fil: "Subaybayan ang Donasyon Ko" },
  "donate.where_most_needed": { en: "Where most needed", fil: "Kung saan pinakakailangan" },
  "donate.anonymous": { en: "Give anonymously", fil: "Magbigay nang hindi nagpapakilala" },
  "totals.confirmed": { en: "Confirmed cash received", fil: "Kumpirmadong natanggap" },
  "totals.remaining": { en: "still needed", fil: "kailangan pa" },
  "nav.campaigns": { en: "Campaigns", fil: "Mga Kampanya" },
  "nav.how_it_works": { en: "How it works", fil: "Paano ito gumagana" },
  "nav.track": { en: "Track donation", fil: "Subaybayan ang donasyon" },
  "nav.plans": { en: "Plans", fil: "Mga Plano" },
  "nav.login": { en: "Log in", fil: "Mag-log in" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang = "en"): string {
  return STRINGS[key][lang] ?? STRINGS[key].en;
}
