export interface FeeBreakdown {
  /** Donation subtotal in PHP */
  subtotal: number;
  /** Platform fee in PHP */
  platformFee: number;
  /** Payment processing fee in PHP */
  processingFee: number;
  /** Total charged in PHP */
  total: number;
}

/** Fee example: ₱1,000 + ₱30 platform + ₱10 processing = ₱1,040 */
export const exampleFeeBreakdown: FeeBreakdown = {
  subtotal: 1000,
  platformFee: 30,
  processingFee: 10,
  total: 1040,
};

export function feeBreakdownFor(amount: number): FeeBreakdown {
  const platformFee = Math.round(amount * 0.03);
  const processingFee = 10;
  return { subtotal: amount, platformFee, processingFee, total: amount + platformFee + processingFee };
}

export type DonationStatus = "Pledged" | "Confirmed" | "Allocated" | "Delivered" | "Verified";

export interface Donation {
  id: string;
  donor: string;
  anonymous: boolean;
  amount: number;
  campaignId: string;
  date: string;
  ledgerRef: string;
  status: DonationStatus;
}

export const donations: Donation[] = [
  { id: "don-001", donor: "Maria Santos", anonymous: false, amount: 1000, campaignId: "cmp-hagonoy", date: "2026-10-03T09:12:00+08:00", ledgerRef: "TX-UGNAY-004821", status: "Verified" },
  { id: "don-002", donor: "Anonymous", anonymous: true, amount: 5000, campaignId: "cmp-san-fernando", date: "2026-10-03T11:40:00+08:00", ledgerRef: "TX-UGNAY-004822", status: "Delivered" },
  { id: "don-003", donor: "Jose Rizal Corp.", anonymous: false, amount: 25000, campaignId: "cmp-hagonoy", date: "2026-10-02T15:05:00+08:00", ledgerRef: "TX-UGNAY-004815", status: "Allocated" },
  { id: "don-004", donor: "Ana Dela Cruz", anonymous: false, amount: 500, campaignId: "cmp-calumpit", date: "2026-10-02T08:22:00+08:00", ledgerRef: "TX-UGNAY-004809", status: "Verified" },
  { id: "don-005", donor: "Kalinga Foundation", anonymous: false, amount: 50000, campaignId: "cmp-san-fernando", date: "2026-10-01T13:57:00+08:00", ledgerRef: "TX-UGNAY-004798", status: "Confirmed" },
  { id: "don-006", donor: "Miguel Torres", anonymous: false, amount: 1200, campaignId: "cmp-sta-rosa", date: "2026-09-30T17:11:00+08:00", ledgerRef: "TX-UGNAY-004777", status: "Verified" },
];
