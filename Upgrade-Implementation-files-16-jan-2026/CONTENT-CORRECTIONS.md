# CONTENT CORRECTIONS: Surgical Text Fixes

## Priority: IMMEDIATE

These are text-only changes that carry zero risk of breaking functionality. Execute first.

---

## 1. Word Count Correction (109K → 114K)

### Search Pattern
```
109,000
109K
109000
```

### Replace With
```
114,000
114K
114000
```

### Locations to Check

**In index.html:**
```html
<!-- Stats section -->
OLD: "109K WORDS WRITTEN"
NEW: "114K WORDS WRITTEN"

<!-- Book description -->
OLD: "109,000-word framework"
NEW: "114,000-word framework"

<!-- Any prose mention -->
OLD: "109,000 words"
NEW: "114,000 words"
```

### Implementation Code
```bash
# Run in project root
sed -i '' 's/109,000/114,000/g' index.html
sed -i '' 's/109K/114K/g' index.html
sed -i '' 's/109000/114000/g' index.html
```

Or use JavaScript find/replace in editor targeting these exact strings.

---

## 2. Em Dash → Short Dash/Full Stop Corrections

### UK English Rule
British English rarely uses em dashes (—). Use:
- Short dash with spaces ( - ) for parenthetical remarks
- Full stop (.) followed by capital letter for stronger breaks

### Specific Fixes

**Fix 1: "Not a dystopia — something worse"**
```html
OLD: Not a dystopia — something worse
NEW: Not a dystopia. Something worse.
```

**Fix 2: "AuDHD — autism plus ADHD"**
```html
OLD: AuDHD — autism plus ADHD
NEW: AuDHD - autism plus ADHD
```

### Global Search
Search for ` — ` (space-emdash-space) and review each instance.

**Decision Framework:**
- If breaking a sentence in two makes it MORE impactful → use full stop
- If it's a parenthetical → use short dash with spaces
- If listing → use short dash

### Common Patterns to Fix
```
"The window — five years"      → "The window. Five years."
"One equation — everything"    → "One equation. Everything."
"Not constraints — values"     → "Not constraints. Values."
"AI — artificial"              → "AI - artificial"
```

---

## 3. Author Bio Enhancement

### Current Career Path (Part I: The Mind)
```
DJ → PR EXECUTIVE → SYSTEMS BUILDER → LITIGANT-IN-PERSON → AI PHILOSOPHER
```

### New Expanded Career Path
```
DJ → MUSIC PRODUCER → PR & MARKETING EXECUTIVE → ENTREPRENEUR → KEYNOTE SPEAKER → SYSTEMS BUILDER → LITIGANT-IN-PERSON → AI PHILOSOPHER → AUTHOR → AI ETHICS EXPERT
```

### HTML Implementation
```html
<!-- Find the career path element and replace -->
<div class="career-path">
    <span class="career-stage">DJ</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">MUSIC PRODUCER</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">PR & MARKETING EXECUTIVE</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">ENTREPRENEUR</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">KEYNOTE SPEAKER</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">SYSTEMS BUILDER</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">LITIGANT-IN-PERSON</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">AI PHILOSOPHER</span>
    <span class="career-arrow">→</span>
    <span class="career-stage">AUTHOR</span>
    <span class="career-arrow">→</span>
    <span class="career-stage highlight">AI ETHICS EXPERT</span>
</div>
```

### Mobile-Friendly Alternative (if space constrained)
```html
<!-- Two-line version for mobile -->
<div class="career-path mobile">
    <div class="career-line-1">
        DJ · MUSIC PRODUCER · PR EXECUTIVE · ENTREPRENEUR · KEYNOTE SPEAKER
    </div>
    <div class="career-line-2">
        SYSTEMS BUILDER · LITIGANT-IN-PERSON · AI PHILOSOPHER · AUTHOR · AI ETHICS EXPERT
    </div>
</div>
```

### Credentials to Add to Bio Section

Add these credentials where author qualifications are mentioned:

```html
<div class="author-credentials">
    <h4>Areas of Expertise</h4>
    <ul class="credentials-list">
        <li>AI Safety & Alignment Research</li>
        <li>AI Ethics & Governance</li>
        <li>Quantum Computing Implications</li>
        <li>Systems Thinking & Complexity</li>
        <li>PR, Branding & Marketing Strategy</li>
        <li>Legal Self-Representation</li>
        <li>Neurodivergent Pattern Recognition</li>
        <li>Cross-Domain Synthesis (Polymathic Method)</li>
    </ul>
</div>
```

---

## 4. Polymathic Method Language

### Rule: Never "is a polymath" - Always "uses the polymathic method"

**Search for these patterns:**
```
"is a polymath"
"he is a polymath"
"Michael is a polymath"
"polymath author"
"polymath thinker"
```

**Replace with:**
```
"applies the polymathic method"
"he utilises the polymathic method"
"Michael applies a polymathic lens"
"author who uses the polymathic method"
"thinker who applies polymathic synthesis"
```

