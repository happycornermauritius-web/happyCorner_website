<script setup lang="ts">
const { settings, categories, products, reviews, productsIn, favourites } = useShop()
const route = useRoute()

useHead({ title: 'Happy Corner – Sino-Mauritian home kitchen' })

const intro = computed(
  () => settings.value.intro || 'Sino-Mauritian family recipes, cooked at home. Choose what you’d like and send your order on WhatsApp.',
)
const about = computed(() =>
  (
    settings.value.about ||
    'Happy Corner is a home kitchen in Mauritius cooking Sino-Mauritian favourites: sakima and macaroni cake, and Chinese roast like porc chasive and chicken chasive.'
  )
    .split(/\n{2,}/)
    .filter(Boolean),
)

const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const tileTone = ['honey', 'red', 'ink']

// Data arrives after the first render, so jump to #reviews etc. once the page is there.
onMounted(async () => {
  if (!route.hash) return
  await nextTick()
  document.querySelector(route.hash)?.scrollIntoView()
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="wrap hero__inner">
        <div class="hero__text">
          <h1>Sakima, macaroni cake and Chinese roast, made at home.</h1>
          <p class="hero__intro">{{ intro }}</p>
          <div class="hero__actions">
            <NuxtLink to="/shop" class="btn btn--red btn--big">Shop the menu</NuxtLink>
            <a href="#how" class="hero__how" @click.prevent="jumpTo('how')">How ordering works</a>
          </div>
        </div>
        <div class="hero__seal" aria-hidden="true">
          <span class="seal">快乐</span>
        </div>
      </div>
    </section>

    <!-- Favourites -->
    <section class="band" aria-labelledby="fav-title">
      <div class="wrap">
        <div class="band__head">
          <h2 id="fav-title">Favourites</h2>
          <NuxtLink to="/shop" class="more">See the whole menu ({{ products.length }})</NuxtLink>
        </div>
        <ProductGrid :products="favourites(4)" />
      </div>
    </section>

    <!-- Categories -->
    <section class="band" aria-labelledby="cat-title">
      <div class="wrap">
        <h2 id="cat-title" class="band__title">Browse the menu</h2>
        <div class="tiles">
          <NuxtLink
            v-for="(c, i) in categories"
            :key="c.slug"
            :to="`/category/${c.slug}`"
            class="tile"
            :class="`tile--${tileTone[i % tileTone.length]}`"
          >
            <div class="tile__text">
              <h3>{{ c.name }}</h3>
              <p v-if="c.description">{{ c.description }}</p>
              <p class="tile__count">
                {{ productsIn(c.slug).length }} {{ productsIn(c.slug).length === 1 ? 'dish' : 'dishes' }}
              </p>
            </div>
            <div class="tile__photos" aria-hidden="true">
              <ProductImage v-for="p in productsIn(c.slug).slice(0, 3)" :key="p.id" :image="p.images[0]" :name="p.name" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How to order -->
    <section id="how" class="band how" aria-labelledby="how-title">
      <div class="wrap">
        <h2 id="how-title" class="band__title">How to order</h2>
        <ol class="steps">
          <li>
            <h3>Choose your dishes</h3>
            <p>Add what you’d like from the <NuxtLink to="/shop">shop</NuxtLink>. Your order is kept as you browse.</p>
          </li>
          <li>
            <h3>Send it on WhatsApp</h3>
            <p>Press <strong>Review order</strong>, add your name and how you’d like to get it, then send. WhatsApp opens with everything written out.</p>
          </li>
          <li>
            <h3>We confirm</h3>
            <p>Happy Corner replies to confirm the day, time and payment. Then you collect, or we deliver.</p>
          </li>
        </ol>
        <p v-if="settings.deliveryNote" class="how__note">{{ settings.deliveryNote }}</p>
      </div>
    </section>

    <!-- About -->
    <section class="band about" aria-labelledby="about-title">
      <div class="wrap about__inner">
        <h2 id="about-title">About Happy Corner</h2>
        <div class="about__text">
          <p v-for="(para, i) in about" :key="i">{{ para }}</p>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <section id="reviews" class="band" aria-labelledby="reviews-title">
      <div class="wrap reviews">
        <div>
          <h2 id="reviews-title" class="band__title">Reviews</h2>
          <ReviewList :reviews="reviews" :limit="4" />
        </div>
        <ReviewForm :products="products" />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* hero */
.hero {
  padding-block: clamp(2.5rem, 7vw, 5.5rem) clamp(1.5rem, 4vw, 3rem);
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(1.5rem, 5vw, 4rem);
}

h1 {
  font-size: clamp(2.6rem, 6.4vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.01em;
  max-width: 13ch;
}

.hero__intro {
  margin-top: 1.4rem;
  max-width: 44ch;
  font-size: 1.2rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.75rem;
  margin-top: 2rem;
}

.btn--big {
  min-height: 3.25rem;
  padding-inline: 1.75rem;
  font-size: 1.1rem;
}

.hero__how {
  font-weight: 600;
  text-underline-offset: 4px;
}

.hero__seal .seal {
  --size: clamp(9rem, 22vw, 15rem);
  transform: rotate(-5deg);
  box-shadow:
    inset 0 0 0 calc(var(--size) * 0.045) var(--lacquer),
    inset 0 0 0 calc(var(--size) * 0.07) var(--paper),
    6px 8px 0 var(--ink);
  animation: stamp 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.25) 0.15s both;
}

@keyframes stamp {
  from {
    opacity: 0;
    transform: rotate(-12deg) scale(1.35);
  }
  to {
    opacity: 1;
    transform: rotate(-5deg) scale(1);
  }
}

/* bands */
.band {
  padding-block: clamp(2.25rem, 5vw, 3.75rem);
}

.band__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 2rem;
  margin-bottom: 1.5rem;
}

.band h2 {
  font-size: clamp(2.1rem, 4.6vw, 3.1rem);
  color: var(--lacquer);
}

.band__title {
  margin-bottom: 1.5rem;
}

.more {
  font-weight: 600;
  text-underline-offset: 4px;
}

/* category tiles */
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  gap: clamp(1rem, 2.5vw, 1.75rem);
}

