/**
 * Template Restaurant / Cafe
 * Redirecteaza catre generic cu instructiuni specifice
 */

import { generateGeneric } from './generic.mjs';

export async function generateRestaurant(anthropicKey, { businessType, city, businessName, lang }) {
  return generateGeneric(anthropicKey, { businessType, city, businessName, lang });
}
