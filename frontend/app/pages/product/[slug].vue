<script setup lang="ts">
const route = useRoute()
const { products, reviews, productsIn, categoryOf } = useShop()
const { qtyOf } = useCart()
const orderOpen = useOrderSheet()

const product = computed(() => products.value.find((p) => p.slug === String(route.params.slug)))
const category = computed(() => (product.value ? categoryOf(product.value) : undefined))
const dishReviews = computed(() => reviews.value.filter((r) => r.productId === product.value?.id))
const more = computed(() =>
  category.value ? productsIn(category.value.slug).filter((p) => p.id !== product.value?.id).slice(0, 4) : [],
)

const jumpToReviews = () => document.getElementById('dish-reviews')?.scrollIntoView({ behavior: 'smooth' })

const active = ref(0)
watch(product, () => (active.value = 0))

useHead({ title: () => (product.value ? `${product.value.name} – Happy Corner` : 'Happy Corner') })
</script>

<template>
  <div class="wrap dish">
    <template v-if="product">
      <nav class="crumbs" aria-label="Breadcrumb">
        <NuxtLink to="/shop">Shop</NuxtLink>
        <template v-if="category">
          <span aria-hidden="true">/</span>
          <NuxtLink :to="`/category/${category.slug}`">{{ category.name }}</NuxtLink>
        </template>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ product.name }}</span>
      </nav>

      <div class="dish__main">
        <div class="gallery">
          <ProductImage class="gallery__main" :image="product.images[active]" :name="product.name" eager />
          <div v-if="product.images.length > 1" class="gallery__thumbs" role="group" aria-label="Photos">
            <button
              v-for="(img, i) in product.images"
              :key="img.src"
              type="button"
              :aria-pressed="i === active"
              :aria-label="`Photo ${i + 1} of ${product.images.length}`"
              @click="active = i"
            >
              <img :src="img.src" alt="" width="120" height="120" loading="lazy" />
            </button>
          </div>
        </div>

        <div class="info">
          <h1>{{ product.name }}</h1>
          <a v-if="product.reviewCount" href="#dish-reviews" class="info__rating" @click.prevent="jumpToReviews">
            <StarRating :value="product.rating" />
            <span>{{ product.reviewCount }} {{ product.reviewCount === 1 ? 'review' : 'reviews' }}</span>
          </a>
          <p class="info__price">{{ product.price != null ? formatRs(product.price) : 'Ask for price' }}</p>
          <p v-if="product.summary" class="info__summary">{{ product.summary }}</p>

          <div class="info__buy">
            <QtyControl :product="product" size="lg" />
            <button v-if="qtyOf(product.id)" type="button" class="btn btn--whatsapp info__review" @click="orderOpen = true">
              <IconChat />
              Review order
            </button>
          </div>
          <p v-if="!product.inStock" class="info__out">Sold out for now. Message us on WhatsApp to ask when it’s back.</p>

          <div v-if="product.details.length" class="info__details">
            <p v-for="(para, i) in product.details" :key="i">{{ para }}</p>
          </div>
        </div>
      </div>

      <section id="dish-reviews" class="reviews" aria-labelledby="dish-reviews-title">
        <div>
          <h2 id="dish-reviews-title">Reviews</h2>
          <ReviewList :reviews="dishReviews" :show-dish="false" />
        </div>
        <ReviewForm :products="products" :product="product" />
      </section>

      <section v-if="more.length" class="more" aria-labelledby="more-title">
        <div class="more__head">
          <h2 id="more-title">More {{ category?.name }}</h2>
          <NuxtLink :to="`/category/${category?.slug}`" class="more__link">See all</NuxtLink>
        </div>
        <ProductGrid :products="more" />
      </section>
    </template>

    <div v-else class="missing">
      <h1>This dish isn’t on the menu</h1>
      <p>It may have been renamed or removed.</p>
      <NuxtLink to="/shop" class="btn btn--red">See the whole menu</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.dish {
  padding-block: clamp(1.5rem, 4vw, 2.5rem) clamp(2rem, 5vw, 3.5rem);
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.crumbs a {
  font-weight: 600;
  color: var(--ink);
  text-underline-offset: 3px;
}

.dish__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: start;
  margin-top: 1.25rem;
}

.gallery {
  display: grid;
  gap: 0.75rem;
}

.gallery__main {
  border: 2px solid var(--ink);
  border-radius: 8px;
  box-shadow: 8px 10px 0 var(--ink);
}

.gallery__main :deep(.pimg__label span) {
  font-size: clamp(2rem, 5vw, 3.4rem);
}

.gallery__thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.gallery__thumbs button {
  width: 4.5rem;
  aspect-ratio: 1;
  padding: 0;
  border: 2px solid var(--line);
  border-radius: 6px;
  overflow: hidden;
  background: none;
  cursor: pointer;
}

.gallery__thumbs button[aria-pressed='true'] {
  border-color: var(--ink);
  box-shadow: 0 0 0 2px var(--honey);
}

.gallery__thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  display: grid;
  gap: 0.9rem;
  justify-items: start;
}

h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: var(--ink);
}

.info__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink-soft);
  font-weight: 500;
  text-underline-offset: 3px;
}

.info__price {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--lacquer);
  font-variant-numeric: tabular-nums;
}

.info__summary {
  max-width: 46ch;
  font-size: 1.2rem;
}

.info__buy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  margin-top: 0.5rem;
}

.info__review {
  min-height: 3.25rem;
  padding-inline: 1.4rem;
}

.info__out {
  color: var(--ink-soft);
}

.info__details {
  display: grid;
  gap: 0.8rem;
  max-width: 58ch;
  margin-top: 1rem;
  padding-top: 1.25rem;
  border-top: 2px dashed var(--line);
  line-height: 1.65;
}

.reviews {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
  margin-top: clamp(3rem, 7vw, 5rem);
  padding-top: clamp(2rem, 5vw, 3rem);
  border-top: 2px solid var(--ink);
}

.reviews h2,
.more h2 {
  font-size: clamp(2rem, 4.4vw, 2.8rem);
  color: var(--lacquer);
  margin-bottom: 1rem;
}

.more {
  margin-top: clamp(3rem, 7vw, 4.5rem);
}

.more__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 2rem;
}

.more__link {
  font-weight: 600;
  text-underline-offset: 4px;
}

.missing {
  display: grid;
  gap: 1rem;
  justify-items: start;
  padding-block: 3rem 5rem;
}

@media (max-width: 820px) {
  .dish__main,
  .reviews {
    grid-template-columns: 1fr;
  }
  .gallery__main {
    box-shadow: 5px 6px 0 var(--ink);
  }
}
</style>
