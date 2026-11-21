<script setup lang="ts">
import type { Review } from '~/data/types'

const props = withDefaults(defineProps<{ reviews: Review[]; limit?: number; showDish?: boolean }>(), {
  limit: 6,
  showDish: true,
})

const showAll = ref(false)
const visible = computed(() => (showAll.value ? props.reviews : props.reviews.slice(0, props.limit)))
const average = computed(() =>
  props.reviews.length ? props.reviews.reduce((n, r) => n + r.rating, 0) / props.reviews.length : 0,
)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
</script>

<template>
  <div>
    <p v-if="reviews.length" class="avg">
      <StarRating :value="average" />
      <span>{{ average.toFixed(1) }} from {{ reviews.length }} {{ reviews.length === 1 ? 'review' : 'reviews' }}</span>
    </p>
    <p v-else class="empty">No reviews yet. Tried it? Be the first to say how it was.</p>

    <ol v-if="reviews.length" class="quotes">
      <li v-for="r in visible" :key="r.id" class="quote">
        <StarRating :value="r.rating" />
        <blockquote>{{ r.text }}</blockquote>
        <p class="quote__by">
          <strong>{{ r.reviewer }}</strong>
          <span v-if="showDish && r.productName"> on {{ r.productName }}</span>
          <span>, {{ formatDate(r.date) }}</span>
        </p>
      </li>
    </ol>
    <button v-if="reviews.length > limit && !showAll" type="button" class="btn" @click="showAll = true">
      Show all {{ reviews.length }} reviews
    </button>
  </div>
</template>

<style scoped>
.avg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.empty {
  max-width: 40ch;
  font-size: 1.1rem;
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
</style>
