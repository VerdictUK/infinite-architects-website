# EMAIL DOMAIN FIX: Critical Brand Consistency

## Priority: IMMEDIATE

This is a brand integrity issue. Wrong email domains undermine credibility.

---

## The Problem

Screenshots reveal multiple instances of incorrect email domains:

| WRONG | CORRECT |
|-------|---------|
| privacy@infinitearchitects.io | privacy@michaeldariuseastwood.com |
| contact@infinitearchitects.co.uk | contact@michaeldariuseastwood.com |
| contact@infinitearchitects.io | contact@michaeldariuseastwood.com |
| press@infinitearchitects.io | press@michaeldariuseastwood.com |
| Any @infinitearchitects.* | @michaeldariuseastwood.com |

---

## Files to Check

### Primary Files
```
/index.html
/privacy.html (or /privacy/index.html)
/presskit.html (or /presskit/index.html)
/terms.html (if exists)
/contact.html (if exists)
```

### Configuration Files
```
/vercel.json
/package.json
/.env (local)
/api/*.js (any API files)
```

### Static Assets
```
/public/press-kit.pdf
/public/media-kit.pdf
Any downloadable documents
```

---

## Find and Replace Commands

### Using sed (Unix/Mac)

```bash
# Fix all infinitearchitects.io emails
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) \
    -exec sed -i '' 's/@infinitearchitects\.io/@michaeldariuseastwood.com/g' {} +

# Fix all infinitearchitects.co.uk emails
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) \
    -exec sed -i '' 's/@infinitearchitects\.co\.uk/@michaeldariuseastwood.com/g' {} +

# Fix any other infinitearchitects domains
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) \
    -exec sed -i '' 's/@infinitearchitects\.[a-z]*/@michaeldariuseastwood.com/g' {} +
```

### Using grep to find occurrences

```bash
# Find all files containing infinitearchitects
grep -r "infinitearchitects" . --include="*.html" --include="*.js" --include="*.json"

# Find all email-like patterns with infinitearchitects
grep -rE "[a-z]+@infinitearchitects\.[a-z]+" . --include="*.html" --include="*.js"
```

---

## Specific Fixes Required

### 1. Privacy Policy Page

**Found in screenshot:** `privacy@infinitearchitects.io`

**Location:** Likely in `/privacy.html` or `/privacy/index.html`

**Fix:**
```html
<!-- WRONG -->
<p>For privacy enquiries, contact: <a href="mailto:privacy@infinitearchitects.io">privacy@infinitearchitects.io</a></p>

<!-- CORRECT -->
<p>For privacy enquiries, contact: <a href="mailto:privacy@michaeldariuseastwood.com">privacy@michaeldariuseastwood.com</a></p>
```

### 2. Footer Contact Information

**Location:** Bottom of `/index.html`

**Fix:**
```html
<!-- WRONG -->
<a href="mailto:contact@infinitearchitects.co.uk">contact@infinitearchitects.co.uk</a>

<!-- CORRECT -->
<a href="mailto:contact@michaeldariuseastwood.com">contact@michaeldariuseastwood.com</a>
```

### 3. Press Kit / Media Contact

**Location:** Press kit section or separate page

**Fix:**
```html
<!-- WRONG -->
<p>Media inquiries: <a href="mailto:press@infinitearchitects.io">press@infinitearchitects.io</a></p>

<!-- CORRECT -->
<p>Media inquiries: <a href="mailto:press@michaeldariuseastwood.com">press@michaeldariuseastwood.com</a></p>
```

### 4. API Files (if any)

**Location:** `/api/contact.js` or similar

**Fix:**
```javascript
// WRONG
const CONTACT_EMAIL = 'contact@infinitearchitects.io';

// CORRECT
const CONTACT_EMAIL = 'contact@michaeldariuseastwood.com';
```

### 5. Environment Variables

**Location:** `.env` or Vercel dashboard

**Fix:**
```env
# WRONG
CONTACT_EMAIL=contact@infinitearchitects.io

# CORRECT
CONTACT_EMAIL=contact@michaeldariuseastwood.com
```

