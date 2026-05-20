# AdSense Setup Verification Checklist

## Files Created ✅

- [x] `public/robots.txt` - Controls Google bot access
- [x] `public/sitemap.xml` - Tells Google your pages
- [x] `index.html` - Updated with AdSense meta tags
- [x] `public/ads.txt` - Already exists with publisher ID

---

## Current Publisher ID
```
ca-pub-4699443071845718
```

---

## Pre-Launch Checklist

### 1. Verify Files Are Accessible

```bash
# Check if files are served correctly
curl https://task.srk.app/robots.txt
curl https://task.srk.app/sitemap.xml
curl https://task.srk.app/ads.txt
```

Expected: All should return 200 status with correct content

### 2. Google Search Console Setup

**In Google Search Console:**

1. ✅ Add property: `https://task.srk.app`
2. ✅ Verify ownership (via meta tag or HTML file)
3. ✅ Go to **Crawl** → **robots.txt Tester**
   - Test: `/` - Should show ✅ allowed
   - Test: `/admin/` - Should show ✅ blocked
   - Test: `/dashboard/` - Should show ✅ blocked
4. ✅ Go to **Sitemaps** → Add new sitemap
   - Submit: `https://task.srk.app/sitemap.xml`
5. ✅ Go to **Coverage** → Request indexing for homepage

### 3. AdSense Setup

**In Google AdSense:**

1. ✅ Add site: `https://task.srk.app`
2. ✅ Choose verification: Meta tag in `<head>`
3. ✅ Wait 24-48 hours for verification
4. ✅ Create Ad Units:
   - [ ] Display Ad (homepage banner)
   - [ ] Display Ad (sidebar)
   - [ ] Matched Content (for related posts)

### 4. Meta Tags Verification

**View source of https://task.srk.app and verify:**

```html
✅ <meta name="google-adsense-account" content="ca-pub-4699443071845718">
✅ <meta name="description" content="...">
✅ <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4699443071845718">
```

### 5. robots.txt Rules

**Test with robots.txt tester in Search Console:**

| Path | Status | Expected |
|------|--------|----------|
| `/` | ✅ | Allowed |
| `/how-it-works` | ✅ | Allowed |
| `/faq` | ✅ | Allowed |
| `/help` | ✅ | Allowed |
| `/admin/` | ❌ | Blocked |
| `/dashboard/` | ❌ | Blocked |
| `/user/profile` | ❌ | Blocked |
| `/api/` | ❌ | Blocked |

### 6. Sitemap Validation

**In Google Search Console:**

- ✅ Sitemap submitted successfully
- ✅ Status shows "Success"
- ✅ All URLs in sitemap have valid status codes

### 7. Mobile Friendly

**Test at:** https://search.google.com/test/mobile-friendly?url=https://task.srk.app

- ✅ Should show "Mobile-friendly"
- ✅ No errors reported

### 8. Page Speed

**Test at:** https://pagespeed.web.dev

Target scores:
- ✅ Performance: > 75
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ SEO: > 90

---

## AdSense Approval Tracking

### What Google Reviews

1. **Content Quality**
   - Minimum 300 words per page
   - Original content
   - Proper formatting

2. **User Experience**
   - Fast loading (< 3 seconds)
   - Mobile responsive
   - Clear navigation

3. **Traffic & Audience**
   - Daily pageviews: target 100+ to 10K+
   - Unique visitors: target 50+ to 5K+
   - Time on site: > 30 seconds

4. **Compliance**
   - No prohibited content
   - No violent content
   - No adult content
   - No copyright violations

### Approval Timeline

| Day | Action | Status |
|-----|--------|--------|
| Day 1 | Submit site | Pending Review |
| Day 2-7 | Google reviews | Under Review |
| Day 7-14 | Approval decision | ✅ Approved or ❌ Denied |

---

## AdSense Optimization Tips

### For Higher Earnings

1. **CPM Optimization**
   - Target high-value keywords (finance, tech, insurance)
   - Increase organic traffic (SEO)
   - Improve content quality

2. **Ad Placement**
   ```
   ✅ Above fold (header)
   ✅ Between content sections
   ✅ In sidebar (if available)
   ✅ After paragraphs
   ```

3. **Ad Types**
   - Display ads (highest CPM)
   - In-feed ads (good CTR)
   - Matched content (related articles)

### Monitor These Metrics

```
Weekly:
- Pageviews
- Clicks
- Impressions
- CTR (Click-Through Rate)
- RPM (Revenue Per Thousand)

Monthly:
- Earnings
- Top pages
- Top traffic sources
- AdSense policies violations
```

---

## Troubleshooting

### Issue: robots.txt Not Found
**Solution:**
```
1. Verify file at: /apps/task/public/robots.txt
2. Check Vite config serves public folder
3. Test: curl https://task.srk.app/robots.txt
```

### Issue: Sitemap URLs Return 404
**Solution:**
```
1. Verify URLs in sitemap match your routes
2. Update last modified dates
