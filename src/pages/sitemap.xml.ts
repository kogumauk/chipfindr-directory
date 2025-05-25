import type { APIRoute } from 'astro';
import { generateSitemapUrls, generateSitemapXML } from '../utils/seo/sitemap';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.origin || 'https://chipfindr.co.uk';
  const urls = generateSitemapUrls(baseUrl);
  const sitemapXML = generateSitemapXML(urls);

  return new Response(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};