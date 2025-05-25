import { promises as fs } from 'fs';
import path from 'path';
import { collections } from '../src/content/config.ts';

const businessListingSchema = collections.listings.schema;

const DATA_DIR = './data/listings';
const PROCESSED_DATA_DIR = './processed_data';

async function processListings() {
  console.log('Starting business listings processing...');

  // Ensure processed_data directory exists
  await fs.mkdir(PROCESSED_DATA_DIR, { recursive: true });

  const validListings = [];
  const erroneousData = [];
  let totalFilesProcessed = 0;
  let totalListingsProcessed = 0;
  let totalValidListings = 0;
  let totalErroneousListings = 0;

  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log(`No JSON files found in ${DATA_DIR}.`);
      return;
    }

    for (const file of jsonFiles) {
      totalFilesProcessed++;
      const filePath = path.join(DATA_DIR, file);
      console.log(`Processing file: ${file}`);

      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        const metadata = jsonData.metadata || {};
        const results = jsonData.results || [];

        if (!Array.isArray(results)) {
          console.warn(`Skipping file ${file}: 'results' is not an array.`);
          erroneousData.push({
            file,
            error: "'results' field is not an array",
            metadata,
            originalData: jsonData,
          });
          continue;
        }

        for (let i = 0; i < results.length; i++) {
          totalListingsProcessed++;
          const sourceListing = results[i];

          // Manually map fields from sourceListing to match businessListingSchema
          const transformedListing = {
            id: sourceListing.id,
            name: sourceListing.displayName ? { text: sourceListing.displayName.text, languageCode: sourceListing.displayName.languageCode } : undefined,
            formattedAddress: sourceListing.formattedAddress,
            addressComponents: sourceListing.addressComponents,
            location: sourceListing.location,
            websiteUri: sourceListing.websiteUri || undefined, // Handle missing or empty
            adrFormatAddress: sourceListing.adrFormatAddress || undefined,
            businessStatus: sourceListing.businessStatus || undefined,
            priceLevel: sourceListing.priceLevel || undefined,
            primaryTypeDisplayName: sourceListing.primaryTypeDisplayName ? { text: sourceListing.primaryTypeDisplayName.text, languageCode: sourceListing.primaryTypeDisplayName.languageCode } : undefined,
            currentOpeningHours: sourceListing.currentOpeningHours || undefined,
            primaryType: sourceListing.primaryType || undefined,
            priceRange: sourceListing.priceRange || undefined,
            nationalPhoneNumber: sourceListing.nationalPhoneNumber || undefined,
            internationalPhoneNumber: sourceListing.internationalPhoneNumber || undefined,
            
            // Optional fields from schema, set to undefined if not present or mapped
            category: undefined,
            subcategory: undefined,
            description: undefined,
            images: undefined,
            verified: undefined,
            rating: sourceListing.rating || undefined,
            reviewCount: sourceListing.userRatingCount || undefined, // Mapping userRatingCount to reviewCount
            createdAt: undefined,
            updatedAt: undefined,
          };

          const validationResult = businessListingSchema.safeParse(transformedListing);

          if (validationResult.success) {
            validListings.push(validationResult.data);
            totalValidListings++;
          } else {
            totalErroneousListings++;
            erroneousData.push({
              file,
              listingIndex: i,
              originalListing: sourceListing,
              errors: validationResult.error.issues,
              metadata,
            });
            console.error(`Validation error in ${file}, listing index ${i}:`, validationResult.error.issues);
          }
        }
      } catch (parseError) {
        console.error(`Error processing file ${file}:`, parseError.message);
        erroneousData.push({
          file,
          error: `File parsing error: ${parseError.message}`,
          originalData: null,
        });
      }
    }

    // Write valid listings to file
    await fs.writeFile(
      path.join(PROCESSED_DATA_DIR, 'validListings.json'),
      JSON.stringify(validListings, null, 2),
      'utf8'
    );
    console.log(`Successfully wrote ${validListings.length} valid listings to validListings.json`);

    // Write erroneous data to file
    await fs.writeFile(
      path.join(PROCESSED_DATA_DIR, 'erroneousData.json'),
      JSON.stringify(erroneousData, null, 2),
      'utf8'
    );
    console.log(`Successfully wrote ${erroneousData.length} erroneous data entries to erroneousData.json`);

  } catch (dirError) {
    console.error(`Error reading data directory ${DATA_DIR}:`, dirError.message);
  } finally {
    console.log('\n--- Processing Summary ---');
    console.log(`Total files processed: ${totalFilesProcessed}`);
    console.log(`Total listings processed: ${totalListingsProcessed}`);
    console.log(`Total valid listings: ${totalValidListings}`);
    console.log(`Total erroneous listings: ${totalErroneousListings}`);
    console.log('Processing complete.');
  }
}

processListings();