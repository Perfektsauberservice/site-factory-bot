/**
 * Mapeaza tipul de business la generator
 * Toate tipurile folosesc Claude cu Framer-style design unic
 */

import { generateGeneric } from './templates/generic.mjs';

// Normalizeaza variantele de denumire → businessType standard
const TYPE_ALIASES = {
  // Frumusete
  frizerie: 'barbershop', barbershop: 'barbershop', 'hair_salon': 'hair_salon',
  'beauty_salon': 'beauty_salon', 'salon_frumusete': 'beauty_salon',
  'nail_salon': 'nail_salon', 'nail salon': 'nail_salon', unghii: 'nail_salon',
  spa: 'spa', masaj: 'massage', massage: 'massage', tatuaje: 'tattoo', tattoo: 'tattoo',

  // Food
  restaurant: 'restaurant', cafe: 'cafe', cafenea: 'cafe', bistro: 'bistro',
  pizzerie: 'pizzeria', pizzeria: 'pizzeria', brutarie: 'bakery', bakery: 'bakery',
  cofetarie: 'bakery', bar: 'bar',

  // Sanatate
  dentist: 'dental_clinic', 'dental_clinic': 'dental_clinic', stomatolog: 'dental_clinic',
  medic: 'medical', doctor: 'medical', psiholog: 'psychology', psychology: 'psychology',
  fizioterapie: 'physiotherapy', physiotherapy: 'physiotherapy',
  farmacie: 'pharmacy', pharmacy: 'pharmacy', optician: 'medical',

  // Auto
  'service_auto': 'auto_repair', 'auto_repair': 'auto_repair', service: 'auto_repair',
  vulcanizare: 'auto_repair', detailing: 'car_detailing', 'car_detailing': 'car_detailing',
  'spalatorie_auto': 'car_wash', 'car_wash': 'car_wash',

  // Imobiliare
  'agentie_imobiliara': 'real_estate', 'real_estate': 'real_estate', imobiliare: 'real_estate',
  constructor: 'construction', construction: 'construction',
  renovari: 'renovation', renovation: 'renovation', instalatii: 'construction',

  // Profesionisti
  avocat: 'lawyer', lawyer: 'lawyer', contabil: 'accountant', accountant: 'accountant',
  notar: 'lawyer', marketing: 'marketing', 'web_design': 'marketing',

  // Sport & educatie
  'fitness_gym': 'fitness_gym', fitness: 'fitness_gym', sala: 'fitness_gym', gym: 'fitness_gym',
  yoga: 'yoga', dans: 'dance', dance: 'dance',
  meditatii: 'tutoring', tutoring: 'tutoring', gradinita: 'kindergarten', kindergarten: 'kindergarten',

  // Altele
  hotel: 'hotel', pensiune: 'guesthouse', guesthouse: 'guesthouse',
  florarie: 'florist', florist: 'florist',
  curatenie: 'cleaning', cleaning: 'cleaning',
  catering: 'catering', 'pet_shop': 'pet_shop', 'petshop': 'pet_shop',
};

function defaultName(businessType, city) {
  const names = {
    barbershop: `Barbershop ${city}`, hair_salon: `Salon ${city}`,
    beauty_salon: `Beauty ${city}`, nail_salon: `Nails ${city}`,
    spa: `Spa ${city}`, massage: `Masaj ${city}`, tattoo: `Tattoo ${city}`,
    restaurant: `Restaurant ${city}`, cafe: `Café ${city}`, bistro: `Bistro ${city}`,
    pizzeria: `Pizzeria ${city}`, bakery: `Bäckerei ${city}`, bar: `Bar ${city}`,
    dental_clinic: `Zahnarzt ${city}`, medical: `Praxis ${city}`,
    psychology: `Psychologie ${city}`, physiotherapy: `Physiotherapie ${city}`,
    pharmacy: `Apotheke ${city}`,
    auto_repair: `Autowerkstatt ${city}`, car_wash: `Waschanlage ${city}`,
    car_detailing: `Detailing ${city}`,
    real_estate: `Immobilien ${city}`, construction: `Bau ${city}`,
    renovation: `Renovierung ${city}`,
    lawyer: `Rechtsanwalt ${city}`, accountant: `Steuerberater ${city}`,
    marketing: `Marketing ${city}`,
    fitness_gym: `Fitnessstudio ${city}`, yoga: `Yoga ${city}`,
    dance: `Tanzschule ${city}`, tutoring: `Nachhilfe ${city}`,
    kindergarten: `Kindergarten ${city}`,
    hotel: `Hotel ${city}`, guesthouse: `Pension ${city}`,
    florist: `Blumen ${city}`, cleaning: `Reinigung ${city}`,
    catering: `Catering ${city}`, pet_shop: `Tierhandlung ${city}`,
  };
  return names[businessType] || `${businessType} ${city}`;
}

export async function generateSite(anthropicKey, { businessType, city, businessName, lang = 'de' }) {
  const normalizedType = TYPE_ALIASES[businessType?.toLowerCase()] || businessType || 'generic';
  const name = businessName || defaultName(normalizedType, city);

  return await generateGeneric(anthropicKey, {
    businessType: normalizedType,
    city,
    businessName: name,
    lang,
  });
}
