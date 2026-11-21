import { demoShop } from '~/data/demo'
import type { Category, Product, Review, Settings, Shop } from '~/data/types'

const emptySettings: Settings = {
  whatsapp: '',
  intro: '',
  location: '',
  hours: '',
  deliveryNote: '',
  facebook: '',
  instagram: '',
}

/** Turn WooCommerce HTML (names, descriptions, reviews) into plain text. */
function toText(html: string | undefined | null): string {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
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

  const [settingsRes, categoriesRes, productsRes, reviewsRes] = await Promise.allSettled([
    $fetch<Partial<Settings>>(`${base}/wp-json/happy-corner/v1/settings`),
    $fetch<any[]>(`${store}/products/categories`, { query: { per_page: 100 } }),
    $fetch<any[]>(`${store}/products`, { query: { per_page: 100, orderby: 'menu_order', order: 'asc' } }),
    $fetch<any[]>(`${store}/products/reviews`, { query: { per_page: 30, orderby: 'date_gmt', order: 'desc' } }),
  ])

  // Products are the one thing the page can't work without.
  if (productsRes.status === 'rejected') throw productsRes.reason

  const settings: Settings = {
    ...emptySettings,
    ...(settingsRes.status === 'fulfilled' ? settingsRes.value : {}),
  }

  const products: Product[] = productsRes.value.map((p) => ({
    id: p.id,
    name: toText(p.name),
    description: toText(p.short_description) || toText(p.description),
    price: toPrice(p.prices),
    image: p.images?.[0] ? { src: p.images[0].src, alt: p.images[0].alt || toText(p.name) } : null,
    categories: (p.categories || []).map((c: any) => c.slug),
    rating: Number(p.average_rating) || 0,
    reviewCount: Number(p.review_count) || 0,
    inStock: p.is_in_stock !== false,
  }))

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

export function useShop() {
  const base = wpBase()

  const { data, status, error, refresh } = useAsyncData<Shop>(
    'shop',
    () => (base ? loadFromWoo(base) : Promise.resolve(demoShop)),
    // Fetched in the browser so menu and price changes in WordPress show straight away.
    { server: false },
  )

  return { shop: data, status, error, refresh }
}

export interface NewReview {
  productId: number
  reviewer: string
  email: string
  rating: number
  review: string
  website: string // honeypot, must stay empty
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
