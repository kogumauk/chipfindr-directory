import type { BusinessListing } from '../types/BusinessListing';

/**
 * Format price range for display
 */
export function formatPriceRange(listing: BusinessListing): string {
  if (!listing.priceRange) return '';
  
  const { startPrice, endPrice } = listing.priceRange;
  
  if (startPrice && endPrice) {
    return `£${startPrice.units} - £${endPrice.units}`;
  } else if (startPrice) {
    return `From £${startPrice.units}`;
  } else if (endPrice) {
    return `Up to £${endPrice.units}`;
  }
  
  return '';
}

/**
 * Format price level for display
 */
export function formatPriceLevel(priceLevel?: string): string {
  switch (priceLevel) {
    case 'PRICE_LEVEL_FREE':
      return 'Free';
    case 'PRICE_LEVEL_INEXPENSIVE':
      return '£';
    case 'PRICE_LEVEL_MODERATE':
      return '££';
    case 'PRICE_LEVEL_EXPENSIVE':
      return '£££';
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return '££££';
    default:
      return '';
  }
}

/**
 * Check if business is currently open
 */
export function isCurrentlyOpen(listing: BusinessListing): boolean {
  return listing.currentOpeningHours?.openNow || false;
}

/**
 * Get next opening time text
 */
export function getNextOpeningText(listing: BusinessListing): string {
  const hours = listing.currentOpeningHours;
  if (!hours) return '';
  
  if (hours.openNow) {
    return hours.nextCloseTime ? `Closes at ${formatTime(hours.nextCloseTime)}` : 'Open now';
  } else {
    return hours.nextOpenTime ? `Opens at ${formatTime(hours.nextOpenTime)}` : 'Closed';
  }
}

/**
 * Format ISO time string to readable time
 */
function formatTime(isoTime: string): string {
  try {
    const date = new Date(isoTime);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } catch {
    return '';
  }
}

/**
 * Get today's opening hours
 */
export function getTodaysHours(listing: BusinessListing): string {
  const hours = listing.currentOpeningHours;
  if (!hours?.weekdayDescriptions) return '';
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[today];
  
  const todaysHours = hours.weekdayDescriptions.find(desc => 
    desc.startsWith(todayName)
  );
  
  return todaysHours ? todaysHours.replace(`${todayName}: `, '') : '';
}

/**
 * Format rating for display
 */
export function formatRating(rating?: number): string {
  if (!rating) return '';
  return rating.toFixed(1);
}

/**
 * Get star rating HTML
 */
export function getStarRating(rating?: number): string {
  if (!rating) return '';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  
  // Half star
  if (hasHalfStar) {
    stars += '½';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }
  
  return stars;
}

/**
 * Extract town/city from address
 */
export function extractTownFromAddress(address: string): string {
  const parts = address.split(', ');
  if (parts.length >= 3) {
    // Usually format: "Street, Town, County/Area, Postcode, Country"
    const town = parts[parts.length - 3];
    if (town && !town.match(/^[A-Z]{1,2}\d/) && town !== 'UK') {
      return town;
    }
  }
  return '';
}

/**
 * Extract postcode from address
 */
export function extractPostcodeFromAddress(address: string): string {
  const parts = address.split(', ');
  const possiblePostcode = parts[parts.length - 2];
  
  // UK postcode pattern
  if (possiblePostcode?.match(/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i)) {
    return possiblePostcode;
  }
  
  return '';
}

/**
 * Get distance text (placeholder for future implementation)
 */
export function getDistanceText(listing: BusinessListing, userLat?: number, userLng?: number): string {
  if (!userLat || !userLng) return '';
  
  // Placeholder for distance calculation
  // In a real implementation, you would calculate the distance using the Haversine formula
  return '';
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phoneNumber?: string): string {
  if (!phoneNumber) return '';
  
  // Format UK phone numbers nicely
  if (phoneNumber.startsWith('+44')) {
    return phoneNumber.replace('+44 ', '0');
  }
  
  return phoneNumber;
}

/**
 * Get business type display text
 */
export function getBusinessTypeText(listing: BusinessListing): string {
  if (listing.primaryTypeDisplayName?.text) {
    return listing.primaryTypeDisplayName.text;
  }
  
  switch (listing.subcategory) {
    case 'takeaway':
      return 'Takeaway';
    case 'seafood-restaurant':
      return 'Seafood Restaurant';
    case 'fast-food':
      return 'Fast Food';
    case 'restaurant':
    default:
      return 'Restaurant';
  }
}

/**
 * Generate business URL slug
 */
export function generateBusinessSlug(listing: BusinessListing): string {
  const name = listing.name.text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  const town = extractTownFromAddress(listing.formattedAddress)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  return town ? `${name}-${town}` : name;
}
