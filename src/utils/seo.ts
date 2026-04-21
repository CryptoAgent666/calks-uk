import type { CalculatorMeta } from '@/data/types'

const SITE_URL = 'https://calks.uk'
const SITE_NAME = 'Calks.uk'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Free online calculators for the UK. Tax, salary, mortgage, pension, VAT and more — updated for 2026/27.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@calks.uk',
      contactType: 'customer support',
    },
    sameAs: [
      'https://www.linkedin.com/in/konstantin-iakovlev',
    ],
  }
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': `${SITE_URL}/#organization` },
    // SearchAction removed: site search is client-side only, no URL-based endpoint
  }
}

const AUTHOR_ID = `${SITE_URL}/#author`

export function getWebPageSchema(title: string, description: string, url: string, dateModified?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}${url}#webpage`,
    url: `${SITE_URL}${url}`,
    name: title,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    author: { '@id': AUTHOR_ID },
    inLanguage: 'en-GB',
    ...(dateModified ? { dateModified } : {}),
  }
}

export function getCalculatorSchema(calc: CalculatorMeta, dateModified?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/calculator/${calc.slug}/#webapp`,
    url: `${SITE_URL}/calculator/${calc.slug}/`,
    name: calc.title,
    description: calc.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-GB',
    ...(dateModified ? { dateModified } : {}),
  }
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

export function getItemListSchema(items: { name: string; url: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      description: item.description,
      url: `${SITE_URL}${item.url}`,
    })),
  }
}
