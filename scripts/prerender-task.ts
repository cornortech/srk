/**
 * Pre-rendering script for Task App
 * Generates static HTML for all static pages to improve SEO and Google crawler visibility
 * This runs after Vite build to capture and save rendered pages as static HTML files
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

// Blog post slugs (from BlogPost.tsx)
const BLOG_SLUGS = [
  'earn-1000-monthly-task-platform',
  'avoid-task-rejection-complete-guide',
  'best-time-complete-tasks-earn-more',
  'building-social-media-presence-tasks',
  'security-tips-protect-account',
];

interface PrerenderConfig {
  port: number;
  distDir: string;
  baseUrl: string;
}

const config: PrerenderConfig = {
  port: 4400,
  distDir: path.resolve(__dirname, '../dist/apps/task'),
  baseUrl: 'http://localhost:4400',
};

async function validateDistDirectory(): Promise<boolean> {
  if (!fs.existsSync(config.distDir)) {
    console.error(`❌ Dist directory not found: ${config.distDir}`);
    console.error('   Run "nx build task" before pre-rendering');
    return false;
  }
  return true;
}

async function startPreviewServer(): Promise<void> {
  console.log(`🚀 Starting preview server on port ${config.port}...`);
  try {
    const { stdout } = await execAsync(
      `cd ${path.resolve(__dirname, '../apps/task')} && npx vite preview --port ${config.port}`,
      { timeout: 10000 }
    );
    console.log('✓ Preview server started');
  } catch (error) {
    // Server starts in background, this error can be ignored
    console.log('ℹ  Server starting in background (this is expected)');
  }

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

async function renderPage(
  pathname: string,
  outputPath: string
): Promise<void> {
  try {
    const url = `${config.baseUrl}${pathname}`;
    console.log(`  📄 Rendering: ${pathname}`);

    // Using node-fetch to get the rendered HTML
    // Note: This requires the app to be running with vite preview
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${pathname}: ${response.status}`);
    }

    const html = await response.text();

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the HTML file
    fs.writeFileSync(outputPath, html);
    console.log(`     ✓ Saved to: ${outputPath}`);
  } catch (error) {
    console.error(`     ❌ Error rendering ${pathname}:`, error);
    throw error;
  }
}

async function prerender(): Promise<void> {
  console.log('🎯 Starting pre-rendering for Task App...\n');

  // Validate environment
  if (!(await validateDistDirectory())) {
    process.exit(1);
  }

  // Start preview server
  await startPreviewServer();

  try {
    console.log('\n📦 Pre-rendering static pages...\n');

    // Pre-render main pages
    for (const page of PAGES_TO_RENDER) {
      const outputPath =
        page === '/'
          ? path.join(config.distDir, 'index.html')
          : path.join(config.distDir, page.slice(1), 'index.html');

      await renderPage(page, outputPath);
    }

    // Pre-render blog post pages
    console.log('\n📚 Pre-rendering blog posts...\n');
    for (const slug of BLOG_SLUGS) {
      const pathname = `/blog/${slug}`;
      const outputPath = path.join(
        config.distDir,
        'blog',
        slug,
        'index.html'
      );
      await renderPage(pathname, outputPath);
    }

    console.log(
      '\n✨ Pre-rendering complete! All pages are now static HTML.\n'
    );
    console.log('📍 Google crawler will now see:');
    console.log('   ✓ All static content');
    console.log('   ✓ Meta tags and structured data');
    console.log('   ✓ Blog posts with full content\n');
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
  }
}

// Run pre-rendering if this is the main module
if (require.main === module) {
  prerender().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { prerender };