### Rationale
The book's Author's Note explicitly frames this distinction. Claiming to "be" a polymath is presumptuous. Describing a *method* of thinking is accurate and humble.

---

## 5. British English Enforcement

### Common American → British Fixes

Search and replace globally:

| American | British |
|----------|---------|
| color | colour |
| behavior | behaviour |
| honor | honour |
| realize | realise |
| analyze | analyse |
| center | centre |
| defense | defence |
| program | programme |
| optimize | optimise |
| organize | organise |
| recognize | recognise |
| apologize | apologise |
| license (verb) | licence |
| practice (verb) | practise |
| dialog | dialogue |
| catalog | catalogue |
| theater | theatre |
| meter | metre |

### Regex for Bulk Fix
```javascript
const ukFixes = {
    'color': 'colour',
    'behavior': 'behaviour',
    'honor': 'honour',
    'realize': 'realise',
    'analyze': 'analyse',
    'center': 'centre',
    'defense': 'defence',
    'program(?!m)': 'programme', // Avoid "programmer"
    'optimize': 'optimise',
    'organize': 'organise',
    'recognize': 'recognise'
};

Object.entries(ukFixes).forEach(([us, uk]) => {
    const regex = new RegExp(`\\b${us}\\b`, 'gi');
    content = content.replace(regex, uk);
});
```

---

## 6. Stats Section Enhancement

### Current (from screenshot)
```
£600K+ REVENUE BUILT | 15 HIGH COURT APPEARANCES | 109K WORDS WRITTEN
```

### Enhanced
```
£600K+ REVENUE BUILT | 15 HIGH COURT APPEARANCES | 114K WORDS WRITTEN
```

### Consider Adding
```
£600K+ | 15 | 114K | 37
REVENUE | HIGH COURT | WORDS | ORIGINAL
BUILT | APPEARANCES | WRITTEN | CONCEPTS
```

---

## 7. Timeline/Prediction Section Clarifications

### Ensure These Facts Are Accurate

**Book Timeline:**
- Manuscript completed: 31 December 2024
- Copyright registered: 31 December 2024
- Print published: 2 January 2026
- Ebook published: 2 January 2026
- BBC Willow broadcast: 7 January 2026

**Prediction Verification:**
- Time between publication and BBC validation: 5 days
- Hartmut Neven quote: "Within the next five years"
- Book prediction: "Perhaps five years"

### Copy to Use
```html
<div class="verification-timeline">
    <div class="timeline-item book">
        <span class="date">JAN 2, 2026</span>
        <span class="event">Book Published</span>
        <span class="quote">"...practical quantum computing within approximately five years"</span>
    </div>
    <div class="timeline-connector">
        <span class="days">5 DAYS</span>
    </div>
    <div class="timeline-item bbc">
        <span class="date">JAN 7, 2026</span>
        <span class="event">BBC Confirms</span>
        <span class="quote">"Within the next five years we could see..."</span>
        <span class="source">- Hartmut Neven, Google Quantum AI</span>
    </div>
</div>
```

---

## 8. Testimonial/Review Enhancement

### Ensure Reviews Show
```
★★★★★ 5.0 rating
Verified Purchase badges
Real quotes (not AI-generated)
```

### If Adding New Reviews
```html
<div class="review verified">
    <div class="stars">★★★★★</div>
    <blockquote>"[Exact quote from review]"</blockquote>
    <cite>
        <span class="reviewer">Verified Reader</span>
        <span class="source">Amazon UK</span>
        <span class="badge">✓ Verified Purchase</span>
    </cite>
</div>
```

---

## 9. CTA Button Text Optimisation

### Current vs Optimised

| Current | Optimised |
|---------|-----------|
| "Get the Book" | "Get Your Copy" |
| "Buy Now" | "Read It Now" |
| "Order" | "Start Reading" |
| "Purchase" | "Unlock the Framework" |
| "Download" | "Get Instant Access" |

### Psychological Principle
Ownership language ("Your Copy") and action language ("Start Reading") convert better than transactional language ("Buy", "Purchase").

---

## 10. Missing Oxford Commas

British English traditionally uses the Oxford comma. Search for lists and ensure consistency:

```
OLD: "AI, quantum computing and philosophy"
NEW: "AI, quantum computing, and philosophy"

OLD: "Claude, GPT-4 and Gemini"
NEW: "Claude, GPT-4, and Gemini"
```

---

## Verification Checklist

After making all content corrections:

- [ ] Search for "109" returns 0 results (or only date-related)
- [ ] Search for " — " returns 0 results
- [ ] Search for "@infinitearchitects" returns 0 results
- [ ] Search for "color" (American spelling) returns 0 results
- [ ] Search for "is a polymath" returns 0 results
- [ ] Career path includes all stages
- [ ] Word count shows 114,000/114K everywhere
- [ ] All CTAs use optimised language

---

## Rollback Instructions

If any content change causes issues:

```bash
git diff index.html  # See what changed
git checkout index.html  # Restore original
```

Or restore specific sections from backup.
