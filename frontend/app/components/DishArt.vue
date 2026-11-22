<script setup lang="ts">
// Illustrations used in place of a photo until real photos are added.
import type { DishKind } from '~/data/types'

const props = defineProps<{ kind: DishKind }>()
const uid = useId()
const id = (n: string) => `${uid}-${n}`

const bg: Record<DishKind, string> = {
  sakima: '#A3261B',
  macaroni: '#2D6A4F',
  sausage: '#E0A23B',
  pork: '#F3E3C3',
  chicken: '#2B1810',
}

// Sakima: blocks in a 3 x 2 stack, back row first
const blocks = [
  { x: 118, y: 150 }, { x: 186, y: 150 }, { x: 254, y: 150 },
  { x: 98, y: 196 }, { x: 166, y: 196 }, { x: 234, y: 196 },
]
// Sesame seeds on top faces
const seeds: [number, number, number][] = [[12, 8, 20], [30, 14, -30], [46, 6, 40], [22, 20, 70], [40, 22, -10]]

// Char siu slices, fanned
const slices = [0, 1, 2, 3, 4, 5]

// Macaroni tube ends on the cut face
const tubes: [number, number][] = [
  [140, 250], [168, 246], [196, 252], [224, 247], [252, 251],
  [154, 272], [182, 276], [210, 270], [238, 275], [266, 271],
]
</script>

