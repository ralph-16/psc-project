

# Normal User / Public Donor Workflow Specification

> **Note:** This document serves as the authoritative specification for the Normal User / Public Donor journey within UGNAY, detailing discovery, donation, tracking, and transparency.

## 1. Purpose, Scope, and Core Principles
This document defines the authoritative workflow for normal users and public donors. The core principle is **frictionless transparency**: anyone must be able to discover needs, make a monetary donation, and track its impact without creating an account. The platform acts as a neutral transparency engine, prioritizing verifiable accountability over subjective curation or engagement gamification.

## 2. Public Access and Account Boundaries
*   **Guest Access:** Guests can browse campaigns, view transparency dashboards, use Quick Donate, specify public recognition/anonymity preferences, and track contributions via a DonationTrace ID.
*   **Logged-In Donors:** Account creation is optional. Registered users inherit all guest features plus a persistent "My Giving" history, campaign saving/following, and the ability to submit "Give Goods" in-kind pledges.
*   **Architecture Principle:** Guests and registered donors use the exact same underlying donation and traceability engine. 

## 3. Campaign Discovery, Sorting, Filters, and Lifecycle
*   **Neutral Default Sorting:** Campaigns default to chronological sorting (newest verified or recently updated). There is no paid promotion, manual favoritism, or subjective "Urgent" labeling.
*   **User Filters:** Users can filter by location, disaster type, and status. An optional sort for "Highest % of Unmet Needs" is available, but absolute need figures must be displayed alongside percentages to maintain scale context.
*   **Campaign Lifecycle:** Campaigns that are *Fully Fulfilled*, *Suspended*, or *Closed* automatically disable donation inputs and explicitly explain their final status and the disposition of any remaining funds.
*   **Social Sharing:** Campaign pages utilize lightweight native device sharing (Web Share API) with a simple copy-link fallback.

## 4. Quick Donate, Campaign Donations, and Give Goods
The platform supports three distinct contribution paths:
1.  **Quick Donate:** A fast monetary flow (cash only) accessible globally. May include a "Where Most Needed" option if authorized campaign rules support it.
2.  **Campaign Donate:** A contextual monetary flow originating from a specific campaign page.
3.  **Give Goods (In-Kind Pledges):** Strictly gated to logged-in donors to ensure LGU logistics coordination. *(Note: While restricting this to logged-in users is agreed upon, the specific 3-step UI simplification is a proposed MVP feature pending technical evaluation).*
*Note: An in-kind pledge is strictly a proposed commitment. It does not equate to physical receipt or reduce the verified relief gap until physically delivered and logged by the LGU.*

## 5. Checkout, Fee Disclosure, and Payment States
*   **Add-On Fee Model:** UGNAY utilizes a proposed platform transaction fee of ~3%. This fee is added *on top* of the intended donation, ensuring the full stated donation amount reaches the verified relief requirement. *(Note: The precise calculation base, rounding rules, and technical split-routing configurations remain unresolved implementation/business rules).*
*   **Explicit Disclosure:** Checkout must distinctly itemize: (1) Intended Donation, (2) UGNAY Platform Fee, (3) Third-Party Gateway Fee, and (4) Final Amount Charged.
*   **Transaction States:** A DonationTrace ID is issued upon submission, but it is not proof of payment. Transaction states must accurately distinguish between *Initiated*, *Pending*, *Confirmed*, *Disputed*, *Chargeback*, *Refunded*, and *Reversed*. 
*   **Disputes & Reversals:** A dispute does not automatically label a transaction as *Failed* or *Reversed*. The DonationTrace history must preserve the timeline and accurately reflect verified events from the payment provider.

## 6. DonationTrace and Guest Tracking
*   **Frictionless Tracking:** Following a donation, guests receive a DonationTrace ID and a clear "Copy" action. They may optionally provide an email to receive a persistent tracking link. Email is never mandatory unless strictly required by the payment provider.

## 7. My Giving and Account Linking
*   **Post-Donation Prompt:** Guests may be gently offered the option to create an account after a successful donation without interrupting the flow.
*   **Secure Linking:** Linking a legacy guest DonationTrace to a registered account requires secure verification of ownership for that specific donation record. A simple email string match is insufficient to automatically grant access.

## 8. Transparency, Surplus Accounting, and Reconciliation
UGNAY does not assume automatic rollovers. Excess funds are explicitly tracked. The dashboard distinguishes:
1.  **Remaining Unspent Funds:** Not yet utilized; disposition pending.
2.  **Authorized for Reallocation:** Approved for another purpose (destination/authorization disclosed).
3.  **Reallocated/Transferred:** Transfer legally completed/reconciled.
4.  **Final Reconciliation:** A closing summary of received, utilized, transferred, and remaining balances.

## 9. Public Evidence and Supporter Wall
*   **Aggregated Impact Reports:** Public users view aggregated outcomes, financial totals, and sanitized photos. Raw line-item receipts are gated by default to protect PII.
*   **Verification Labeling:** A report is only labeled "Verified" when the responsible reviewer has formally recorded their verification.
*   **Opt-In Supporter Wall:** Individual donors are anonymous by default. To appear on the Supporter Wall, a donation must have a *Confirmed* payment status, explicit opt-in consent, and server-side privacy enforcement ensuring anonymity defaults never leak. Display names must undergo validation. *(Note: Responsibility and policies for moderating display names remain unresolved).* No donation amounts or rankings are displayed.

## 10. Disputes, Refunds, and Support Boundaries
*   **Unified Entry Point:** A "Report a Problem" option exists on Trace/Confirmation screens.
*   **Boundary Enforcement:** UGNAY is a transparency engine, not a fund holder. The UI must explicitly state that UGNAY cannot promise or process refunds.
*   **Routing:** Financial disputes are referred to the authorized fund administrator/payment provider. Platform tracking errors are routed to UGNAY support. Support tickets generate reference IDs. *(Note: Backend automated routing is proposed; if unavailable, a realistic fallback providing direct contact info to the user is required).*

## 11. Accessibility and Low-Bandwidth Behavior
*   **Accessibility:** Core transparency data, donation forms, and trace tracking must function smoothly on mobile devices and low-bandwidth connections, independent of heavy visual assets.

## 12. Current Implementation Status and Verification
*   **Status:** Currently, `app/campaigns` and `LandingDonate` rely entirely on front-end UI components, `localStorage`, and static mock data. Backend routing, secure verification, database state machines, and payment gateway webhooks do not exist.
*   **Verified Behavior:** The current codebase simulates the checkout and fee UI visually, but actual payment confirmation, add-on math execution, and secure guest-linking are strictly unimplemented.

