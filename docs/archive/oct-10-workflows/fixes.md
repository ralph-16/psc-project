We caught a few major logic gaps in how corporate donations interact with the LGU side, so we locked down the business rules before we start coding. Here are the main holes and how we fixed them:

The "Instant Delivery" Hole:
Problem: The current UI assumes that when a corporation clicks "Contribute 5,000 items," the goods magically appear at the LGU instantly.
Fix: Pledges vs. Receipt. In-kind contributions are now strictly tracked as Proposed Commitments. They don't reduce the LGU's relief gap until a truck actually arrives and the LGU logs physical receipt.
The "Exact Peso Tracking" Hole:
Problem: Trying to trace exactly which cans of sardines were bought with Sponsor A's specific ₱50,000 check is an operational nightmare.
Fix: Proportional Cash Pooling. Cash is pooled by default. A sponsor’s CSR dashboard will show their impact based on their percentage of the pool applied to funds actually spent (recalculated monthly).
The "Stuck at 90%" Hole:
Problem: If a sponsor pledges 5,000 hygiene kits but 500 get damaged in transit, their dashboard is stuck at 90% fulfilled forever, ruining their CSR report.
Fix: Formal Variance Resolution. We added a rule where an LGU officer can formally "close" a partial delivery (with documented reasons and sponsor acknowledgement) so the pledge gets settled cleanly.
The "Fake AI Score" Hole:
Problem: The UI shows a random "84% match" for campaigns with no logic behind it.
Fix: Rules-Based SponsorMatch. Corporate onboarding will now actually capture CSR preferences (geography, sector, budget) so the matching engine can explain exactly why a campaign is recommended.
The "Privacy vs. Marketing" Hole:
Problem: Sponsors want granular delivery photos for their impact reports, but LGUs can't leak beneficiary identities.
Fix: Tiered Evidence. Field documents and photos must be formally reviewed and sanitized (PII stripped) by an LGU auditor before they are published to the corporate dashboard.

TL;DR: The Corporate and LGU workflows are now perfectly synced. Corporate pledges cleanly handshake with LGU inventory, and all the edge cases for cash, discrepancies, and privacy are documented and ready for development!