<script setup lang="ts">
// Shows loading / error while shop data loads, then the page.
const { ready, loading, error, refresh } = useShop()
</script>

<template>
  <slot v-if="ready" />
  <div v-else-if="loading" class="wrap state" aria-live="polite">Loading the menu…</div>
  <div v-else-if="error" class="wrap state" role="alert">
    <p><strong>The menu couldn’t load.</strong> The shop server didn’t respond. Check your connection, then try again.</p>
    <button type="button" class="btn" @click="refresh()">Try again</button>
  </div>
</template>

<style scoped>
.state {
  display: grid;
  gap: 1rem;
  justify-items: start;
  padding-block: 4rem 8rem;
  font-size: 1.1rem;
}
</style>
