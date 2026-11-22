import { demoShop } from '~/data/demo'
import type { Category, Product, Review, Settings, Shop } from '~/data/types'

const emptySettings: Settings = {
  whatsapp: '',
  intro: '',
  about: '',
  location: '',
  hours: '',
  deliveryNote: '',
  deliveryPoints: [],
  homeDeliveryMin: 4500,
  orderAhead: { days: 0, categories: [] },
  facebook: '',
  instagram: '',
}

function parse(html: string | undefined | null): Document | null {
  return html ? new DOMParser().parseFromString(html, 'text/html') : null
}

/** WooCommerce HTML (names, short descriptions, reviews) to one line of text. */
function toText(html: string | undefined | null): string {
  return (parse(html)?.body.textContent || '').replace(/\s+/g, ' ').trim()
}

/** WooCommerce HTML description to plain paragraphs. */
function toParagraphs(html: string | undefined | null): string[] {
  const doc = parse(html)
  if (!doc) return []
  const blocks = doc.body.querySelectorAll('p, li, h2, h3, h4')
  const parts = blocks.length ? [...blocks].map((b) => b.textContent || '') : (doc.body.textContent || '').split(/\n{2,}/)
  return parts.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean)
}

function toPrice(prices: any): number | null {
  if (!prices || prices.price === '' || prices.price == null) return null
  const minor = Number(prices.currency_minor_unit ?? 0)
  const value = Number(prices.price) / 10 ** minor
  return Number.isFinite(value) && value > 0 ? value : null
}

function wpBase(): string {
  return String(useRuntimeConfig().public.wpUrl || '').replace(/\/+$/, '')
}

async function loadFromWoo(base: string): Promise<Shop> {
  const store = `${base}/wp-json/wc/store/v1`

  const [settingsRes, categoriesRes, productsRes, featuredRes, reviewsRes] = await Promise.allSettled([
    $fetch<any>(`${base}/wp-json/happy-corner/v1/settings`),
    $fetch<any[]>(`${store}/products/categories`, { query: { per_page: 100 } }),
    $fetch<any[]>(`${store}/products`, { query: { per_page: 100, orderby: 'menu_order', order: 'asc' } }),
    $fetch<any[]>(`${store}/products`, { query: { per_page: 100, featured: true } }),
    $fetch<any[]>(`${store}/products/reviews`, { query: { per_page: 100, orderby: 'date_gmt', order: 'desc' } }),
  ])

  // Products are the one thing the site can't work without.
  if (productsRes.status === 'rejected') throw productsRes.reason

  const raw: any = settingsRes.status === 'fulfilled' ? settingsRes.value : {}
  const settings: Settings = {
    ...emptySettings,
    ...raw,
    deliveryPoints: Array.isArray(raw.deliveryPoints) ? raw.deliveryPoints.filter(Boolean) : [],
    homeDeliveryMin: Number.isFinite(Number(raw.homeDeliveryMin)) && raw.homeDeliveryMin !== '' && raw.homeDeliveryMin != null
      ? Number(raw.homeDeliveryMin)
      : emptySettings.homeDeliveryMin,
    orderAhead: {
      days: Math.max(0, Number(raw.orderAhead?.days) || 0),
      categories: Array.isArray(raw.orderAhead?.categories) ? raw.orderAhead.categories.map(String) : [],
    },
  }

  const featuredIds = new Set(featuredRes.status === 'fulfilled' ? featuredRes.value.map((p) => p.id) : [])

  const products: Product[] = productsRes.value.map((p) => {
    const name = toText(p.name)
    const details = toParagraphs(p.description)
    return {
      id: p.id,
      slug: p.slug,
      name,
      summary: toText(p.short_description) || details[0] || '',
      details,
      price: toPrice(p.prices),
      images: (p.images || []).map((img: any) => ({ src: img.src, alt: img.alt || name })),
      categories: (p.categories || []).map((c: any) => c.slug),
      featured: featuredIds.has(p.id),
      rating: Number(p.average_rating) || 0,
      reviewCount: Number(p.review_count) || 0,
      inStock: p.is_in_stock !== false,
    }
  })

  const used = new Set(products.flatMap((p) => p.categories))
  const categories: Category[] =
    categoriesRes.status === 'fulfilled'
      ? categoriesRes.value
          .filter((c) => used.has(c.slug) && c.slug !== 'uncategorized')
          .sort((a, b) => a.id - b.id) // creation order
          .map((c) => ({ id: c.id, slug: c.slug, name: toText(c.name), description: toText(c.description) }))
      : []

  const reviews: Review[] =
    reviewsRes.status === 'fulfilled'
      ? reviewsRes.value.map((r) => ({
          id: r.id,
          productId: r.product_id,
          productName: toText(r.product_name),
          reviewer: toText(r.reviewer),
          text: toText(r.review),
          rating: Number(r.rating) || 0,
          date: r.date_created,
        }))
      : []

  return { demo: false, settings, categories, products, reviews }
}

/** All shop data. Loaded once in the browser and shared by every page. */
export function useShop() {
  const base = wpBase()

  const { data, status, error, refresh } = useAsyncData<Shop>(
    'shop',
    () => (base ? loadFromWoo(base) : Promise.resolve(demoShop)),
    // Fetched in the browser so menu and price changes in WordPress show straight away.
    { server: false },
  )

  const ready = computed(() => !!data.value)
  const loading = computed(() => !data.value && (status.value === 'pending' || status.value === 'idle'))

  const settings = computed<Settings>(() => data.value?.settings ?? emptySettings)
  const categories = computed(() => data.value?.categories ?? [])
  const products = computed(() => data.value?.products ?? [])
  const reviews = computed(() => data.value?.reviews ?? [])

  const productsIn = (slug: string) => products.value.filter((p) => p.categories.includes(slug))
  const categoryOf = (p: Product) => categories.value.find((c) => p.categories.includes(c.slug))

  /** Up to `max` dishes for the home page: featured ones first, then the rest. */
  const favourites = (max = 4) =>
    [...products.value].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, max)

  return {
    shop: data,
    status,
    error,
    refresh,
    ready,
    loading,
    settings,
    categories,
    products,
    reviews,
    productsIn,
    categoryOf,
    favourites,
  }
}

export interface NewReview {
  productId: number
  reviewer: string
  email: string
  rating: number
  review: string
  website: string // spam trap, must stay empty
}

export async function postReview(input: NewReview): Promise<'sent' | 'demo'> {
  const base = wpBase()
  if (!base) return 'demo'
  await $fetch(`${base}/wp-json/happy-corner/v1/reviews`, {
    method: 'POST',
    body: {
      product_id: input.productId,
      reviewer: input.reviewer,
      email: input.email,
      rating: input.rating,
      review: input.review,
      website: input.website,
    },
  })
  return 'sent'
}
