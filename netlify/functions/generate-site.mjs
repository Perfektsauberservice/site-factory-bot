/**
 * Genereaza fisierele unui site demo pe baza tipului de business
 * Returneaza un obiect { "index.html": "...", "style.css": "...", ... }
 */

import { generateBarbershop } from './templates/barbershop.mjs';
import { generateRestaurant } from './templates/restaurant.mjs';
import { generateGeneric } from './templates/generic.mjs';

const TEMPLATE_MAP = {
  barbershop: generateBarbershop,
  frizerie: generateBarbershop,
  hair_salon: generateBarbershop,
  beauty_salon: generateBarbershop,
  restaurant: generateRestaurant,
  cafe: generateRestaurant,
  bistro: generateRestaurant,
  // toate celelalte merg pe generic
};

export async function generateSite(anthropicKey, { businessType, city, businessName, lang = 'de' }) {
  const generator = TEMPLATE_MAP[businessType] || generateGeneric;

  const name = businessName || defaultName(businessType, city);

  return await generator(anthropicKey, { businessType, city, businessName: name, lang });
}

function defaultName(businessType, city) {
  const names = {
    barbershop: `Barbershop ${city}`,
    hair_salon: `Hairsalon ${city}`,
    beauty_salon: `Beauty Salon ${city}`,
    restaurant: `Restaurant ${city}`,
    cafe: `Café ${city}`,
    dental_clinic: `Zahnarzt ${city}`,
    auto_repair: `Autowerkstatt ${city}`,
    fitness_gym: `Fitnessstudio ${city}`,
    hotel: `Hotel ${city}`,
    bakery: `Bäckerei ${city}`,
    lawyer: `Rechtsanwalt ${city}`,
  };
  return names[businessType] || `${businessType} ${city}`;
}
