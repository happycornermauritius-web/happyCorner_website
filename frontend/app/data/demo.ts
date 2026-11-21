import type { Product, Shop } from './types'

// Sample data, shown only when NUXT_PUBLIC_WP_URL is empty.
// Prices and reviews are placeholders.

const product = (p: Partial<Product> & Pick<Product, 'id' | 'slug' | 'name' | 'price' | 'categories'>): Product => ({
  summary: '',
  details: [],
  images: [],
  featured: false,
  rating: 0,
  reviewCount: 0,
  inStock: true,
  ...p,
})

export const demoShop: Shop = {
  demo: true,
  settings: {
    whatsapp: '',
    intro: '',
    about: '',
    location: 'Mauritius',
    hours: '',
    deliveryNote: '',
    facebook: '',
    instagram: '',
  },
  categories: [
    { id: 1, slug: 'sakima-macaroni-cake', name: 'Sakima & macaroni cake', description: 'Sweet treats for tea time and gatherings.' },
    { id: 2, slug: 'chinese-roast', name: 'Chinese roast', description: 'Roast meats in the Sino-Mauritian style.' },
  ],
  products: [
    product({
      id: 11,
      slug: 'sakima',
      name: 'Sakima',
      price: 150,
      categories: ['sakima-macaroni-cake'],
      summary: 'Crisp fried pastry bound with honey syrup, cut into squares.',
      details: ['Sample description. Add the full description of each dish in WordPress, under Products.'],
      featured: true,
      rating: 5,
      reviewCount: 1,
    }),
    product({
      id: 12,
      slug: 'macaroni-cake',
      name: 'Macaroni cake',
      price: 200,
      categories: ['sakima-macaroni-cake'],
      featured: true,
    }),
    product({
      id: 21,
      slug: 'grilled-sausage',
      name: 'Grilled sausage',
      price: 250,
      categories: ['chinese-roast'],
      summary: 'Chinese sausage, grilled.',
    }),
    product({
      id: 22,
      slug: 'porc-chasive',
      name: 'Porc chasive',
      price: 350,
      categories: ['chinese-roast'],
      summary: 'Pork roasted in a sweet, glossy chasive glaze.',
      featured: true,
      rating: 4,
      reviewCount: 1,
    }),
    product({
      id: 23,
      slug: 'chicken-chasive',
      name: 'Chicken chasive',
      price: 300,
      categories: ['chinese-roast'],
      summary: 'Chicken roasted in the same chasive glaze.',
      featured: true,
      inStock: false,
    }),
  ],
  reviews: [
    {
      id: 1,
      productId: 22,
      productName: 'Porc chasive',
      reviewer: 'Sample customer',
      text: 'This is a sample review. Real reviews appear here once customers post them and you approve them.',
      rating: 4,
      date: '2026-11-14',
    },
    {
      id: 2,
      productId: 11,
      productName: 'Sakima',
      reviewer: 'Sample customer',
      text: 'Another sample review, to show how a longer comment wraps across lines on the page.',
      rating: 5,
      date: '2026-11-09',
    },
  ],
}
