// Supporting Interfaces
export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface OpeningHoursDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface OpeningHoursTime {
  day: number;
  hour: number;
  minute: number;
  date?: OpeningHoursDate;
  truncated?: boolean;
}

export interface OpeningHoursPeriod {
  open: OpeningHoursTime;
  close: OpeningHoursTime;
}

export interface BusinessHours {
  openNow?: boolean;
  periods?: OpeningHoursPeriod[];
  weekdayDescriptions?: string[];
  nextOpenTime?: string;
  nextCloseTime?: string;
}

export interface TypedText {
  text: string;
  languageCode?: string;
}

export interface PriceDetails {
  currencyCode: string;
  units: string;
  nanos?: number;
}

export interface PriceRange {
  startPrice?: PriceDetails;
  endPrice?: PriceDetails;
}

// Business Listing Schema
export interface BusinessListing {
  id: string; // Maps to JSON 'id'
  name: TypedText; // Maps to JSON 'displayName'
  formattedAddress: string; // Maps to JSON 'formattedAddress'
  addressComponents: AddressComponent[]; // Maps to JSON 'addressComponents'
  location: Location; // Maps to JSON 'location'
  websiteUri?: string; // Maps to JSON 'websiteUri'
  adrFormatAddress?: string; // Maps to JSON 'adrFormatAddress'
  businessStatus?: string; // Maps to JSON 'businessStatus'
  priceLevel?: string; // Maps to JSON 'priceLevel'
  primaryTypeDisplayName?: TypedText; // Maps to JSON 'primaryTypeDisplayName'
  currentOpeningHours?: BusinessHours; // Maps to JSON 'currentOpeningHours'
  primaryType?: string; // Maps to JSON 'primaryType'
  priceRange?: PriceRange; // Maps to JSON 'priceRange'
  nationalPhoneNumber?: string; // Maps to JSON 'nationalPhoneNumber'
  internationalPhoneNumber?: string; // Maps to JSON 'internationalPhoneNumber'
  
  // Existing fields, updated or kept optional
  category?: string; // No direct map in JSON, keep for future use
  subcategory?: string; // No direct map in JSON, keep for future use
  description?: string; // No direct map in JSON, keep for future use
  images?: string[]; // No direct map in JSON, keep for future use
  verified?: boolean; // No direct map in JSON, keep for future use
  rating?: number; // Maps to JSON 'rating'
  reviewCount?: number; // Maps to JSON 'userRatingCount'
  createdAt?: Date; // Keep for internal tracking
  updatedAt?: Date; // Keep for internal tracking
  
  // Location-specific fields for search and filtering
  town?: string; // Extracted from addressComponents
  county?: string; // Extracted from addressComponents  
  postcode?: string; // Extracted from addressComponents
}