// Test search functionality with sample data (JavaScript version)

// Sample data (copied from staticDataLoader.ts)
const sampleListings = [
  {
    id: 'brixham-fish-restaurant',
    name: { text: 'Brixham Fish Restaurant & Takeaway' },
    formattedAddress: '22 The Quay, Brixham TQ5 8AW, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AW'
  },
  {
    id: 'simply-fish-brixham',
    name: { text: 'Simply Fish' },
    formattedAddress: '68-74 Fore St, Brixham TQ5 8AF, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AF'
  },
  {
    id: 'rockfish-brixham',
    name: { text: 'Rockfish' },
    formattedAddress: 'New Fish Quay, Brixham TQ5 8AW, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 8AW'
  },
  {
    id: 'fishionados-brixham',
    name: { text: 'Fishionados' },
    formattedAddress: '10 Summercourt Way, Brixham TQ5 0DY, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 0DY'
  },
  {
    id: 'davids-fish-chips',
    name: { text: "David's Fish & Chips" },
    formattedAddress: '64 Bolton St, Brixham TQ5 9DH, UK',
    town: 'Brixham',
    county: 'Devon',
    postcode: 'TQ5 9DH'
  }
];

// Filter function (copied from dataLoader.ts)
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

console.log('=== SEARCH FUNCTIONALITY TEST ===');

console.log(`Loaded ${sampleListings.length} sample listings:`);
sampleListings.forEach((listing, index) => {
  console.log(`${index + 1}. ${listing.name.text} - ${listing.town}`);
});

console.log('\n=== TESTING SEARCH FILTERS ===');

// Test 1: Search by business name
console.log('\n1. Search for "rockfish":');
const rockfishResults = filterListings(sampleListings, 'rockfish', '');
console.log(`Found ${rockfishResults.length} results:`);
rockfishResults.forEach(result => console.log(`  - ${result.name.text}`));

// Test 2: Search by location
console.log('\n2. Search by location "brixham":');
const brixhamResults = filterListings(sampleListings, '', 'brixham');
console.log(`Found ${brixhamResults.length} results:`);
brixhamResults.forEach(result => console.log(`  - ${result.name.text} in ${result.town}`));

// Test 3: Search by food type
console.log('\n3. Search for "fish":');
const fishResults = filterListings(sampleListings, 'fish', '');
console.log(`Found ${fishResults.length} results:`);
fishResults.forEach(result => console.log(`  - ${result.name.text}`));

// Test 4: Combined search
console.log('\n4. Search for "fish" in "brixham":');
const combinedResults = filterListings(sampleListings, 'fish', 'brixham');
console.log(`Found ${combinedResults.length} results:`);
combinedResults.forEach(result => console.log(`  - ${result.name.text} in ${result.town}`));

// Test 5: No results
console.log('\n5. Search for "pizza" (should find nothing):');
const noResults = filterListings(sampleListings, 'pizza', '');
console.log(`Found ${noResults.length} results`);

// Test 6: Case sensitivity
console.log('\n6. Test case sensitivity - search for "ROCKFISH":');
const caseResults = filterListings(sampleListings, 'ROCKFISH', '');
console.log(`Found ${caseResults.length} results:`);
caseResults.forEach(result => console.log(`  - ${result.name.text}`));

// Test 7: Partial matches
console.log('\n7. Search for "david":');
const partialResults = filterListings(sampleListings, 'david', '');
console.log(`Found ${partialResults.length} results:`);
partialResults.forEach(result => console.log(`  - ${result.name.text}`));

console.log('\n=== SEARCH TEST COMPLETE ===');
