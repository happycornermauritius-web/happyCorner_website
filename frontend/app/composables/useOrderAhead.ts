import type { Product } from '~/data/types'

/** Today's date in the visitor's time zone, as YYYY-MM-DD. */
export function todayISO(): string {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function formatDay(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

/** "1 week", "2 weeks", "3 days" */
export function noticeLabel(days: number): string {
  if (days >= 7 && days % 7 === 0) return days === 7 ? '1 week' : `${days / 7} weeks`
  return days === 1 ? '1 day' : `${days} days`
}

/** Rules for dishes that must be ordered in advance (e.g. Chinese roast: 1 week). */
export function useOrderAhead() {
  const { settings, categories } = useShop()
  const { lines } = useCart()
  const { products } = useShop()

  const days = computed(() => settings.value.orderAhead.days)
  const label = computed(() => noticeLabel(days.value))
  const isAheadCategory = (slug: string) => days.value > 0 && settings.value.orderAhead.categories.includes(slug)
  const needsAhead = (p: Pick<Product, 'categories'>) => p.categories.some(isAheadCategory)

  /** Names of the menu sections with the rule, e.g. "Chinese roast" */
  const sectionNames = computed(() =>
    categories.value.filter((c) => isAheadCategory(c.slug)).map((c) => c.name),
  )

  /** Dishes in the current order that need notice */
  const aheadInOrder = computed(() =>
    lines.value.filter((l) => {
      const p = products.value.find((x) => x.id === l.id)
      return p ? needsAhead(p) : false
    }),
  )

  /** Earliest day the current order can be ready */
  const earliest = computed(() => (aheadInOrder.value.length ? addDaysISO(todayISO(), days.value) : todayISO()))

  return { days, label, isAheadCategory, needsAhead, sectionNames, aheadInOrder, earliest }
}
