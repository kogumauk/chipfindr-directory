import { loadAllBusinessListings, getFeaturedBusinesses } from './src/utils/dataLoader.ts';

console.log('Testing data loader...');

try {
  console.log('Loading all businesses...');
  const businesses = await loadAllBusinessListings();
  console.log(`Loaded ${businesses.length} businesses`);
  
  if (businesses.length > 0) {
    console.log('First business:', businesses[0].name.text);
    console.log('First business address:', businesses[0].formattedAddress);
  }
  
  console.log('Loading featured businesses...');
  const featured = await getFeaturedBusinesses(3);
  console.log(`Featured businesses: ${featured.length}`);
  
  featured.forEach((business, index) => {
    console.log(`${index + 1}. ${business.name.text} - Rating: ${business.rating} (${business.reviewCount} reviews)`);
  });
  
} catch (error) {
  console.error('Error testing data loader:', error);
}
