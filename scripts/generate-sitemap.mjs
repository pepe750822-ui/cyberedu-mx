import fs from 'fs';
import { areas } from '../src/data/areas.ts';
import { blogPosts } from '../src/data/blogData.ts';

const DOMAIN = 'https://cyberedumx.com';
const TODAY = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/simulador-pro', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.7', changefreq: 'daily' },
  { path: '/tokens', priority: '0.5', changefreq: 'monthly' },
  { path: '/sugerencias', priority: '0.3', changefreq: 'monthly' },
  { path: '/modalidades', priority: '0.5', changefreq: 'monthly' },
  { path: '/certificaciones', priority: '0.5', changefreq: 'monthly' },
  { path: '/reportes', priority: '0.4', changefreq: 'monthly' },
  { path: '/marketing', priority: '0.4', changefreq: 'monthly' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Static Routes
staticRoutes.forEach(route => {
  xml += `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
});

xml += `\n  <!-- Blog Posts -->\n`;
blogPosts.forEach(post => {
  xml += `  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>0.7</priority>
  </url>\n`;
});

xml += `\n  <!-- Educational Areas & Videos -->\n`;
areas.forEach(area => {
  // Area landing
  xml += `  <url>
    <loc>${DOMAIN}/area/${area.id}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>0.9</priority>
  </url>\n`;
  
  // Videos in area
  area.videos.forEach(video => {
    xml += `  <url>
      <loc>${DOMAIN}/area/${area.id}?video=${video.id}</loc>
      <lastmod>${TODAY}</lastmod>
      <priority>0.6</priority>
    </url>\n`;
  });
});

xml += `</urlset>`;

fs.writeFileSync('./public/sitemap.xml', xml);
console.log('✅ sitemap.xml generado exitosamente con ' + (staticRoutes.length + blogPosts.length + areas.length + areas.reduce((a, b) => a + b.videos.length, 0)) + ' rutas.');
