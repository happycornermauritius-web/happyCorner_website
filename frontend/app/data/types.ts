export interface Settings {
  whatsapp: string
  intro: string
  location: string
  hours: string
  deliveryNote: string
  facebook: string
  instagram: string
}

export interface Category {
  id: number
  slug: string
  name: string
  description: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number | null
  image: { src: string; alt: string } | null
  categories: string[]
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
