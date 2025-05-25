// Static data loader for build-time data processing
import { readFileSync } from 'fs';
import { join } from 'path';
import type { BusinessListing } from '../types/BusinessListing';
import { transformBusinessData, type JSONDataFile } from './dataLoader';

// This will be populated at build time
let cachedListings: BusinessListing[] | null = null;

/**
 * Load business listings at build time
 */
export function loadBusinessListingsSync(): BusinessListing[] {
  if (cachedListings) {
    return cachedListings;
  }

  const listings: BusinessListing[] = [];
  
  try {
    // Define the data directory path
    const dataDir = join(process.cwd(), 'data', 'listings');
    
    // List of JSON files to load
    const jsonFiles = [
      '20250420_2311_Fish_and_Chip_shops_in_Brixham,_Devon.json',
      '20250420_2311_Fish_and_Chip_shops_in_Budleigh_Salterton,_Devon.json'
    ];
    
    for (const filename of jsonFiles) {
      try {
        const filePath = join(dataDir, filename);
        const fileContent = readFileSync(filePath, 'utf-8');
        const jsonData: JSONDataFile = JSON.parse(fileContent);
        
        if (jsonData.results && Array.isArray(jsonData.results)) {
          for (const result of jsonData.results) {
            try {
              const transformed = transformBusinessData(result);
              listings.push(transformed);
            } catch (error) {
              console.warn(`Error transforming business data from ${filename}:`, error);
            }
          }
        }
      } catch (fileError) {
        console.warn(`Error loading file ${filename}:`, fileError);
      }
    }
    
    cachedListings = listings;
    return listings;
    
  } catch (error) {
    console.error('Error loading business listings:', error);
    return [];
  }
}

/**
 * Get real business listings from loaded data
 */
export function getSampleListings(): BusinessListing[] {
  return loadBusinessListingsSync();
}
