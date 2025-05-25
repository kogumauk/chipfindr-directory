import { getSampleListings } from './src/utils/staticDataLoader.ts';
import { filterListings } from './src/utils/dataLoader.ts';

console.log('=== SEARCH FUNCTIONALITY TEST ===');

// Load sample data
const listings = getSampleListings();
console.log(`Loaded ${listings.length} sample listings:`);
listings.forEach((listing, index) => {
  console.log(`${index + 1}. ${listing.name.text} - ${listing.town}`);
});

console.log('\n=== TESTING SEARCH FILTERS ===');

// Test 1: Search by business name
console.log('\n1. Search for "rockfish":');
const rockfishResults = filterListings(listings, 'rockfish', '');
console.log(`Found ${rockfishResults.length} results:`);
rockfishResults.forEach(result => console.log(`  - ${result.name.text}`));

// Test 2: Search by location
console.log('\n2. Search by location "brixham":');
const brixhamResults = filterListings(listings, '', 'brixham');
console.log(`Found ${brixhamResults.length} results:`);
brixhamResults.forEach(result => console.log(`  - ${result.name.text} in ${result.town}`));

// Test 3: Search by food type
console.log('\n3. Search for "fish":');
const fishResults = filterListings(listings, 'fish', '');
console.log(`Found ${fishResults.length} results:`);
fishResults.forEach(result => console.log(`  - ${result.name.text}`));

// Test 4: Combined search
console.log('\n4. Search for "fish" in "brixham":');
const combinedResults = filterListings(listings, 'fish', 'brixham');
console.log(`Found ${combinedResults.length} results:`);
combinedResults.forEach(result => console.log(`  - ${result.name.text} in ${result.town}`));

// Test 5: No results
console.log('\n5. Search for "pizza" (should find nothing):');
const noResults = filterListings(listings, 'pizza', '');
console.log(`Found ${noResults.length} results`);

console.log('\n=== SEARCH TEST COMPLETE ===');
