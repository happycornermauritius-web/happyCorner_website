<script setup lang="ts">
const props = defineProps<{ whatsapp: string }>()
const link = computed(() => (props.whatsapp ? whatsappLink(props.whatsapp) : ''))
</script>

<template>
  <header class="header">
    <div class="wrap header__inner">
      <a href="#top" class="brand">
        <span class="seal" style="--size: 2.6rem" aria-hidden="true">快乐</span>
        <span class="brand__name">Happy Corner</span>
      </a>
      <nav class="nav" aria-label="Main">
        <a href="#menu">Menu</a>
        <a href="#reviews">Reviews</a>
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
  background: rgba(214, 189, 143, 0.92);
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
  gap: 1.4rem;
}

.nav > a:not(.btn) {
  font-weight: 600;
  text-decoration: none;
}

.nav > a:not(.btn):hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.nav__wa {
  min-height: 2.5rem;
  padding-block: 0.4rem;
}

@media (max-width: 560px) {
  .nav > a:not(.btn) {
    display: none;
  }
  .brand__name {
    font-size: 1.3rem;
  }
}
</style>
