export interface Settings {
  whatsapp: string
  intro: string
  about: string
  location: string
  hours: string
  deliveryNote: string
  /** Pickup places customers can choose */
  deliveryPoints: string[]
  /** Order total (Rs) from which home delivery is offered. 0 = always offered */
  homeDeliveryMin: number
  /** Menu sections that must be ordered ahead, and how many days ahead */
  orderAhead: { days: number; categories: string[] }
  facebook: string
  instagram: string
}

export interface Category {
  id: number
  slug: string
  name: string
  description: string
}

export interface ProductImage {
  src: string
  alt: string
}

export interface Product {
  id: number
  slug: string
  name: string
  /** One line, shown on cards */
  summary: string
  /** Paragraphs for the product page */
  details: string[]
  price: number | null
  images: ProductImage[]
  categories: string[]
  featured: boolean
  rating: number
  reviewCount: number
  inStock: boolean
}

export interface Review {
  id: number
  productId: number
  productName: string
  reviewer: string
  text: string
  rating: number
  date: string
}

export interface Shop {
  demo: boolean
  settings: Settings
  categories: Category[]
  products: Product[]
  reviews: Review[]
}

export type DishKind = 'sakima' | 'macaroni' | 'sausage' | 'pork' | 'chicken'
