/** Mock donor/org session for the prototype (localStorage only, no backend). */

export type MockSession = {
  name: string;
  email: string;
  org?: string;
  at: string;
};

const KEY = "ugnay-session";

export function getSession(): MockSession | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MockSession>;
    if (!parsed || typeof parsed.email !== "string") return null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: parsed.email,
      org: typeof parsed.org === "string" ? parsed.org : undefined,
      at: typeof parsed.at === "string" ? parsed.at : "",
    };
  } catch {
    return null;
  }
}

export function setSession(session: Omit<MockSession, "at">): void {
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ ...session, at: new Date().toISOString() }),
    );
  } catch {
    /* storage unavailable — session stays in memory only */
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Safe post-auth destination (same-origin paths only, never back to /auth). */
export function safeNext(raw: string | null, fallback = "/account"): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("/auth")) return raw;
  return fallback;
}