<template>
  <svg class="art" viewBox="0 0 400 400" role="img" :aria-label="`Illustration of ${kind}`" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient :id="id('plate')" cx="50%" cy="42%" r="60%">
        <stop offset="0" stop-color="#FFFBF2" />
        <stop offset="0.8" stop-color="#F4E7CE" />
        <stop offset="1" stop-color="#E4D0AA" />
      </radialGradient>
      <linearGradient :id="id('gold')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F6CF73" />
        <stop offset="1" stop-color="#D99A32" />
      </linearGradient>
      <linearGradient :id="id('goldSide')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#C9862A" />
        <stop offset="1" stop-color="#9E6418" />
      </linearGradient>
      <linearGradient :id="id('glaze')" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#C9352A" />
        <stop offset="1" stop-color="#7E1B13" />
      </linearGradient>
      <linearGradient :id="id('meat')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EBA58E" />
        <stop offset="1" stop-color="#C97A62" />
      </linearGradient>
      <linearGradient :id="id('sausage')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#C2402F" />
        <stop offset="0.55" stop-color="#9A2318" />
        <stop offset="1" stop-color="#6A140D" />
      </linearGradient>
      <linearGradient :id="id('crust')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E9A84A" />
        <stop offset="1" stop-color="#C47F27" />
      </linearGradient>
      <linearGradient :id="id('custard')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F9DE93" />
        <stop offset="1" stop-color="#EBBE5C" />
      </linearGradient>
    </defs>

    <rect width="400" height="400" :fill="bg[props.kind]" />
    <!-- soft light from the top left -->
    <circle cx="90" cy="60" r="220" fill="#fff" opacity="0.07" />

    <!-- close-up: plate and food scaled so the dish fills the square -->
    <g transform="translate(200 232) scale(1.3) translate(-200 -236)">
    <!-- plate -->
    <ellipse cx="200" cy="262" rx="168" ry="92" fill="#000" opacity="0.18" />
    <ellipse cx="200" cy="248" rx="166" ry="92" :fill="`url(#${id('plate')})`" />
    <ellipse cx="200" cy="248" rx="128" ry="66" fill="none" stroke="#E2CDA4" stroke-width="3" />

    <!-- SAKIMA: golden blocks with strands and sesame -->
    <g v-if="kind === 'sakima'">
      <g v-for="(b, i) in blocks" :key="i" :transform="`translate(${b.x} ${b.y})`">
        <rect x="0" y="26" width="64" height="40" rx="6" :fill="`url(#${id('goldSide')})`" />
        <path d="M0 26 L14 0 H78 L64 26 Z" :fill="`url(#${id('gold')})`" />
        <path d="M64 26 L78 0 V38 L64 66 Z" fill="#B67420" />
        <path d="M6 40 q10 -5 18 0 t18 0 t16 0 M6 52 q10 -5 18 0 t18 0 t16 0" fill="none" stroke="#F2C060" stroke-width="2.4" stroke-linecap="round" opacity="0.8" />
        <ellipse v-for="(s, j) in seeds" :key="j" :cx="s[0] + 8" :cy="s[1] + 2" rx="3.2" ry="1.6" :transform="`rotate(${s[2]} ${s[0] + 8} ${s[1] + 2})`" fill="#FFF6DD" />
        <path d="M18 4 H70" stroke="#FFF1C2" stroke-width="2" stroke-linecap="round" opacity="0.7" />
      </g>
    </g>

    <!-- MACARONI CAKE: baked slice with tube ends on the cut face -->
    <g v-else-if="kind === 'macaroni'">
      <path d="M96 222 L150 170 H312 L304 222 Z" :fill="`url(#${id('crust')})`" />
      <rect x="96" y="222" width="208" height="76" rx="4" :fill="`url(#${id('custard')})`" />
      <path d="M304 222 L312 170 V246 L304 298 Z" fill="#C9902F" />
      <path d="M96 222 H304" stroke="#B8701D" stroke-width="4" />
      <circle v-for="(t, i) in tubes" :key="i" :cx="t[0]" :cy="t[1]" r="10" fill="#E8B550" stroke="#C48A2C" stroke-width="3" />
      <circle v-for="(t, i) in tubes" :key="`h${i}`" :cx="t[0]" :cy="t[1]" r="4" fill="#B3772A" />
      <path d="M130 186 q20 -8 40 0 M200 182 q24 -8 48 0 M260 188 q18 -6 34 0" stroke="#A9661A" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7" />
    </g>

    <!-- GRILLED SAUSAGE: three sausages with grill marks, plus slices -->
    <g v-else-if="kind === 'sausage'">
      <g v-for="(y, i) in [184, 214, 244]" :key="i" :transform="`rotate(-12 200 ${y})`">
        <rect :x="96 + i * 6" :y="y - 15" width="196" height="30" rx="15" :fill="`url(#${id('sausage')})`" />
        <path v-for="g in 5" :key="g" :d="`M${116 + i * 6 + g * 32} ${y - 13} l-12 26`" stroke="#4A0C07" stroke-width="4" stroke-linecap="round" opacity="0.7" />
        <rect :x="110 + i * 6" :y="y - 10" width="150" height="5" rx="2.5" fill="#fff" opacity="0.25" />
      </g>
      <g v-for="(x, i) in [126, 166, 206]" :key="`s${i}`">
        <ellipse :cx="x + 30" cy="292" rx="20" ry="13" fill="#7E1B13" />
        <ellipse :cx="x + 30" cy="289" rx="17" ry="10" fill="#C8584A" />
        <circle v-for="k in 4" :key="k" :cx="x + 22 + k * 3.5" :cy="285 + (k % 2) * 6" r="2" fill="#F6E3D6" />
      </g>
      <path d="M268 286 q14 -10 26 -2 M276 300 q12 -8 22 0" stroke="#3E7B3A" stroke-width="5" stroke-linecap="round" fill="none" />
    </g>

    <!-- PORC CHASIVE: fanned char siu slices with red glazed edges -->
    <g v-else-if="kind === 'pork'">
      <g v-for="i in slices" :key="i" :transform="`translate(${78 + i * 38} ${168 + Math.abs(i - 2.5) * 6}) rotate(${-14 + i * 5})`">
        <rect x="0" y="0" width="58" height="104" rx="10" :fill="`url(#${id('glaze')})`" />
        <rect x="7" y="7" width="44" height="90" rx="6" :fill="`url(#${id('meat')})`" />
        <path d="M12 30 q14 6 34 0 M12 56 q14 6 34 0 M12 80 q14 5 34 0" stroke="#B9654E" stroke-width="2.5" fill="none" opacity="0.7" />
        <rect x="9" y="3" width="30" height="4" rx="2" fill="#fff" opacity="0.35" />
      </g>
      <g fill="#3E7B3A">
        <rect x="92" y="296" width="9" height="9" rx="2" transform="rotate(20 96 300)" />
        <rect x="290" y="288" width="9" height="9" rx="2" transform="rotate(-15 294 292)" />
        <rect x="312" y="274" width="8" height="8" rx="2" />
      </g>
      <path d="M118 312 q60 14 176 -6" stroke="#9A2318" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.5" />
    </g>

    <!-- CHICKEN CHASIVE: glazed drumsticks -->
    <g v-else-if="kind === 'chicken'">
      <g v-for="(d, i) in [{ x: 140, y: 214, r: -28 }, { x: 214, y: 200, r: 12 }, { x: 186, y: 262, r: -4 }]" :key="i" :transform="`translate(${d.x} ${d.y}) rotate(${d.r})`">
        <rect x="46" y="-7" width="54" height="14" rx="7" fill="#F4E6CC" />
        <circle cx="102" cy="-8" r="9" fill="#F4E6CC" />
        <circle cx="102" cy="8" r="9" fill="#F4E6CC" />
        <path d="M-58 0 C-58 -42 6 -46 52 -10 Q60 0 52 10 C6 46 -58 42 -58 0 Z" :fill="`url(#${id('glaze')})`" />
        <path d="M-40 -18 C-20 -32 10 -30 32 -14" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.3" />
      </g>
      <g fill="#3E7B3A">
        <rect x="108" y="300" width="9" height="9" rx="2" transform="rotate(20 112 304)" />
        <rect x="286" y="292" width="9" height="9" rx="2" />
      </g>
    </g>
    </g>
  </svg>
</template>

<style scoped>
.art {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
