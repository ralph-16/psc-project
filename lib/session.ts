/** Mock donor/org session for the prototype (localStorage only, no backend). */

export type MockSession = {
  name: string;
  email: string;
  org?: string;
  /** Which front door signed this session in; defaults to donor-style. */
  kind?: SessionKind;
  at: string;
};

export type SessionKind = "individual" | "lgu" | "ngo" | "corporate";

const KEY = "ugnay-session";

export function getSession(): MockSession | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MockSession>;
    if (!parsed || typeof parsed.email !== "string") return null;
    const kind = parsed.kind;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: parsed.email,
      org: typeof parsed.org === "string" ? parsed.org : undefined,
      kind:
        kind === "lgu" || kind === "ngo" || kind === "corporate" || kind === "individual"
          ? kind
          : undefined,
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

/* --- LGU workspace RBAC (mock prototype scope) --- */

export type LguRole = "manager" | "warehouse" | "auditor";

export const LGU_ROLE_LABELS: Record<LguRole, string> = {
  manager: "Campaign Manager",
  warehouse: "Warehouse",
  auditor: "Auditor",
};

const LGU_ROLES_KEY = "ugnay-lgu-roles";
const ALL_ROLES: LguRole[] = ["manager", "warehouse", "auditor"];

export interface LguStaff {
  name: string;
  roles: LguRole[];
}

/** Mock staff identities. Names match `dispatchedBy` strings in deliveries. */
export const LGU_STAFF: LguStaff[] = [
  { name: "Campaign Manager (A. Santos)", roles: ["manager"] },
  { name: "Warehouse (J. Cruz)", roles: ["warehouse"] },
  { name: "Auditor (M. Villanueva)", roles: ["auditor"] },
];

/** Active roles for this browser. Defaults to all (current full-access UX). */
export function getLguRoles(): LguRole[] {
  try {
    if (typeof window === "undefined") return [...ALL_ROLES];
    const raw = window.localStorage.getItem(LGU_ROLES_KEY);
    if (!raw) return [...ALL_ROLES];
    const parsed = JSON.parse(raw) as string[];
    const valid = parsed.filter(
      (r): r is LguRole => r === "manager" || r === "warehouse" || r === "auditor",
    );
    return valid.length > 0 ? valid : [...ALL_ROLES];
  } catch {
    return [...ALL_ROLES];
  }
}

export function setLguRoles(roles: LguRole[]): void {
  try {
    window.localStorage.setItem(LGU_ROLES_KEY, JSON.stringify(roles));
  } catch {
    /* storage unavailable */
  }
}
