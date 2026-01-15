# Remarketing Pixels Documentation

> **Website:** michaeldariuseastwood.com
> **Last Updated:** 2026-01-15
> **Purpose:** Track visitors for retargeting across advertising platforms

---

## 1. Google Analytics 4

| Property | Value |
|----------|-------|
| **Measurement ID** | `G-V4FDJHP4R4` |
| **Stream ID** | `13301669397` |
| **Stream Name** | www.michaeldariuseastwood.com |
| **Admin URL** | https://analytics.google.com |

### Events Tracked
- `page_view` - Automatic
- `newsletter_signup` - Newsletter form submission
- `begin_checkout` - Amazon buy button clicks

---

## 2. Google Ads Remarketing

| Property | Value |
|----------|-------|
| **Conversion ID** | `AW-17876453606` |
| **Admin URL** | https://ads.google.com |

### Remarketing Lists Available
- All website visitors
- Visitors who clicked buy buttons
- Newsletter subscribers

### How to Create Audiences
1. Google Ads → Tools & Settings → Audience Manager
2. Create audience based on website visitors
3. Use for Display Network and YouTube remarketing

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

### Remarketing Audiences to Create
1. **All Visitors** - Everyone who visited (180 days)
2. **Engaged** - ViewContent but no InitiateCheckout
3. **Hot Leads** - InitiateCheckout (clicked buy)
4. **Subscribers** - Lead event fired

---

## 4. Twitter/X Pixel

| Property | Value |
|----------|-------|
| **Pixel ID** | `[PENDING - Account access issue]` |
| **Admin URL** | https://ads.twitter.com |

### Installation Status
- [ ] Not yet installed
- **Note:** Owner having account access issues - will add later

---

## 5. LinkedIn Insight Tag

| Property | Value |
|----------|-------|
| **Partner ID** | `8470874` |
| **Admin URL** | https://www.linkedin.com/campaignmanager |

### Installation Status
- [x] Installed and active

### Remarketing Audiences to Create
1. **All Website Visitors** - Everyone who visited (90-180 days)
2. **Professional Audience** - Great for B2B targeting
3. **Engaged Visitors** - Time on site / pages viewed

### How to Create Audiences
1. LinkedIn Campaign Manager → Account Assets → Matched Audiences
2. Create audience → Website → Website visitors
3. Use for Sponsored Content and InMail campaigns

---

## 6. TikTok Pixel

| Property | Value |
|----------|-------|
| **Pixel ID** | `[TO BE ADDED]` |
| **Admin URL** | https://ads.tiktok.com |

### Installation Status
- [ ] Not yet installed

---

## Implementation Details

### Code Location
All pixels are installed in `/index.html` in the `<head>` section:
- Lines 109-119: Google (Analytics + Ads)
- Lines 121-143: Meta/Facebook Pixel
- Lines 145-164: LinkedIn Insight Tag

### Event Tracking Location
- Newsletter Lead event: Line ~33350
- InitiateCheckout events: Line ~32650

### CSP Configuration
The Content Security Policy in `vercel.json` allows:
- `script-src`: googletagmanager.com, google-analytics.com, connect.facebook.net, snap.licdn.com
- `connect-src`: google-analytics.com, analytics.google.com, facebook.com, px.ads.linkedin.com

---

## Testing & Verification

### Chrome Extensions
- **Google Tag Assistant** - Verify GA4 and Google Ads
- **Meta Pixel Helper** - Verify Facebook/Meta pixel

### Debug Mode
Open browser console and check for:
```javascript
// Google
console.log(window.dataLayer);

// Facebook
console.log(window.fbq);
```

---

## GDPR Compliance Notes

- Newsletter form includes consent checkbox
- All tracking respects user privacy
- Consider adding cookie consent banner for EU visitors

---

## Contact

For pixel issues or access requests:
- **Website Owner:** Michael Darius Eastwood
- **Email:** michael@michaeldariuseastwood.com
