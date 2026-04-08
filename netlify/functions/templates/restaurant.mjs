/**
 * Template Restaurant / Cafe
 * Redirecteaza catre generic cu instructiuni specifice
 */

export async function generateRestaurant(anthropicKey, { businessType, city, businessName, lang }) {
  // Foloseste template-ul generic cu Claude care genereaza specific pentru restaurant
  const { generateGeneric } = await import('./generic.mjs');
  return generateGeneric(anthropicKey, { businessType, city, businessName, lang });
}
