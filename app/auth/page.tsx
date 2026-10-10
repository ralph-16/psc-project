"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Eye,
  EyeOff,
  HeartHandshake,
  Landmark,
  User,
} from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import LandingFooter from "@/components/ugnay/LandingFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import {
  ErrorSummary,
  FieldError,
  FormStatus,
  focusIssues,
  isEmail,
  issueFor,
  type FormIssue,
  type SubmitStatus,
} from "@/components/ugnay/form-feedback";
import { safeNext, setSession, type SessionKind } from "@/lib/session";
import { cn } from "@/lib/utils";

type Audience = SessionKind;
type Tab = "login" | "signup" | "forgot";

const TABS: { id: Tab; label: string }[] = [
  { id: "login", label: "Login" },
  { id: "signup", label: "Sign up" },
  { id: "forgot", label: "Forgot" },
];

const AUDIENCES: { id: Audience; label: string; desc: string; icon: typeof User }[] = [
  { id: "individual", label: "Individual", desc: "Donate, pledge goods, and track.", icon: User },
  { id: "lgu", label: "LGU staff", desc: "Relief desks and validators.", icon: Landmark },
  { id: "ngo", label: "NGO", desc: "Humanitarian organizations.", icon: HeartHandshake },
  { id: "corporate", label: "Corporate", desc: "Sponsors and CSR teams.", icon: Building2 },
];

const WORKSPACE_PRESETS: Record<Exclude<Audience, "individual">, { org: string; email: string }> = {
  lgu: { org: "Bulacan PDRRMO", email: "desk@bulacan.gov.ph" },
  ngo: { org: "Kalinga Foundation", email: "field@kalinga.ph" },
  corporate: { org: "Central Luzon Foods Inc.", email: "csr@clfoods.ph" },
};

const LGU_ROLES = [
  "Relief Desk Officer",
  "Field Validator",
  "Warehouse Keeper",
  "Finance Reviewer",
  "Read-only Auditor",
];

const inputCls =
  "w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-base text-[#1a2333] placeholder:text-[#9ca3af] focus:border-[#084989] focus:ring-2 focus:ring-[#084989]/20 focus:outline-none";

function invalidCls(hasError: boolean) {
  return hasError ? " !border-[#c8102e] focus:!border-[#c8102e] focus:!ring-[#c8102e]/20" : "";
}

function audienceOf(raw: string | null): Audience {
  return raw === "lgu" || raw === "ngo" || raw === "corporate" ? raw : "individual";
}

