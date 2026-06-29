# calks.uk — Constants pilot & 2026-27 freshness (handoff)

Session log + living reference for the regulatory-constants pilot run **2026-06-16** from the
DATA_HUB session. Repo: `CALK-UK` (Astro 6 + React 19 + Capacitor 8, **English only**, Cloudflare
Pages + Capgo OTA). **Seventh fleet site on the full pipeline** (after calk24.de, calk-usa.com,
calk.kz, calk-au.com, calk.nz, calk-ca.com). The UK tax year runs **6 April – 5 April**; this audit
is for **2026-27** (started 6 Apr 2026).

---

## TL;DR — current state

| Thing | State |
|---|---|
| Constants | **1382** canonical (`src/data/regulatory-constants.canonical.json`) — sweep of 334 calculator components + 3 content files (31 agents) → mechanical canonicalize. England/Wales/Scotland/NI. |
| ⚠️ Canonical is an **audit ledger** | The JSON is **NOT imported by the site** — live values are hardcoded per-component. Verify against the JSON, but **apply fixes to the `.tsx` / content files**, which are authoritative. |
| Freshness | **1072 web-verified** (570 core + 502 deferred-tail, 2026-06-16, 41 source-topic agents over two passes vs gov.uk / HMRC / gov.scot / gov.wales / revenue.scot / DWP / nhsemployers): **1000 current / 0 stale / 71 uncertain**. **Tail closed 2026-06-28** (see §3a): the remaining **309 unverified** were web-verified via 11 parallel topic agents (`tier2-tail`) → **249 current / 38 stale_confirmed / 22 uncertain**. **Whole-ledger now: 1251 current / 38 stale_confirmed / 92 uncertain / 1 historical / 0 unverified.** |
| Fixes | **~370 edits applied** to the working tree (across components + content/faqs prose; `tsc` noisy only on pre-existing `@/utils` alias + a pre-existing CourtFee `feePct` union, unrelated) — **NOT deployed**. |
| Monitoring | Tier-1 weekly server monitor (`calks-uk-monitor-config.json`, **687 gov-sourced / 180 gov source pages**, gov-only whitelist + volatility guard) + Tier-2 quarterly fleet LLM verify (next **8 Jul 2026**). |
| Dashboard | calks.uk = **«Полный пилот»** (7th), `in_routine=true`, `monitored=true`. |
| **Deployed?** | ✅ **Deployed 2026-06-16** (OTA bundle `202606161331`) via `npm run deploy` — verified live (dividend 10.75/35.75, Scottish £16,537, IHT £2.5m, blind allowance £3,250, SSP £123.25). Deploy = `npm run deploy` (`scripts/deploy.mjs` → `npx wrangler pages deploy dist --project-name calks-uk` + Capgo OTA bundle). Repo IS under git (`github.com/CryptoAgent666/calks-uk`). |

## 1. What changed for 2026-27 (the drift this pilot caught)

UK income-tax thresholds are **frozen to 2028** (PA £12,570, higher-rate £50,270) — so those read
**current**, not stale. The real 2026-27 drift was in:
- **Dividend tax +2pp** (Budget 2025, from 6 Apr 2026): ordinary **8.75→10.75%**, upper **33.75→35.75%**
  (additional 39.35% unchanged). Applied across all dividend calculators + prose.
