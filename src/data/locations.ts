import locationsData from './locations.json';

export type LocationType = 'library' | 'school' | 'league' | null;

export interface Location {
  id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  description: string | null;
  show_in_client_mode: boolean;
  slug: string;
  position: number;
  hidden_at: string | null;
  formatted_address: string | null;
  street_address: string | null;
  street_address2: string | null;
  city: string | null;
  state_code: string | null;
  postal_code: string | null;
  country_code: string | null;
  timezone_friendly: string | null;
  timezone: string | null;
  code: string;
  type?: LocationType;
}

export const mainCampus = {
  name: 'Main Campus & Office',
  address: ['12625 High Bluff Drive #113', 'Hacienda Building', 'San Diego, CA 92130'],
  directionsUrl: 'https://goo.gl/maps/GUdss2BayCqGmDCLA',
  phone: '(858) 284-0481',
  phoneHref: 'tel:18582840481',
  email: 'info@jointheleague.org',
  emailHref: 'mailto:info@jointheleague.org',
  responseNote:
    'If we miss your call, please leave a voicemail or email us. We typically respond within 24 working hours.'
};

const LIBRARY_PATTERN = /library/i;
const SCHOOL_PATTERN = /(St\.|Alliance|Learning|Academy)/i;

const inferLocationType = (name: string | null | undefined): LocationType => {
  if (!name) {
    return null;
  }

  if (LIBRARY_PATTERN.test(name)) {
    return 'library';
  }

  if (SCHOOL_PATTERN.test(name)) {
    return 'school';
  }

  return null;
};

// Exported from Pike 13
const normalizedLocations: Location[] = (locationsData as Location[]).map((location) => {
  const derivedType = inferLocationType(location?.name ?? null);
  const typedLocation: Location = { ...location };

  if (derivedType) {
    typedLocation.type = derivedType;
  }

  return typedLocation;
});

const locationExtras: Record<string, Partial<Location>> = {
  CV: { type: 'league' },
  VL: { type: 'league' },
  BW: { type: 'league' }
};

const locationsMap = new Map<string, Location>(
  normalizedLocations
    .filter((location) => Boolean(location.code))
    .map((location) => [location.code, location])
);

for (const [code, extraFields] of Object.entries(locationExtras)) {
  const target = locationsMap.get(code);
  if (!target) {
    continue;
  }

  const sanitizedExtras = Object.fromEntries(
    Object.entries(extraFields).filter(([, value]) => value !== null && value !== undefined)
  ) as Partial<Location>;

  Object.assign(target, sanitizedExtras);
}

export const locations = normalizedLocations;

// Extract unique location codes
export const locationCodes = [...new Set(locations.map((location) => location.code))];

export const activeLocationCodes = ['CV', 'VL', 'SOTM', 'SJA', 'BW', 'STME', 'THS', 'SRS', 'MTE', 'SFC', 'FF', 'LT', 'WQ', 'SFA', 'HTH'];

export const libraries = ['CHWL', 'MVL', 'RBL', 'NUCL', 'SBCL', 'MVBL', 'CMRL', 'PHRL']