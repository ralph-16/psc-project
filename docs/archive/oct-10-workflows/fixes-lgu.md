We found a few major "holes" in how the app handles real disaster response, so we updated the workflow specification to fix them before we write more code:

The "Procurement" Hole:
Problem: The old flow forced every single relief batch to go through a "Purchasing/Procurement" step. That breaks if an NGO just drops off boxes of canned goods (in-kind donations).
Fix: Conditional paths. We updated the flow so direct donations can skip procurement and go straight to allocation.
The "Double Counting" Hole:
Problem: Our Relief Gap formula is Required - Inventory - Incoming. If 1,000 packs of "Incoming" goods physically arrive at the warehouse, they become "Inventory." If the system didn't automatically delete them from "Incoming", we'd accidentally subtract those 1,000 packs twice, making the gap look smaller than it is.
Fix: Strict accounting. We defined a rule that instantly moves the exact quantity from Incoming to Inventory the second they are received.
The "Self-Verification" Hole:
Problem: The person dropping off the goods (or the LGU) shouldn't be the final auditor, or it ruins our transparency promise.
Fix: Two-step delivery. We split it into "Acknowledgement" (done by the receiver in the field) and "Final Verification" (done at the desk). If an independent NGO isn't there and the LGU has to self-verify, the system will explicitly badge it as "Self-Verified" so donors know.
The "Too Many Screens" Hole:
Problem: During a typhoon, clicking through 10 different global modules (Population, Inventory, Forecast, etc.) is a nightmare for an LGU officer.
Fix: The Incident War Room & Roles. We documented a single centralized "War Room" dashboard for active disasters, and grouped the sidebar links cleanly by roles (Campaign Manager, Warehouse, Auditor).

TL;DR: We made the workflow handle real-world chaos (donations skipping procurement, math not breaking upon delivery, and better auditing), all documented in LGU-WORKFLOW.md.