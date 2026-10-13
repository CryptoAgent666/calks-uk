#!/usr/bin/env node
/**
 * Contextual internal links for calculator prose.
 *
 * Wraps the first natural mention of another calculator's name or keyword in
 * `howItWorks` paragraphs with the site's link markup:
 *   <a href="/calculator/<slug>/" class="text-primary underline">original words</a>
 *
 * Why: in October 2026 the 339 calculator pages carried about 17 in-text links
 * between them, "Related Calculators" was the same six per category and
 * sessions averaged 1.15 pages. Links placed on the words people already read
 * are the cheapest way to move visitors (and crawl weight) between pages.
 *
 * Rules, so the result reads as editing rather than SEO glue:
 *   - only howItWorks paragraphs (never quickAnswer, examples, tables, FAQs)
 *   - at most one link per paragraph, at most MAX_PER_PAGE per page
 *   - never link a page to itself, never the same target twice on a page
 *   - never touch a paragraph that already contains a link
 *   - phrases come from each target's keywords and title; single words only
 *     from the DISTINCT list (ISA, VAT, UCAS...) so "tax" or "pension" alone
 *     never become links
 *   - whole-word, case-insensitive, outside existing HTML tags
 *   - a paragraph is edited only when its exact source string is found once in
 *     calculator-content.ts; template literals with ${} are skipped
 *
 * Usage:
 *   node scripts/add-internal-links.mjs            # dry run, prints the plan
 *   node scripts/add-internal-links.mjs --write    # applies it
 * Re-run after adding calculators; existing links are respected, so it only
 * fills gaps. Always diff the result and rebuild before committing.
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { build } from 'esbuild'

const WRITE = process.argv.includes('--write')
const VERBOSE = process.argv.includes('--verbose')
const MAX_PER_PAGE = 3
const ROOT = new URL('..', import.meta.url).pathname
const CONTENT_PATH = join(ROOT, 'src/data/calculator-content.ts')

// Single words that are unambiguous calculator topics. Everything else must be
// a phrase of two or more words to qualify as an anchor.
const DISTINCT = new Set(['isa', 'vat', 'ir35', 'ucas', 'gcse', 'cis', 'sdlt', 'lbtt', 'ulez', 'epc', 'bmi', 'ltv', 'apr', 'bnpl', 'lisa', 'sipp', 'lgps', 'ilr', 'mot', 'ni'])
// Phrases too generic to point at one calculator.
const BANNED = new Set(['tax', 'pension', 'mortgage', 'salary', 'loan', 'calculator', 'uk', 'interest', 'savings', 'benefit', 'benefits', 'insurance', 'cost', 'costs', 'income', 'rate', 'rates', 'pay', 'take home', 'money', 'budget', 'price', 'value', 'weight', 'time', 'date', 'age', 'number', 'percentage', 'unit converter', 'tax free savings', 'tax calculator', 'uk tax', 'hmrc', 'interest rate', 'interest rates', 'effective rate', 'total cost', 'land tax', 'annual allowance', 'limited company', 'monthly payment', 'monthly payments', 'square foot', 'square feet', 'sq ft', 'per hour', 'average speed', 'property value', 'tax bill', 'real terms', 'relief at source', 'fixed costs'])

async function bundle(entry) {
  const dir = mkdtempSync(join(tmpdir(), 'calk-links-'))
  const out = join(dir, 'm.mjs')
  await build({ entryPoints: [join(ROOT, entry)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent' })
  const m = await import(out)
  rmSync(dir, { recursive: true, force: true })
  return m
}

const { CALCULATORS } = await bundle('src/data/calculators.ts')
const { CALCULATOR_CONTENT } = await bundle('src/data/calculator-content.ts')
const bySlug = new Map(CALCULATORS.map((c) => [c.slug, c]))

// Anchor phrases per target, longest first.
function phrasesFor(c) {
  const raw = [c.title.replace(/\s*[—:(].*$/, '').replace(/\bcalculator\b/i, '').trim(), ...c.keywords]
  const out = new Set()
  for (let p of raw) {
    p = p.toLowerCase().replace(/[^a-z0-9£&' -]+/g, ' ').replace(/\s+/g, ' ').trim()
    if (!p || BANNED.has(p)) continue
    const words = p.split(' ')
    if (words.length === 1 && !DISTINCT.has(p)) continue
    if (words.length === 1 && p.length < 3) continue
    out.add(p)
  }
  return [...out].sort((a, b) => b.length - a.length)
}
const targets = CALCULATORS.map((c) => ({ c, phrases: phrasesFor(c) })).filter((t) => t.phrases.length)

// Phrase → candidate targets. A phrase owned by several calculators is only
// used when exactly one of them is the clear owner (title match wins).
const owners = new Map()
for (const t of targets) for (const p of t.phrases) (owners.get(p) ?? owners.set(p, []).get(p)).push(t.c)
function ownerOf(phrase) {
  const list = owners.get(phrase) || []
  if (list.length === 1) return list[0]
  const titled = list.filter((c) => c.title.toLowerCase().includes(phrase))
  return titled.length === 1 ? titled[0] : null
}
const phraseList = [...owners.keys()].filter((p) => ownerOf(p)).sort((a, b) => b.length - a.length)

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Split a paragraph into text and tag segments so matches never land inside markup.
function segments(html) {
  const out = []
  const re = /<[^>]+>/g
  let last = 0, m
  while ((m = re.exec(html))) {
    if (m.index > last) out.push({ text: html.slice(last, m.index), tag: false })
    out.push({ text: m[0], tag: true })
    last = re.lastIndex
  }
  if (last < html.length) out.push({ text: html.slice(last), tag: false })
  return out
}

function tokens(c) {
  return new Set([c.title, ...c.keywords].join(' ').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2))
}

// How the source file spells a paragraph: single-quoted with \' escapes, or a
// template literal (which we only edit when it has no ${} and appears once).
function sourceForms(p) {
  const sq = "'" + p.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"
  const bt = '`' + p.replace(/\\/g, '\\\\').replace(/`/g, '\\`') + '`'
  return [sq, bt]
}

let source = readFileSync(CONTENT_PATH, 'utf8')
const plan = []
const perTarget = new Map()

for (const [slug, content] of Object.entries(CALCULATOR_CONTENT)) {
  const me = bySlug.get(slug)
  if (!me || !Array.isArray(content.howItWorks)) continue
  const existing = new Set()
  for (const p of content.howItWorks) for (const m of p.matchAll(/href="\/calculator\/([a-z0-9-]+)\//g)) existing.add(m[1])
  let budget = MAX_PER_PAGE - existing.size
  if (budget <= 0) continue
  const used = new Set([slug, ...existing])
  const myTokens = tokens(me)
  const myTopic = [me.title, ...me.keywords].join(' | ').toLowerCase()

  for (const para of content.howItWorks) {
    if (budget <= 0) break
    if (/<a\s/i.test(para) || para.includes('${')) continue
    const forms = sourceForms(para).filter((f) => source.split(f).length === 2)
    if (forms.length !== 1) continue

    const segs = segments(para)
    let best = null
    for (const phrase of phraseList) {
      const target = ownerOf(phrase)
      if (!target || used.has(target.slug)) continue
      // a phrase from the page's own title or keywords names this page, not a neighbour
      if (myTopic.includes(phrase)) continue
      const re = new RegExp(`(?<![a-z0-9£])${esc(phrase)}(?![a-z0-9])`, 'i')
      for (let i = 0; i < segs.length; i++) {
        if (segs[i].tag) continue
        const m = re.exec(segs[i].text)
        if (!m) continue
        // relevance: shared words + same category, then phrase length
        let score = target.category === me.category ? 2 : 0
        for (const w of tokens(target)) if (myTokens.has(w)) score += 1
        score += phrase.split(' ').length
        // a link into another category needs real topical overlap, not just a phrase hit
        if (target.category !== me.category && score < 4) break
        if (!best || score > best.score) best = { phrase, target, seg: i, index: m.index, len: m[0].length, score }
        break
      }
    }
    if (!best) continue
    const seg = segs[best.seg]
    const original = seg.text.slice(best.index, best.index + best.len)
    seg.text = seg.text.slice(0, best.index) + `<a href="/calculator/${best.target.slug}/" class="text-primary underline">${original}</a>` + seg.text.slice(best.index + best.len)
    const newPara = segs.map((s) => s.text).join('')
    const [oldForm] = forms
    const newForm = oldForm[0] === "'" ? sourceForms(newPara)[0] : sourceForms(newPara)[1]
    source = source.replace(oldForm, newForm)
    used.add(best.target.slug)
    budget--
    plan.push({ slug, target: best.target.slug, anchor: original })
    perTarget.set(best.target.slug, (perTarget.get(best.target.slug) || 0) + 1)
  }
}

// Validate every link in the new source resolves to a real calculator.
const broken = [...source.matchAll(/href="\/calculator\/([a-z0-9-]+)\//g)].map((m) => m[1]).filter((s) => !bySlug.has(s))
if (broken.length) {
  console.error('Refusing to write: links to unknown slugs:', [...new Set(broken)].join(', '))
  process.exit(1)
}

const pages = new Set(plan.map((p) => p.slug)).size
console.log(`${plan.length} links on ${pages} pages (max ${MAX_PER_PAGE} per page), ${perTarget.size} distinct targets`)
const top = [...perTarget.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
console.log('most linked targets:', top.map(([s, n]) => `${s} ×${n}`).join(', '))
const shown = VERBOSE ? plan : plan.slice(0, 25)
for (const p of shown) console.log(`  ${p.slug} → ${p.target}  ("${p.anchor}")`)
if (plan.length > shown.length) console.log(`  … ${plan.length - shown.length} more (use --verbose)`)

if (WRITE) {
  writeFileSync(CONTENT_PATH, source)
  console.log('written', CONTENT_PATH)
} else {
  console.log('dry run; pass --write to apply')
}
