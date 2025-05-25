import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const JSON_FILE_PATH = './processed_data/validListings.json';
const SUPABASE_TABLE_NAME = 'business_listings';

async function syncListings() {
  let listings;
  try {
    const fileContent = readFileSync(JSON_FILE_PATH, 'utf-8');
    listings = JSON.parse(fileContent);
    console.log(`Successfully read and parsed ${listings.length} listings from ${JSON_FILE_PATH}`);
  } catch (error) {
    console.error(`Error reading or parsing JSON file: ${error.message}`);
    return;
  }

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL and Key are required.');
    console.error('Please ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set in your .env file.');
    process.exit(1); // Exit if credentials are not found
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let successfulUpserts = 0;
  let failedUpserts = 0;

  for (const listing of listings) {
    try {
      const recordToUpsert = {
        id: listing.id,
        name: listing.name,
        formatted_address: listing.formattedAddress,
        address_components: listing.addressComponents,
        location: listing.location,
        website_uri: listing.websiteUri || null,
        adr_format_address: listing.adrFormatAddress || null,
        business_status: listing.businessStatus || null,
        price_level: listing.priceLevel || null,
        primary_type_display_name: listing.primaryTypeDisplayName || null,
        current_opening_hours: listing.currentOpeningHours || null,
        primary_type: listing.primaryType || null,
        price_range: listing.priceRange || null,
        national_phone_number: listing.nationalPhoneNumber || null,
        international_phone_number: listing.internationalPhoneNumber || null,
        category: listing.category || null,
        subcategory: listing.subcategory || null,
        description: listing.description || null,
        images: listing.images || null,
        verified: listing.verified || null,
        rating: listing.rating || null,
        review_count: listing.reviewCount || null,
        // createdAt and updatedAt will be handled by Supabase defaults or triggers
        // raw_json_data: listing, // Uncomment if you add this column to your table
      };

      const { data, error } = await supabase
        .from(SUPABASE_TABLE_NAME)
        .upsert(recordToUpsert, {
          onConflict: 'id',
        })
        .select();

      if (error) {
        console.error(`Error upserting listing ${listing.id}: ${error.message}`);
        failedUpserts++;
      } else {
        successfulUpserts++;
      }
    } catch (error) {
      console.error(`Unexpected error during upsert for listing ${listing.id}: ${error.message}`);
      failedUpserts++;
    }
  }

  console.log('\n--- Sync Summary ---');
  console.log(`Total listings processed: ${listings.length}`);
  console.log(`Successfully upserted: ${successfulUpserts}`);
  console.log(`Failed upserts: ${failedUpserts}`);
}

syncListings();