export default function AuthPage() {
  const router = useRouter();
  const [audience, setAudience] = useState<Audience>(() => {
    if (typeof window === "undefined") return "individual";
    return audienceOf(new URLSearchParams(window.location.search).get("audience"));
  });
  const [rawNext] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  });
  const [tab, setTab] = useState<Tab>("login");
  const [showPw, setShowPw] = useState(false);
  const [issues, setIssues] = useState<FormIssue[]>([]);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [org, setOrg] = useState(WORKSPACE_PRESETS.lgu.org);
  const [workEmail, setWorkEmail] = useState(WORKSPACE_PRESETS.lgu.email);
  const [lguRole, setLguRole] = useState(LGU_ROLES[0]);

  function homeFor(kind: Audience) {
    return kind === "lgu"
      ? "/lgu/dashboard"
      : kind === "individual"
        ? "/account"
        : "/corporate/dashboard";
  }

  function pickAudience(next: Audience) {
    setAudience(next);
    setTab("login");
    setIssues([]);
    setStatus("idle");
    if (next !== "individual") {
      setOrg(WORKSPACE_PRESETS[next].org);
      setWorkEmail(WORKSPACE_PRESETS[next].email);
      setLguRole(LGU_ROLES[0]);
    }
  }

  function switchTab(next: Tab) {
    setTab(next);
    setIssues([]);
    setStatus("idle");
  }

  function fail(next: FormIssue[]) {
    setIssues(next);
    setStatus("idle");
    focusIssues(next, true);
  }

  function handleSubmit(next: FormIssue[], onOk: () => void) {
    if (next.length > 0) {
      fail(next);
      return;
    }
    setIssues([]);
    setStatus("pending");
    window.setTimeout(() => {
      setStatus("success");
      onOk();
    }, 700);
  }

  function submitLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const next: FormIssue[] = [];
    if (!email.trim()) next.push({ fieldId: "auth-email", label: "Email", message: "Enter your email address." });
    else if (!isEmail(email)) next.push({ fieldId: "auth-email", label: "Email", message: "Enter an email like you@example.ph." });
    if (!password) next.push({ fieldId: "auth-pw", label: "Password", message: "Enter your password." });
    handleSubmit(next, () => {
      setSession({ name: email.trim().split("@")[0], email: email.trim(), kind: "individual" });
      router.push(safeNext(rawNext, "/account"));
    });
  }

  function submitSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const mobile = String(fd.get("mobile") ?? "");
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const next: FormIssue[] = [];
    if (!name.trim()) next.push({ fieldId: "su-name", label: "Full name", message: "Enter your full name." });
    if (mobile.replace(/\D/g, "").length < 7) next.push({ fieldId: "su-phone", label: "Mobile", message: "Enter a valid mobile number." });
    if (!email.trim()) next.push({ fieldId: "su-email", label: "Email", message: "Enter your email address." });
    else if (!isEmail(email)) next.push({ fieldId: "su-email", label: "Email", message: "Enter an email like you@example.ph." });
    if (password.length < 8) next.push({ fieldId: "su-pw", label: "Password", message: "Use at least 8 characters." });
    handleSubmit(next, () => {
      setSession({
        name: name.trim(),
        email: email.trim(),
        kind: "individual",
      });
      router.push(safeNext(rawNext, "/account"));
    });
  }

  function submitForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const next: FormIssue[] = [];
    if (!email.trim()) next.push({ fieldId: "fg-email", label: "Email", message: "Enter your account email." });
    else if (!isEmail(email)) next.push({ fieldId: "fg-email", label: "Email", message: "Enter an email like you@example.ph." });
    handleSubmit(next, () => {});
  }

  function submitWorkspace(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: FormIssue[] = [];
    if (!org.trim()) next.push({ fieldId: "ws-org", label: "Organization", message: "Enter your organization." });
    if (!workEmail.trim()) next.push({ fieldId: "ws-email", label: "Work email", message: "Enter your work email." });
    else if (!isEmail(workEmail)) next.push({ fieldId: "ws-email", label: "Work email", message: "Enter an email like desk@lgu.gov.ph." });
    handleSubmit(next, () => {
      setSession({ name: org.trim(), email: workEmail.trim(), org: org.trim(), kind: audience });
      router.push(safeNext(rawNext, homeFor(audience)));
    });
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Sign in" }]}
          title="Sign in to Ugnay"
          description="One sign-in for everyone — pick who you are, then continue."
        />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section aria-label="Authentication forms" className="ugnay-card p-5 sm:p-8">
            {/* Audience picker */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Who are you signing in as?">
              {AUDIENCES.map((a) => {
                const on = audience === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => pickAudience(a.id)}
                    aria-pressed={on}
                    className={cn(
                      "flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] px-2 py-3 text-center",
                      on
                        ? "border-[#084989] bg-[#084989]/5"
                        : "border-[#e5e7eb] bg-white hover:border-[#084989]/40",
                    )}
                  >
                    <a.icon className={cn("size-5", on ? "text-[#084989]" : "text-[#6b7280]")} aria-hidden />
                    <span className={cn("text-xs font-bold", on ? "text-[#084989]" : "text-[#1a2333]")}>
                      {a.label}
                    </span>
                    <span className="hidden text-[10px] leading-tight text-[#6b7280] sm:block">
                      {a.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {audience === "individual" ? (
              <>
                {/* Tabs */}
                <div
                  role="tablist"
                  aria-label="Auth screens"
                  className="mt-5 flex flex-wrap gap-2"
                >
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      id={`auth-tab-${t.id}`}
                      aria-selected={tab === t.id}
                      aria-controls={`auth-panel-${t.id}`}
                      onClick={() => switchTab(t.id)}
                      className={
                        tab === t.id
                          ? "ugnay-btn ugnay-btn-solid !px-4 !py-2 !text-xs min-h-[44px]"
                          : "ugnay-btn ugnay-btn-outline !px-4 !py-2 !text-xs min-h-[44px]"
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {issues.length > 0 && (
                  <div className="mt-4" key={tab}>
                    <ErrorSummary issues={issues} />
                  </div>
                )}

                {tab === "login" && (
                  <form role="tabpanel" id="auth-panel-login" aria-labelledby="auth-tab-login" className="mt-6 space-y-4" onSubmit={submitLogin} noValidate>
                    <div>
                      <label htmlFor="auth-email" className="text-sm font-semibold text-[#1a2333]">
                        Email
                      </label>
                      <input id="auth-email" name="email" type="email" placeholder="you@example.ph" className={inputCls + invalidCls(!!issueFor(issues, "auth-email"))} autoComplete="email" aria-invalid={!!issueFor(issues, "auth-email")} aria-describedby={issueFor(issues, "auth-email") ? "auth-email-error" : undefined} />
                      <FieldError id="auth-email-error" message={issueFor(issues, "auth-email")} />
                    </div>
                    <div>
                      <label htmlFor="auth-pw" className="text-sm font-semibold text-[#1a2333]">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="auth-pw"
                          name="password"
                          type={showPw ? "text" : "password"}
                          placeholder="••••••••"
                          className={`${inputCls} pr-12${invalidCls(!!issueFor(issues, "auth-pw"))}`}
                          autoComplete="current-password"
                          aria-invalid={!!issueFor(issues, "auth-pw")}
                          aria-describedby={issueFor(issues, "auth-pw") ? "auth-pw-error" : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          aria-label={showPw ? "Hide password" : "Show password"}
                          className="absolute top-1/2 right-1.5 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full p-2 text-[#6b7280] hover:text-[#084989]"
                        >
                          {showPw ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                        </button>
                      </div>
                      <FieldError id="auth-pw-error" message={issueFor(issues, "auth-pw")} />
                    </div>
                    <button type="submit" disabled={status === "pending"} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60">
                      {status === "pending" ? "Logging in…" : "Log in"}
                    </button>
                    <FormStatus status={status} pendingText="Checking credentials…" successText="Signed in." />
                    <p className="text-center text-sm text-[#6b7280]">
                      Forgot your password?{" "}
                      <button type="button" onClick={() => switchTab("forgot")} className="font-semibold text-[#084989] hover:underline">
                        Reset it
                      </button>
                    </p>
                  </form>
                )}

                {tab === "signup" && (
                  <form role="tabpanel" id="auth-panel-signup" aria-labelledby="auth-tab-signup" className="mt-6 space-y-4" onSubmit={submitSignup} noValidate>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="su-name" className="text-sm font-semibold text-[#1a2333]">Full name</label>
                        <input id="su-name" name="name" placeholder="Maria Santos" className={inputCls + invalidCls(!!issueFor(issues, "su-name"))} autoComplete="name" aria-invalid={!!issueFor(issues, "su-name")} aria-describedby={issueFor(issues, "su-name") ? "su-name-error" : undefined} />
                        <FieldError id="su-name-error" message={issueFor(issues, "su-name")} />
                      </div>
                      <div>
                        <label htmlFor="su-phone" className="text-sm font-semibold text-[#1a2333]">Mobile</label>
                        <input id="su-phone" name="mobile" placeholder="09xx xxx xxxx" className={inputCls + invalidCls(!!issueFor(issues, "su-phone"))} autoComplete="tel" aria-invalid={!!issueFor(issues, "su-phone")} aria-describedby={issueFor(issues, "su-phone") ? "su-phone-error" : undefined} />
                        <FieldError id="su-phone-error" message={issueFor(issues, "su-phone")} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="su-email" className="text-sm font-semibold text-[#1a2333]">Email</label>
                      <input id="su-email" name="email" type="email" placeholder="you@example.ph" className={inputCls + invalidCls(!!issueFor(issues, "su-email"))} autoComplete="email" aria-invalid={!!issueFor(issues, "su-email")} aria-describedby={issueFor(issues, "su-email") ? "su-email-error" : undefined} />
                      <FieldError id="su-email-error" message={issueFor(issues, "su-email")} />
                    </div>
                    <div>
                      <label htmlFor="su-pw" className="text-sm font-semibold text-[#1a2333]">Password</label>
                      <input id="su-pw" name="password" type="password" placeholder="At least 8 characters" className={inputCls + invalidCls(!!issueFor(issues, "su-pw"))} autoComplete="new-password" aria-invalid={!!issueFor(issues, "su-pw")} aria-describedby={issueFor(issues, "su-pw") ? "su-pw-error" : undefined} />
                      <FieldError id="su-pw-error" message={issueFor(issues, "su-pw")} />
                    </div>
                    <button type="submit" disabled={status === "pending"} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60">
                      {status === "pending" ? "Creating account…" : "Create account"}
                    </button>
                    <FormStatus status={status} pendingText="Creating your account…" successText="Account created." />
                  </form>
                )}

                {tab === "forgot" && (
                  <form role="tabpanel" id="auth-panel-forgot" aria-labelledby="auth-tab-forgot" className="mt-6 space-y-4" onSubmit={submitForgot} noValidate>
                    <p className="text-sm text-[#6b7280]">
                      Enter your account email and we’ll send a reset link.
                      page.
                    </p>
                    <div>
                      <label htmlFor="fg-email" className="text-sm font-semibold text-[#1a2333]">Email</label>
                      <input id="fg-email" name="email" type="email" placeholder="you@example.ph" className={inputCls + invalidCls(!!issueFor(issues, "fg-email"))} autoComplete="email" aria-invalid={!!issueFor(issues, "fg-email")} aria-describedby={issueFor(issues, "fg-email") ? "fg-email-error" : undefined} />
                      <FieldError id="fg-email-error" message={issueFor(issues, "fg-email")} />
                    </div>
                    <button type="submit" disabled={status === "pending"} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60">
                      {status === "pending" ? "Sending…" : "Send reset link"}
                    </button>
                    <FormStatus status={status} pendingText="Preparing your reset link…" successText="Reset link sent — check your inbox." />
                    <button type="button" onClick={() => switchTab("login")} className="ugnay-btn ugnay-btn-link w-full">
                      Back to login
                    </button>
                  </form>
                )}
              </>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={submitWorkspace} noValidate>
                {issues.length > 0 && <ErrorSummary issues={issues} />}
                <div>
                  <label htmlFor="ws-org" className="text-sm font-semibold text-[#1a2333]">
                    Organization
                  </label>
                  <input
                    id="ws-org"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. Bulacan PDRRMO"
                    autoComplete="organization"
                    aria-invalid={!!issueFor(issues, "ws-org")}
                    aria-describedby={issueFor(issues, "ws-org") ? "ws-org-error" : undefined}
                    className={inputCls + invalidCls(!!issueFor(issues, "ws-org"))}
                  />
                  <FieldError id="ws-org-error" message={issueFor(issues, "ws-org")} />
                </div>
                <div>
                  <label htmlFor="ws-email" className="text-sm font-semibold text-[#1a2333]">
                    Work email
                  </label>
                  <input
                    id="ws-email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    type="email"
                    placeholder="desk@lgu.gov.ph"
                    autoComplete="email"
                    aria-invalid={!!issueFor(issues, "ws-email")}
                    aria-describedby={issueFor(issues, "ws-email") ? "ws-email-error" : undefined}
                    className={inputCls + invalidCls(!!issueFor(issues, "ws-email"))}
                  />
                  <FieldError id="ws-email-error" message={issueFor(issues, "ws-email")} />
                </div>
                {audience === "lgu" && (
                  <div>
                    <label htmlFor="ws-role" className="text-sm font-semibold text-[#1a2333]">
                      Role
                    </label>
                    <select
                      id="ws-role"
                      value={lguRole}
                      onChange={(e) => setLguRole(e.target.value)}
                      className={inputCls}
                    >
                      {LGU_ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button type="submit" disabled={status === "pending"} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60">
                  {status === "pending" ? "Signing in…" : `Continue to ${audience === "lgu" ? "LGU portal" : "workspace"}`}
                </button>
                <FormStatus status={status} pendingText="Checking credentials…" successText="Signed in." />
                <p className="text-xs text-[#6b7280]">
                  Workspace access is provisioned by your organization admin with a role.
                </p>
              </form>
            )}
          </section>

          {/* Quick access */}
          <aside className="ugnay-card h-fit p-5 sm:p-6" aria-label="Quick access">
            <h2 className="font-display text-lg font-bold text-[#1a2333]">Quick access</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Jump straight into a workspace:
            </p>
            <div className="mt-4 space-y-2">
              <Link href="/account" className="ugnay-btn ugnay-btn-solid w-full">
                <User className="size-4" aria-hidden /> Enter as donor
              </Link>
              <Link href="/corporate/dashboard" className="ugnay-btn ugnay-btn-outline w-full">
                <Building2 className="size-4" aria-hidden /> Enter as corporate
              </Link>
              <Link href="/lgu/dashboard" className="ugnay-btn ugnay-btn-outline w-full">
                <Landmark className="size-4" aria-hidden /> Enter as LGU desk
              </Link>
            </div>
            <p className="mt-4 rounded-xl bg-[#f3f3f3] px-3 py-2 text-xs text-[#6b7280]">
              These buttons open the relevant workspace.
              
            </p>
            <Link href="/transparency" className="ugnay-btn ugnay-btn-link mt-2 w-full">
              Just looking? Browse transparency first
            </Link>
          </aside>
        </div>
      </main>
      <LandingFooter base="/" />
    </div>
  );
}