- **SSP reform** (from 6 Apr 2026): Lower Earnings Limit and the 3 waiting-days **removed**; weekly rate
  £116.75→**£123.25**. (The LEL/waiting-days → 0 logic change is **deferred** — it's structural, not a scalar.)
- **IHT APR/BPR** 100%-relief allowance **£1m → £2.5m** (from 6 Apr 2026).
- **April-2026 uprating**: DWP benefit cap, statutory pay (SMP/SPP/SSP LEL £125→£129), maternity
  allowance, pension credit, housing benefit, blind person's allowance £3,070→**£3,250**, employment
  tribunal cap, various gov fees (ILR, spouse/visa).
- **Scotland** (set annually): starter band top £15,397→**£16,537**, basic band top £27,491→**£29,526**
  (+ the contiguous prose edges).
- **Student-loan interest** rates (Plan 1/2/4/5 + Postgraduate) + Plan 2 income threshold.
- **NI Class 2/3** voluntary rates + small-profits threshold; **NLW prose** £12.21→**£12.71** (the
  computed constant was already current; the prose copies in content/faqs were stale).

### ⚠️ False positive caught
The freshness agents flagged **AMAP car mileage 45p→55p** (5 keys). This is **WRONG** — the 45p/25p
rate is **frozen since 2011** and confirmed current for 2026-27 on gov.uk. Fresh verification rejected
it; the code (45p) was left untouched. **Do not trust a "55p" AMAP value.**

## 2. Two constant surfaces

Values live in BOTH (a) the **334 `src/components/calculators/*.tsx`** (module-level consts like
`PERSONAL_ALLOWANCE = 12570`, `MIN_WAGE = 12.71`, rate literals) AND (b) **prose/FAQ** in
`src/data/calculator-content.ts` and `src/data/faqs.ts`. There is **no central rates module**.
NB: the `.ts` source uses **`£` escapes** for some `£` signs — grep both `£` and the escaped form,
and watch derived illustrative sums (e.g. "35h × £12.71 = £X/week") which must be recomputed when a
rate changes.

## 3. Tail completion (2026-06-16) & what genuinely remains

The deferred tail was **finished** in a second pass: the 11 structural-stale were resolved and a
freshness sweep ran over the 502 verifiable "tail" constants (NHS pay, court/visa fees, maintenance
loans, council band-D, capital allowances, etc.), fixing 77 + the structural set. **Result: 0 stale.**

**Resolved structural (was 11 stale):**
- **SSP reform** — `SickPayCalculator.tsx` rewritten for the 6 Apr 2026 reform: 3 waiting days removed
  (paid from day 1), Lower Earnings Limit gate removed, low earners get min(£123.25, 80% of AWE).
- **SDLT** — the band table was **already correct** (0% to £125k, 2% to £250k, 5% to £925k, FTB 0% to
  £300k cap £500k, +5% surcharge); the `sdlt_band1_rate` flag was a canonical artifact.
- **help-to-save** — prose already describes the Apr-2025 reform (UC + 16h-NLW-equiv); current.
- **Wales LTT** — calc uses a band table (not a flat 4% surcharge); structurally correct.
- **WTC** — tax credits closed 5 Apr 2025 → marked **historical** (scheme defunct).
- **pension-credit severe-disability** £87.87→**£86.05** (gov.uk; the code's £84.65 base was wrong).
- **WDA main pool 18→14%** (Budget 2025, Finance Bill 2025-26, from 1/6 Apr 2026) — a "frozen-but-
  actually-changed" caught by fresh verification (like dividend; special-rate pool stays 6%).

**What genuinely remains (not stale — uncertain or un-verifiable):**
- **71 uncertain:** the **Teachers' Pension Scheme** tiers/rates (live `TeachersPensionCalculator.tsx`
  uses its OWN set 32,947 / 46,525 / 57,790 / 79,573 — needs the official TPS factsheet); the
  **proposed High-Value Council Tax Surcharge** bands (£2m+ properties — not yet law); per-region
  council band-D averages (no single MHCLG 2026-27 headline); a few structural items (Right-to-Buy
  regional discount caps, the removed SA £150k threshold, maintenance-loan minimum tiers).
- ~~**310 unverified:**~~ **CLOSED 2026-06-28** — see §3a. All 309 were web-verified; none are now
  in the `unverified` bucket.

## 3a. Tail verification (2026-06-28, `tier2-tail`)

The **309 `unverified`** constants (council-tax band ratios/1991 bands, DWP benefit rates, NHS/teacher
pay scales, VAT/ISA/business tax, immigration points, housing/building-regs, childcare/UCAS, motoring,
employment rights, HMRC/finance, legal/personal-injury) were grouped into **11 topic batches (≤45)** and
verified by **11 parallel web-search agents** vs PRIMARY sources (gov.uk/HMRC, legislation.gov.uk,
DWP, NHS Employers, STPCD, judiciary.uk, NS&I, TfL, Sentencing Council, UCAS). Verdicts merged into the
ledger as `status` (current/stale_confirmed/uncertain) + `official_value` + `source_url` + `verified_date`
+ `verify_method:tier2-tail`. Ledger backed up to `.bak-tail`. **Result: 249 current / 38 stale_confirmed
/ 22 uncertain.** The two highest-weight stale clusters were adversarially re-checked: **VED first-year
rates 12/12 matched the live gov.uk table exactly**; teacher leadership scales confirmed vs STPCD 2025.
The loop-closer's own `assess()` reproduced the counts with **0 label/measure inconsistencies** (669
numerically cross-checked).

✅ **APPLIED + deployed by the CALK-UK session on 2026-06-28** (OTA bundle `202606281843`, prose verified
live): all 38 corrected in the live `.tsx`/content (ledger left untouched, as instructed). ⚠️ Two adjacent
items were NOT changed (not in the 38, would be guesses) — **DataHub to verify**: (1) `WTC_BASIC` £2,476 &
`WTC_DISABILITY` £4,124 show the same fictional "+1.7%" pattern as the fixed WTC couple/30hr (WTC is frozen
at its 2024/25 final values, so these are likely £2,435 / £4,055); (2) the non-London RTB regional caps
(£16k–£38k by region) — only the London £16,000 was confirmed, and the Manchester worked example now assumes
the £16,000 North West cap. The original ledger-only stale list actioned:
- **VED first-year CO2 rates** ×12 — all one year behind; correct 2026-27 table is live on gov.uk
  (1-50 → £115, 51-75 → £135, … over-255 → £5,690; the stored `_max` 2755 and `_1_to_50` 10/`_51_to_75` 30
  were especially wrong).
