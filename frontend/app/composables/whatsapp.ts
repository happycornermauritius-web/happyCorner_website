import type { CartLine } from './useCart'
import { formatRs } from './useCart'

/** Digits only, with Mauritius country code (230) added to local 7–8 digit numbers. */
export function normaliseWhatsApp(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '')
  if (digits.length === 7 || digits.length === 8) return `230${digits}`
  return digits
}

export interface OrderDetails {
  name: string
  method: 'point' | 'home'
  /** Chosen delivery point (pickup) */
  point: string
  address: string
  /** Exact spot for home delivery, from the map */
  pin: { lat: number; lng: number } | null
  day: string
  note: string
}

export function buildOrderMessage(lines: CartLine[], total: number, d: OrderDetails): string {
  const items = lines.map((l) => `${l.qty} x ${l.name}${l.price != null ? ` (${formatRs(l.price * l.qty)})` : ''}`)

  const when = d.day
    ? new Date(`${d.day}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

  return [
    'Hello Happy Corner, I’d like to order:',
    '',
    ...items,
    '',
    `Total: ${formatRs(total)}${lines.some((l) => l.price == null) ? ' + items to confirm' : ''}`,
    `Name: ${d.name.trim()}`,
    d.method === 'home'
      ? `Home delivery to: ${d.address.trim() || 'see location pin'}`
      : d.point
        ? `Pick up at: ${d.point}`
        : 'Pick up at a delivery point (please tell me which)',
    d.method === 'home' && d.pin ? `Location pin: https://www.google.com/maps?q=${d.pin.lat},${d.pin.lng}` : null,
    when ? `For: ${when}` : null,
    d.note.trim() ? `Note: ${d.note.trim()}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')
    .replace(/\u00a0/g, ' ')
}

export function whatsappLink(number: string, message = ''): string {
  const n = normaliseWhatsApp(number)
  return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
