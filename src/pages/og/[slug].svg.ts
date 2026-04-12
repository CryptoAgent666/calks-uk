import type { GetStaticPaths } from 'astro'
import { CALCULATORS, getCalculatorBySlug } from '@/data/calculators'
import { CATEGORIES } from '@/data/categories'

export const getStaticPaths: GetStaticPaths = () => {
  return CALCULATORS.map((calc) => ({
    params: { slug: calc.slug },
  }))
}

export async function GET({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug)!
  const category = CATEGORIES[calc.category]

  // Truncate title to fit
  const title = calc.title.length > 50 ? calc.title.slice(0, 47) + '...' : calc.title
  // Wrap description
  const desc = calc.description.length > 100 ? calc.description.slice(0, 97) + '...' : calc.description

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e3a5f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="4" fill="#3b82f6"/>
  <!-- Category badge -->
  <rect x="60" y="60" width="${category.name.length * 14 + 40}" height="40" rx="8" fill="#1e40af" opacity="0.5"/>
  <text x="80" y="87" font-family="Inter,system-ui,sans-serif" font-size="18" font-weight="600" fill="#93c5fd">${escapeXml(category.name)}</text>
  <!-- Title -->
  <text x="60" y="180" font-family="Inter,system-ui,sans-serif" font-size="48" font-weight="700" fill="#ffffff">${escapeXml(title)}</text>
  <!-- Description -->
  <text x="60" y="240" font-family="Inter,system-ui,sans-serif" font-size="22" fill="#94a3b8">${escapeXml(desc)}</text>
  <!-- Tax year badge -->
  <text x="60" y="310" font-family="Inter,system-ui,sans-serif" font-size="18" fill="#64748b">Updated for 2025/26 tax year</text>
  <!-- Brand -->
  <rect x="60" y="520" width="180" height="50" rx="12" fill="#1e40af" opacity="0.3"/>
  <text x="90" y="552" font-family="Inter,system-ui,sans-serif" font-size="24" font-weight="700" fill="#ffffff">Calks.uk</text>
  <!-- Free badge -->
  <text x="1060" y="552" font-family="Inter,system-ui,sans-serif" font-size="20" font-weight="600" fill="#22c55e">FREE</text>
  <!-- Calculator icon -->
  <rect x="1040" y="80" width="100" height="130" rx="12" fill="#1e40af" opacity="0.3"/>
  <text x="1066" y="160" font-family="Inter,system-ui,sans-serif" font-size="48" fill="#60a5fa">&#x1F5A9;</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