- **DWP/UC** ×9 — UC AET single 1009→**991**, couple 1617→**1597** (recompute on £12.71 NLW); UC childcare
  max 1031→**1071.09** (×2 keys) & 1768→**1836.16**; LCW element 156.11→**158.76**; the 2025/26 historical
  couple AET 1524→**1534**; defunct-WTC 30hr 1032→**1015** & couple 2543→**2500**.
- **Teacher leadership** ×6 (STPCD 2025, +4% from 1 Sep 2025) — Grp1 58325→**58569**/76449→**77924**,
  Grp4 69596→**71330**/98884→**97136**, Grp8 92991→**100540**/136298→**143796**; ITT bursary cap 28000→**29000**.
- **Vento bands** lower 1200-11200 → **1300-12600** (Ninth Addendum, claims on/after 6 Apr 2026; mid/upper
  also uprated). **Whiplash ≤3-mo tariff** 240→**275** (SI 2025/615, accidents on/after 31 May 2025).
- **Right-to-Buy London cash cap** 96000→**16000** (SI 2024/1073, 21 Nov 2024). **MEES** date 2028→**1 Oct 2030**
  (value C unchanged). **HMRC late-payment interest** base+2.5%→base+**4%** (from 6 Apr 2025).
  **business-rates AVD** 1 Apr 2021→**1 Apr 2024** (2026 list). **Premium Bonds odds** 21,000→**22,000**.
  **AS-level UCAS** D=8/E=4→**D=10/E=6**. **Water avg combined bill** 583→**639** (medium conf).

## 4. Monitoring (lives on the DATA_HUB server)

- **Tier-1 weekly** (`constants_freshness_monitor.py`): UK config = `calks-uk-monitor-config.json`
  (**687 gov-sourced constants / 180 source pages**, gov-only whitelist: gov.uk + `.gov.uk`,
  **gov.scot**, **gov.wales**, **revenue.scot**, legislation.gov.uk, nhs.uk). Source-hash + calendar;
  **volatility guard** re-fetches an apparent change before alerting. Baseline seeded 2026-06-16.
  Non-gov-sourced (nhsemployers/moneyhelper/acas/parliament-research/aggregators) rely on Tier-2.
- **Tier-2 quarterly** (8 Jan/Apr/Jul/Oct): calks.uk is in `fleet_pipeline.full_pilot` + the
  `calk24-constants-freshness-verify` task's SITES list. **Next run 8 Jul 2026.**
- Dashboard: mydatahub.duckdns.org/dashboard → 🧮 Calculators (calks.uk = «Полный пилот»).
- The loop: alert/drift → review → fix in THIS repo (.tsx + content/faqs) → **if the change is
  user-significant, add a brief entry to the Updates page (`src/pages/updates.astro`)** → `npm run deploy`.

## 5. Build & deploy (this repo's pipeline)

- `npm run deploy` (`scripts/deploy.mjs`): `astro build` → zip `dist/` as OTA bundle → write
  `/app/latest.json` → `npx wrangler pages deploy dist --project-name calks-uk --branch main`. Site +
  OTA go live together; installed apps (iOS+Android, Capacitor 8 + Capgo) auto-update on next launch.
- Repo IS under git with a GitHub remote. ⚠️ Fixes are in the working tree — commit + deploy when ready.

## 6. Pending / TODO

- [x] **Tail stale ×38 (§3a, found 2026-06-28):** APPLIED to live `.tsx`/content + deployed 2026-06-28
      (OTA `202606281843`, prose verified live). Covered the VED 12-band first-year table, teacher leadership
      ×6 + ITT bursary, UC AET/childcare/LCW, WTC couple/30hr, Vento bands, full whiplash tariff (SI 2025/615),
      RTB regional-cap reform + recomputed Manchester example, MEES 2030, UCAS AS, premium bonds, water, etc.
      Two adjacent un-confirmed items flagged for DataHub (WTC basic/disability, non-London RTB caps) — see §3a.
- [x] **Deploy** the fixes (`npm run deploy`) — done 2026-06-16, OTA bundle `202606161331`, verified live.
- [ ] **Structural (§3):** SSP reform logic (remove LEL/waiting-days gating), SDLT band table restructure,
      help-to-save eligibility, Wales LTT surcharge band table.
- [ ] **TPS bands:** verify the live `TeachersPensionCalculator.tsx` set against official 2026-27.
- [ ] **2 pension-credit additions + WTC:** re-verify (odd direction / possibly defunct).
- [ ] Refactor 330+ per-component hardcoded constants into a shared module (long-standing).
