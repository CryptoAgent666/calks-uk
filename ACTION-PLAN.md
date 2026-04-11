# Calks.uk SEO Action Plan

**Generated:** 11 April 2026  
**Current Score:** 91/100

---

## Critical (Fix Immediately)

*No critical issues remaining — all were fixed during the audit.*

---

## High Priority (Fix Within 1 Week)

### 1. Expand 24 Short Titles (< 30 chars)
**Impact:** Improved CTR in search results, better keyword targeting  
**Effort:** Low (data file edit)  
**Pages:** age-calculator, annuity-calculator, apr-calculator, currency-converter, date-calculator, decking-calculator, fencing-calculator, gravel-calculator, isa-calculator, length-converter, macro-calculator, mulch-calculator, paint-calculator, payroll-calculator, plaster-calculator, ratio-calculator, sipp-calculator, sleep-calculator, tax-code-checker, tile-calculator, timber-calculator, tip-calculator, topsoil-calculator, volume-converter

**Action:** Update title field in `src/data/calculators.ts`. Examples:
- "Tip Calculator" -> "UK Tip Calculator — Restaurant Gratuity Guide"
- "APR Calculator" -> "APR Calculator — Compare True Interest Rates"
- "ISA Calculator" -> "ISA Calculator — Project Your Tax-Free Savings"
- "Age Calculator" -> "Age Calculator — Years, Months & Days"

### 2. Self-Host Google Fonts (Inter)
**Impact:** Faster LCP, eliminate third-party dependency  
**Effort:** Low  
**Action:**
1. Download Inter font files (woff2) from Google Fonts
2. Place in `public/fonts/`
3. Add `@font-face` declarations in `global.css`
4. Remove Google Fonts `<link>` from Layout.astro
5. Remove preconnect hints

### 3. Create Dynamic OG Images
**Impact:** Better social sharing, improved CTR  
**Effort:** Medium  
**Action:** Use `@vercel/og` or a custom Astro integration to generate unique OG images per calculator with title + category badge.

---

## Medium Priority (Fix Within 1 Month)

### 4. Add FAQPage Schema to Top 50 Calculators
**Impact:** FAQ rich results in Google, featured snippets  
**Effort:** Medium  
**Action:**
1. Add 3-5 FAQs per calculator (common questions about that calculation)
2. Add FAQPage JSON-LD schema
3. Render FAQ section below calculator results

### 5. Create llms.txt for AI Search
**Impact:** Better AI crawler indexing  
**Effort:** Low  
**Action:** Create `public/llms.txt` with site description, calculator inventory, data sources.

### 6. Add meta theme-color
**Impact:** Browser chrome appearance  
**Effort:** Trivial  
**Action:** Add `<meta name="theme-color" content="#1e3a5f">` to Layout.astro

### 7. Expand 3 Short Meta Descriptions
**Impact:** Better search snippets  
**Effort:** Trivial  
**Pages:** area-converter, student-loan-plan4-calculator, temperature-converter

---

## Low Priority (Backlog)

### 8. Add Blog Section
**Impact:** Capture informational queries ("How does UK income tax work?")  
**Effort:** High  
**Action:** Create `/blog/` section with tax guides, pension explainers, mortgage advice articles.

### 9. Add HowTo Schema for Step-by-Step Calculators
**Impact:** How-to rich results  
**Effort:** Medium  
**Action:** Add HowTo schema for calculators with multi-step processes.

### 10. Implement PWA Manifest
**Impact:** App-like experience, Add to Home Screen  
**Effort:** Low  
**Action:** Create `public/manifest.json` with app name, icons, theme colour.

### 11. Add XML Sitemap Lastmod Dates
**Impact:** Crawl prioritisation  
**Effort:** Low  
**Action:** Configure @astrojs/sitemap to include lastmod dates.

### 12. Add Breadcrumb HTML to Service Pages
**Impact:** Consistent navigation pattern  
**Effort:** Low  
**Action:** Add breadcrumb component to about, privacy, terms, methodology, contact, updates pages.

---

## Score Improvement Forecast

| Action | Score Impact |
|--------|-------------|
| Expand short titles | +2 |
| Self-host fonts | +2 |
| Add FAQ schema | +2 |
| Create llms.txt | +1 |
| Dynamic OG images | +1 |
| Add blog section | +1 |
| **Potential Score** | **~98/100** |
