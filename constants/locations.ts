/**
 * Popular locations with average land prices
 */
export interface LocationOption {
  name: string;
  region: string;
  avgLandPrice: number;
  image: string;
}

export const POPULAR_LOCATIONS: LocationOption[] = [
  { name: 'Amsterdam', region: 'Noord-Holland', avgLandPrice: 800, image: '/generated/locations/amsterdam-province.png' },
  { name: 'Utrecht', region: 'Utrecht', avgLandPrice: 650, image: '/generated/locations/utrecht-province.png' },
  { name: 'Den Haag', region: 'Zuid-Holland', avgLandPrice: 550, image: '/generated/locations/den-haag-province.png' },
  { name: 'Amersfoort', region: 'Utrecht', avgLandPrice: 500, image: '/generated/locations/amersfoort-province.png' },
  { name: 'Haarlem', region: 'Noord-Holland', avgLandPrice: 600, image: '/generated/locations/haarlem-province.png' },
  { name: 'Almere', region: 'Flevoland', avgLandPrice: 350, image: '/generated/locations/almere-province.png' },
  { name: 'Groningen', region: 'Groningen', avgLandPrice: 300, image: '/generated/locations/generic-province.png' },
  { name: 'Eindhoven', region: 'Noord-Brabant', avgLandPrice: 450, image: '/generated/locations/generic-province.png' },
];

/**
 * Estimate land cost based on location and plot size
 */
export const estimateLandCost = (
  location: string,
  plotSize: string | null
): number => {
  // Find location average price per m²
  const loc = POPULAR_LOCATIONS.find(l => 
    location.toLowerCase().includes(l.name.toLowerCase())
  );
  const pricePerSqm = loc?.avgLandPrice ?? 400;
  
  // Get plot size midpoint
  const plotSizes: Record<string, number> = {
    '<300': 250,
    '300-500': 400,
    '500-1000': 750,
    '1000+': 1200,
  };
  const sqm = plotSizes[plotSize ?? '300-500'] ?? 400;
  
  return pricePerSqm * sqm;
};




