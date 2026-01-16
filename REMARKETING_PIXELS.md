# Remarketing Pixels & Analytics Documentation

> **Website:** michaeldariuseastwood.com
> **Last Updated:** 2026-01-16
> **Purpose:** Track visitors for retargeting, analytics, and user behaviour insights

---

## ACTIVE PIXELS SUMMARY

| Platform | ID | Status |
|----------|-----|--------|
| Google Analytics 4 | `G-V4FDJHP4R4` | LIVE |
| Google Ads Remarketing | `AW-17876453606` | LIVE |
| Meta (Facebook/Instagram) | `1951047602453657` | LIVE |
| LinkedIn Insight Tag | `8470874` | LIVE |
| Microsoft Clarity | `v2la0ovmkx` | LIVE |

---

## 1. Google Analytics 4

| Property | Value |
|----------|-------|
| **Measurement ID** | `G-V4FDJHP4R4` |
| **Stream ID** | `13301669397` |
| **Stream Name** | www.michaeldariuseastwood.com |
| **Admin URL** | https://analytics.google.com |

### Events Tracked
| Event | Trigger |
|-------|---------|
| `page_view` | Automatic on every page |
| `newsletter_signup` | Newsletter form submission |
| `begin_checkout` | Amazon buy button clicks |
| `chat_open` | AI chat panel opened |
| `chat_response` | AI generates response |
| `chat_feedback` | User gives thumbs up/down |
| `chat_error` | Chat error occurs |

### Custom Tracking Functions
```javascript
// Track any event
window.trackEvent(category, action, label, value);

// Track purchase intent (triggers GA4 + Google Ads conversion)
window.trackPurchaseIntent(format, source);
// format: 'kindle', 'paperback', 'hardcover'
// source: 'hero', 'tripath', 'footer', etc.
```

---

## 2. Google Ads Remarketing

| Property | Value |
|----------|-------|
| **Conversion ID** | `AW-17876453606` |
| **Admin URL** | https://ads.google.com |

### Conversion Tracking
- Purchase intent events send conversion data with value
- Values: Kindle £8.99, Paperback £14.99, Hardcover £24.99

### Remarketing Lists to Create
1. **All website visitors** - 30/90/180 day windows
2. **Buy button clickers** - High intent audience
3. **Newsletter subscribers** - Engaged audience
4. **Chat users** - Highly engaged visitors

### How to Create Audiences
1. Google Ads → Tools & Settings → Audience Manager
2. Create audience based on website visitors
3. Use for Display Network, YouTube, and Search remarketing

---

## 3. Meta (Facebook + Instagram) Pixel

| Property | Value |
|----------|-------|
| **Pixel ID** | `1951047602453657` |
| **Admin URL** | https://business.facebook.com/events_manager |

### Events Tracked
| Event | Trigger | Parameters |
|-------|---------|------------|
| `PageView` | Every page load | Automatic |
| `ViewContent` | Page load | content_name, content_ids, value, currency |
| `Lead` | Newsletter signup | content_name, content_category |
| `InitiateCheckout` | Amazon button click | content_name, value, currency, num_items |

### Custom Tracking Functions
```javascript
// Track Amazon button clicks
window.fbTrackPurchase(format);
// format: 'kindle', 'paperback', 'hardcover'

// Track newsletter signup
window.fbTrackLead();
```

### Remarketing Audiences to Create
1. **All Visitors** - Everyone who visited (180 days)
2. **Engaged** - ViewContent but no InitiateCheckout
3. **Hot Leads** - InitiateCheckout (clicked buy)
4. **Subscribers** - Lead event fired
5. **Lookalike** - Similar to Hot Leads audience

---

## 4. LinkedIn Insight Tag

| Property | Value |
|----------|-------|
| **Partner ID** | `8470874` |
| **Admin URL** | https://www.linkedin.com/campaignmanager |

### Installation
- JavaScript tag in `<head>`
- Noscript fallback image pixel for non-JS browsers

### Remarketing Audiences to Create
1. **All Website Visitors** - 90-180 day window
2. **Professional Audience** - Great for B2B/thought leader targeting
3. **Engaged Visitors** - Based on time on site

