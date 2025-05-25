import type { BusinessListing } from '../../types/BusinessListing';
import { getSampleListings } from '../staticDataLoader';
import { extractLocations } from '../locationUtils';
import { generateBusinessSlug } from '../formatters';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate all sitemap URLs for the ChipFindr website
 */
export function generateSitemapUrls(baseUrl: string = 'https://chipfindr.co.uk'): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const now = new Date().toISOString();
  
  // Static pages
  urls.push(
    {
      loc: baseUrl,
      lastmod: now,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/search`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/location`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    }
  );

  // Business pages
  const allListings = getSampleListings();
  allListings.forEach(business => {
    const slug = generateBusinessSlug(business);
    urls.push({
      loc: `${baseUrl}/business/${slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  // Location pages
  const locations = extractLocations(allListings);
  locations.forEach(location => {
    urls.push({
      loc: `${baseUrl}/location/${location.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: location.type === 'town' ? 0.8 : 0.6
    });
  });

  return urls;
}

/**
 * Generate XML sitemap content
 */
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlsXml = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(baseUrl: string = 'https://chipfindr.co.uk'): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1

# Block access to admin/internal pages when they exist
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/
Disallow: /temp/
Disallow: /debug/
`;
}