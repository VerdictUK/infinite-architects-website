# 🚀 CLAUDE CODE QUICK-START GUIDE

> **Run these commands in order. Copy-paste ready.**

---

## STEP 0: SETUP & BACKUP

```bash
cd /Users/michaeleastwood/infinite-architects-ultimate-website
cp index.html index.html.backup.$(date +%Y%m%d)
echo "✅ Ready to implement enhancements"
```

---

## STEP 1: READ THE FULL INSTRUCTIONS

Tell Claude Code:

```
Read the file CLAUDE_CODE_ENHANCEMENTS_V2.md and implement all 5 phases in order:
1. Exit Intent Popup
2. Cookie Consent Banner  
3. Sticky Mobile CTA
4. Reviews Section
5. Favicon & OG Image specs

Follow the exact CSS/HTML/JS insertion points specified.
Test after each phase.
Do NOT modify any existing animations, particles, or tesseract code.
```

---

## STEP 2: ALTERNATIVE - PHASE BY PHASE

If you want to go phase by phase, tell Claude Code:

### Phase 1: Exit Intent
```
Implement Phase 1 (Exit Intent Popup) from CLAUDE_CODE_ENHANCEMENTS_V2.md.
Add the CSS before Footer CSS section.
Add the HTML before </body>.
Add the JS before the closing })();
Test that popup appears when mouse leaves viewport.
```

### Phase 2: Cookie Consent
```
Implement Phase 2 (Cookie Consent Banner) from CLAUDE_CODE_ENHANCEMENTS_V2.md.
Add CSS after Exit Intent CSS.
Add HTML right after opening <body> tag.
Add JS before closing })();
Test that banner appears and saves consent to localStorage.
```

### Phase 3: Sticky Mobile CTA
```
Implement Phase 3 (Sticky Mobile CTA) from CLAUDE_CODE_ENHANCEMENTS_V2.md.
Add CSS after Cookie Consent CSS.
Add HTML after <body> tag (before cookie banner).
Add JS before closing })();
Test on mobile viewport that CTA appears after scrolling past hero.
```

### Phase 4: Reviews Section
```
Implement Phase 4 (Reviews Section) from CLAUDE_CODE_ENHANCEMENTS_V2.md.
Add CSS after Sticky CTA CSS.
Add HTML before the Footer section in the page body.
Add JS before closing })();
Test carousel auto-scroll and dot navigation.
```

### Phase 5: Favicons
```
Implement Phase 5 (Favicon & OG specs) from CLAUDE_CODE_ENHANCEMENTS_V2.md.
Add favicon link tags to <head> section.
Create site.webmanifest file.
Update OG meta tags with correct image paths.
```

---

## STEP 3: IMPLEMENT PREVIOUS ENHANCEMENTS

Also implement the first enhancement package:

```
Read CLAUDE_CODE_INSTRUCTIONS.md and implement:
1. JSON-LD structured data in <head>
2. Newsletter section before footer
3. Reading progress bar
4. Sample chapter modal
Deploy linkinbio.html and presskit.html
```

---

## STEP 4: TEST

```bash
npx serve . -p 3000
# Open http://localhost:3000
# Test all features:
# - Exit intent (move mouse out of viewport)
# - Cookie banner (appears on first visit)
# - Sticky CTA (scroll on mobile)
# - Reviews carousel
# - Newsletter form
# - Sample modal
```

---

## STEP 5: DEPLOY

```bash
git add .
git commit -m "feat: Complete enhancement package - exit intent, cookies, reviews, sticky CTA"
vercel --prod
```

---

## CRITICAL FILES FOR CLAUDE CODE

Ensure these files are in the repository:

1. **CLAUDE.md** - Master AI instructions
2. **CLAUDE_CODE_INSTRUCTIONS.md** - First enhancement package
3. **CLAUDE_CODE_ENHANCEMENTS_V2.md** - Second enhancement package (this one)
4. **INFINITE_ARCHITECTS_ENHANCEMENT_PACKAGE.md** - CSS/HTML/JS components
5. **index.html** - Main website
6. **linkinbio.html** - Social media hub
7. **presskit.html** - Media kit
8. **sitemap.xml** - SEO sitemap

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Exit intent fires immediately | Check mouse event threshold |
| Cookie banner won't hide | Check localStorage key spelling |
| Sticky CTA overlaps cookie | CSS z-index adjustment |
| Reviews don't auto-scroll | Check interval is running |
| Favicons not showing | Clear browser cache |

---

## DOMAIN UPDATES NEEDED

Before deploying, update these placeholders:

- `YOUR-DOMAIN.com` → Your actual domain
- `G-XXXXXXXXXX` → Your GA4 ID
- `@YOUR_TWITTER` → Your Twitter handle

---

**Quick-Start Guide v1.0**
**For Claude Code**
