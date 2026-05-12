import type { CalculatorMeta } from '@/data/types'

const SITE_URL = 'https://calks.uk'
const SITE_NAME = 'Calks.uk'

const AUTHOR_ID = `${SITE_URL}/#author`

// Today's ISO date — set at build time so dateModified stays fresh on every deploy
const BUILD_DATE = new Date().toISOString().split('T')[0]

/**
 * Person schema for the author (Konstantin Iakovlev) — emitted on every page
 * to fix broken @id references identified in the GSC audit.
 */
export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: 'Konstantin Iakovlev',
    givenName: 'Konstantin',
    familyName: 'Iakovlev',
    url: `${SITE_URL}/about/`,
    image: `${SITE_URL}/author.jpg`,
    jobTitle: 'Financial Tools Developer',
    description: 'Founder of Calks.uk and the Calk network of country-specific calculator sites.',
    worksFor: { '@id': `${SITE_URL}/#organization` },
    founderOf: { '@id': `${SITE_URL}/#organization` },
    sameAs: [
      'https://www.linkedin.com/in/konstantin-iakovlev',
      'https://calk.nz',
      'https://calk-au.com',
      'https://calk.kz',
    ],
    knowsAbout: [
      'UK taxation',
      'HMRC rates',
      'PAYE',
      'National Insurance',
      'financial calculators',
      'personal finance',
      'web development',
    ],
  }
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'Calks UK',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description: 'Free online calculators for the UK. Tax, salary, mortgage, pension, VAT and more — updated for 2026/27.',
    foundingDate: '2026-04-06',
    founder: { '@id': AUTHOR_ID },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    knowsLanguage: 'en-GB',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@calks.uk',
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://www.linkedin.com/in/konstantin-iakovlev',
      'https://calk.nz',
      'https://calk-au.com',
      'https://calk.kz',
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
    inLanguage: 'en-GB',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

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
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-GB',
    // Always emit dateModified — use the explicit one if given, otherwise build date
    dateModified: dateModified || BUILD_DATE,
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
