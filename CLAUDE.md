# CALK-UK (calks.uk) — project context

UK tax/finance calculator site. **Astro 6 + React 19 + Capacitor 8**, English-only, **334 calculator
components** (`src/components/calculators/*.tsx`). Hosting: **Cloudflare Pages** + self-hosted Capgo OTA
(`https://calks.uk/app/`). Git: `github.com/CryptoAgent666/calks-uk`. iOS + Android both ready.

## Deploy
```bash
npm run deploy   # scripts/deploy.mjs: astro build -> zip dist as OTA bundle -> write /app/latest.json
                 # -> npx wrangler pages deploy dist --project-name calks-uk --branch main
```
Site + OTA bundle go live together; installed apps auto-update on next launch. No CI.

## Regulatory constants (tax rates, NI, student loans, benefits, SDLT, council tax…)

The site hard-codes hundreds of government-set values. They are inventoried + freshness-monitored.
**READ `CONSTANTS-PILOT-2026-06.md` before touching any constant.**

- **Inventory / source of truth:** `src/data/regulatory-constants.canonical.json` — **1382 constants**
  (key, value, unit, law, theme, surfaces[], used_by[], status, source_url, conflict). ⚠️ This JSON is
  an **audit ledger — NOT imported by the site.** Live values are hardcoded per-component, so apply
  fixes to the `.tsx` / content files (authoritative), then reconcile the ledger.
- **Two surfaces:** computed consts in the 334 `src/components/calculators/*.tsx` (e.g.
  `PERSONAL_ALLOWANCE = 12570`, `MIN_WAGE = 12.71`) **and** prose/FAQ in `src/data/calculator-content.ts`
  & `src/data/faqs.ts`. No central rates module. NB the `.ts` source uses `£` escapes for some `£` —
  grep both forms; recompute derived illustrative sums when a rate changes.
- **English-only** — no locale mirror.

### State as of 2026-06-16 (UK tax year 2026-27, 6 Apr – 5 Apr)
- **1382 constants** = **1000 current · 0 stale · 71 uncertain · 310 unverified · 1 historical** (after
  the tail-completion pass 2026-06-16). 1072 web-verified over two passes (570 core + 502 tail).
- **~370 high-confidence 2026-27 fixes APPLIED** to the working tree (`.tsx` + content/faqs prose) —
  **NOT deployed**. Incl. **dividend +2pp** (8.75→10.75, 33.75→35.75, Budget 2025), **SSP reform** logic
  (waiting-days + LEL removed 6 Apr 2026), **IHT APR/BPR cap £1m→£2.5m**, **WDA main pool 18→14%**
  (Budget 2025), **NHS AfC pay scales 2026/27**, court/visa/probate fees, maintenance loans, tuition
  £9,790, IR35 £15m, April-2026 benefits/pension-credit/statutory-pay, **Scottish** bands, student-loan
  interest, NI Class 2/3, **NLW prose £12.21→£12.71**.
- ⚠️ **AMAP car mileage is 45p/25p (frozen since 2011)** — a freshness agent hallucinated "55p"; it was
  rejected. Lesson: re-verify "frozen-but-suddenly-changed" against the live gov source (WDA & dividend
  WERE real changes; AMAP was not).
- **Remaining (not stale):** 71 uncertain (Teachers' Pension tiers — live code has its own set, needs the
  official TPS factsheet; proposed High-Value Council Tax bands; per-region band-D; a few structural) +
  310 unverified (derived / non-numeric / council-tax local £) → Tier-2 quarterly + calendar.
- Monitored by DATA_HUB: Tier-1 weekly (`calks-uk-monitor-config.json`, 687 gov constants / 180 pages,
  gov-only: gov.uk/gov.scot/gov.wales/revenue.scot/legislation) + Tier-2 quarterly (next 8 Jul 2026).
  Dashboard «Полный пилот». Loop: alert → fix here (.tsx + content/faqs) → **if the change is
  user-significant, add a brief note to the Updates page (`src/pages/updates.astro`)** → `npm run deploy`.

## Key UK context
- Income-tax thresholds **frozen to 2028** (PA £12,570, basic-rate limit £37,700, higher £50,270, additional £125,140).
- **Scotland has its own income-tax bands & rates** (starter 19 / basic 20 / intermediate 21 / higher 42 / advanced 45 / top 48%) — set annually via the Scottish Budget.
- Employer (secondary) NI **15%** from Apr 2025 (secondary threshold £5,000).
- SDLT (England/NI) from Apr 2025: residential nil-rate £125k, FTB relief to £300k (cap £500k), +5% additional-property surcharge.
- VAT 20% (registration threshold £90k); Corporation Tax 25% main / 19% small profits.
