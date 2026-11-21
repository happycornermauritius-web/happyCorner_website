<script setup lang="ts">
import type { Settings } from '~/data/types'

const props = defineProps<{ settings: Settings }>()
const wa = computed(() => (props.settings.whatsapp ? whatsappLink(props.settings.whatsapp) : ''))
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="wrap footer__inner">
      <div class="footer__brand">
        <span class="seal" style="--size: 3.4rem" aria-hidden="true">快乐</span>
        <div>
          <p class="footer__name">Happy Corner</p>
          <p>Sino-Mauritian home kitchen<template v-if="settings.location">, {{ settings.location }}</template></p>
        </div>
      </div>

      <div class="footer__info">
        <p v-if="settings.hours">{{ settings.hours }}</p>
        <p class="footer__links">
          <a v-if="wa" :href="wa" target="_blank" rel="noopener">WhatsApp</a>
          <a v-if="settings.facebook" :href="settings.facebook" target="_blank" rel="noopener">Facebook</a>
          <a v-if="settings.instagram" :href="settings.instagram" target="_blank" rel="noopener">Instagram</a>
        </p>
        <p class="footer__copy">© {{ year }} Happy Corner</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--lacquer);
  color: var(--paper);
  padding-block: 2.5rem calc(6rem + env(safe-area-inset-bottom));
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer .seal {
  background: var(--paper);
  color: var(--lacquer);
  box-shadow: inset 0 0 0 calc(var(--size) * 0.05) var(--paper), inset 0 0 0 calc(var(--size) * 0.085) var(--lacquer);
}

.footer__name {
  font-family: var(--display);
  font-size: 1.6rem;
  line-height: 1.1;
}

.footer__info {
  display: grid;
  gap: 0.35rem;
  justify-items: end;
  text-align: right;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  font-weight: 600;
}

.footer__links a {
  text-underline-offset: 4px;
}

.footer__copy {
  opacity: 0.8;
  font-size: 0.9rem;
}

@media (max-width: 560px) {
  .footer__info {
    justify-items: start;
    text-align: left;
  }
}
</style>
