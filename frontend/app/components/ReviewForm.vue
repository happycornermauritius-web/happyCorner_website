<script setup lang="ts">
import type { Product } from '~/data/types'

// With `product` set, the review is for that dish and the dish picker is hidden.
const props = defineProps<{ products: Product[]; product?: Product }>()

const uid = useId()
const form = reactive({ productId: props.product?.id ?? 0, rating: 0, reviewer: '', email: '', review: '', website: '' })
const state = ref<'idle' | 'sending' | 'sent' | 'demo'>('idle')
const error = ref('')

watch(
  () => props.product?.id,
  (id) => id && (form.productId = id),
)

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
  Object.assign(form, { productId: props.product?.id ?? 0, rating: 0, review: '' })
  state.value = 'idle'
}
</script>

<template>
  <div class="write">
    <h3>{{ product ? `Review ${product.name}` : 'Write a review' }}</h3>

    <div v-if="state === 'sent' || state === 'demo'" class="write__done" role="status">
      <p v-if="state === 'sent'"><strong>Thanks, {{ form.reviewer }}.</strong> Your review will show here once it’s approved.</p>
      <p v-else><strong>Preview mode.</strong> Reviews are saved once the site is connected to WooCommerce.</p>
      <button type="button" class="btn" @click="another">Write another review</button>
    </div>

    <form v-else class="write__form" novalidate @submit.prevent="submit">
      <label v-if="!product" class="field">
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
            <input :id="`${uid}-star-${i}`" v-model.number="form.rating" type="radio" :name="`${uid}-rating`" :value="i" />
            <label :for="`${uid}-star-${i}`" :title="`${i} star${i > 1 ? 's' : ''}`">
              <span aria-hidden="true">★</span>
              <span class="visually-hidden">{{ i }} star{{ i > 1 ? 's' : '' }}</span>
            </label>
          </template>
        </div>
      </fieldset>

      <div class="field">
        <label :for="`${uid}-name`"><span>Your name</span></label>
        <input :id="`${uid}-name`" v-model="form.reviewer" type="text" autocomplete="given-name" maxlength="60" :aria-describedby="`${uid}-name-help`" />
        <small :id="`${uid}-name-help`">Shown with your review.</small>
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
</template>

<style scoped>
.write {
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 8px;
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
</style>
