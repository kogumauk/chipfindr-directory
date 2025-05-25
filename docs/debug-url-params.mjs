// Test the URL parameter extraction logic exactly as used in search.astro
console.log('=== URL PARAMETER EXTRACTION TEST ===');

// Simulate different URL scenarios
const testUrls = [
  'http://localhost:4321/search',
  'http://localhost:4321/search?q=rockfish',
  'http://localhost:4321/search?location=brixham',
  'http://localhost:4321/search?q=fish&location=devon',
  'http://localhost:4321/search?q=pizza&location=brixham'
];

testUrls.forEach(urlString => {
  console.log(`\n--- Testing URL: ${urlString} ---`);
  
  const url = new URL(urlString);
  const searchQuery = url.searchParams.get('q') || '';
  const locationQuery = url.searchParams.get('location') || '';
  
  console.log('Search params entries:', Array.from(url.searchParams.entries()));
  console.log('Search Query raw:', url.searchParams.get('q'));
  console.log('Search Query processed:', `"${searchQuery}"`);
  console.log('Location Query raw:', url.searchParams.get('location'));
  console.log('Location Query processed:', `"${locationQuery}"`);
  
  // Show what would be passed to filterListings
  console.log(`Would filter with: searchTerm="${searchQuery}", location="${locationQuery}"`);
});

console.log('\n=== FORM SUBMISSION SIMULATION ===');

// Simulate form data as it would be created by SearchBar
const formSubmissions = [
  { q: 'rockfish', location: '' },
  { q: '', location: 'brixham' },
  { q: 'fish', location: 'devon' },
  { q: 'pizza', location: 'brixham' }
];

formSubmissions.forEach((formData, index) => {
  console.log(`\n--- Form submission ${index + 1}: ---`);
  console.log('Form data:', formData);
  
  // Simulate URLSearchParams creation (as done in SearchBar)
  const params = new URLSearchParams();
  if (formData.q && formData.q.trim()) params.append('q', formData.q.trim());
  if (formData.location && formData.location.trim()) params.append('location', formData.location.trim());
  
  const searchUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
  console.log('Generated URL:', searchUrl);
  
  // Parse it back (as done in search.astro)
  const testUrl = new URL(`http://localhost:4321${searchUrl}`);
  const parsedQ = testUrl.searchParams.get('q') || '';
  const parsedLocation = testUrl.searchParams.get('location') || '';
  
  console.log('Parsed back - q:', `"${parsedQ}"`, 'location:', `"${parsedLocation}"`);
});

console.log('\n=== EDGE CASE TESTING ===');

// Test edge cases that might be causing issues
const edgeCases = [
  { desc: 'Empty strings', q: '', location: '' },
  { desc: 'Whitespace only', q: '   ', location: '   ' },
  { desc: 'URL encoded', q: 'fish+and+chips', location: 'devon' },
  { desc: 'Special characters', q: "david's", location: 'devon' },
  { desc: 'Case variations', q: 'ROCKFISH', location: 'BRIXHAM' }
];

edgeCases.forEach(testCase => {
  console.log(`\n--- Edge case: ${testCase.desc} ---`);
  console.log('Input:', testCase);
  
  const params = new URLSearchParams();
  if (testCase.q && testCase.q.trim()) params.append('q', testCase.q.trim());
  if (testCase.location && testCase.location.trim()) params.append('location', testCase.location.trim());
  
  const url = `/search${params.toString() ? '?' + params.toString() : ''}`;
  console.log('Generated URL:', url);
  
  // Parse and clean
  const testUrl = new URL(`http://localhost:4321${url}`);
  const cleanQ = testUrl.searchParams.get('q') || '';
  const cleanLocation = testUrl.searchParams.get('location') || '';
  
  console.log('Final values for filtering:', { searchTerm: cleanQ, location: cleanLocation });
});