### How to Create Audiences
1. LinkedIn Campaign Manager → Account Assets → Matched Audiences
2. Create audience → Website → Website visitors
3. Use for Sponsored Content and InMail campaigns

---

## 5. Microsoft Clarity (Heatmaps & Session Recordings)

| Property | Value |
|----------|-------|
| **Project ID** | `v2la0ovmkx` |
| **Admin URL** | https://clarity.microsoft.com |

### Features (All FREE)
| Feature | Description |
|---------|-------------|
| **Heatmaps** | See where visitors click, scroll, and hover |
| **Session Recordings** | Watch real user sessions |
| **Insights** | Automatic detection of rage clicks, dead clicks, excessive scrolling |
| **Funnels** | Track conversion paths |

### Key Metrics to Monitor
- **Rage Clicks** - Users clicking repeatedly (frustration)
- **Dead Clicks** - Clicks on non-interactive elements
- **Scroll Depth** - How far down users scroll
- **Quick Backs** - Users who leave immediately

### GDPR Compliance
```javascript
// Clarity respects consent - called when user accepts cookies
clarity('consent');
```

### Integration Notes
- Works alongside GA4 without conflict
- Session recordings mask sensitive data by default
- No sampling - records ALL sessions on free tier

---

## 6. Twitter/X Pixel

| Property | Value |
|----------|-------|
| **Pixel ID** | `[PENDING]` |
| **Admin URL** | https://ads.twitter.com |
| **Status** | Not yet installed - account access pending |

---

## 7. TikTok Pixel

| Property | Value |
|----------|-------|
| **Pixel ID** | `[TO BE ADDED]` |
| **Admin URL** | https://ads.tiktok.com |
| **Status** | Not yet installed |

---

## Code Location in index.html

All pixels are installed in the `<head>` section:

| Pixel | Approximate Lines |
|-------|------------------|
| Google Analytics 4 | 77-113 |
| Microsoft Clarity | 115-123 |
| Meta/Facebook | 125-170 |
| LinkedIn | 172-191 |

---

## Testing & Verification

### Browser Extensions
| Extension | Purpose |
|-----------|---------|
| **Google Tag Assistant** | Verify GA4 and Google Ads |
| **Meta Pixel Helper** | Verify Facebook/Meta pixel |
| **LinkedIn Insight Tag Helper** | Verify LinkedIn tag |

### Debug Mode
Open browser console:
```javascript
// Google Analytics
console.log(window.dataLayer);

// Facebook
console.log(typeof fbq); // Should be 'function'

// LinkedIn
console.log(window._linkedin_data_partner_ids);

// Clarity
console.log(typeof clarity); // Should be 'function'
```

### Quick Health Check
Visit https://www.michaeldariuseastwood.com and check:
1. Network tab → Filter by "google" - should see gtag requests
2. Network tab → Filter by "facebook" - should see fbevents
3. Network tab → Filter by "linkedin" - should see insight tag
4. Network tab → Filter by "clarity" - should see clarity.ms requests

---

## GDPR & Privacy Compliance

### Consent Management
The site includes consent-aware tracking:

```javascript
// When user ACCEPTS cookies:
grantAllTracking();

// When user DECLINES:
denyAllTracking();
```

### What Happens on Consent
| Action | GA4 | Facebook | LinkedIn | Clarity |
|--------|-----|----------|----------|---------|
| Grant | Full tracking | Full tracking | Full tracking | Recording enabled |
| Deny | Anonymous only | No tracking | No tracking | No recording |

### Recommendations
- [ ] Add visible cookie consent banner for EU visitors
- [ ] Link to Privacy Policy explaining data collection
- [ ] Provide opt-out mechanism

---

## Conversion Value Reference

| Format | Price (GBP) | Use In |
|--------|-------------|--------|
| Kindle | £8.99 | GA4, Google Ads, Facebook |
| Paperback | £14.99 | GA4, Google Ads, Facebook |
| Hardcover | £24.99 | GA4, Google Ads, Facebook |

---

## Contact

For pixel issues or access requests:
- **Website Owner:** Michael Darius Eastwood
- **Email:** michael@michaeldariuseastwood.com
- **Website:** https://www.michaeldariuseastwood.com
