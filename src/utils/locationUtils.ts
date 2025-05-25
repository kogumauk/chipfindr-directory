// Location utilities for generating location-based pages
import type { BusinessListing } from '../types/BusinessListing';

export interface LocationInfo {
  name: string;          // Display name (e.g., "Brixham", "Devon")
  slug: string;          // URL slug (e.g., "brixham", "devon")
  type: 'town' | 'county' | 'postcode';
  count: number;         // Number of businesses
  businesses: BusinessListing[];
}

/**
 * Generate URL-friendly slug from location name
 */
export function generateLocationSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .trim();
}

/**
 * Extract all unique locations from business listings
 */
export function extractLocations(businesses: BusinessListing[]): LocationInfo[] {
  const locationMap = new Map<string, LocationInfo>();
  
  businesses.forEach(business => {
    // Add town-level locations
    if (business.town && business.town.trim()) {
      const townName = business.town.trim();
      const townSlug = generateLocationSlug(townName);
      
      if (!locationMap.has(townSlug)) {
        locationMap.set(townSlug, {
          name: townName,
          slug: townSlug,
          type: 'town',
          count: 0,
          businesses: []
        });
      }
      
      const townLocation = locationMap.get(townSlug)!;
      townLocation.count++;
      townLocation.businesses.push(business);
    }
    
    // Add county-level locations
    if (business.county && business.county.trim()) {
      const countyName = business.county.trim();
      const countySlug = generateLocationSlug(countyName);
      
      if (!locationMap.has(countySlug)) {
        locationMap.set(countySlug, {
          name: countyName,
          slug: countySlug,
          type: 'county',
          count: 0,
          businesses: []
        });
      }
      
      const countyLocation = locationMap.get(countySlug)!;
      countyLocation.count++;
      countyLocation.businesses.push(business);
    }
    
    // Add postcode area locations (first part of postcode)
    if (business.postcode && business.postcode.trim()) {
      const postcodeArea = business.postcode.trim().split(' ')[0]; // Get "TQ5" from "TQ5 8AW"
      if (postcodeArea && postcodeArea.length >= 2) {
        const postcodeSlug = generateLocationSlug(postcodeArea);
        
        if (!locationMap.has(postcodeSlug)) {
          locationMap.set(postcodeSlug, {
            name: postcodeArea.toUpperCase(),
            slug: postcodeSlug,
            type: 'postcode',
            count: 0,
            businesses: []
          });
        }
        
        const postcodeLocation = locationMap.get(postcodeSlug)!;
        postcodeLocation.count++;
        postcodeLocation.businesses.push(business);
      }
    }
  });
  
  // Convert to array and sort by count (most businesses first)
  return Array.from(locationMap.values())
    .filter(location => location.count > 0)
    .sort((a, b) => {
      // Sort by type priority (towns first, then counties, then postcodes)
      const typePriority = { town: 1, county: 2, postcode: 3 };
      if (typePriority[a.type] !== typePriority[b.type]) {
        return typePriority[a.type] - typePriority[b.type];
      }
      // Then sort by count (descending)
      return b.count - a.count;
    });
}

/**
 * Find location info by slug
 */
export function findLocationBySlug(locations: LocationInfo[], slug: string): LocationInfo | null {
  return locations.find(location => location.slug === slug) || null;
}

/**
 * Generate location page metadata
 */
export function generateLocationMetadata(location: LocationInfo) {
  const { name, type, count } = location;
  
  const typeText = type === 'town' ? 'in' : type === 'county' ? 'in' : 'in the';
  const locationText = type === 'postcode' ? `${name} postcode area` : name;
  
  return {
    title: `Fish & Chip Shops ${typeText} ${locationText} | ChipFindr`,
    description: `Find the best ${count} fish & chip shops ${typeText} ${locationText}. Read reviews, get opening times, contact details and directions for local chippies.`,
    keywords: `fish and chips ${name.toLowerCase()}, chippy ${name.toLowerCase()}, ${name.toLowerCase()} fish shop, ${name.toLowerCase()} takeaway, fish and chips near me`,
    heading: `Fish & Chip Shops ${typeText} ${locationText}`,
    subheading: count === 1 
      ? `${count} fish & chip shop found ${typeText} ${locationText}`
      : `${count} fish & chip shops found ${typeText} ${locationText}`
  };
}

/**
 * Get related locations (same type or parent/child relationships)
 */
export function getRelatedLocations(
  currentLocation: LocationInfo, 
  allLocations: LocationInfo[], 
  businesses: BusinessListing[]
): LocationInfo[] {
  const related: LocationInfo[] = [];
  
  if (currentLocation.type === 'town') {
    // For towns, show other towns in the same county
    const townBusinesses = currentLocation.businesses;
    const counties = [...new Set(townBusinesses.map(b => b.county).filter(Boolean))];
    
    counties.forEach(county => {
      const countyLocation = allLocations.find(loc => 
        loc.type === 'county' && 
        loc.name === county
      );
      if (countyLocation) {
        related.push(countyLocation);
      }
    });
    
    // Add other towns in the same county
    if (counties.length > 0) {
      const sameCountyTowns = allLocations.filter(loc => 
        loc.type === 'town' && 
        loc.slug !== currentLocation.slug &&
        loc.businesses.some(b => counties.includes(b.county || ''))
      );
      related.push(...sameCountyTowns.slice(0, 4));
    }
  } else if (currentLocation.type === 'county') {
    // For counties, show towns within that county
    const townsInCounty = allLocations.filter(loc => 
      loc.type === 'town' &&
      loc.businesses.some(b => b.county === currentLocation.name)
    );
    related.push(...townsInCounty.slice(0, 6));
  }
  
  return related.slice(0, 6); // Limit to 6 related locations
}
