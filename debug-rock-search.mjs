// Test specifically for "Rock" search issue

// Sample data (exact copy from staticDataLoader)
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

// Current filter function
function filterListings(listings, searchTerm = '', location = '') {
  console.log('=== DETAILED ROCK SEARCH DEBUG ===');
  console.log('SearchTerm:', `"${searchTerm}"`);
  console.log('Location:', `"${location}"`);
  console.log('Total listings:', listings.length);
  
  const results = listings.filter(listing => {
    const nameText = listing.name.text.toLowerCase();
    const addressText = listing.formattedAddress.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    console.log(`\nChecking: "${listing.name.text}"`);
    console.log(`  Name: "${nameText}"`);
    console.log(`  Search term: "${searchLower}"`);
    console.log(`  Name includes search: ${nameText.includes(searchLower)}`);
    console.log(`  Address includes search: ${addressText.includes(searchLower)}`);
    
    const matchesSearch = !searchTerm || 
      nameText.includes(searchLower) ||
      addressText.includes(searchLower) ||
      (listing.primaryTypeDisplayName?.text || '').toLowerCase().includes(searchLower);
    
    const matchesLocation = !location || 
      listing.town?.toLowerCase().includes(location.toLowerCase()) ||
      listing.county?.toLowerCase().includes(location.toLowerCase()) ||
      listing.postcode?.toLowerCase().includes(location.toLowerCase()) ||
      listing.formattedAddress.toLowerCase().includes(location.toLowerCase());
    
    console.log(`  Matches search: ${matchesSearch}`);
    console.log(`  Matches location: ${matchesLocation}`);
    console.log(`  Final result: ${matchesSearch && matchesLocation}`);
    
    return matchesSearch && matchesLocation;
  });
  
  console.log(`\nFinal results: ${results.length}`);
  results.forEach(r => console.log(`  - ${r.name.text}`));
  console.log('=== END DETAILED DEBUG ===');
  
  return results;
}

console.log('=== SPECIFIC "Rock" SEARCH TEST ===');

// Test the exact scenario
console.log('\n1. Testing search for "Rock":');
const rockResults = filterListings(sampleListings, 'Rock', '');

console.log('\n2. Testing search for "rock" (lowercase):');
const rockLowerResults = filterListings(sampleListings, 'rock', '');

console.log('\n3. Testing search for "Rockfish" (full name):');
const rockfishResults = filterListings(sampleListings, 'Rockfish', '');

console.log('\n4. Manual check of Rockfish name:');
const rockfishListing = sampleListings.find(l => l.id === 'rockfish-brixham');
if (rockfishListing) {
  console.log('Rockfish listing found:');
  console.log('  Name:', rockfishListing.name.text);
  console.log('  Name length:', rockfishListing.name.text.length);
  console.log('  Name chars:', rockfishListing.name.text.split('').map(c => `'${c}'`).join(', '));
  console.log('  Includes "Rock":', rockfishListing.name.text.toLowerCase().includes('rock'));
}
