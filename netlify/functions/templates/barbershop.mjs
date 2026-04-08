/**
 * Template Barbershop / Frizerie
 * Foloseste Claude pentru design unic de fiecare data
 */

import { generateGeneric } from './generic.mjs';

export async function generateBarbershop(anthropicKey, { city, businessName, lang }) {
  return generateGeneric(anthropicKey, {
    businessType: 'barbershop',
    city,
    businessName,
    lang,
  });
}
