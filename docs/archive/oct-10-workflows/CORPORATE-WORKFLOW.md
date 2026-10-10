# Corporate & NGO Workflow Specification

> **Note:** This document serves as the authoritative specification for the Corporate, NGO, and Sponsor workflow within the UGNAY platform, superseding earlier `.docx` concept notes.

## 1. Corporate Onboarding and SponsorMatch

UGNAY functions as an active SponsorMatch engine supported by manual browsing, rather than just a passive directory.

*   **Onboarding:** Corporate registration (`/corporate/onboarding`) must capture actionable CSR preferences: preferred cause areas (e.g., WASH, health), geographic coverage, capacity, and SDG alignment.
*   **Active Matching:** The system ranks relevant opportunities based on these preferences against verified relief gaps.
*   **Explainability:** The match score (e.g., "85% fit") must be explainable via rules-based logic (e.g., matching geography and sector). It is never pay-to-rank.
*   **Manual Discovery:** Corporations are never restricted to algorithms; they can manually browse, search, and filter all eligible campaigns.

## 2. Contribution Types and Pledges

The system strictly differentiates between Cash and In-Kind contributions, as well as the difference between a promise and physical receipt.

*   **In-Kind Contributions (Pledges):** When a corporate user submits an in-kind contribution, it is logged strictly as a **Proposed Commitment**. It does *not* automatically reduce the LGU's relief gap. It appears on the corporate dashboard as "Pending Drop-off" or "Pending Confirmation."
*   **Cash Contributions (Pooled):** By default, cash contributions are pooled for operational efficiency. 
*   **Restricted Funds:** If a contribution has explicit contractual allocation or reporting restrictions, it bypasses automatic pooling and is tracked individually.

## 3. Discrepancies and Partial Fulfillment

Fulfillment rarely matches pledges exactly. The dashboard must handle discrepancies honestly:
*   **Partial Receipt:** If a sponsor pledges 5,000 items but only 4,500 are verified received, the dashboard instantly reflects 4,500 fulfilled and flags 500 as "Outstanding" or "Under Review."
*   **No Automatic Closure:** Pledges are not automatically closed upon partial receipt. The remaining quantity must either be delivered later or formally resolved.
*   **Formal Variance Resolution (Recommended Policy):** An authorized LGU officer is responsible for recording the formal resolution and final status of any discrepancy. If the remaining quantity is cancelled or waived, the reason must be documented and sponsor acknowledgement is required (unless specific campaign exceptions apply). The pledge then enters a "Closed — Partially Fulfilled" state. 
*   **History Preservation:** The system always preserves the original pledge amount, the verified receipt, the discrepancy, the evidence, and the subsequent resolution actions.

## 4. Evidence, Privacy, and Impact Reporting

Corporate sponsors receive impact reports based on a **Tiered Evidence Model**:

*   **Baseline Impact Summary:** Shows actual contribution, verified quantities delivered, incident location, and fulfillment status.
*   **Granular Evidence (Authorized):** Where underlying records support it, sponsors receive Barangay-level or Evacuation-Center-level summaries, sanitized field photos, and delivery documents.
*   **Privacy & Sanitization:** Evidence must *never* expose Personally Identifiable Information (PII) such as beneficiary names, IDs, or exact household addresses. All field photos and documents must be reviewed and sanitized by an authorized LGU officer before being published to the corporate tier.
### Proportional Cash Attribution
For pooled cash contributions, a sponsor's impact is attributed based on its proportion of eligible pooled funds *actually spent* on documented, campaign-related relief. It does not treat pledged amounts as proof of impact and never falsely implies 1:1 physical tracking of specific coins. 

*   **Rolling Reconciliation (Calculation Basis):** Impact is recalculated after each rolling monthly expenditure reconciliation. *(Recommended simple auditable approach: A sponsor's share is calculated as their total received contribution divided by the total pooled cash received for the campaign. Their attributed monthly impact is that percentage applied to the total eligible monthly spending).*
*   **Reporting Labels:** The dashboard must clearly distinguish between **"Provisional Impact"** (reported during an active campaign based on rolling months) and **"Final Reconciled Impact"** (locked after campaign closure).
*   **Adjustments and Closure:** Outstanding expenses, refunds, accounting corrections, and unspent balances are fully reconciled at final campaign closure, adjusting the final impact report accordingly.
*   **Evidence Required:** Impact reports are strictly backed by documented expenditure records and LGU-sanitized delivery evidence.
*   **Restricted Funds Exception:** Contributions with explicit contractual restrictions bypass the pool, are tracked separately, and respect their specific allocation rules.

### Public Sponsor Recognition
*   **Visibility Control:** Public recognition of a sponsor's contribution is enabled by default.
*   **Sponsor Preferences:** The sponsor may change this visibility setting per contribution or per campaign.
*   **Distinction from Privacy:** Public recognition is strictly distinct from access to financial, operational, and beneficiary data. Opting out of public recognition (anonymous giving) does not opt the sponsor out of legitimate operational reporting to authorized LGU personnel or accountability audits.

## 5. Corporate-LGU Handoff

The integrity of UGNAY depends on a strict state-machine handoff between the Corporate and LGU workspaces.

1.  **Visibility:** Corporate pledges become visible to LGUs for logistics planning.
2.  **Physical Receipt:** When the LGU physically receives the goods, the exact received quantity transitions from "Incoming Commitment" into "Available Inventory."
3.  **Gap Calculation:** This transition ensures the LGU Relief Gap is reduced appropriately without double-counting the pledge and the physical stock.
4.  **Verification Feedback:** Once the LGU verifies final delivery to the end beneficiary, that status automatically flows back to the corporate Transparency and Tracking dashboards.
