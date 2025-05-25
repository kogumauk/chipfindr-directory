// Data loading utilities for ChipFindr
import type { BusinessListing } from '../types/BusinessListing';

export interface JSONBusinessResult {
  name: string;
  id: string;
  formattedAddress: string;
  addressComponents: Array<{
    longText: string;
    shortText: string;
    types: string[];
    languageCode?: string;
  }>;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  websiteUri?: string;
  adrFormatAddress?: string;
  businessStatus?: string;
  priceLevel?: string;
  userRatingCount?: number;
  displayName: {
    text: string;
    languageCode?: string;
  };
  primaryTypeDisplayName?: {
    text: string;
    languageCode?: string;
  };
  currentOpeningHours?: any;
  primaryType?: string;
  priceRange?: {
    startPrice?: {
      currencyCode: string;
      units: string;
      nanos?: number;
    };
    endPrice?: {
      currencyCode: string;
      units: string;
      nanos?: number;
    };
  };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
}

export interface JSONDataFile {
  metadata: {
    request_parameters: {
      textQuery: string;
      maxResultCount: number;
    };
    request_timestamp: string;
    response_details: {
      timestamp: string;
      status_code: number;
      total_results: number;
    };
  };
  results: JSONBusinessResult[];
}

/**
 * Transform JSON business data to BusinessListing format
 */
export function transformBusinessData(jsonData: JSONBusinessResult): BusinessListing {
  // Extract location info from address components
  const getLocationInfo = () => {
    const components = jsonData.addressComponents || [];
    const town = components.find(c => c.types.includes('postal_town'))?.longText || '';
    
    // Try different ways to get county/administrative area
    let county = components.find(c => c.types.includes('administrative_area_level_1'))?.longText || '';
    if (!county) {
      county = components.find(c => c.types.includes('administrative_area_level_2'))?.longText || '';
    }
    
    // For UK addresses, England is too broad - try to get more specific county
    if (county === 'England') {
      const level2 = components.find(c => c.types.includes('administrative_area_level_2'))?.longText;
      if (level2 && level2 !== 'England') {
        county = level2;
      } else {
        // Default to Devon for our current data
        county = 'Devon';
      }
    }
    
    const postcode = components.find(c => c.types.includes('postal_code'))?.longText || '';
    
    return { town, county, postcode };
  };

  const locationInfo = getLocationInfo();

  // Transform the data to match our BusinessListing interface
  const businessListing: BusinessListing = {
    id: jsonData.id,
    name: {
      text: jsonData.displayName.text,
      languageCode: jsonData.displayName.languageCode
    },
    formattedAddress: jsonData.formattedAddress,
    addressComponents: jsonData.addressComponents,
    location: jsonData.location,
    websiteUri: jsonData.websiteUri || '',
    adrFormatAddress: jsonData.adrFormatAddress,
    businessStatus: jsonData.businessStatus,
    priceLevel: jsonData.priceLevel,
    primaryTypeDisplayName: jsonData.primaryTypeDisplayName,
    currentOpeningHours: jsonData.currentOpeningHours,
    primaryType: jsonData.primaryType,
    priceRange: jsonData.priceRange,
    nationalPhoneNumber: jsonData.nationalPhoneNumber,
    internationalPhoneNumber: jsonData.internationalPhoneNumber,
    
    // Additional fields for directory functionality
    category: 'fish-and-chips',
    subcategory: jsonData.primaryType || 'restaurant',
    rating: jsonData.rating,
    reviewCount: jsonData.userRatingCount,
    verified: jsonData.businessStatus === 'OPERATIONAL',
    
    // Extract location details for search/filtering
    town: locationInfo.town,
    county: locationInfo.county,
    postcode: locationInfo.postcode
  };

  return businessListing;
}

/**
 * Load all business listings from JSON files
 */
export async function loadBusinessListings(): Promise<BusinessListing[]> {
  const listings: BusinessListing[] = [];
  
  try {
    // For now, let's create some sample data to test the homepage
    // In production, this would load from actual JSON files or API
    const sampleData: BusinessListing[] = [
      {
        id: 'sample-1',
        name: { text: 'Sample Fish & Chips' },
        formattedAddress: 'Sample Street, Sample Town, Devon',
        addressComponents: [],
        location: { latitude: 50.3974, longitude: -3.5129 },
        websiteUri: 'https://example.com',
        businessStatus: 'OPERATIONAL',
        rating: 4.5,
        reviewCount: 100,
        category: 'fish-and-chips',
        verified: true,
        town: 'Sample Town',
        county: 'Devon',
        postcode: 'EX1 2AB'
      }
    ];
    
    return sampleData;
    
    // TODO: Uncomment this when ready to load real data
    /*
    const brixhamData = await import('../../data/listings/20250420_2311_Fish_and_Chip_shops_in_Brixham,_Devon.json');
    const budleighData = await import('../../data/listings/20250420_2311_Fish_and_Chip_shops_in_Budleigh_Salterton,_Devon.json');
    
    const files = [brixhamData.default, budleighData.default] as JSONDataFile[];
    
    for (const file of files) {
      if (file.results && Array.isArray(file.results)) {
        for (const result of file.results) {
          try {
            const transformed = transformBusinessData(result);
            listings.push(transformed);
          } catch (error) {
            console.warn('Error transforming business data:', error, result);
          }
        }
      }
    }
    */
  } catch (error) {
    console.error('Error loading business listings:', error);
  }
  
  return listings;
}

/**
 * Get location statistics from listings
 */
export function getLocationStats(listings: BusinessListing[]) {
  const locations = new Map<string, number>();
  const counties = new Map<string, number>();
  
  listings.forEach(listing => {
    if (listing.town) {
      locations.set(listing.town, (locations.get(listing.town) || 0) + 1);
    }
    if (listing.county) {
      counties.set(listing.county, (counties.get(listing.county) || 0) + 1);
    }
  });
  
  return {
    totalListings: listings.length,
    locations: Array.from(locations.entries()).map(([name, count]) => ({ name, count })),
    counties: Array.from(counties.entries()).map(([name, count]) => ({ name, count }))
  };
}

/**
 * Filter listings by search criteria
 */
export function filterListings(
  listings: BusinessListing[], 
  searchTerm: string = '',
  location: string = ''
): BusinessListing[] {
  return listings.filter(listing => {
    const matchesSearch = !searchTerm || 
      listing.name.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.formattedAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (listing.primaryTypeDisplayName?.text || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !location || 
      listing.town?.toLowerCase().includes(location.toLowerCase()) ||
      listing.county?.toLowerCase().includes(location.toLowerCase()) ||
      listing.postcode?.toLowerCase().includes(location.toLowerCase()) ||
      listing.formattedAddress.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });
}
