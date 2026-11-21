<script setup lang="ts">
import type { Product, Review } from '~/data/types'

const props = defineProps<{ reviews: Review[]; products: Product[]; demo: boolean }>()

const average = computed(() =>
  props.reviews.length ? props.reviews.reduce((n, r) => n + r.rating, 0) / props.reviews.length : 0,
)

const showAll = ref(false)
const visible = computed(() => (showAll.value ? props.reviews : props.reviews.slice(0, 6)))

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// form
const form = reactive({ productId: 0, rating: 0, reviewer: '', email: '', review: '', website: '' })
const state = ref<'idle' | 'sending' | 'sent' | 'demo'>('idle')
const error = ref('')

async function submit() {
  error.value = ''
  if (!form.productId) return (error.value = 'Choose the dish you’re reviewing.')
  if (!form.rating) return (error.value = 'Choose a star rating.')
  if (!form.reviewer.trim()) return (error.value = 'Enter your name.')
  if (form.review.trim().length < 3) return (error.value = 'Write a few words about it.')

  state.value = 'sending'
  try {
    state.value = await postReview({ ...form, reviewer: form.reviewer.trim(), review: form.review.trim() })
  } catch (e: any) {
    state.value = 'idle'
    error.value = e?.data?.message || 'Your review couldn’t be sent. Check your connection and try again.'
  }
}

function another() {
  Object.assign(form, { productId: 0, rating: 0, review: '' })
  state.value = 'idle'
}
</script>

<template>
  <section class="reviews" id="reviews" aria-labelledby="reviews-title">
    <div class="wrap reviews__inner">
      <div class="reviews__list">
        <div class="reviews__head">
          <h2 id="reviews-title">Reviews</h2>
          <p v-if="reviews.length" class="reviews__avg">
            <StarRating :value="average" />
            <span>{{ average.toFixed(1) }} from {{ reviews.length }} {{ reviews.length === 1 ? 'review' : 'reviews' }}</span>
          </p>
        </div>

        <p v-if="!reviews.length" class="reviews__empty">No reviews yet. Tried something? Be the first to say how it was.</p>

        <ol v-else class="quotes">
          <li v-for="r in visible" :key="r.id" class="quote">
            <StarRating :value="r.rating" />
            <blockquote>{{ r.text }}</blockquote>
            <p class="quote__by">
              <strong>{{ r.reviewer }}</strong>
              <span v-if="r.productName"> on {{ r.productName }}</span>
              <span>, {{ formatDate(r.date) }}</span>
            </p>
          </li>
        </ol>
        <button v-if="reviews.length > 6 && !showAll" type="button" class="btn" @click="showAll = true">
          Show all {{ reviews.length }} reviews
        </button>
      </div>

      <div class="write">
        <h3>Write a review</h3>

        <div v-if="state === 'sent' || state === 'demo'" class="write__done" role="status">
          <p v-if="state === 'sent'"><strong>Thanks, {{ form.reviewer }}.</strong> Your review will show here once it’s approved.</p>
          <p v-else><strong>Preview mode.</strong> Reviews are saved once the site is connected to WooCommerce.</p>
          <button type="button" class="btn" @click="another">Review another dish</button>
        </div>

        <form v-else class="write__form" novalidate @submit.prevent="submit">
          <label class="field">
            <span>Dish</span>
            <select v-model.number="form.productId">
              <option :value="0" disabled>Choose a dish</option>
              <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </label>

          <fieldset class="rate">
            <legend>Your rating</legend>
            <div class="rate__stars">
              <template v-for="i in [5, 4, 3, 2, 1]" :key="i">
                <input :id="`star-${i}`" v-model.number="form.rating" type="radio" name="rating" :value="i" />
                <label :for="`star-${i}`" :title="`${i} star${i > 1 ? 's' : ''}`">
                  <span aria-hidden="true">★</span>
                  <span class="visually-hidden">{{ i }} star{{ i > 1 ? 's' : '' }}</span>
                </label>
              </template>
            </div>
          </fieldset>

          <div class="field">
            <label for="review-name"><span>Your name</span></label>
            <input id="review-name" v-model="form.reviewer" type="text" autocomplete="given-name" maxlength="60" aria-describedby="review-name-help" />
            <small id="review-name-help">Shown with your review.</small>
          </div>

          <label class="field">
            <span>Email <small>(optional, not shown)</small></span>
            <input v-model="form.email" type="email" autocomplete="email" />
          </label>

          <label class="field">
            <span>Your review</span>
            <textarea v-model="form.review" rows="4" maxlength="1000"></textarea>
          </label>

          <!-- Spam trap: hidden from people, bots fill it in -->
          <label class="trap" aria-hidden="true">
            Website <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
          </label>

          <p v-if="error" class="form-error" role="alert">{{ error }}</p>

          <button type="submit" class="btn btn--red" :disabled="state === 'sending'">
            {{ state === 'sending' ? 'Posting…' : 'Post review' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reviews {
  padding-block: clamp(3rem, 7vw, 5rem);
  border-top: 2px solid var(--ink);
}

.reviews__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}

.reviews__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1.5rem;
}

.reviews__head h2 {
  font-size: clamp(2.6rem, 6vw, 3.75rem);
  color: var(--lacquer);
}

.reviews__avg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.reviews__empty {
  margin-top: 1.5rem;
  max-width: 40ch;
  font-size: 1.15rem;
}

.quotes {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: grid;
  gap: 1.75rem;
}

.quote {
  padding-left: 1.25rem;
  border-left: 4px solid var(--lacquer);
}

.quote blockquote {
  margin: 0.4rem 0 0.5rem;
  max-width: 60ch;
  font-size: 1.15rem;
  line-height: 1.55;
}

.quote__by {
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.quote__by strong {
  color: var(--ink);
}

.write {
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 6px;
  padding: clamp(1.25rem, 3vw, 2rem);
}

.write h3 {
  font-size: 1.8rem;
}

.write__form {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.write__done {
  display: grid;
  gap: 1rem;
  justify-items: start;
  margin-top: 1rem;
}

.rate {
  margin: 0;
  padding: 0;
  border: 0;
}

.rate legend {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}

/* Stars are in reverse order so hovering/checking fills everything to the left */
.rate__stars {
  display: inline-flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.rate__stars input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.rate__stars label {
  font-size: 2.1rem;
  line-height: 1;
  padding: 0.1rem;
  color: rgba(43, 24, 16, 0.25);
  cursor: pointer;
}

.rate__stars input:checked ~ label,
.rate__stars label:hover,
.rate__stars label:hover ~ label {
  color: var(--honey);
  text-shadow: 0 0 1px var(--ink);
}

.rate__stars input:focus-visible + label {
  outline: 3px solid var(--honey);
  outline-offset: 1px;
  border-radius: 4px;
}

.trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

@media (max-width: 820px) {
  .reviews__inner {
    grid-template-columns: 1fr;
  }
}
</style>
