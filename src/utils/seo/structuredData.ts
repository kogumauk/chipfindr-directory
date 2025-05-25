import type { BusinessListing } from '../../types/BusinessListing';
import { generateBusinessSlug } from '../formatters';

/**
 * Generates JSON-LD structured data for a business listing
 * Follows Schema.org LocalBusiness and Restaurant schemas
 */
export function generateBusinessStructuredData(business: BusinessListing, baseUrl: string = 'https://chipfindr.co.uk') {
  // Extract postcode for address locality
  const postcodeMatch = business.formattedAddress?.match(/([A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2})/i);
  const postcode = postcodeMatch ? postcodeMatch[0] : business.postcode || '';

  // Parse address components
  const addressParts = business.formattedAddress?.split(',').map(part => part.trim()) || [];
  const streetAddress = addressParts[0] || '';
  const addressRegion = business.county || 'UK';

  // Generate business URL
  const businessUrl = `${baseUrl}/business/${generateBusinessSlug(business)}`;

  // Base structured data
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Restaurant", // Most fish & chip shops are restaurants
    "@id": `${baseUrl}#business-${business.id}`,
    "name": business.name?.text || '',
    "description": `${business.name?.text} - Fish & Chip shop in ${business.town}, ${business.county}. ${business.rating ? `Rated ${business.rating} stars` : ''} ${business.reviewCount ? `with ${business.reviewCount} reviews` : ''}`.trim(),
    "url": businessUrl,
    "telephone": business.nationalPhoneNumber || undefined,
    "priceRange": business.priceLevel ? '$'.repeat(business.priceLevel) : '$$',
    "currenciesAccepted": "GBP",
    "paymentAccepted": "Cash, Credit Card, Debit Card",
    "servesCuisine": ["British", "Fish and Chips", "Seafood"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": business.town || '',
      "addressRegion": addressRegion,
      "postalCode": postcode,
      "addressCountry": "GB"
    }
  };

  // Add coordinates if available
  if (business.location) {
    structuredData.geo = {
      "@type": "GeoCoordinates",
      "latitude": business.location.latitude,
      "longitude": business.location.longitude
    };
  }

  // Add rating and reviews if available
  if (business.rating && business.reviewCount) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": business.rating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": business.reviewCount
    };
  }

  // Add opening hours if available
  if (business.currentOpeningHours?.weekdayDescriptions) {
    const openingHours = business.currentOpeningHours.weekdayDescriptions
      .filter(hours => !hours.includes('Closed'))
      .map(hours => {
        const [day, time] = hours.split(': ');
        if (!time || time === 'Closed') return null;
        
        // Convert day names to Schema.org format
        const dayMap: { [key: string]: string } = {
          'Monday': 'Mo',
          'Tuesday': 'Tu', 
          'Wednesday': 'We',
          'Thursday': 'Th',
          'Friday': 'Fr',
          'Saturday': 'Sa',
          'Sunday': 'Su'
        };
        
        const dayCode = dayMap[day];
        if (!dayCode) return null;
        
        // Parse time ranges (e.g., "11:30 AM – 9:00 PM")
        const timeRange = time.replace(/\s*–\s*/, '-').replace(/\s*(AM|PM)/g, '');
        return `${dayCode} ${timeRange}`;
      })
      .filter(Boolean);
    
    if (openingHours.length > 0) {
      structuredData.openingHours = openingHours;
    }
  }

  // Add website if available
  if (business.websiteUri) {
    structuredData.sameAs = [business.websiteUri];
  }

  // Add business categories
  if (business.primaryTypeDisplayName?.text) {
    structuredData.category = business.primaryTypeDisplayName.text;
  }

  // Add additional business types based on subcategory
  const businessTypes = ['Restaurant', 'FoodEstablishment'];
  if (business.subcategory === 'takeaway') {
    businessTypes.push('TakeawayRestaurant');
  }
  if (business.subcategory === 'seafood-restaurant') {
    businessTypes.push('SeafoodRestaurant');
  }

  // Set the most specific type as primary
  structuredData["@type"] = businessTypes;

  return structuredData;
}

/**
 * Generates JSON-LD structured data for a search results page
 */
export function generateSearchPageStructuredData(searchQuery?: string, location?: string, baseUrl: string = 'https://chipfindr.co.uk') {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Fish & Chip Shops${location ? ` in ${location}` : ''}${searchQuery ? ` - ${searchQuery}` : ''}`,
    "description": `Find the best fish & chip shops${location ? ` in ${location}` : ''}. Compare ratings, reviews, and opening hours.`,
    "url": `${baseUrl}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}${location ? `&location=${encodeURIComponent(location)}` : ''}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Fish & Chip Shop Listings",
      "description": "Directory of fish & chip shops across the UK"
    }
  };
}

/**
 * Generates JSON-LD structured data for location pages
 */
export function generateLocationPageStructuredData(
  locationName: string, 
  locationType: 'town' | 'county' | 'postcode',
  businessCount: number,
  baseUrl: string = 'https://chipfindr.co.uk'
) {
  const typeMap = {
    town: 'City',
    county: 'State', 
    postcode: 'PostalAddress'
  };

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": locationName,
    "description": `Fish & chip shops in ${locationName}. Find ${businessCount} local fish & chip shops with ratings, reviews, and contact details.`,
    "url": `${baseUrl}/location/${locationName.toLowerCase().replace(/\s+/g, '-')}`,
    "containedInPlace": {
      "@type": locationType === 'town' ? "State" : "Country",
      "name": locationType === 'town' ? "UK" : "United Kingdom"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `Fish & Chip Shops in ${locationName}`,
      "numberOfItems": businessCount,
      "description": `Directory of ${businessCount} fish & chip shops in ${locationName}`
    }
  };
}

/**
 * Generates breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: { label: string; href?: string }[], baseUrl: string = 'https://chipfindr.co.uk') {
  const listItems = breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.label,
    "item": crumb.href ? `${baseUrl}${crumb.href}` : undefined
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": listItems
  };
}

/**
 * Generate meta tags for social media sharing
 */
export function generateSocialMetaTags(
  title: string,
  description: string,
  url: string,
  imageUrl?: string,
  type: 'website' | 'article' = 'website'
) {
  const siteName = 'ChipFindr';
  const defaultImage = '/images/chipfindr-og-image.jpg'; // We'll create this later
  
  return {
    // Open Graph tags
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:type': type,
    'og:site_name': siteName,
    'og:image': imageUrl || defaultImage,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:locale': 'en_GB',
    
    // Twitter Card tags
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl || defaultImage,
    'twitter:site': '@chipfindr', // Social media handle when created
    
    // Additional meta tags
    'theme-color': '#2563eb', // Blue theme color
  };
}