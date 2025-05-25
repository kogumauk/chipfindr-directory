// Debug the actual search integration issue
console.log('=== SEARCH INTEGRATION DEBUGGING ===');

// Copy the exact sample data from staticDataLoader.ts
const getSampleListings = () => [
  {
    id: 'brixham-fish-restaurant',
    name: { text: 'Brixham Fish Restaurant & Takeaway' },
    formattedAddress: '22 The Quay, Brixham TQ5 8AW, UK',
    addressComponents: [
      { longText: '22', shortText: '22', types: ['street_number'] },
      { longText: 'The Quay', shortText: 'The Quay', types: ['route'] },
      { longText: 'Brixham', shortText: 'Brixham', types: ['postal_town'] },
      { longText: 'TQ5 8AW', shortText: 'TQ5 8AW', types: ['postal_code'] }
    ],
    location: { latitude: 50.3973947, longitude: -3.5128581 },
    rating: 4.6,
    reviewCount: 484,
    websiteUri: 'http://brixhamfishrestaurant.com/',
    businessStatus: 'OPERATIONAL',
    priceLevel: 'PRICE_LEVEL_INEXPENSIVE',
    primaryTypeDisplayName: { text: 'Restaurant' },
    nationalPhoneNumber: '01803 123456',
    category: 'fish-and-chips',
    subcategory: 'restaurant',
    verified: true,
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AW'
  },
  {
    id: 'simply-fish-brixham',
    name: { text: 'Simply Fish' },
    formattedAddress: '68-74 Fore St, Brixham TQ5 8AF, UK',
    addressComponents: [
      { longText: '68-74', shortText: '68-74', types: ['street_number'] },
      { longText: 'Fore Street', shortText: 'Fore St', types: ['route'] },
      { longText: 'Brixham', shortText: 'Brixham', types: ['postal_town'] },
      { longText: 'TQ5 8AF', shortText: 'TQ5 8AF', types: ['postal_code'] }
    ],
    location: { latitude: 50.395843899999996, longitude: -3.5126364 },
    rating: 4.3,
    reviewCount: 1200,
    websiteUri: 'http://simplyfishrestaurant.co.uk/',
    businessStatus: 'OPERATIONAL',
    priceLevel: 'PRICE_LEVEL_MODERATE',
    primaryTypeDisplayName: { text: 'Seafood Restaurant' },
    nationalPhoneNumber: '01803 859585',
    category: 'fish-and-chips',
    subcategory: 'seafood-restaurant',
    verified: true,
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AF'
  },
  {
    id: 'rockfish-brixham',
    name: { text: 'Rockfish' },
    formattedAddress: 'New Fish Quay, Brixham TQ5 8AW, UK',
    addressComponents: [
      { longText: 'New Fish Quay', shortText: 'New Fish Quay', types: ['premise'] },
      { longText: 'Brixham', shortText: 'Brixham', types: ['postal_town'] },
      { longText: 'TQ5 8AW', shortText: 'TQ5 8AW', types: ['postal_code'] }
    ],
    location: { latitude: 50.397940999999996, longitude: -3.512194 },
    rating: 4.5,
    reviewCount: 2688,
    websiteUri: 'https://therockfish.co.uk/pages/brixham-seafood-restaurant',
    businessStatus: 'OPERATIONAL',
    priceLevel: 'PRICE_LEVEL_MODERATE',
    primaryTypeDisplayName: { text: 'Seafood Restaurant' },
    nationalPhoneNumber: '01803 850872',
    category: 'fish-and-chips',
    subcategory: 'seafood-restaurant',
    verified: true,
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AW'
  },
  {
    id: 'fishionados-brixham',
    name: { text: 'Fishionados' },
    formattedAddress: '10 Summercourt Way, Brixham TQ5 0DY, UK',
    addressComponents: [
      { longText: '10', shortText: '10', types: ['street_number'] },
      { longText: 'Summercourt Way', shortText: 'Summercourt Way', types: ['route'] },
      { longText: 'Brixham', shortText: 'Brixham', types: ['postal_town'] },
      { longText: 'TQ5 0DY', shortText: 'TQ5 0DY', types: ['postal_code'] }
    ],
    location: { latitude: 50.385506199999995, longitude: -3.5301746 },
    rating: 4.4,
    reviewCount: 217,
    websiteUri: 'https://www.fishionados.co.uk/',
    businessStatus: 'OPERATIONAL',
    priceLevel: 'PRICE_LEVEL_INEXPENSIVE',
    primaryTypeDisplayName: { text: 'Takeout Restaurant' },
    nationalPhoneNumber: '01803 340908',
    category: 'fish-and-chips',
    subcategory: 'takeaway',
    verified: true,
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 0DY'
  },
  {
    id: 'davids-fish-chips',
    name: { text: "David's Fish & Chips" },
    formattedAddress: '64 Bolton St, Brixham TQ5 9DH, UK',
    addressComponents: [
      { longText: '64', shortText: '64', types: ['street_number'] },
      { longText: 'Bolton Street', shortText: 'Bolton St', types: ['route'] },
      { longText: 'Brixham', shortText: 'Brixham', types: ['postal_town'] },
      { longText: 'TQ5 9DH', shortText: 'TQ5 9DH', types: ['postal_code'] }
    ],
    location: { latitude: 50.3917463, longitude: -3.5145964 },
    rating: 4.5,
    reviewCount: 552,
    websiteUri: 'http://www.davids-chippy.co.uk/',
    businessStatus: 'OPERATIONAL',
    priceLevel: 'PRICE_LEVEL_MODERATE',
    primaryTypeDisplayName: { text: 'Takeout Restaurant' },
    nationalPhoneNumber: '01803 855771',
    category: 'fish-and-chips',
    subcategory: 'takeaway',
    verified: true,
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 9DH'
  }
];

