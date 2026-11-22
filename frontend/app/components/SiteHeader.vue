<script setup lang="ts">
const route = useRoute()
const { count } = useCart()
const orderOpen = useOrderSheet()
const inShop = computed(() => ['/shop', '/category', '/product'].some((p) => route.path.startsWith(p)))
</script>

<template>
  <header class="header">
    <div class="wrap header__inner">
      <NuxtLink to="/" class="brand" aria-label="Happy Corner home">
        <span class="seal" style="--size: 2.6rem" aria-hidden="true">快乐</span>
        <span class="brand__name">Happy Corner</span>
      </NuxtLink>

      <nav class="nav" aria-label="Main">
        <NuxtLink to="/shop" class="nav__link nav__shop" :class="{ active: inShop }">Shop</NuxtLink>
        <NuxtLink :to="{ path: '/', hash: '#how' }" class="nav__link nav__wide">How to order</NuxtLink>
        <NuxtLink :to="{ path: '/', hash: '#reviews' }" class="nav__link nav__wide">Reviews</NuxtLink>
        <button type="button" class="order" @click="orderOpen = true">
          <span>Order</span>
          <span class="order__count" :class="{ 'order__count--on': count > 0 }" aria-live="polite">
            {{ count }}<span class="visually-hidden"> {{ count === 1 ? 'item' : 'items' }}</span>
          </span>
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(214, 189, 143, 0.94);
  backdrop-filter: blur(6px);
  border-bottom: 2px solid var(--ink);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.25rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
}

.brand__name {
  font-family: var(--display);
  font-size: 1.5rem;
  line-height: 1;
  color: var(--lacquer);
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav__link {
  font-weight: 600;
  text-decoration: none;
  text-underline-offset: 6px;
  text-decoration-thickness: 3px;
}

.nav__link:hover,
.nav__shop.active {
  text-decoration-line: underline;
}

.nav__shop.active {
  text-decoration-color: var(--lacquer);
}

.order {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 2.75rem;
  padding: 0.35rem 0.45rem 0.35rem 1.15rem;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: var(--ink);
  color: var(--paper);
  font: 600 1rem/1 var(--body);
  cursor: pointer;
}

.order:hover {
  background: #4a2c1f;
}

.order__count {
  display: inline-grid;
  place-items: center;
  min-width: 1.9rem;
  height: 1.9rem;
  padding-inline: 0.4rem;
  border-radius: 999px;
  background: rgba(248, 238, 219, 0.18);
  font-variant-numeric: tabular-nums;
}

.order__count--on {
  background: var(--honey);
  color: var(--ink);
}

@media (max-width: 760px) {
  .nav__wide {
    display: none;
  }
}

@media (max-width: 420px) {
  .nav {
    gap: 1rem;
  }
  .brand__name {
    font-size: 1.2rem;
  }
  .brand .seal {
    --size: 2.2rem !important;
  }
}
</style>
