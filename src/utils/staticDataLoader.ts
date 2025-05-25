// Static data loader for build-time data processing
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { BusinessListing } from '../types/BusinessListing';
import { transformBusinessData, type JSONDataFile } from './dataLoader';

// This will be populated at build time
let cachedListings: BusinessListing[] | null = null;

/**
 * Load business listings at build time - now dynamically reads all JSON files
 */
export function loadBusinessListingsSync(): BusinessListing[] {
  if (cachedListings) {
    return cachedListings;
  }

  const listings: BusinessListing[] = [];
  
  try {
    // Define the data directory path
    const dataDir = join(process.cwd(), 'data', 'listings');
    
    // Dynamically find all JSON files in the data directory
    const jsonFiles = readdirSync(dataDir).filter(file => file.endsWith('.json'));
    
    console.log(`📁 [StaticDataLoader] Found ${jsonFiles.length} data files for build-time processing`);
    
    for (const filename of jsonFiles) {
      try {
        const filePath = join(dataDir, filename);
        const fileContent = readFileSync(filePath, 'utf-8');
        const jsonData: JSONDataFile = JSON.parse(fileContent);
        
        if (jsonData.results && Array.isArray(jsonData.results)) {
          let transformedCount = 0;
          for (const result of jsonData.results) {
            try {
              const transformed = transformBusinessData(result);
              listings.push(transformed);
              transformedCount++;
            } catch (error) {
              console.warn(`Error transforming business data from ${filename}:`, error);
            }
          }
          console.log(`   ✅ [StaticDataLoader] Loaded ${transformedCount} businesses from ${filename}`);
        }
      } catch (fileError) {
        console.warn(`Error loading file ${filename}:`, fileError);
      }
    }
    
    cachedListings = listings;
    console.log(`🎉 [StaticDataLoader] Total businesses loaded: ${listings.length}`);
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