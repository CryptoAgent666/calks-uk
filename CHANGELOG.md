# CHANGELOG — Calks.uk

## v1.5.12 — 2026-05-22 (Audit 9 via calkcheck)

### Content fixes
- **4 thin content pages** expanded with 5 new paragraphs each:
  - `timber-calculator` — UK timber grades, prices 2026, studwork calc, standards
  - `roman-numeral-converter` — basics, UK uses, limitations, quick conversion
  - `vat-calculator` — UK VAT 2026/27, three modes, registration, schemes, mistakes
  - `business-mileage-record-calculator` — AMAP 45p/25p, eligibility, records, AFR

### Audit results (30 pages, 96 criteria via calkcheck)
- Initial: 26/30 fully clean, 4 with thin content
- After fix: **30/30 clean** ✓
- Content bugs detected: 30/30 false positives (URL patterns in i18n key detection); 5 "wrong_year_2024" findings all legitimate historical references (Class 2 NI abolished, BIK rate progression, EV mileage rate change)
- Cumulative coverage: 270/331 calculators audited and verified clean (82%)

---

## v1.5.11 — 2026-05-22 (Audit 8)

### Content fixes
- 7 thin content pages expanded: elm-payment, home-buying-total-cost, ni-salary-sacrifice-2029, cost-of-delay, wedding-cost, farm-tenancy, fence-paint
- 1 missing FAQ added: inflation-calculator (4 unique questions)

### Audit results
- 22/30 → 30/30 clean

---

## v1.5.10 — 2026-05-22 (Audit 7)

### Content fixes
- 7 thin content pages expanded
- 1 missing FAQ: holiday-entitlement-calculator

---

## v1.5.9 — 2026-05-22 (Audit 6)

### Content fixes
- 5 thin content pages expanded: binary-converter, car-depreciation, pension-sharing-divorce, a-level-grade, stamp-duty

### Audit framework
- Introduced 96-criterion audit including critical #96 (Tap target ≥44×44px / WCAG 2.5.5 AAA / 2.5.8 AA)

---

## v1.5.8 — 2026-05-22 (Tap target compliance)

### Systemic accessibility fix — Mobile UX (Criterion #96)
- **WCAG 2.5.8 AA tap target compliance: 41% → 100%**
- Fixed Footer (28 category links): 17px → 32px height (added py-1.5 inline-block)
- Fixed Header logo: 36px → 44px (added min-h-[44px])
- Fixed Footer logo: 32px → 44px
- Fixed Breadcrumb links: 20px → 36px (py-2 inline-block)
- Fixed email mailto link: 20px → 36px (py-2)
- Fixed Cookie consent buttons: 38px → 46px (py-3)

---

## v1.5.7 — 2026-05-22 (Accessibility systemic fix)

### Systemic accessibility fix — Input labels (WCAG 2.1 AA)
- **937/1090 inputs got aria-label** (was 0/1090)
- 311 of 334 calculator React components updated
- JSX-aware parser respects {} braces in onChange={(e) => ...} handlers
- Inputs inside `<label>` (implicit association) kept as-is
- Inputs inside loops/dynamic content require manual fix (73 remaining = 7%)

### Audit results (Audit 5, 80+ params)
- Static audit: 30/30 clean
- Accessibility: All `<main>`, `<nav>`, alt-text, heading hierarchy OK
- inputs_no_label across sample: 2/30 → 26/30 pages with all inputs labelled

---

## v1.5.6 — Audit 5

### Content fixes
- 7 thin content pages + 4 long titles shortened
- Added carer-allowance-calculator content entry

---

## v1.5.5 — Audit 4

### Content fixes
- 7 thin content + 2 missing FAQs + 8 long titles shortened (ir35, staircasing, corporation-tax, pension-annual-allowance, pension-calculator, stamp-duty-first-time-buyer, inheritance-tax, business-rates)

---

## v1.5.4 — Audit 3

### Content fixes
- 6 thin content + 1 missing FAQ (mortgage-affordability) + 4 long titles shortened

---

## v1.5.3 — Audit 2

### Content fixes
- 11 thin content (car-insurance-estimate, agricultural-worker-wage, high-council-tax, bmi-children, divorce-settlement, prime-number, gas-cost, farm-operating-cost, mtd-readiness, carer-allowance, first-homes-scheme)
- 2 missing FAQs (pension-drawdown, solar-panel)
- 3 long titles shortened (pension-drawdown, carer-allowance, mortgage-overpayment)

---

## v1.5.2 — Audit 1

### Content fixes
- 5 thin content pages + 2 missing FAQ (council-tax, landlord-tax) + 1 long title (benefits-in-kind)

---

## v1.5.0 — Initial release (Audits 0-incremental over weeks)

### SEO + content base
- 331 calculators with custom metaTitles
- ~250 calculators with rich content (5+ paragraphs in howItWorks)
- Schema.org JSON-LD: 4 types per page (WebPage, WebApplication, BreadcrumbList, Person)
- E-E-A-T signals: AuthorByline, source citations (gov.uk/HMRC/NHS), Quick Answer blocks, disclaimer, last updated
- Boilerplate FAQs eliminated (0/331)

### Infrastructure
- robots.txt with smart AI crawler rules (block training, allow search)
- sitemap-index.xml: 359 URLs
- llms.txt: 2.7 KB for AI crawler optimization
- TLS 1.2/1.3
- All security headers: HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

### Mobile
- PWA with manifest + service worker
- Android app via Capacitor (Google Play: uk.calks.app)
