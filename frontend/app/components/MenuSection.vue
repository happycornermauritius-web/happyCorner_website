<script setup lang="ts">
import type { Category, Product } from '~/data/types'

const props = defineProps<{ categories: Category[]; products: Product[]; deliveryNote: string }>()

const groups = computed(() => {
  const groups = props.categories
    .map((c) => ({ ...c, items: props.products.filter((p) => p.categories.includes(c.slug)) }))
    .filter((g) => g.items.length)
  const placed = new Set(groups.flatMap((g) => g.items.map((p) => p.id)))
  const rest = props.products.filter((p) => !placed.has(p.id))
  if (rest.length) groups.push({ id: 0, slug: 'more', name: 'More', description: '', items: rest })
  return groups
})
</script>

<template>
  <section class="menu" id="menu" aria-labelledby="menu-title">
    <div class="wrap">
      <div class="sheet">
        <div class="sheet__head">
          <h2 id="menu-title">Menu</h2>
          <p v-if="deliveryNote" class="sheet__note">{{ deliveryNote }}</p>
        </div>

        <p v-if="!products.length" class="empty">The menu is being updated. Message us on WhatsApp to ask what’s cooking.</p>

        <div v-for="group in groups" :key="group.slug" class="group">
          <h3 class="group__title">{{ group.name }}</h3>
          <p v-if="group.description" class="group__desc">{{ group.description }}</p>
          <ul class="group__list">
            <MenuItem v-for="p in group.items" :key="p.id" :product="p" />
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.menu {
  padding-bottom: clamp(3rem, 7vw, 5rem);
}

.sheet {
  position: relative;
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 6px;
  box-shadow: 10px 12px 0 var(--ink);
  padding: clamp(1.5rem, 4.5vw, 3.25rem);
}

.sheet__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 3px solid var(--ink);
}

.sheet__head h2 {
  font-size: clamp(2.6rem, 6vw, 3.75rem);
  color: var(--lacquer);
}

.sheet__note {
  max-width: 40ch;
  color: var(--ink-soft);
}

.group {
  margin-top: 2.25rem;
}

.group__title {
  font-size: clamp(1.6rem, 3.4vw, 2.1rem);
  color: var(--ink);
}

.group__desc {
  margin-top: 0.4rem;
  max-width: var(--measure);
  color: var(--ink-soft);
}

.group__list {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
}

.empty {
  padding-block: 2rem;
  color: var(--ink-soft);
}

@media (max-width: 640px) {
  .sheet {
    box-shadow: 6px 7px 0 var(--ink);
  }
}
</style>
