/**
 * Shared policy defaults (Oct 10, prototype scope). Tunable constants so the
 * locked rules live in one place instead of inside UI copy.
 */

/** Single delivery batch value above which independent verification is required. */
export const HIGH_VALUE_THRESHOLD_PESOS = 50_000;

/** LocalStorage key for the corporate CSR profile captured at onboarding. */
export const CSR_PROFILE_KEY = "ugnay-csr-profile";
