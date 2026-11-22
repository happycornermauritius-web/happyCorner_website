<script setup lang="ts">
const { settings, categories, products, reviews, productsIn, favourites } = useShop()
const ahead = useOrderAhead()
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

const wa = computed(() => (settings.value.whatsapp ? whatsappLink(settings.value.whatsapp) : ''))
const mosaic = computed(() => favourites(4))
const picks = computed(() => favourites(5))
const lead = computed(() => picks.value[0])
const rest = computed(() => picks.value.slice(1))

const tileTone = ['honey', 'red', 'ink']

const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

// Data arrives after the first render, so jump to #reviews etc. once the page is there.
onMounted(async () => {
  if (!route.hash) return
  await nextTick()
  document.querySelector(route.hash)?.scrollIntoView()
})
</script>

<template>
  <div>
    <!-- Hero: the food first -->
    <section class="hero">
      <div class="wrap hero__inner">
        <div class="hero__text">
          <h1>Sakima, macaroni cake and Chinese roast, made at home.</h1>
          <p class="hero__intro">{{ intro }}</p>
          <div class="hero__actions">
            <NuxtLink to="/shop" class="btn btn--red btn--big">Shop the menu</NuxtLink>
            <a v-if="wa" :href="wa" target="_blank" rel="noopener" class="btn btn--big">
              <IconChat />
              Ask on WhatsApp
            </a>
            <a v-else href="#how" class="hero__how" @click.prevent="jumpTo('how')">How ordering works</a>
          </div>
          <ul class="facts">
            <li>Cooked at home in Mauritius</li>
            <li>Order on WhatsApp</li>
            <li v-if="settings.homeDeliveryMin">Home delivery from {{ formatRs(settings.homeDeliveryMin) }}</li>
            <li v-else>Home delivery available</li>
          </ul>
        </div>

        <div class="mosaic">
          <NuxtLink
            v-for="(p, i) in mosaic"
            :key="p.id"
            :to="`/product/${p.slug}`"
            class="mosaic__tile"
            :class="`mosaic__tile--${i}`"
          >
            <ProductImage :image="p.images[0]" :name="p.name" eager />
            <span class="mosaic__name">{{ p.name }}</span>
          </NuxtLink>
          <span class="seal mosaic__seal" aria-hidden="true">快乐</span>
        </div>
      </div>
    </section>

    <!-- Favourites: one lead dish, the rest beside it -->
    <section class="band" aria-labelledby="fav-title">
      <div class="wrap">
        <div class="band__head">
          <h2 id="fav-title">Favourites</h2>
          <NuxtLink to="/shop" class="more">See the whole menu ({{ products.length }})</NuxtLink>
        </div>
        <div class="picks" :class="{ 'picks--full': rest.length === 4 }">
          <ProductCard v-if="lead" :product="lead" large class="picks__lead" />
          <ProductCard v-for="p in rest" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- Story -->
    <section class="story" aria-labelledby="about-title">
      <div class="wrap story__inner">
        <div class="story__text">
          <h2 id="about-title">About Happy Corner</h2>
          <p v-for="(para, i) in about" :key="i">{{ para }}</p>
          <a v-if="settings.instagram" :href="settings.instagram" target="_blank" rel="noopener" class="story__link">
            Follow us on Instagram
          </a>
        </div>
        <span class="seal story__seal" aria-hidden="true">快乐</span>
      </div>
    </section>

    <!-- Menu sections -->
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
              <p v-if="ahead.isAheadCategory(c.slug)" class="tile__ahead">Order {{ ahead.label.value }} ahead</p>
              <p class="tile__count">
                See {{ productsIn(c.slug).length }} {{ productsIn(c.slug).length === 1 ? 'dish' : 'dishes' }}
              </p>
            </div>
            <div class="tile__photo" aria-hidden="true">
              <ProductImage v-if="productsIn(c.slug)[0]" :image="productsIn(c.slug)[0]!.images[0]" :name="productsIn(c.slug)[0]!.name" />
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
            <p>Press <strong>Order</strong>, add your name and how you’d like to get it, then send. WhatsApp opens with everything written out.</p>
          </li>
          <li>
            <h3>We confirm</h3>
            <p>
              Happy Corner replies to confirm the day, time and payment. Pick up at a delivery point<template v-if="settings.homeDeliveryMin">, or get home delivery on orders from {{ formatRs(settings.homeDeliveryMin) }}</template><template v-else>, or get home delivery</template>.
            </p>
          </li>
        </ol>

        <div class="delivery">
          <div v-if="settings.deliveryPoints.length">
            <h3>Delivery points</h3>
            <ul class="delivery__points">
              <li v-for="p in settings.deliveryPoints" :key="p">{{ p }}</li>
            </ul>
          </div>
          <div v-if="ahead.sectionNames.value.length">
            <h3>Order ahead</h3>
            <p>{{ ahead.sectionNames.value.join(' and ') }} must be ordered at least {{ ahead.label.value }} before the day you want it. Other dishes can be ordered any time.</p>
          </div>
          <div>
            <h3>Home delivery</h3>
            <p v-if="settings.homeDeliveryMin">For orders from {{ formatRs(settings.homeDeliveryMin) }}. Below that, pick up at a delivery point.</p>
            <p v-else>Available for every order.</p>
          </div>
        </div>
        <p v-if="settings.deliveryNote" class="how__note">{{ settings.deliveryNote }}</p>
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
/* ---------- hero ---------- */
.hero {
  padding-block: clamp(2rem, 6vw, 4.5rem) clamp(2rem, 5vw, 3.5rem);
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
}

