import type { APIRoute } from 'astro';
import { generateRobotsTxt } from '../utils/seo/sitemap';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.origin || 'https://chipfindr.co.uk';
  const robotsTxt = generateRobotsTxt(baseUrl);

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
};