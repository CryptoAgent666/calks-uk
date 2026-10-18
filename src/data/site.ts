// Site-wide editorial constants.

// Date of the last full verification pass of regulatory constants against
// gov sources (weekly Tier-1 monitor + reconcile). Shown as the trust badge
// on calculator pages. ⚠️ Update this on every constants-fix deploy —
// it is part of the DATA_HUB loop (see CLAUDE.md "Regulatory constants").
export const RATES_VERIFIED = '19 October 2026'

// Calculators shown as "Popular" on the homepage and in the footer, ordered by
// Search Console clicks over the 28 days to 13 October 2026 (gcse 286, premium
// bonds 200, weight 94, NS&I 77, zero hours 62, fence paint 54, ground rent 54,
// business rates 47, car insurance 46, farm tenancy 34, cost of living 30,
// night shift 22). Before this the list was the first twelve priority-1 entries,
// which were tax pages ranking 40th to 85th. Refresh from GSC every quarter.
export const POPULAR_SLUGS = [
  'gcse-grade-calculator',
  'premium-bonds-calculator',
  'weight-converter',
  'ns-i-savings-calculator',
  'zero-hours-calculator',
  'fence-paint-calculator',
  'ground-rent-calculator',
  'business-rates-calculator',
  'car-insurance-estimate-calculator',
  'farm-tenancy-calculator',
  'cost-of-living-comparison-calculator',
  'night-shift-calculator',
]
