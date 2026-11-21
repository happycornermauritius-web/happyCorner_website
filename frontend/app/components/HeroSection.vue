<script setup lang="ts">
defineProps<{ intro: string; location: string; hours: string }>()
</script>

<template>
  <section class="hero" id="top">
    <div class="wrap hero__inner">
      <div class="hero__text">
        <h1>Sakima, macaroni cake and Chinese roast, made at home.</h1>
        <p class="hero__intro">{{ intro || 'Sino-Mauritian family recipes, cooked at home. Choose what you’d like and send your order on WhatsApp.' }}</p>
        <div class="hero__actions">
          <a href="#menu" class="btn btn--red">See the menu</a>
          <p v-if="location || hours" class="hero__meta">
            <span v-if="location">{{ location }}</span>
            <span v-if="hours">{{ hours }}</span>
          </p>
        </div>
      </div>
      <div class="hero__seal" aria-hidden="true">
        <span class="seal">快乐</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: clamp(3rem, 8vw, 6.5rem) clamp(2.5rem, 6vw, 4.5rem);
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
  color: var(--ink);
}

.hero__intro {
  margin-top: 1.4rem;
  max-width: 44ch;
  font-size: 1.2rem;
  line-height: 1.55;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 2rem;
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  color: var(--ink-soft);
  font-weight: 500;
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

@media (max-width: 720px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }
  .hero__seal {
    order: -1;
  }
  .hero__seal .seal {
    --size: 6.5rem;
  }
}
</style>