---

## JavaScript Global Fix (Runtime Backup)

Add this to catch any missed instances at runtime:

```javascript
/**
 * EMAIL DOMAIN SANITIZER
 * Catches and fixes any remaining incorrect email domains
 * Belt-and-suspenders approach for brand consistency
 */
(function sanitizeEmailDomains() {
    'use strict';
    
    const wrongDomains = [
        '@infinitearchitects.io',
        '@infinitearchitects.co.uk',
        '@infinitearchitects.com',
        '@infinitearchitects.org'
    ];
    
    const correctDomain = '@michaeldariuseastwood.com';
    
    function fixEmailInText(text) {
        let fixed = text;
        wrongDomains.forEach(wrong => {
            const regex = new RegExp(wrong.replace('.', '\\.'), 'gi');
            fixed = fixed.replace(regex, correctDomain);
        });
        return fixed;
    }
    
    function fixEmails() {
        // Fix mailto links
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            wrongDomains.forEach(wrong => {
                if (link.href.includes(wrong)) {
                    link.href = link.href.replace(wrong, correctDomain);
                    console.warn('[EMAIL FIX] Fixed mailto link:', link.href);
                }
            });
        });
        
        // Fix visible email text
        const textWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        while (textWalker.nextNode()) {
            const node = textWalker.currentNode;
            wrongDomains.forEach(wrong => {
                if (node.textContent.includes(wrong)) {
                    node.textContent = node.textContent.replace(
                        new RegExp(wrong.replace('.', '\\.'), 'g'),
                        correctDomain
                    );
                    console.warn('[EMAIL FIX] Fixed text content');
                }
            });
        }
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixEmails);
    } else {
        fixEmails();
    }
    
    // Run again after full load
    window.addEventListener('load', fixEmails);
})();
```

---

## Verification Script

Run this in browser console to verify all emails are correct:

```javascript
(function verifyEmails() {
    const wrongDomains = ['infinitearchitects.io', 'infinitearchitects.co.uk', 'infinitearchitects.com'];
    let issues = [];
    
    // Check mailto links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        wrongDomains.forEach(domain => {
            if (link.href.includes(domain)) {
                issues.push({
                    type: 'mailto',
                    element: link,
                    href: link.href
                });
            }
        });
    });
    
    // Check page text
    const bodyText = document.body.innerText;
    wrongDomains.forEach(domain => {
        if (bodyText.includes(domain)) {
            issues.push({
                type: 'text',
                domain: domain
            });
        }
    });
    
    if (issues.length === 0) {
        console.log('✅ All emails verified correct!');
    } else {
        console.error('❌ Found incorrect email domains:', issues);
    }
    
    return issues;
})();
```

---

## Correct Email Addresses Reference

| Purpose | Email |
|---------|-------|
| General Contact | contact@michaeldariuseastwood.com |
| Press/Media | press@michaeldariuseastwood.com |
| Privacy Enquiries | privacy@michaeldariuseastwood.com |
| Support (if needed) | support@michaeldariuseastwood.com |

---

## After Fixing

### Test These Scenarios

1. Click every mailto link on the site
2. Check privacy policy page contact info
3. Check footer contact info
4. Check press kit page
5. Search entire codebase for "infinitearchitects"
6. Run verification script in console

### Expected Result

```
grep -r "infinitearchitects" . --include="*.html" --include="*.js"
# Should return: (no results)
```

---

## Brand Guidelines

### Domain Hierarchy

1. **Primary Website:** www.michaeldariuseastwood.com
2. **Email Domain:** @michaeldariuseastwood.com
3. **Social Media:** @michaeldariuseastwood (where available)

### What NOT to Use

- infinitearchitects.io
- infinitearchitects.co.uk
- infinitearchitects.com
- Any other domain for official communications

### Rationale

The author's personal brand (Michael Darius Eastwood) is the primary identity. "Infinite Architects" is the book title, not a company name. All official communications should come from the personal domain to maintain authenticity and avoid confusion.
