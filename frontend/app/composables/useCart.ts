import type { Product } from '~/data/types'

export interface CartLine {
  id: number
  name: string
  price: number | null
  qty: number
}

const STORAGE_KEY = 'happy-corner-cart'

export function useCart() {
  const lines = useState<CartLine[]>('cart', () => [])
  const loaded = useState('cart-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    loaded.value = true
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(saved)) lines.value = saved.filter((l) => l && l.qty > 0)
    } catch {}
    watch(
      lines,
      (val) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
        } catch {}
      },
      { deep: true },
    )
  }

  const qtyOf = (id: number) => lines.value.find((l) => l.id === id)?.qty ?? 0

  function setQty(product: Pick<Product, 'id' | 'name' | 'price'>, qty: number) {
    const next = Math.max(0, Math.min(99, Math.round(qty)))
    const line = lines.value.find((l) => l.id === product.id)
    if (next === 0) {
      lines.value = lines.value.filter((l) => l.id !== product.id)
    } else if (line) {
      line.qty = next
      line.price = product.price
      line.name = product.name
    } else {
      lines.value.push({ id: product.id, name: product.name, price: product.price, qty: next })
    }
  }

  /** Drop items that are no longer on the menu and refresh names/prices. */
  function syncWith(products: Product[]) {
    const byId = new Map(products.map((p) => [p.id, p]))
    lines.value = lines.value
      .filter((l) => byId.get(l.id)?.inStock)
      .map((l) => ({ ...l, name: byId.get(l.id)!.name, price: byId.get(l.id)!.price }))
  }

  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
  const total = computed(() => lines.value.reduce((n, l) => n + (l.price ?? 0) * l.qty, 0))
  const hasUnpriced = computed(() => lines.value.some((l) => l.price == null))

  const clear = () => (lines.value = [])

  return { lines, count, total, hasUnpriced, qtyOf, setQty, syncWith, clear }
}

/** Shared open/closed state of the order sheet. */
export const useOrderSheet = () => useState('order-sheet-open', () => false)

export const formatRs = (n: number) => `Rs ${n.toLocaleString('en-MU', { maximumFractionDigits: 2 })}`
