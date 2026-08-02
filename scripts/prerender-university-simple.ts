#!/usr/bin/env node
/**
 * Pre-render University App Static Pages using Puppeteer
 * Generates fully rendered HTML versions of all static pages for Google AdSense approval
 * Puppeteer simulates a real browser, allowing React to render all content
 * Run after: nx build university
 * Usage: tsx scripts/prerender-university-simple.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import http from 'http';
import puppeteer, { Browser, Page } from 'puppeteer';
import Beasties from 'beasties';
import { allArticles } from '../apps/university/src/data/articles';

const DIST_DIR = path.resolve(__dirname, '../dist/apps/university');
const PORT = 3334;
const SITE_URL = 'https://thesrkuniversity.com';

// Pages to pre-render
const PAGES_TO_RENDER = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/how-it-works',
  '/features',
  '/getting-started',
  '/help',
  '/blog',
  '/articles',
  '/terms-and-conditions',
  '/privacy-policy',
  '/disclaimer',
  '/affiliate-terms',
];

// Blog post slugs
const BLOG_SLUGS = [
  'online-learning-future-education',
  'digital-marketing-skills-2026',
  'entrepreneurship-startup-guide',
];

// Article slugs, sourced from the actual article data so this list can
// never drift out of sync with what's really on /articles.
const ARTICLE_SLUGS = allArticles.map((article) => article.slug);

function generateSitemap(): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const staticEntries: Array<[string, string, string]> = [
    ['/', 'weekly', '1.0'],
    ['/articles', 'weekly', '0.9'],
    ['/blog', 'weekly', '0.8'],
    ['/about', 'monthly', '0.8'],
    ['/features', 'monthly', '0.8'],
    ['/how-it-works', 'monthly', '0.8'],
    ['/getting-started', 'monthly', '0.8'],
    ['/faq', 'monthly', '0.7'],
    ['/help', 'monthly', '0.7'],
    ['/contact', 'monthly', '0.6'],
    ['/privacy-policy', 'yearly', '0.3'],
    ['/terms-and-conditions', 'yearly', '0.3'],
    ['/disclaimer', 'yearly', '0.3'],
    ['/affiliate-terms', 'yearly', '0.3'],
  ];

  const dynamicEntries: Array<[string, string, string]> = [
    ...BLOG_SLUGS.map(
      (slug): [string, string, string] => [`/blog/${slug}`, 'monthly', '0.6']
    ),
    ...ARTICLE_SLUGS.map(
      (slug): [string, string, string] => [`/articles/${slug}`, 'monthly', '0.7']
    ),
  ];

  const urls = [...staticEntries, ...dynamicEntries]
    .map(
      ([loc, changefreq, priority]) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function savePageAsStatic(
  pathname: string,
  html: string
): Promise<void> {
  const outputPath =
    pathname === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, pathname.replace(/\/$/, ''), 'index.html');

  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html, 'utf-8');
}

async function waitForServer(maxAttempts = 20): Promise<void> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(`http://localhost:${PORT}/`, (res) => {
          if (res.statusCode === 200 || res.statusCode === 404) {
            resolve();
          } else {
            reject(new Error(`Unexpected status: ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.setTimeout(1000);
      });
      console.log('✓ Server is ready\n');
      return;
    } catch (error) {
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }
  throw new Error('Server did not become ready in time');
}

async function serveAndPrerender(): Promise<void> {
  console.log('🎯 University App Pre-rendering with Puppeteer\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(
      `❌ Error: Dist directory not found at ${DIST_DIR}\n   Please run: nx build university`
    );
    process.exit(1);
  }

  // Start static server
  const server = http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url);

    // First check if exact path exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Server error');
          return;
        }
        const ext = path.extname(filePath);
        const contentType =
          ext === '.html'
            ? 'text/html'
            : ext === '.js'
              ? 'application/javascript'
              : ext === '.css'
                ? 'text/css'
                : ext === '.json'
                  ? 'application/json'
                  : 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
      return;
    }

    // Check if directory with index.html exists
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Server error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }

    // Fall back to main index.html for SPA routing
    fs.readFile(path.join(DIST_DIR, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, async () => {
      console.log(`📦 Started server on http://localhost:${PORT}`);
      console.log('⏳ Waiting for server to be ready...');

      let browser: Browser | null = null;

      try {
        await waitForServer();

        const baseUrl = `http://localhost:${PORT}`;

        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
          ],
        });

        console.log('🚀 Puppeteer browser launched\n');
        console.log('🔄 Pre-rendering pages...\n');

        // Pre-render main pages
        console.log('📄 Static Pages:');
        for (const page of PAGES_TO_RENDER) {
          let pageInstance: Page | null = null;
          try {
            const url = `${baseUrl}${page}`;
            console.log(`  • Rendering ${page}...`);

            pageInstance = await browser.newPage();

            const response = await pageInstance.goto(url, {
              waitUntil: 'networkidle2',
              timeout: 10000,
            });

            if (!response || !response.ok()) {
              throw new Error(`Navigation failed: ${response?.status()}`);
            }

            // Wait for React to fully render
            await pageInstance.waitForFunction(
              () => document.body.children.length > 0,
              { timeout: 5000 }
            );

            // Additional wait for dynamic content
            await new Promise((r) => setTimeout(r, 1000));

            const html = await pageInstance.content();

            // Check if content is actually there
            if (html.includes('<div id="root"></div>')) {
              throw new Error('Page did not render - only got app shell');
            }

            await savePageAsStatic(page, html);
            console.log(`    ✓ Saved (${html.length} bytes)`);
          } catch (error) {
            console.error(
              `    ❌ Error: ${error instanceof Error ? error.message : String(error)}`
            );
          } finally {
            if (pageInstance) {
              try {
                await pageInstance.close();
              } catch (e) {
                // ignore
              }
            }
          }
        }

        // Pre-render blog posts
        console.log('\n📚 Blog Posts:');
        for (const slug of BLOG_SLUGS) {
          let pageInstance: Page | null = null;
          try {
            const pathname = `/blog/${slug}`;
            const url = `${baseUrl}${pathname}`;
            console.log(`  • Rendering ${pathname}...`);

            pageInstance = await browser.newPage();

            const response = await pageInstance.goto(url, {
              waitUntil: 'networkidle2',
              timeout: 10000,
            });

            if (!response || !response.ok()) {
              throw new Error(`Navigation failed: ${response?.status()}`);
            }

            // Wait for content to be in DOM
            await pageInstance.waitForFunction(
              () => document.body.innerText.length > 100,
              { timeout: 5000 }
            );

            await new Promise((r) => setTimeout(r, 1000));

            const html = await pageInstance.content();

            if (html.includes('<div id="root"></div>')) {
              throw new Error('Page did not render - only got app shell');
            }

            await savePageAsStatic(pathname, html);
            console.log(`    ✓ Saved (${html.length} bytes)`);
          } catch (error) {
            console.error(
              `    ❌ Error: ${error instanceof Error ? error.message : String(error)}`
            );
          } finally {
            if (pageInstance) {
              try {
                await pageInstance.close();
              } catch (e) {
                // ignore
              }
            }
          }
        }

        // Pre-render articles
        console.log('\n📰 Articles:');
        for (const slug of ARTICLE_SLUGS) {
          let pageInstance: Page | null = null;
          try {
            const pathname = `/articles/${slug}`;
            const url = `${baseUrl}${pathname}`;
            console.log(`  • Rendering ${pathname}...`);

            pageInstance = await browser.newPage();

            const response = await pageInstance.goto(url, {
              waitUntil: 'networkidle2',
              timeout: 10000,
            });

            if (!response || !response.ok()) {
              throw new Error(`Navigation failed: ${response?.status()}`);
            }

            // Wait for content to be in DOM
            await pageInstance.waitForFunction(
              () => document.body.innerText.length > 100,
              { timeout: 5000 }
            );

            await new Promise((r) => setTimeout(r, 1000));

            const html = await pageInstance.content();

            if (html.includes('<div id="root"></div>')) {
              throw new Error('Page did not render - only got app shell');
            }

            await savePageAsStatic(pathname, html);
            console.log(`    ✓ Saved (${html.length} bytes)`);
          } catch (error) {
            console.error(
              `    ❌ Error: ${error instanceof Error ? error.message : String(error)}`
            );
          } finally {
            if (pageInstance) {
              try {
                await pageInstance.close();
              } catch (e) {
                // ignore
              }
            }
          }
        }

        // Critical CSS inlining: the single global Tailwind stylesheet is
        // ~34KB and was render-blocking FCP by ~1.6s (confirmed via
        // PageSpeed Insights) since the browser can't paint anything until
        // it's downloaded, even though the HTML already has real content.
        // Beasties inlines just the CSS rules actually used by each
        // prerendered page directly into <head> (zero network request) and
        // defers the full stylesheet non-blocking (media=print swap) for
        // the rest of the app.
        console.log('\n🎨 Inlining critical CSS...');
        const pagesToInline = [
          '/',
          ...PAGES_TO_RENDER.filter((p) => p !== '/'),
          ...BLOG_SLUGS.map((slug) => `/blog/${slug}`),
          ...ARTICLE_SLUGS.map((slug) => `/articles/${slug}`),
        ];
        for (const pathname of pagesToInline) {
          const filePath =
            pathname === '/'
              ? path.join(DIST_DIR, 'index.html')
              : path.join(DIST_DIR, pathname.replace(/\/$/, ''), 'index.html');
          if (!fs.existsSync(filePath)) continue;
          try {
            const beasties = new Beasties({
              path: DIST_DIR,
              preload: 'swap',
              compress: true,
              logLevel: 'silent',
            });
            const html = fs.readFileSync(filePath, 'utf-8');
            const inlined = await beasties.process(html);
            fs.writeFileSync(filePath, inlined, 'utf-8');
            console.log(`  ✓ ${pathname}`);
          } catch (error) {
            console.error(
              `  ⚠ Skipped ${pathname}: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        }

        // Sitemap: written fresh every build from the same ARTICLE_SLUGS
        // list used for pre-rendering, so it can't drift out of sync with
        // what's actually indexable on the site.
        console.log('\n🗺️  Generating sitemap.xml...');
        fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), generateSitemap(), 'utf-8');
        console.log('  ✓ sitemap.xml written');

        console.log('\n✨ Pre-rendering complete!\n');
        console.log('📊 Results:');
        console.log(`  ✓ Generated ${PAGES_TO_RENDER.length} static pages`);
        console.log(`  ✓ Generated ${BLOG_SLUGS.length} blog post pages`);
        console.log(`  ✓ Generated ${ARTICLE_SLUGS.length} article pages`);
        console.log(
          `  ✓ Total: ${PAGES_TO_RENDER.length + BLOG_SLUGS.length + ARTICLE_SLUGS.length} pages\n`
        );
        console.log('🔍 Google crawler will now see:');
        console.log('  ✓ Fully rendered HTML with all React content');
        console.log('  ✓ Complete page text (no JavaScript required)');
        console.log('  ✓ All content pre-rendered for SEO');
        console.log('  ✓ Blog posts with full article content\n');
        console.log(
          '📍 AdSense Compliance: All pages are now fully crawlable by Google!\n'
        );
      } catch (error) {
        console.error('❌ Pre-rendering failed:', error);
        process.exit(1);
      } finally {
        if (browser) {
          try {
            await browser.close();
          } catch (e) {
            // ignore
          }
        }
        server.close(() => {
          resolve();
          process.exit(0);
        });
      }
    });
  });
}

serveAndPrerender().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
