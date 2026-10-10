/**
 * Secure guest linking (donor workflow §7). Claiming a past guest donation
 * requires proving ownership of its contact email via a verification loop —
 * an email string match alone never grants access. Prototype scope: the code
 * is generated and displayed in-UI (a real backend would email it); issued
 * links persist to a local inbox.
 */

export interface LinkedDonation {
  traceId: string;
  email: string;
  at: string;
}

export const LINKED_KEY = "ugnay-linked";

export function newVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function readLinked(): LinkedDonation[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(LINKED_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function linkDonation(traceId: string, email: string): LinkedDonation[] {
  const entry: LinkedDonation = {
    traceId: traceId.trim().toUpperCase(),
    email: email.trim().toLowerCase(),
    at: new Date().toISOString(),
  };
  try {
    const list = readLinked();
    if (!list.some((l) => l.traceId === entry.traceId)) list.push(entry);
    window.localStorage.setItem(LINKED_KEY, JSON.stringify(list));
    return list;
  } catch {
    return [entry];
  }
}

export function unlinkDonation(traceId: string): LinkedDonation[] {
  try {
    const list = readLinked().filter(
      (l) => l.traceId !== traceId.trim().toUpperCase(),
    );
    window.localStorage.setItem(LINKED_KEY, JSON.stringify(list));
    return list;
  } catch {
    return [];
  }
}
