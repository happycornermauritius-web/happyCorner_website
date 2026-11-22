import type { DishKind } from '~/data/types'

/** Which illustration fits a dish, from its name. Undefined if none fits. */
export function dishKind(name: string): DishKind | undefined {
  const n = name.toLowerCase()
  if (n.includes('sakima') || n.includes('sachima')) return 'sakima'
  if (n.includes('macaroni')) return 'macaroni'
  if (n.includes('sausage') || n.includes('saucisse') || n.includes('lap che')) return 'sausage'
  if (n.includes('chicken') || n.includes('poulet')) return 'chicken'
  if (n.includes('porc') || n.includes('pork') || n.includes('chasive') || n.includes('char siu')) return 'pork'
  return undefined
}
