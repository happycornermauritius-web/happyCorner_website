<script setup lang="ts">
const { settings } = useShop()
const link = computed(() => (settings.value.whatsapp ? whatsappLink(settings.value.whatsapp) : ''))
const route = useRoute()
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
        <NuxtLink to="/shop" class="nav__shop" :class="{ active: inShop }">Shop</NuxtLink>
        <NuxtLink :to="{ path: '/', hash: '#reviews' }" class="nav__link">Reviews</NuxtLink>
        <a v-if="link" :href="link" target="_blank" rel="noopener" class="btn btn--whatsapp nav__wa">
          <IconChat />
          <span>WhatsApp</span>
        </a>
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
  gap: 1.25rem;
}

.nav__link,
.nav__shop {
  font-weight: 600;
  text-decoration: none;
  text-underline-offset: 6px;
  text-decoration-thickness: 3px;
}

.nav__link:hover,
.nav__shop:hover,
.nav__shop.active {
  text-decoration-line: underline;
}

.nav__shop.active {
  text-decoration-color: var(--lacquer);
}

.nav__wa {
  min-height: 2.5rem;
  padding-block: 0.4rem;
}

@media (max-width: 600px) {
  .nav {
    gap: 0.9rem;
  }
  .nav__link {
    display: none;
  }
  .brand__name {
    font-size: 1.25rem;
  }
  .nav__wa span {
    display: none;
  }
  .nav__wa {
    width: 2.6rem;
    padding: 0;
  }
}
</style>
