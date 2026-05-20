# AdSense & SEO Setup Guide for SRK Task App

## Files Created

### 1. **robots.txt** (`public/robots.txt`)
Controls which pages search engines and bots can crawl.

**What's Included:**
- ✅ Allows Google bots (Googlebot, AdsBot-Google)
- ✅ Allows public pages (FAQ, Help, How-it-works)
- ✅ Blocks private pages (Dashboard, Admin, Payment)
- ✅ Blocks bad bots (Ahrefs, Semrush, etc.)
- ✅ Sitemap reference for Google

### 2. **sitemap.xml** (`public/sitemap.xml`)
Tells search engines about your public pages.

**What's Included:**
- ✅ Homepage (priority: 1.0)
- ✅ How-it-works (priority: 0.9)
- ✅ FAQ, Help, Getting-started
- ✅ Privacy & Terms pages
- ✅ Last modified dates

### 3. **ads.txt** (Already exists)
Declares authorized AdSense partners.

**Current Setup:**
```
google.com, pub-4699443071845718, DIRECT, f08c47fec0942fa0a
```

---

## Step-by-Step AdSense Setup

### Step 1: Verify Site Ownership in AdSense

1. Go to **Google AdSense** → **Sites**
2. Add your domain: `https://task.srk.app`
3. Choose verification method (recommended: **HTML tag**)
4. Add this to your `index.html` head:
   ```html
   <meta name="google-adsense-account" content="ca-pub-4699443071845718">
   ```

### Step 2: Verify robots.txt & sitemap.xml

1. In Google Search Console:
   - Go to **Sitemaps** → Add new sitemap
   - Submit: `https://task.srk.app/sitemap.xml`
   
2. Check robots.txt:
   - Go to **Crawl** → **robots.txt Tester**
   - Verify Googlebot can access public pages

### Step 3: Create Ad Units

**For Task App, Create These Ad Placements:**

1. **Display Ads** (Responsive)
   - Homepage banner (top)
   - Sidebar (in dashboard if public)
   - Between content sections

2. **In-Feed Ads**
   - Between task items in list
   - Between FAQ questions

3. **Matched Content**
   - After help articles
   - At end of how-it-works page

**Ad Code Example:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4699443071845718"
     crossorigin="anonymous"></script>
<!-- Task App Display Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-4699443071845718"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Step 4: Update Meta Tags

Add to your `index.html` head:

```html
<!-- AdSense -->
<meta name="google-adsense-account" content="ca-pub-4699443071845718">

<!-- SEO Meta Tags -->
<meta name="description" content="Earn money by completing social media tasks. Follow, like, and engage with brands on Instagram, Twitter, and more. Start earning today!">
<meta name="keywords" content="earn money online, social media tasks, get paid to click, micro tasks, freelance work">
<meta property="og:title" content="SRK Task - Earn Money Online">
<meta property="og:description" content="Complete simple tasks and earn real money. No investment required.">
<meta property="og:url" content="https://task.srk.app">
<meta property="og:type" content="website">

<!-- Structured Data for Rich Snippets -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SRK Task",
  "url": "https://task.srk.app",
  "description": "Earn money by completing social media tasks",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://task.srk.app/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
```

---

## Important: robots.txt Rules for AdSense

### ✅ DO Allow These Pages
```
Allow: /          (Homepage)
Allow: /faq/      (FAQ page - great for ads)
Allow: /help/     (Help content - great for ads)
Allow: /pages/    (Public content pages)
```

### ❌ DON'T Allow These Pages
```
Disallow: /admin/
Disallow: /dashboard/
Disallow: /user/
Disallow: /api/
Disallow: /payment/
```

**Why?** 
- AdSense crawlers will see user-specific content as duplicate
- Wastes crawl budget on private pages
- Confuses Google's indexing algorithm

---

## Monitoring & Optimization

### Weekly Checks

1. **Google Search Console**
   - Check coverage report
   - Look for indexing errors
   - Monitor click-through rate (CTR)

2. **Google Analytics**
   - Track page views
   - Monitor bounce rate
   - Check average session duration

3. **AdSense Dashboard**
   - Check earnings
   - Monitor CPM rates
   - Review top performing pages
   - Check for policy violations

### Monthly Tasks

1. Update `sitemap.xml` with new public pages
2. Monitor CTR - if low (<1%), improve ad placement
3. Check Search Console for new errors
4. Review robots.txt for blocked content

---

## AdSense Best Practices for Task App

### 1. **Page Speed** ⚡
- AdSense code adds ~200-400ms load time
- Minimize other scripts
- Use async loading (already in example above)

### 2. **Ad Placement** 📍
- Place above fold (first screen) for best CTR
- Not in navigation or footer only
- 3-5 ads per page maximum
- Never hide ads in collapsed sections

### 3. **Content Quality** ✍️
- Minimum 300 words per page for good indexing
- Original content (not duplicated)
- At least 2 ads per 500 words
- High-quality images
