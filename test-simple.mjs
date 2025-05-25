import fs from 'fs';
import path from 'path';

console.log('Testing JSON data loading...');

try {
  const dataDir = path.join(process.cwd(), 'data', 'listings');
  console.log('Data directory:', dataDir);
  
  const files = fs.readdirSync(dataDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  console.log('Found JSON files:', jsonFiles);
  
  let totalBusinesses = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    console.log(`File: ${file}`);
    console.log(`  Results: ${data.results.length}`);
    console.log(`  Query: ${data.metadata.request_parameters.textQuery}`);
    
    if (data.results.length > 0) {
      const firstBusiness = data.results[0];
      console.log(`  First business: ${firstBusiness.displayName.text}`);
      console.log(`  Address: ${firstBusiness.formattedAddress}`);
      console.log(`  Rating: ${firstBusiness.rating || 'N/A'}`);
    }
    
    totalBusinesses += data.results.length;
    console.log('---');
  }
  
  console.log(`Total businesses loaded: ${totalBusinesses}`);
  
} catch (error) {
  console.error('Error:', error);
}
