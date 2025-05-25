#!/usr/bin/env node

/**
 * Generate PWA assets script
 * Creates required icon sizes and manifest from SVG source
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');

// Ensure directories exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Create placeholder PNG files (in a real project, you'd convert SVG to PNG)
const iconSizes = [192, 512];
const svgIcon = `
<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="{size}" height="{size}" rx="24" fill="#1e40af"/>
<text x="{centerX}" y="{centerY}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="{fontSize}" font-weight="bold">C</text>
</svg>
`;

iconSizes.forEach(size => {
  const centerX = size / 2;
  const centerY = (size / 2) + (size * 0.1);
  const fontSize = size * 0.4;
  
  const svg = svgIcon
    .replace(/{size}/g, size.toString())
    .replace(/{centerX}/g, centerX.toString())
    .replace(/{centerY}/g, centerY.toString())
    .replace(/{fontSize}/g, fontSize.toString());
  
  fs.writeFileSync(path.join(ICONS_DIR, `pwa-${size}x${size}.svg`), svg);
});

// Create Apple Touch Icon
const appleTouchIcon = `
<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="180" height="180" rx="20" fill="#1e40af"/>
<text x="90" y="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="bold">C</text>
</svg>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.svg'), appleTouchIcon);

// Create favicon
const favicon = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="4" fill="#1e40af"/>
<text x="16" y="22" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">C</text>
</svg>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), favicon);

// Create mask icon for Safari
const maskIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="16" height="16" rx="2" fill="black"/>
<text x="8" y="12" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" font-weight="bold">C</text>
</svg>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'mask-icon.svg'), maskIcon);

console.log('✅ PWA assets generated successfully!');
console.log('📁 Generated files:');
console.log('  - favicon.svg');
console.log('  - apple-touch-icon.svg');
console.log('  - mask-icon.svg');
iconSizes.forEach(size => {
  console.log(`  - icons/pwa-${size}x${size}.svg`);
});

console.log('\n🔄 Note: For production, convert SVG files to PNG using a tool like sharp or an online converter.');
console.log('📝 PWA icons should be PNG format for better browser compatibility.');