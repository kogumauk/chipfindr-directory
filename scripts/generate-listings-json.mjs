// Build script to generate static listings JSON
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Generating static listings JSON...');

// Inline the sample listings data (same as staticDataLoader.ts)
const getSampleListings = () => [
  {
    id: 'brixham-fish-restaurant',
    name: { text: 'Brixham Fish Restaurant & Takeaway' },
    formattedAddress: '22 The Quay, Brixham TQ5 8AW, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AW',
    rating: 4.6,
    reviewCount: 484,
    primaryTypeDisplayName: { text: 'Restaurant' },
    nationalPhoneNumber: '01803 123456',
    websiteUri: 'http://brixhamfishrestaurant.com/',
    verified: true,
    category: 'fish-and-chips',
    subcategory: 'restaurant'
  },
  {
    id: 'simply-fish-brixham',
    name: { text: 'Simply Fish' },
    formattedAddress: '68-74 Fore St, Brixham TQ5 8AF, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AF',
    rating: 4.3,
    reviewCount: 1200,
    primaryTypeDisplayName: { text: 'Seafood Restaurant' },
    nationalPhoneNumber: '01803 859585',
    websiteUri: 'http://simplyfishrestaurant.co.uk/',
    verified: true,
    category: 'fish-and-chips',
    subcategory: 'seafood-restaurant'
  },
  {
    id: 'rockfish-brixham',
    name: { text: 'Rockfish' },
    formattedAddress: 'New Fish Quay, Brixham TQ5 8AW, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AW',
    rating: 4.5,
    reviewCount: 2688,
    primaryTypeDisplayName: { text: 'Seafood Restaurant' },
    nationalPhoneNumber: '01803 850872',
    websiteUri: 'https://therockfish.co.uk/pages/brixham-seafood-restaurant',
    verified: true,
    category: 'fish-and-chips',
    subcategory: 'seafood-restaurant'
  },
  {
    id: 'fishionados-brixham',
    name: { text: 'Fishionados' },
    formattedAddress: '10 Summercourt Way, Brixham TQ5 0DY, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 0DY',
    rating: 4.4,
    reviewCount: 217,
    primaryTypeDisplayName: { text: 'Takeout Restaurant' },
    nationalPhoneNumber: '01803 340908',
    websiteUri: 'https://www.fishionados.co.uk/',
    verified: true,
    category: 'fish-and-chips',
    subcategory: 'takeaway'
  },
  {
    id: 'davids-fish-chips',
    name: { text: "David's Fish & Chips" },
    formattedAddress: '64 Bolton St, Brixham TQ5 9DH, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 9DH',
    rating: 4.5,
    reviewCount: 552,
    primaryTypeDisplayName: { text: 'Takeout Restaurant' },
    nationalPhoneNumber: '01803 855771',
    websiteUri: 'http://www.davids-chippy.co.uk/',
    verified: true,
    category: 'fish-and-chips',
    subcategory: 'takeaway'
  }
];

try {
  // Get all listings
  const allListings = getSampleListings();
  
  // Create a clean, optimized version for client-side use
  const optimizedListings = allListings.map(listing => ({
    id: listing.id,
    name: listing.name,
    formattedAddress: listing.formattedAddress,
    town: listing.town,
    county: listing.county,
    postcode: listing.postcode,
    rating: listing.rating,
    reviewCount: listing.reviewCount,
    primaryTypeDisplayName: listing.primaryTypeDisplayName,
    nationalPhoneNumber: listing.nationalPhoneNumber,
    websiteUri: listing.websiteUri,
    verified: listing.verified,
    category: listing.category,
    subcategory: listing.subcategory,
    // Add searchable text for better filtering
    searchText: [
      listing.name.text,
      listing.formattedAddress,
      listing.town,
      listing.county,
      listing.postcode,
      listing.primaryTypeDisplayName?.text || '',
      listing.category,
      listing.subcategory
    ].filter(Boolean).join(' ').toLowerCase()
  }));

  // Ensure public/data directory exists
  const publicDataDir = join(__dirname, '..', 'public', 'data');
  mkdirSync(publicDataDir, { recursive: true });
  
  // Write the JSON file
  const outputPath = join(publicDataDir, 'listings.json');
  writeFileSync(outputPath, JSON.stringify({
    listings: optimizedListings,
    metadata: {
      generatedAt: new Date().toISOString(),
      totalCount: optimizedListings.length,
      locations: [...new Set(optimizedListings.map(l => l.town).filter(Boolean))],
      categories: [...new Set(optimizedListings.map(l => l.category).filter(Boolean))]
    }
  }, null, 2));
  
  console.log(`✅ Generated ${optimizedListings.length} listings to ${outputPath}`);
  console.log(`📊 Locations: ${[...new Set(optimizedListings.map(l => l.town))].join(', ')}`);

} catch (error) {
  console.error('❌ Error generating listings JSON:', error);
  process.exit(1);
}
