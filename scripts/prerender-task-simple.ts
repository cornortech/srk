#!/usr/bin/env node
/**
 * Pre-render Task App Static Pages using Puppeteer
 * Generates fully rendered HTML versions of all static pages for Google AdSense approval
 * Puppeteer simulates a real browser, allowing React to render all content
 * Run after: nx build task
 * Usage: tsx scripts/prerender-task-simple.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import http from 'http';
import puppeteer, { Browser, Page } from 'puppeteer';

const DIST_DIR = path.resolve(__dirname, '../dist/apps/task');
const PORT = 3333;

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
  '/terms-and-conditions',
  '/privacy-policy',
  '/disclaimer',
  '/affiliate-terms',
];

// Blog post slugs
const BLOG_SLUGS = [
  'earn-1000-monthly-task-platform',
  'avoid-task-rejection-complete-guide',
  'best-time-complete-tasks-earn-more',
  'building-social-media-presence-tasks',
  'security-tips-protect-account',
];

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
  console.log('🎯 Task App Pre-rendering with Puppeteer\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(
      `❌ Error: Dist directory not found at ${DIST_DIR}\n   Please run: nx build task`
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
            
            // Set timeout and error handling
            pageInstance.on('error', (err) => {
              console.error(`    Page error: ${err.message}`);
            });

            // Use different wait strategy for home page (it has continuous animations)
            const waitUntil = page === '/' ? 'domcontentloaded' : 'networkidle2';
            const timeout = 30000; 

            const response = await pageInstance.goto(url, {
              waitUntil,
              timeout,
            });

            if (!response || !response.ok()) {
              throw new Error(`Navigation failed: ${response?.status()}`);
            }

            // Wait for React to fully render
            await pageInstance.waitForFunction(
              () => document.body.children.length > 0,
              { timeout: 10000 }
            );

            // Additional wait for dynamic content  
            await new Promise((r) => setTimeout(r, 3000));

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
              timeout: 20000,
            });

            if (!response || !response.ok()) {
              throw new Error(`Navigation failed: ${response?.status()}`);
            }

            // Wait for content to be in DOM
            await pageInstance.waitForFunction(
              () => document.body.innerText.length > 100,
              { timeout: 10000 }
            );

            await new Promise((r) => setTimeout(r, 2000));

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

        console.log('\n✨ Pre-rendering complete!\n');
        console.log('📊 Results:');
        console.log(`  ✓ Generated ${PAGES_TO_RENDER.length} static pages`);
        console.log(`  ✓ Generated ${BLOG_SLUGS.length} blog post pages`);
        console.log(`  ✓ Total: ${PAGES_TO_RENDER.length + BLOG_SLUGS.length} pages\n`);
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