.tile {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 2px solid var(--ink);
  border-radius: 8px;
  text-decoration: none;
}

.tile--honey {
  background: var(--honey);
  color: var(--ink);
}

.tile--red {
  background: var(--lacquer);
  color: var(--paper);
}

.tile--ink {
  background: var(--ink);
  color: var(--paper);
}

.tile h3 {
  font-size: clamp(1.7rem, 3.4vw, 2.3rem);
}

.tile__text {
  display: grid;
  gap: 0.35rem;
}

.tile__count {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.tile:hover .tile__count {
  text-decoration-thickness: 3px;
}

.tile__photos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
}

.tile__photos > * {
  border: 2px solid var(--ink);
  border-radius: 6px;
}

.tile__photos :deep(.pimg__label span) {
  font-size: clamp(0.85rem, 1.6vw, 1.05rem);
}

/* how to order */
.how {
  background: var(--paper);
  border-block: 2px solid var(--ink);
}

.steps {
  list-style: none;
  counter-reset: step;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1.5rem 2.5rem;
}

.steps li {
  counter-increment: step;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 1rem;
  align-items: start;
}

.steps li::before {
  content: counter(step);
  grid-row: span 2;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--lacquer);
  color: var(--paper);
  font-family: var(--display);
  font-size: 1.4rem;
}

.steps h3 {
  font-family: var(--body);
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.3;
  padding-top: 0.45rem;
}

.steps p {
  margin-top: 0.3rem;
  color: var(--ink-soft);
}

.steps a {
  color: var(--ink);
  font-weight: 600;
}

.how__note {
  margin-top: 1.75rem;
  font-weight: 600;
}

/* about */
.about__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: 1rem 3rem;
  align-items: start;
}

.about__text {
  display: grid;
  gap: 1rem;
  max-width: 62ch;
  font-size: 1.15rem;
  line-height: 1.65;
}

/* reviews */
.reviews {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}

@media (max-width: 820px) {
  .reviews,
  .about__inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }
  .hero__seal {
    order: -1;
  }
  .hero__seal .seal {
    --size: 6rem;
  }
}
</style>
