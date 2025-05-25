import { defineCollection, z } from 'astro:content';
// Import your interfaces if needed for reference or complex Zod types,
// though Zod schemas are usually defined directly.

// Define Zod schemas for supporting types first
const addressComponentSchema = z.object({
  longText: z.string(),
  shortText: z.string(),
  types: z.array(z.string()),
  languageCode: z.string().optional(),
});

const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const openingHoursDateSchema = z.object({
  year: z.number().optional(),
  month: z.number().optional(),
  day: z.number().optional(),
});

const openingHoursTimeSchema = z.object({
  day: z.number(),
  hour: z.number(),
  minute: z.number(),
  date: openingHoursDateSchema.optional(),
  truncated: z.boolean().optional(),
});

const openingHoursPeriodSchema = z.object({
  open: openingHoursTimeSchema,
  close: openingHoursTimeSchema,
});

const businessHoursSchema = z.object({
  openNow: z.boolean().optional(),
  periods: z.array(openingHoursPeriodSchema).optional(),
  weekdayDescriptions: z.array(z.string()).optional(),
  nextOpenTime: z.string().optional(),
  nextCloseTime: z.string().optional(),
});

const typedTextSchema = z.object({
  text: z.string(),
  languageCode: z.string().optional(),
});

const priceDetailsSchema = z.object({
  currencyCode: z.string(),
  units: z.string(), // Kept as string for flexibility as per previous schema
  nanos: z.number().optional(),
});

const priceRangeSchema = z.object({
  startPrice: priceDetailsSchema.optional(),
  endPrice: priceDetailsSchema.optional(),
});

// Define the main BusinessListing schema using Zod
const businessListingSchema = z.object({
  id: z.string(),
  name: typedTextSchema, // Maps to JSON 'displayName'
  formattedAddress: z.string(),
  addressComponents: z.array(addressComponentSchema),
  location: locationSchema,
  websiteUri: z.string().url().optional().or(z.literal('')), // Allow empty string or valid URL
  adrFormatAddress: z.string().optional(),
  businessStatus: z.string().optional(),
  priceLevel: z.string().optional(),
  primaryTypeDisplayName: typedTextSchema.optional(),
  currentOpeningHours: businessHoursSchema.optional(),
  primaryType: z.string().optional(),
  priceRange: priceRangeSchema.optional(),
  nationalPhoneNumber: z.string().optional(),
  internationalPhoneNumber: z.string().optional(),
  
  category: z.string().optional(),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(), // Assuming images are URLs
  verified: z.boolean().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  createdAt: z.date().optional(), // Or z.string().datetime() if stored as ISO strings
  updatedAt: z.date().optional(), // Or z.string().datetime()
  
  // Location-specific fields for search and filtering
  town: z.string().optional(),
  county: z.string().optional(),
  postcode: z.string().optional(),
});

const listingsCollection = defineCollection({
  type: 'data', // Using 'data' for JSON/YAML files
  schema: businessListingSchema,
});

export const collections = {
  'listings': listingsCollection,
};