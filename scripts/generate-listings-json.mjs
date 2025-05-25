// Build script to generate static listings JSON from data/listings/*.json files
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Generating static listings JSON...');

// Function to extract town and county from address components
function extractLocationInfo(addressComponents) {
  let town = '';
  let county = '';
  let postcode = '';
  
  for (const component of addressComponents) {
    if (component.types.includes('postal_town')) {
      town = component.longText;
    } else if (component.types.includes('administrative_area_level_2')) {
      county = component.longText;
    } else if (component.types.includes('postal_code')) {
      postcode = component.longText;
    }
  }
  
  return { town, county, postcode };
}

// Function to generate business slug
function generateBusinessSlug(name, address) {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  const addressParts = address.split(',');
  const street = addressParts[0] || '';
  const cleanStreet = street.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  
  return `${cleanName}-${cleanStreet}`.replace(/-+/g, '-').trim();
}

// Function to transform Google Places API data to our BusinessListing format
function transformGooglePlacesToBusinessListing(place) {
  const locationInfo = extractLocationInfo(place.addressComponents || []);
  const businessName = place.displayName?.text || 'Unknown Business';
  
  // Generate category and subcategory based on primary type
  let category = 'fish-and-chips';
  let subcategory = 'restaurant';
  
  if (place.primaryType === 'meal_takeaway' || place.primaryTypeDisplayName?.text?.toLowerCase().includes('takeaway')) {
    subcategory = 'takeaway';
  } else if (place.primaryTypeDisplayName?.text?.toLowerCase().includes('seafood')) {
    subcategory = 'seafood-restaurant';
  }

  return {
    id: generateBusinessSlug(businessName, place.formattedAddress || ''),
    name: { text: businessName },
    formattedAddress: place.formattedAddress || '',
    town: locationInfo.town,
    county: locationInfo.county,
    postcode: locationInfo.postcode,
    rating: place.rating,
    reviewCount: place.userRatingCount,
    primaryTypeDisplayName: place.primaryTypeDisplayName,
    nationalPhoneNumber: place.nationalPhoneNumber,
    websiteUri: place.websiteUri,
    verified: place.businessStatus === 'OPERATIONAL',
    category,
    subcategory,
    location: place.location,
    currentOpeningHours: place.currentOpeningHours,
    priceLevel: place.priceLevel,
    priceRange: place.priceRange,
    businessStatus: place.businessStatus
  };
}

try {
  // Read all JSON files from data/listings directory
  const dataDir = join(__dirname, '..', 'data', 'listings');
  const files = readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  console.log(`📁 Found ${files.length} data files:`, files.map(f => f.split('_').pop()?.replace('.json', '')).join(', '));
  
  let allListings = [];
  let processedFiles = 0;
  let totalBusinesses = 0;
  
  // Process each JSON file
  for (const file of files) {
    try {
      const filePath = join(dataDir, file);
      const fileContent = readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      console.log(`📄 Processing ${file}...`);
      
      // Extract results from the Google Places API response
      if (data.results && Array.isArray(data.results)) {
        const transformedBusinesses = data.results.map(transformGooglePlacesToBusinessListing);
        allListings.push(...transformedBusinesses);
        
        console.log(`   ✅ Added ${transformedBusinesses.length} businesses from ${data.metadata?.request_parameters?.textQuery || file}`);
        totalBusinesses += transformedBusinesses.length;
      }
      
      processedFiles++;
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message);
    }
  }
  
  // Create optimized listings for client-side use
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
    location: listing.location,
    currentOpeningHours: listing.currentOpeningHours,
    priceLevel: listing.priceLevel,
    priceRange: listing.priceRange,
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
  
  // Generate location and category statistics
  const locations = [...new Set(optimizedListings.map(l => l.town).filter(Boolean))];
  const counties = [...new Set(optimizedListings.map(l => l.county).filter(Boolean))];
  const categories = [...new Set(optimizedListings.map(l => l.category).filter(Boolean))];
  
  // Write the JSON file
  const outputPath = join(publicDataDir, 'listings.json');
  writeFileSync(outputPath, JSON.stringify({
    listings: optimizedListings,
    metadata: {
      generatedAt: new Date().toISOString(),
      totalCount: optimizedListings.length,
      locations,
      counties,
      categories,
      processedFiles,
      source: 'Google Places API'
    }
  }, null, 2));
  
  console.log(`\n🎉 SUCCESS! Generated ${optimizedListings.length} listings from ${processedFiles} files`);
  console.log(`📊 Locations: ${locations.join(', ')}`);
  console.log(`🗺️  Counties: ${counties.join(', ')}`);
  console.log(`💾 Output: ${outputPath}`);

} catch (error) {
  console.error('❌ Error generating listings JSON:', error);
  process.exit(1);
}
