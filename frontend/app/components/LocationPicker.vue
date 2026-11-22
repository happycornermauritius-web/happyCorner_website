<script setup lang="ts">
// Map for home delivery: tap to drop a pin, drag to adjust, or use the phone's location.
// OpenStreetMap tiles, no API key needed.
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, Marker } from 'leaflet'

export interface Pin {
  lat: number
  lng: number
}

const pin = defineModel<Pin | null>({ default: null })

const el = ref<HTMLDivElement | null>(null)
const status = ref('')
const mapFailed = ref(false)
const locating = ref(false)

let L: typeof import('leaflet') | null = null
let map: LeafletMap | null = null
let marker: Marker | null = null

const MAURITIUS: [number, number] = [-20.25, 57.57]

const round = (n: number) => Math.round(n * 1e6) / 1e6

function place(lat: number, lng: number, zoom?: number) {
  if (!L || !map) return
  pin.value = { lat: round(lat), lng: round(lng) }
  if (!marker) {
    marker = L.marker([lat, lng], {
      draggable: true,
      keyboard: true,
      title: 'Delivery location',
      icon: L.divIcon({ className: 'pin', html: '<span></span>', iconSize: [30, 42], iconAnchor: [15, 40] }),
    }).addTo(map)
    marker.on('dragend', () => {
      const p = marker!.getLatLng()
      pin.value = { lat: round(p.lat), lng: round(p.lng) }
    })
  } else {
    marker.setLatLng([lat, lng])
  }
  if (zoom) map.setView([lat, lng], zoom)
  status.value = ''
}

function useMyLocation() {
  if (!navigator.geolocation) {
    status.value = 'This device can’t share its location. Tap the map to place the pin instead.'
    return
  }
  locating.value = true
  status.value = 'Finding your location…'
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locating.value = false
      place(pos.coords.latitude, pos.coords.longitude, 17)
    },
    (err) => {
      locating.value = false
      status.value =
        err.code === err.PERMISSION_DENIED
          ? 'Location access is blocked. Tap the map to place the pin instead.'
          : 'Your location couldn’t be found. Tap the map to place the pin instead.'
    },
    { enableHighAccuracy: true, timeout: 15000 },
  )
}

function clearPin() {
  pin.value = null
  if (marker && map) {
    map.removeLayer(marker)
    marker = null
  }
}

onMounted(async () => {
  L = await import('leaflet')
  if (!el.value) return
  map = L.map(el.value, { scrollWheelZoom: false, attributionControl: true }).setView(MAURITIUS, 10)
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  let failed = 0
  tiles.on('tileerror', () => {
    if (++failed > 3) mapFailed.value = true
  })
  tiles.on('tileload', () => (mapFailed.value = false))
  map.on('click', (e) => place(e.latlng.lat, e.latlng.lng))
  if (pin.value) place(pin.value.lat, pin.value.lng, 17)
  // The map sits in a dialog that may still be laying out.
  setTimeout(() => map?.invalidateSize(), 150)
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  marker = null
})

const mapsLink = computed(() => (pin.value ? `https://www.google.com/maps?q=${pin.value.lat},${pin.value.lng}` : ''))
</script>

<template>
  <div class="loc">
    <div class="loc__head">
      <span class="loc__label">Pin your location <small>(recommended)</small></span>
      <button type="button" class="btn loc__me" :disabled="locating" @click="useMyLocation">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
        Use my location
      </button>
    </div>

    <div ref="el" class="loc__map" role="application" aria-label="Map. Tap to place the delivery pin."></div>

    <p v-if="mapFailed" class="loc__msg">The map couldn’t load here. Use your location, or describe landmarks in the address.</p>
    <p v-else-if="status" class="loc__msg" role="status">{{ status }}</p>
    <p v-else-if="pin" class="loc__ok" role="status">
      Pin placed. Drag it to adjust.
      <a :href="mapsLink" target="_blank" rel="noopener">Check on Google Maps</a>
      <button type="button" class="loc__clear" @click="clearPin">Remove pin</button>
    </p>
    <p v-else class="loc__hint">Tap the map where your house is, or use your location.</p>
  </div>
</template>

<style scoped>
.loc {
  display: grid;
  gap: 0.5rem;
}

.loc__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.loc__label {
  font-weight: 600;
  font-size: 0.95rem;
}

.loc__label small {
  font-weight: 500;
  color: var(--ink-soft);
}

.loc__me {
  min-height: 2.4rem;
  padding: 0.35rem 0.9rem;
  font-size: 0.9rem;
}

.loc__map {
  height: 15rem;
  border: 2px solid var(--line);
  border-radius: 8px;
  background: #e8e0cf;
  z-index: 0;
}

.loc__hint,
.loc__msg,
.loc__ok {
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.loc__msg {
  color: var(--lacquer);
  font-weight: 500;
}

.loc__ok {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.9rem;
  color: var(--jade);
  font-weight: 600;
}

.loc__ok a {
  color: var(--ink);
}

.loc__clear {
  padding: 0;
  border: 0;
  background: none;
  color: var(--lacquer);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

/* Map pin */
.loc :deep(.pin) {
  background: none;
  border: 0;
}

.loc :deep(.pin span) {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: var(--lacquer);
  border: 3px solid var(--paper);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transform: rotate(-45deg);
}

.loc :deep(.pin span)::after {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: var(--paper);
}
</style>
