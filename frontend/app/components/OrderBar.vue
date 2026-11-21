<script setup lang="ts">
import type { OrderDetails } from '~/composables/whatsapp'

const props = defineProps<{ whatsapp: string; demo: boolean }>()
const { lines, count, total, hasUnpriced, setQty, clear } = useCart()

const dialog = ref<HTMLDialogElement | null>(null)
const details = reactive<OrderDetails>({ name: '', method: 'collect', address: '', day: '', note: '' })
const error = ref('')
const sent = ref(false)
const preview = ref('')

const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)

function open() {
  error.value = ''
  sent.value = false
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

function send() {
  error.value = ''
  if (!lines.value.length) return (error.value = 'Your order is empty. Add something from the menu.')
  if (!details.name.trim()) return (error.value = 'Enter your name so we know who the order is for.')
  if (details.method === 'delivery' && !details.address.trim())
    return (error.value = 'Enter the delivery address, or choose to collect.')

  const message = buildOrderMessage(lines.value, total.value, details)
  if (!props.whatsapp) {
    if (!props.demo) return (error.value = 'Ordering isn’t set up yet: the WhatsApp number is missing.')
    // Preview mode: show the message instead of opening WhatsApp
    preview.value = message
  } else {
    preview.value = ''
    window.open(whatsappLink(props.whatsapp, message), '_blank', 'noopener')
  }
  sent.value = true
}

function finish() {
  clear()
  close()
}
</script>

<template>
  <div>
    <Transition name="bar">
      <div v-if="count > 0" class="bar">
        <div class="wrap bar__inner">
          <p class="bar__summary">
            <strong>{{ count }} {{ count === 1 ? 'item' : 'items' }}</strong>
            <span>{{ formatRs(total) }}<template v-if="hasUnpriced"> + to confirm</template></span>
          </p>
          <button type="button" class="btn btn--whatsapp" @click="open">
            <IconChat />
            Review order
          </button>
        </div>
      </div>
    </Transition>

    <dialog ref="dialog" class="sheet" aria-labelledby="order-title" @click.self="close">
      <form class="sheet__body" method="dialog" @submit.prevent="send">
        <div class="sheet__top">
          <h2 id="order-title">Your order</h2>
          <button type="button" class="sheet__close" aria-label="Close" @click="close">×</button>
        </div>

        <template v-if="!sent">
          <ul class="lines">
            <li v-for="l in lines" :key="l.id">
              <span class="lines__name">{{ l.name }}</span>
              <span class="lines__qty">
                <button type="button" :aria-label="`One less ${l.name}`" @click="setQty(l, l.qty - 1)">−</button>
                <output>{{ l.qty }}</output>
                <button type="button" :aria-label="`One more ${l.name}`" @click="setQty(l, l.qty + 1)">+</button>
              </span>
              <span class="lines__price">{{ l.price != null ? formatRs(l.price * l.qty) : 'To confirm' }}</span>
            </li>
          </ul>
          <p class="total">
            <span>Total</span>
            <strong>{{ formatRs(total) }}</strong>
          </p>

          <div class="fields">
            <label class="field">
              <span>Your name</span>
              <input v-model="details.name" type="text" autocomplete="name" required />
            </label>

            <fieldset class="choice">
              <legend>How would you like to get it?</legend>
              <label><input v-model="details.method" type="radio" value="collect" /> I’ll collect</label>
              <label><input v-model="details.method" type="radio" value="delivery" /> Delivery</label>
            </fieldset>

            <label v-if="details.method === 'delivery'" class="field">
              <span>Delivery address</span>
              <textarea v-model="details.address" rows="2" autocomplete="street-address"></textarea>
            </label>

            <label class="field">
              <span>Day you’d like it <small>(optional)</small></span>
              <input v-model="details.day" type="date" :min="today" />
            </label>

            <label class="field">
              <span>Note <small>(optional)</small></span>
              <textarea v-model="details.note" rows="2" placeholder="Time, allergies, special requests"></textarea>
            </label>
          </div>

          <p v-if="error" class="form-error" role="alert">{{ error }}</p>

          <button type="submit" class="btn btn--whatsapp send">
            <IconChat />
            Send order on WhatsApp
          </button>
          <p class="help">This opens WhatsApp with your order written out. Your order is confirmed when Happy Corner replies.</p>
        </template>

        <div v-else-if="preview" class="done">
          <p><strong>Preview mode.</strong> With a WhatsApp number set, this message opens in WhatsApp ready to send:</p>
          <pre class="preview">{{ preview }}</pre>
          <div class="done__actions">
            <button type="button" class="btn" @click="sent = false">Back to order</button>
          </div>
        </div>

        <div v-else class="done">
          <p><strong>WhatsApp should now be open with your order.</strong> Press send there to place it.</p>
          <p>If WhatsApp didn’t open, check that it’s installed, then try again.</p>
          <div class="done__actions">
            <button type="button" class="btn" @click="sent = false">Try again</button>
            <button type="button" class="btn btn--red" @click="finish">Done, clear my order</button>
          </div>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.bar {
  position: fixed;
  inset: auto 0 0;
  z-index: 30;
  background: var(--ink);
  color: var(--paper);
  padding-block: 0.75rem calc(0.75rem + env(safe-area-inset-bottom));
}

.bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.bar__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1rem;
  font-size: 1.05rem;
  font-variant-numeric: tabular-nums;
}

.bar-enter-active,
.bar-leave-active {
  transition: transform 0.25s ease;
}
.bar-enter-from,
.bar-leave-to {
  transform: translateY(100%);
}

/* dialog */
.sheet {
  width: min(34rem, 100% - 1.5rem);
  max-height: calc(100dvh - 2rem);
  padding: 0;
  border: 2px solid var(--ink);
  border-radius: 10px;
  background: var(--paper);
  color: var(--ink);
  box-shadow: 8px 10px 0 var(--ink);
}

.sheet::backdrop {
  background: rgba(43, 24, 16, 0.55);
}

.sheet__body {
  padding: 1.5rem;
}

.sheet__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sheet__top h2 {
  font-size: 2rem;
  color: var(--lacquer);
}

.sheet__close {
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  color: var(--ink);
}

.sheet__close:hover {
  background: rgba(43, 24, 16, 0.08);
}

.lines {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.lines li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 6rem;
  align-items: center;
  gap: 0.75rem;
  padding-block: 0.6rem;
  border-bottom: 1px dashed var(--line);
}

.lines__name {
  font-weight: 600;
}

.lines__qty {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.lines__qty button {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  font: 600 1rem/1 var(--body);
  cursor: pointer;
}

.lines__qty output {
  min-width: 1.5rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.lines__price {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.total {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 1.2rem;
  font-variant-numeric: tabular-nums;
}

.fields {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.choice {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.choice legend {
  width: 100%;
  margin-bottom: 0.35rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.choice label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.25rem;
  cursor: pointer;
}

.choice input {
  width: 1.15rem;
  height: 1.15rem;
  accent-color: var(--lacquer);
}

.form-error {
  margin-top: 1rem;
}

.send {
  width: 100%;
  margin-top: 1.25rem;
}

.help {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.done {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.preview {
  margin: 0;
  padding: 1rem;
  border-radius: 8px;
  background: #dcf8c6;
  color: #1f2c34;
  font: 0.95rem/1.5 var(--body);
  white-space: pre-wrap;
}

.done__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
