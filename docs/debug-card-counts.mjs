// Complete end-to-end test of search functionality
console.log('=== COMPLETE SEARCH FUNCTIONALITY TEST ===');

// Copy the exact data and functions
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
    primaryTypeDisplayName: { text: 'Restaurant' }
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
    primaryTypeDisplayName: { text: 'Seafood Restaurant' }
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
    primaryTypeDisplayName: { text: 'Seafood Restaurant' }
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
    primaryTypeDisplayName: { text: 'Takeout Restaurant' }
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
    primaryTypeDisplayName: { text: 'Takeout Restaurant' }
  }
];

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

// Test scenarios that should show different numbers of cards
const testScenarios = [
  { desc: 'No search - should show ALL 5 cards', url: '/search', expectedCount: 5 },
  { desc: 'Search for "rockfish" - should show 1 card', url: '/search?q=rockfish', expectedCount: 1 },
  { desc: 'Search for "pizza" - should show 0 cards', url: '/search?q=pizza', expectedCount: 0 },
  { desc: 'Search for "restaurant" - should show 3 cards', url: '/search?q=restaurant', expectedCount: 3 },
  { desc: 'Search for "takeout" - should show 2 cards', url: '/search?q=takeout', expectedCount: 2 },
  { desc: 'Location devon - should show ALL 5 cards', url: '/search?location=devon', expectedCount: 5 },
  { desc: 'Location TQ5 8AW - should show 2 cards', url: '/search?location=TQ5%208AW', expectedCount: 2 },
  { desc: 'Fish + Brixham - should show 5 cards', url: '/search?q=fish&location=brixham', expectedCount: 5 },
  { desc: 'Pizza + Brixham - should show 0 cards', url: '/search?q=pizza&location=brixham', expectedCount: 0 }
];

console.log('\n=== TESTING EXPECTED CARD COUNTS ===');

testScenarios.forEach(scenario => {
  console.log(`\n--- ${scenario.desc} ---`);
  console.log(`URL: ${scenario.url}`);
  
  // Simulate what search.astro does
  const testUrl = new URL(`http://localhost:4321${scenario.url}`);
  const searchQuery = testUrl.searchParams.get('q') || '';
  const locationQuery = testUrl.searchParams.get('location') || '';
  
  console.log(`Parameters: searchQuery="${searchQuery}", locationQuery="${locationQuery}"`);
  
  // Get all listings and filter them
  const allListings = getSampleListings();
  const filteredListings = filterListings(allListings, searchQuery, locationQuery);
  
  console.log(`Expected: ${scenario.expectedCount} cards`);
  console.log(`Actual: ${filteredListings.length} cards`);
  
  if (filteredListings.length !== scenario.expectedCount) {
    console.log('❌ MISMATCH!');
  } else {
    console.log('✅ CORRECT');
  }
  
  if (filteredListings.length > 0) {
    console.log('Cards that should be displayed:');
    filteredListings.forEach((listing, index) => {
      console.log(`  ${index + 1}. ${listing.name.text}`);
    });
  } else {
    console.log('No cards should be displayed');
  }
});

console.log('\n=== SPECIAL CASE ANALYSIS ===');

// Test the specific case you mentioned where search terms don't affect results
console.log('\n--- Debugging: Why does search have no effect? ---');

const allListings = getSampleListings();
console.log(`Total listings available: ${allListings.length}`);

// Test if ANY search term reduces the count
const searchTerms = ['rockfish', 'pizza', 'nonexistent', 'xyz123'];
searchTerms.forEach(term => {
  const filtered = filterListings(allListings, term, '');
  console.log(`Search "${term}": ${filtered.length} results (should be less than 5 if working)`);
});

// Test if location filtering works
const locations = ['devon', 'brixham', 'london', 'nonexistent'];
locations.forEach(loc => {
  const filtered = filterListings(allListings, '', loc);
  console.log(`Location "${loc}": ${filtered.length} results`);
});
