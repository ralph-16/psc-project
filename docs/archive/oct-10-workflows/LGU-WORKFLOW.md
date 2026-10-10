# LGU Operational Workflow Specification

> **Note:** This document serves as the authoritative specification for the Local Government Unit (LGU) workflow within the UGNAY platform.

## 1. Roles and Authorization

The LGU platform uses a unified workspace with Role-Based Access Control (RBAC). Smaller LGUs may assign multiple roles to a single user.

*   **Campaign Manager:** Responsible for incident assessment, needs estimation, managing the Incident War Room, and initiating public campaigns.
*   **Warehouse / Field Worker:** Responsible for receiving goods, managing physical inventory, allocating resources, and dispatching deliveries.
*   **Auditor / Finance Officer:** Responsible for reviewing delivery evidence, executing final verification, discrepancy resolution, and financial reconciliation.

**Open Decision (Authorization):** If a single user holds both Warehouse and Auditor roles, does the system permit them to verify a delivery they dispatched? (Self-dealing conflict requires project-team policy).

## 2. Incident War Room

The Incident War Room (`/lgu/events/[id]`) is the central, incident-specific operational dashboard.
It aggregates data for immediate decision-making, including:
*   Incident identity, status, and location.
*   Affected population (incident scope).
*   Incident-specific available stock.
*   Incoming resource commitments.
*   Estimated vs. Verified Needs.
*   Calculated Remaining Relief Gap.
*   Pending approvals, urgent exceptions, and discrepancies.

**Global Modules:** The War Room relies on data from master modules (`/lgu/population` and `/lgu/inventory`). Global management (e.g., cross-incident warehousing) remains in those master modules; they are not duplicated inside the War Room.

## 3. Needs Estimation and Validation

To balance speed and transparency:
*   **Estimated Needs:** Derived from preliminary data. Cannot trigger a public campaign without review.
*   **Verified Needs:** Ground-truthed assessments.
*   **Approval:** An authorized reviewer must approve Estimated Needs before a public campaign goes live. Once Verified data is available, the system transparently updates the campaign requirements.

## 4. Incoming Commitments and Inventory Accounting

The relief gap is calculated continuously:
`Remaining Gap = Required − Inventory − Confirmed Incoming`

*Definition of Inventory:* Refers strictly to *Available Physical Stock* (Total On-Hand minus Reserved/Allocated stock).

### Accounting Rules (Preventing Double-Counting):
1.  **Proposed Commitments:** Do *not* reduce the relief gap.
2.  **Confirmed Commitments:** Reduce the relief gap.
3.  **Physical Receipt:** When a confirmed commitment arrives, its quantity is subtracted from "Confirmed Incoming" and added to "Available Inventory." The net effect on the Remaining Gap is zero at the moment of transfer, preventing double-counting.
4.  **Partial Receipts:** Supported. The unreceived portion remains in "Confirmed Incoming," while the received portion moves to "Available Inventory."
5.  **Traceability:** Receipts are permanently linked to the originating commitment, destination, and commodity.

**Open Decision (Commitment Expiry):** Do unfulfilled Confirmed Commitments expire automatically after a certain timeframe, or do they require manual cancellation to remove them from the gap calculation?

## 5. Conditional Fulfillment Paths

Fulfillment is not a single linear path. Procurement is not mandatory for all goods.

**Path A: Direct In-Kind Donations**
`Received (Warehouse) → Allocated → In Transit → Delivered → Verified`

**Path B: Existing Inventory**
`Allocated → In Transit → Delivered → Verified`

**Path C: Goods Requiring Procurement (Cash)**
`Procurement (PO Created) → Received → Allocated → In Transit → Delivered → Verified`

## 6. Delivery, Acknowledgement, and Discrepancies

Delivery is tracked via distinct, role-separated stages:
1.  **Dispatch:** Recorded by Warehouse/Logistics.
2.  **Acknowledgement:** Recorded by the receiving party (e.g., Barangay representative). Notes quantity received vs. quantity dispatched.
3.  **Evidence Review:** Conducted by the Auditor/Finance Officer.
4.  **Discrepancy Resolution:** Handled by the Auditor.
    *   **Usable Goods:** Decrement from outstanding pipeline.
    *   **Damaged/Missing Goods:** Do *not* automatically return to Available Inventory. They are moved to a "Write-off/Quarantine" state. The Relief Gap will organically recalculate based on the shortfall of usable goods against the requirement.
5.  **Final Verification:** Closes the fulfillment loop.

## 7. Verification and Conflict of Interest

Final verification is decoupled from field acknowledgement.
*   **Independently Verified:** Sign-off provided by a third-party NGO or independent auditor.
*   **Self-Verified by LGU:** Permitted if an independent auditor is absent to prevent operational gridlock. The system must explicitly badge these records as self-verified for transparency.

**Open Decision (Verification Thresholds):** Are there high-value delivery thresholds where "Self-Verified by LGU" is strictly prohibited, mandating third-party review?

## 8. Corporate Contributions and Accountability

To prevent warehouse gridlock, Ugnay does not force physical segregation of corporate donations unless legally required.
*   **In-Kind:** Tracked at the batch level.
*   **Cash:** Pooled and reported via proportional attribution (e.g., "This contribution funded X% of the delivery to Barangay Y").
*   **Segregation:** Only executed when the specific donation agreement demands it.