// Copy the exact filter function from dataLoader.ts
function filterListings(listings, searchTerm = '', location = '') {
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

// Test with the actual data that the search page uses
console.log('Loading sample listings...');
const allListings = getSampleListings();
console.log(`Loaded ${allListings.length} listings:`);
allListings.forEach((listing, index) => {
  console.log(`${index + 1}. ${listing.name.text} (${listing.town})`);
});

console.log('\n=== TESTING FILTERING WITH ACTUAL DATA ===');

// Test 1: No filters (should return all)
console.log('\n1. No filters (should return all 5):');
const allResults = filterListings(allListings, '', '');
console.log(`Found ${allResults.length} results`);

// Test 2: Search for "rockfish"
console.log('\n2. Search for "rockfish":');
const rockfishResults = filterListings(allListings, 'rockfish', '');
console.log(`Found ${rockfishResults.length} results:`);
rockfishResults.forEach(r => console.log(`  - ${r.name.text}`));

// Test 3: Search for "pizza" (should find nothing)
console.log('\n3. Search for "pizza" (should find nothing):');
const pizzaResults = filterListings(allListings, 'pizza', '');
console.log(`Found ${pizzaResults.length} results`);

// Test 4: Location filter for "brixham"
console.log('\n4. Location filter for "brixham":');
const brixhamResults = filterListings(allListings, '', 'brixham');
console.log(`Found ${brixhamResults.length} results:`);
brixhamResults.forEach(r => console.log(`  - ${r.name.text} in ${r.town}`));

// Test 5: Location filter for "devon"
console.log('\n5. Location filter for "devon":');
const devonResults = filterListings(allListings, '', 'devon');
console.log(`Found ${devonResults.length} results:`);
devonResults.forEach(r => console.log(`  - ${r.name.text} in ${r.county}`));

// Test 6: Combined search
console.log('\n6. Search for "fish" in "brixham":');
const combinedResults = filterListings(allListings, 'fish', 'brixham');
console.log(`Found ${combinedResults.length} results:`);
combinedResults.forEach(r => console.log(`  - ${r.name.text}`));

// Test 7: Examine data structure for any inconsistencies
console.log('\n=== DATA STRUCTURE EXAMINATION ===');
const firstListing = allListings[0];
console.log('First listing structure:');
console.log('- ID:', firstListing.id);
console.log('- Name:', firstListing.name?.text);
console.log('- Address:', firstListing.formattedAddress);
console.log('- Town:', firstListing.town);
console.log('- County:', firstListing.county);
console.log('- Postcode:', firstListing.postcode);
console.log('- Primary Type:', firstListing.primaryTypeDisplayName?.text);

console.log('\n=== DEBUGGING COMPLETE ===');
