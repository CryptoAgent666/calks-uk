// UK price index values from the ONS MM23 dataset, release of 21 October 2026
// (next release 18 November 2026). Generated from the ONS CSV downloads, do not hand-edit values:
//   CPI: series D7BT, CPI INDEX 00: ALL ITEMS, 2015=100
//        https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7bt/mm23
//   RPI: series CHAW, RPI All Items Index, Jan 1987=100
//        https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/chaw/mm23
// Annual figures are the ONS annual averages. The current year has no annual average yet, so
// LATEST_INDEX_MONTH holds the latest published month and stands in for that year.

export type InflationSeries = 'cpi' | 'rpi'

export const CPI_ANNUAL_INDEX: Record<number, number> = {
  1988: 49.6, 1989: 52.2, 1990: 55.9, 1991: 60.1, 1992: 62.6, 1993: 64.2,
  1994: 65.5, 1995: 67.2, 1996: 68.8, 1997: 70.1, 1998: 71.2, 1999: 72.1,
  2000: 72.7, 2001: 73.6, 2002: 74.5, 2003: 75.5, 2004: 76.5, 2005: 78.1,
  2006: 79.9, 2007: 81.8, 2008: 84.7, 2009: 86.6, 2010: 89.4, 2011: 93.4,
  2012: 96.1, 2013: 98.5, 2014: 100.0, 2015: 100.0, 2016: 100.7, 2017: 103.4,
  2018: 105.9, 2019: 107.8, 2020: 108.7, 2021: 111.6, 2022: 121.7, 2023: 130.5,
  2024: 133.9, 2025: 138.4,
}

export const RPI_ANNUAL_INDEX: Record<number, number> = {
  1987: 101.9, 1988: 106.9, 1989: 115.2, 1990: 126.1, 1991: 133.5, 1992: 138.5,
  1993: 140.7, 1994: 144.1, 1995: 149.1, 1996: 152.7, 1997: 157.5, 1998: 162.9,
  1999: 165.4, 2000: 170.3, 2001: 173.3, 2002: 176.2, 2003: 181.3, 2004: 186.7,
  2005: 192.0, 2006: 198.1, 2007: 206.6, 2008: 214.8, 2009: 213.7, 2010: 223.6,
  2011: 235.2, 2012: 242.7, 2013: 250.1, 2014: 256.0, 2015: 258.5, 2016: 263.1,
  2017: 272.5, 2018: 281.6, 2019: 288.8, 2020: 293.1, 2021: 305.0, 2022: 340.3,
  2023: 373.3, 2024: 386.7, 2025: 402.7,
}

export const LATEST_INDEX_MONTH = {
  label: 'September 2026',
  year: 2026,
  cpi: 144.1,
  rpi: 422.1,
}

/** The index value for a year, or null when the series does not cover it. */
export function indexForYear(series: InflationSeries, year: number): number | null {
  if (year === LATEST_INDEX_MONTH.year) return LATEST_INDEX_MONTH[series]
  const table = series === 'cpi' ? CPI_ANNUAL_INDEX : RPI_ANNUAL_INDEX
  return table[year] ?? null
}

export function firstIndexYear(series: InflationSeries): number {
  return Math.min(...Object.keys(series === 'cpi' ? CPI_ANNUAL_INDEX : RPI_ANNUAL_INDEX).map(Number))
}