h1 {
  font-size: clamp(2.6rem, 6vw, 4.9rem);
  line-height: 0.97;
  letter-spacing: -0.01em;
  max-width: 12ch;
  text-wrap: balance;
}

.hero__intro {
  margin-top: 1.4rem;
  max-width: 42ch;
  font-size: 1.2rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1.25rem;
  margin-top: 2rem;
}

.btn--big {
  min-height: 3.25rem;
  padding-inline: 1.6rem;
  font-size: 1.05rem;
}

.hero__how {
  font-weight: 600;
  text-underline-offset: 4px;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.4rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
  font-weight: 500;
  font-size: 0.95rem;
}

.facts li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.facts li::before {
  content: '';
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 2px;
  background: var(--lacquer);
  transform: rotate(45deg);
}

/* 2 x 2 food mosaic, stamped with the seal */
.mosaic {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.6rem, 1.4vw, 1rem);
}

.mosaic__tile {
  position: relative;
  display: block;
  border: 2px solid var(--ink);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 5px 6px 0 var(--ink);
  text-decoration: none;
}

.mosaic__tile--1,
.mosaic__tile--3 {
  transform: translateY(1.5rem);
}

.mosaic__name {
  position: absolute;
  left: 0.6rem;
  bottom: 0.6rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: var(--paper);
  border: 2px solid var(--ink);
  font-weight: 600;
  font-size: 0.9rem;
}

.mosaic__tile:hover .mosaic__name {
  background: var(--honey);
}

.mosaic__seal {
  --size: clamp(5rem, 9vw, 7.5rem);
  position: absolute;
  left: calc(var(--size) * -0.3);
  top: calc(var(--size) * -0.3);
  rotate: -8deg;
  box-shadow:
    inset 0 0 0 calc(var(--size) * 0.045) var(--lacquer),
    inset 0 0 0 calc(var(--size) * 0.075) var(--paper),
    4px 5px 0 var(--ink);
  animation: stamp 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.25) 0.35s both;
  pointer-events: none;
}

@keyframes stamp {
  from {
    opacity: 0;
    scale: 1.5;
    rotate: -16deg;
  }
  to {
    opacity: 1;
    scale: 1;
    rotate: -8deg;
  }
}

/* ---------- bands ---------- */
.band {
  padding-block: clamp(2.5rem, 6vw, 4.25rem);
}

.band__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 2rem;
  margin-bottom: 1.75rem;
}

