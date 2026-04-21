export type CategoryId =
  | 'tax'
  | 'pay'
  | 'pension'
  | 'mortgage'
  | 'loans'
  | 'business'
  | 'investment'
  | 'auto'
  | 'health'
  | 'building'
  | 'education'
  | 'farming'
  | 'immigration'
  | 'tools'
  | 'benefits'
  | 'energy'
  | 'insurance'
  | 'legal'
  | 'math'
  | 'gardening'

export interface CalculatorMeta {
  slug: string
  title: string
  description: string
  category: CategoryId
  icon: string
  keywords: string[]
  priority: number // 1-3, 1 = highest
  financialYear?: string // e.g. "2026-27"
  metaTitle?: string // override for <title> tag
  isNew?: boolean
  isTrending?: boolean
}

export interface Category {
  id: CategoryId
  name: string
  icon: string
  color: string
  iconColor: string
  darkColor: string
  darkIconColor: string
}