.band h2,
.story h2 {
  font-size: clamp(2.2rem, 4.8vw, 3.3rem);
  color: var(--lacquer);
}

.band__title {
  margin-bottom: 1.75rem;
}

.more {
  font-weight: 600;
  text-underline-offset: 4px;
}

/* favourites */
.picks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: clamp(1.25rem, 2.5vw, 2rem);
}

@media (max-width: 899px) {
  .picks {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem 0.9rem;
  }
  .picks__lead {
    grid-column: 1 / -1;
  }
}

@media (min-width: 900px) {
  .picks--full {
    grid-template-columns: minmax(0, 1.6fr) repeat(2, minmax(0, 1fr));
  }
  .picks--full .picks__lead {
    grid-row: span 2;
  }
}

/* ---------- story ---------- */
.story {
  background: var(--lacquer);
  color: var(--paper);
  border-block: 2px solid var(--ink);
  padding-block: clamp(3rem, 7vw, 5.5rem);
}

.story h2 {
  color: var(--paper);
  margin-bottom: 1.25rem;
}

.story__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2rem clamp(2rem, 6vw, 5rem);
}

.story__text {
  display: grid;
  gap: 1rem;
  max-width: 60ch;
  font-size: 1.2rem;
  line-height: 1.65;
}

.story__link {
  justify-self: start;
  margin-top: 0.5rem;
  font-weight: 600;
  text-underline-offset: 5px;
}

.story__seal {
  --size: clamp(8rem, 16vw, 12rem);
  background: var(--paper);
  color: var(--lacquer);
  rotate: 6deg;
  box-shadow:
    inset 0 0 0 calc(var(--size) * 0.045) var(--paper),
    inset 0 0 0 calc(var(--size) * 0.075) var(--lacquer),
    6px 7px 0 var(--ink);
}

/* ---------- category tiles ---------- */
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 26rem), 1fr));
  gap: clamp(1rem, 2.5vw, 1.75rem);
}

.tile {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
  align-items: center;
  gap: 1.25rem;
  padding: clamp(1.1rem, 2.5vw, 1.6rem);
  border: 2px solid var(--ink);
  border-radius: 14px;
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
  font-size: clamp(1.7rem, 3.2vw, 2.3rem);
}

.tile__text {
  display: grid;
  gap: 0.5rem;
}

.tile__ahead {
  justify-self: start;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  background: var(--paper);
  color: var(--lacquer);
  font-weight: 600;
  font-size: 0.9rem;
}

.tile__count {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.tile:hover .tile__ahead {
  justify-self: start;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  background: var(--paper);
  color: var(--lacquer);
  font-weight: 600;
  font-size: 0.9rem;
}

.tile__count {
  text-decoration-thickness: 3px;
}

.tile__photo {
  border: 2px solid var(--ink);
  border-radius: 10px;
  overflow: hidden;
  rotate: 3deg;
}

.tile:hover .tile__photo {
  rotate: 0deg;
}

/* ---------- how to order ---------- */
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
  grid-template-rows: auto 1fr;
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

.delivery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1.5rem 2.5rem;
  margin-top: 2.25rem;
  padding-top: 1.75rem;
  border-top: 2px dashed var(--line);
}

.delivery h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.delivery__points {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.2rem;
}

.how__note {
  margin-top: 1.75rem;
  font-weight: 600;
}

/* ---------- reviews ---------- */
.reviews {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}

/* ---------- narrow screens ---------- */
@media (max-width: 860px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }
  .mosaic {
    max-width: 30rem;
    margin: 1.5rem 0 1.5rem 1.25rem;
  }
  .reviews {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .story__inner {
    grid-template-columns: 1fr;
  }
  .story__seal {
    --size: 6rem;
    order: -1;
  }
  .tile {
    grid-template-columns: minmax(0, 1fr) 7.5rem;
  }
  .mosaic__name {
    font-size: 0.8rem;
    left: 0.4rem;
    bottom: 0.4rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tile:hover .tile__photo {
    rotate: 3deg;
  }
}
</style>
