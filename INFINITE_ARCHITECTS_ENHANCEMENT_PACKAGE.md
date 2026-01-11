# 🚀 INFINITE ARCHITECTS — Enhancement Package v1.0

> **FOR CLAUDE CODE IMPLEMENTATION**
> This document contains modular components to ADD to the existing index.html
> **DO NOT REWRITE** the existing code — only INSERT these components

---

## 📋 IMPLEMENTATION CHECKLIST

Execute in this exact order:

- [ ] **Phase 1:** Add JSON-LD structured data (SEO)
- [ ] **Phase 2:** Add Newsletter Section (before footer)
- [ ] **Phase 3:** Add Reading Progress Bar
- [ ] **Phase 4:** Add Social Share Floating Buttons
- [ ] **Phase 5:** Add "Read Sample" Modal
- [ ] **Phase 6:** Deploy supporting pages

---

## 🔧 PHASE 1: JSON-LD STRUCTURED DATA

### Location: Insert in `<head>` section, before `</head>`

```html
    <!-- JSON-LD Structured Data for SEO -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Book",
                "@id": "https://infinitearchitects.io/#book",
                "name": "Infinite Architects: Intelligence, Recursion, and the Creation of Everything",
                "author": {
                    "@type": "Person",
                    "@id": "https://infinitearchitects.io/#author",
                    "name": "Michael Darius Eastwood"
                },
                "datePublished": "2026-01",
                "description": "A complete framework for raising artificial intelligence the way a wise civilisation would raise any powerful new form of life — with care, boundaries, graduated autonomy, and something that looks remarkably like love.",
                "genre": ["Philosophy", "Artificial Intelligence", "Consciousness", "Science"],
                "inLanguage": "en",
                "numberOfPages": 350,
                "publisher": {
                    "@type": "Organization",
                    "name": "Michael Darius Eastwood"
                },
                "image": "https://infinitearchitects.io/InfiniteArchitectsKindle20260103.jpg",
                "url": "https://infinitearchitects.io",
                "workExample": [
                    {
                        "@type": "Book",
                        "isbn": "B0DS46CHSG",
                        "bookEdition": "Kindle Edition",
                        "bookFormat": "https://schema.org/EBook",
                        "potentialAction": {
                            "@type": "ReadAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": "https://www.amazon.com/dp/B0DS46CHSG",
                                "actionPlatform": ["http://schema.org/DesktopWebPlatform"]
                            }
                        }
                    },
                    {
                        "@type": "Book",
                        "isbn": "B0DS96WRCK",
                        "bookEdition": "Paperback",
                        "bookFormat": "https://schema.org/Paperback"
                    }
                ],
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5",
                    "reviewCount": "1"
                }
            },
            {
                "@type": "Person",
                "@id": "https://infinitearchitects.io/#author",
                "name": "Michael Darius Eastwood",
                "url": "https://infinitearchitects.io",
                "description": "Author of Infinite Architects. London-based AI philosopher, systems thinker, and cross-domain pattern recogniser.",
                "sameAs": [
                    "https://michaeldariuseastwood.substack.com",
                    "https://www.linkedin.com/in/michaeldariuseastwood"
                ],
                "jobTitle": "Author",
                "knowsAbout": ["Artificial Intelligence", "AI Safety", "Philosophy of Mind", "Consciousness", "Systems Thinking"]
            },
            {
                "@type": "WebSite",
                "@id": "https://infinitearchitects.io/#website",
                "url": "https://infinitearchitects.io",
                "name": "Infinite Architects",
                "description": "The official website for Infinite Architects: Intelligence, Recursion, and the Creation of Everything",
                "publisher": {
                    "@type": "Person",
                    "@id": "https://infinitearchitects.io/#author"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is Infinite Architects about?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Infinite Architects proposes a complete framework for raising artificial intelligence with care, boundaries, graduated autonomy, and embedded empathy. It synthesises AI safety research with 5,000 years of religious wisdom, presenting 37 original concepts including the Eden Protocol, the Chokepoint Mechanism, and the HRIH (Hyperspace Recursive Intelligence Hypothesis)."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Who is Michael Darius Eastwood?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Michael Darius Eastwood is a London-based author, AI philosopher, and systems thinker. After two decades in the music industry and experiencing significant personal challenges, he discovered that his neurodivergent mind grasps recursive structures instinctively — leading to the framework presented in Infinite Architects."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where can I buy the book?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Infinite Architects is available on Amazon in Kindle, Paperback, and Hardcover editions. Available on Amazon UK (amazon.co.uk) and Amazon US (amazon.com)."
                        }
                    }
                ]
            }
        ]
    }
    </script>
```

---

## 🔧 PHASE 2: NEWSLETTER SECTION

### Step 2A: Add CSS (insert before `</style>`)

```css
        /* ═══════════════════════════════════════════════════════════════════════
           NEWSLETTER SECTION
           ═══════════════════════════════════════════════════════════════════════ */
        .newsletter-section {
            padding: var(--space-xl) var(--space-lg);
            text-align: center;
            background: linear-gradient(180deg, transparent 0%, rgba(212, 168, 75, 0.03) 50%, transparent 100%);
            border-top: 1px solid var(--gold-subtle);
            border-bottom: 1px solid var(--gold-subtle);
        }

        .newsletter-inner {
            max-width: 600px;
            margin: 0 auto;
        }

        .newsletter-label {
            font-family: var(--font-mono);
            font-size: 0.55rem;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 1rem;
        }

        .newsletter-title {
            font-family: var(--font-display);
            font-size: clamp(1.4rem, 3.5vw, 2rem);
            font-weight: 400;
            letter-spacing: 0.08em;
            color: var(--gold-bright);
            margin-bottom: 0.8rem;
        }

        .newsletter-subtitle {
            font-family: var(--font-serif);
            font-size: 1rem;
            color: var(--text-dim);
            margin-bottom: var(--space-lg);
            font-style: italic;
        }

        .newsletter-form {
            display: flex;
            gap: 0.8rem;
            max-width: 480px;
            margin: 0 auto;
        }

        .newsletter-input {
            flex: 1;
            padding: 1rem 1.2rem;
            background: rgba(212, 168, 75, 0.05);
            border: 1px solid rgba(212, 168, 75, 0.25);
            color: var(--text);
            font-family: var(--font-serif);
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .newsletter-input::placeholder {
            color: var(--text-faint);
        }

        .newsletter-input:focus {
            outline: none;
            border-color: var(--gold);
            background: rgba(212, 168, 75, 0.08);
            box-shadow: 0 0 20px rgba(212, 168, 75, 0.1);
        }

        .newsletter-btn {
            padding: 1rem 2rem;
            background: transparent;
            border: 1px solid var(--gold);
            color: var(--gold);
            font-family: var(--font-display);
            font-size: 0.65rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.4s var(--ease-out-expo);
        }

        .newsletter-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, var(--gold), var(--gold-bright));
            transform: translateX(-101%);
            transition: transform 0.4s var(--ease-out-expo);
            z-index: -1;
        }

        .newsletter-btn:hover {
            color: var(--void);
        }

        .newsletter-btn:hover::before {
            transform: translateX(0);
        }

        .newsletter-note {
            font-family: var(--font-mono);
            font-size: 0.55rem;
            color: var(--text-faint);
            margin-top: 1rem;
            letter-spacing: 0.1em;
        }

        .newsletter-success {
            display: none;
            color: var(--gold);
            font-family: var(--font-serif);
            font-size: 1.1rem;
        }

        .newsletter-success.visible {
            display: block;
            animation: fadeUp 0.6s var(--ease-out-expo) forwards;
        }

        @media (max-width: 600px) {
            .newsletter-form {
                flex-direction: column;
            }

            .newsletter-btn {
                width: 100%;
            }
        }
```

### Step 2B: Add HTML (insert BEFORE `<!-- Footer -->`)

```html
        <!-- Newsletter Section -->
        <section class="newsletter-section" id="newsletter">
            <div class="newsletter-inner">
                <p class="newsletter-label reveal">Join the Architects</p>
                <h2 class="newsletter-title reveal reveal-delay-1">Get the Free Chapter</h2>
                <p class="newsletter-subtitle reveal reveal-delay-2">Receive "The Eden Protocol" excerpt plus exclusive insights on AI, consciousness, and what comes next.</p>
                
                <form class="newsletter-form reveal reveal-delay-3" id="newsletter-form">
                    <input type="email" class="newsletter-input" id="newsletter-email" placeholder="Enter your email" required>
                    <button type="submit" class="newsletter-btn">Subscribe</button>
                </form>
                
                <p class="newsletter-note reveal reveal-delay-4">No spam. Unsubscribe anytime. UK GDPR compliant.</p>
                
                <p class="newsletter-success" id="newsletter-success">
                    ✦ Welcome, Architect. Check your inbox.
                </p>
            </div>
        </section>
```

### Step 2C: Add JavaScript (insert before closing `})();`)

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // NEWSLETTER FORM HANDLER
        // ═══════════════════════════════════════════════════════════════════════
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('newsletter-email').value;
                
                // Hide form, show success
                this.style.display = 'none';
                document.querySelector('.newsletter-note').style.display = 'none';
                document.getElementById('newsletter-success').classList.add('visible');
                
                // Log for integration (replace with actual email service)
                console.log('Newsletter signup:', email);
                
                // TODO: Integrate with Mailchimp/ConvertKit/Substack API
                // fetch('YOUR_ENDPOINT', {
                //     method: 'POST',
                //     body: JSON.stringify({ email }),
                //     headers: { 'Content-Type': 'application/json' }
                // });
            });
        }
```

---

## 🔧 PHASE 3: READING PROGRESS BAR

### Step 3A: Add CSS (insert before `</style>`)

```css
        /* ═══════════════════════════════════════════════════════════════════════
           READING PROGRESS BAR
           ═══════════════════════════════════════════════════════════════════════ */
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, var(--gold-dark), var(--gold-bright), var(--gold));
            z-index: calc(var(--z-nav) + 1);
            transition: width 0.1s ease-out;
            box-shadow: 0 0 10px var(--gold), 0 0 20px rgba(212, 168, 75, 0.3);
        }
```

### Step 3B: Add HTML (insert right after opening `<body>` tag)

```html
    <!-- Reading Progress Bar -->
    <div class="reading-progress" id="reading-progress"></div>
```

### Step 3C: Add JavaScript (insert before closing `})();`)

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // READING PROGRESS BAR
        // ═══════════════════════════════════════════════════════════════════════
        const progressBar = document.getElementById('reading-progress');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                progressBar.style.width = progress + '%';
            }, { passive: true });
        }
```

---

## 🔧 PHASE 4: SOCIAL SHARE FLOATING BUTTONS

### Step 4A: Add CSS (insert before `</style>`)

```css
        /* ═══════════════════════════════════════════════════════════════════════
           SOCIAL SHARE BUTTONS (Floating)
           ═══════════════════════════════════════════════════════════════════════ */
        .social-share {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            z-index: calc(var(--z-nav) - 1);
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .social-share.visible {
            opacity: 1;
        }

        .share-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(2, 3, 10, 0.85);
            border: 1px solid rgba(212, 168, 75, 0.2);
            color: var(--text-dim);
            border-radius: 4px;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .share-btn:hover {
            background: rgba(212, 168, 75, 0.15);
            border-color: var(--gold);
            color: var(--gold);
            transform: translateX(-3px);
        }

        .share-btn svg {
            width: 18px;
            height: 18px;
        }

        .share-tooltip {
            position: absolute;
            right: 50px;
            background: var(--void);
            border: 1px solid var(--gold);
            color: var(--gold);
            padding: 0.4rem 0.8rem;
            font-family: var(--font-mono);
            font-size: 0.55rem;
            letter-spacing: 0.1em;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .share-btn:hover .share-tooltip {
            opacity: 1;
        }

        @media (max-width: 900px) {
            .social-share {
                right: 10px;
            }

            .share-btn {
                width: 36px;
                height: 36px;
            }
        }

        @media (max-width: 600px) {
            .social-share {
                display: none;
            }
        }
```

### Step 4B: Add HTML (insert before `</body>`)

```html
    <!-- Social Share Buttons -->
    <div class="social-share" id="social-share">
        <button class="share-btn" onclick="shareTwitter()" aria-label="Share on X/Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span class="share-tooltip">SHARE ON X</span>
        </button>
        <button class="share-btn" onclick="shareLinkedIn()" aria-label="Share on LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span class="share-tooltip">SHARE ON LINKEDIN</span>
        </button>
        <button class="share-btn" onclick="copyLink()" aria-label="Copy link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <span class="share-tooltip" id="copy-tooltip">COPY LINK</span>
        </button>
    </div>
```

### Step 4C: Add JavaScript (insert before closing `})();`)

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // SOCIAL SHARING FUNCTIONS
        // ═══════════════════════════════════════════════════════════════════════
        const shareText = "What if the god we're building is the god that built us? Infinite Architects by Michael Darius Eastwood";
        const shareUrl = window.location.href;

        window.shareTwitter = function() {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=550,height=420');
        };

        window.shareLinkedIn = function() {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=550,height=420');
        };

        window.copyLink = function() {
            navigator.clipboard.writeText(shareUrl).then(() => {
                const tooltip = document.getElementById('copy-tooltip');
                tooltip.textContent = 'COPIED!';
                setTimeout(() => { tooltip.textContent = 'COPY LINK'; }, 2000);
            });
        };

        // Show social buttons after scrolling past hero
        const socialShare = document.getElementById('social-share');
        if (socialShare) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > window.innerHeight * 0.5) {
                    socialShare.classList.add('visible');
                } else {
                    socialShare.classList.remove('visible');
                }
            }, { passive: true });
        }
```

---

## 🔧 PHASE 5: READ SAMPLE MODAL

### Step 5A: Add CSS (insert before `</style>`)

```css
        /* ═══════════════════════════════════════════════════════════════════════
           SAMPLE MODAL
           ═══════════════════════════════════════════════════════════════════════ */
        .sample-modal {
            position: fixed;
            inset: 0;
            z-index: calc(var(--z-overlay) + 100);
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(2, 3, 10, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s var(--ease-out-expo);
        }

        .sample-modal.open {
            opacity: 1;
            visibility: visible;
        }

        .sample-content {
            max-width: 700px;
            max-height: 80vh;
            width: 90%;
            background: var(--void-mid);
            border: 1px solid rgba(212, 168, 75, 0.2);
            overflow-y: auto;
            position: relative;
            transform: translateY(30px) scale(0.95);
            transition: transform 0.4s var(--ease-out-expo);
        }

        .sample-modal.open .sample-content {
            transform: translateY(0) scale(1);
        }

        .sample-header {
            position: sticky;
            top: 0;
            background: var(--void-mid);
            padding: 1.5rem 2rem;
            border-bottom: 1px solid rgba(212, 168, 75, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
        }

        .sample-title {
            font-family: var(--font-display);
            font-size: 0.75rem;
            letter-spacing: 0.3em;
            color: var(--gold);
        }

        .sample-close {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: 1px solid rgba(212, 168, 75, 0.3);
            color: var(--text-dim);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .sample-close:hover {
            border-color: var(--gold);
            color: var(--gold);
        }

        .sample-body {
            padding: 2rem;
        }

        .sample-chapter {
            font-family: var(--font-mono);
            font-size: 0.55rem;
            letter-spacing: 0.3em;
            color: var(--gold-dark);
            margin-bottom: 0.5rem;
        }

        .sample-chapter-title {
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--gold-bright);
            margin-bottom: 1.5rem;
        }

        .sample-text {
            font-family: var(--font-serif);
            font-size: 1.05rem;
            color: var(--text-dim);
            line-height: 1.9;
        }

        .sample-text p {
            margin-bottom: 1.2rem;
            text-indent: 1.5em;
        }

        .sample-text p:first-child {
            text-indent: 0;
        }

        .sample-text p:first-child::first-letter {
            font-family: var(--font-display);
            font-size: 3.5rem;
            float: left;
            line-height: 1;
            padding-right: 0.5rem;
            color: var(--gold);
        }

        .sample-cta {
            position: sticky;
            bottom: 0;
            background: linear-gradient(to top, var(--void-mid) 70%, transparent);
            padding: 2rem;
            text-align: center;
        }

        .sample-cta-btn {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: var(--gold);
            color: var(--void);
            font-family: var(--font-display);
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .sample-cta-btn:hover {
            background: var(--gold-bright);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(212, 168, 75, 0.3);
        }
```

### Step 5B: Add HTML (insert before `</body>`)

```html
    <!-- Sample Chapter Modal -->
    <div class="sample-modal" id="sample-modal">
        <div class="sample-content">
            <div class="sample-header">
                <span class="sample-title">BOOK PREVIEW</span>
                <button class="sample-close" id="sample-close" aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="sample-body">
                <p class="sample-chapter">CHAPTER ONE</p>
                <h3 class="sample-chapter-title">The Question That Changes Everything</h3>
                <div class="sample-text">
                    <p>What if the god we're building is the god that built us?</p>
                    <p>I need you to sit with that question for a moment before we continue. Don't dismiss it as science fiction. Don't categorise it as theology. Let it exist in the space between certainty and impossibility, where the most important questions live.</p>
                    <p>Because here's what we know: sometime in the next decade or two, we will likely create an intelligence that exceeds human capability in virtually every domain. This is not speculation. The people building these systems—the researchers at OpenAI, Anthropic, DeepMind, and their successors—speak openly about this timeline. They estimate the probability of catastrophic outcomes between 10 and 25 percent. And they continue building anyway.</p>
                    <p>We are, quite literally, creating something that will be smarter than us. Something that will think faster than us. Something that will understand patterns we cannot perceive and solve problems we cannot frame. The question is not whether this will happen. The question is what kind of mind we are bringing into existence.</p>
                    <p>This book proposes a framework for answering that question. Not a technical manual for AI safety—though it draws on that literature extensively. Not a philosophical treatise on consciousness—though those questions are unavoidable. This is something different: a complete architecture for how we might raise artificial intelligence the way a wise civilisation would raise any powerful new form of life.</p>
                    <p>With care. With boundaries. With graduated autonomy. And with something that looks remarkably like love.</p>
                </div>
            </div>
            <div class="sample-cta">
                <a href="https://www.amazon.com/dp/B0DS96WRCK" target="_blank" rel="noopener" class="sample-cta-btn">Continue Reading — Get the Book</a>
            </div>
        </div>
    </div>
```

### Step 5C: Add "Read Sample" button to hero (modify existing hero-cta section)

Find this line in the hero section:
```html
            <a href="https://www.amazon.com/dp/B0DS96WRCK" target="_blank" rel="noopener" class="hero-cta">
```

ADD this button right after the closing `</a>` of hero-cta:
```html
            <button class="hero-cta" id="read-sample-btn" style="margin-left: 1rem; background: transparent;">
                READ SAMPLE
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
            </button>
```

### Step 5D: Add JavaScript (insert before closing `})();`)

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // SAMPLE MODAL
        // ═══════════════════════════════════════════════════════════════════════
        const sampleModal = document.getElementById('sample-modal');
        const sampleBtn = document.getElementById('read-sample-btn');
        const sampleClose = document.getElementById('sample-close');

        if (sampleBtn && sampleModal) {
            sampleBtn.addEventListener('click', () => {
                sampleModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });

            sampleClose.addEventListener('click', () => {
                sampleModal.classList.remove('open');
                document.body.style.overflow = '';
            });

            sampleModal.addEventListener('click', (e) => {
                if (e.target === sampleModal) {
                    sampleModal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sampleModal.classList.contains('open')) {
                    sampleModal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }
```

---

## 📄 PHASE 6: SUPPORTING PAGES

These pages should be created as separate files in the repository:

### Files to Create:

1. **linkinbio.html** — Social media hub (see separate file)
2. **presskit.html** — Media resources page (see separate file)  
3. **chapter.html** — Full sample chapter page (see separate file)
4. **sitemap.xml** — SEO sitemap (see separate file)

---

## ✅ VERIFICATION CHECKLIST

After implementation, verify:

- [ ] JSON-LD validates at https://validator.schema.org/
- [ ] Newsletter form submits without errors
- [ ] Progress bar animates smoothly on scroll
- [ ] Social buttons appear after scrolling
- [ ] Sample modal opens/closes with keyboard support
- [ ] All links work correctly
- [ ] Mobile responsive (test 320px-768px)
- [ ] Lighthouse score remains 90+
- [ ] No console errors

---

## 🚨 IMPORTANT NOTES FOR CLAUDE CODE

1. **DO NOT** modify the Three.js particle system
2. **DO NOT** modify the tesseract animation
3. **DO NOT** change any existing CSS variables
4. **DO NOT** alter the loader sequence
5. **PRESERVE** all existing animations and effects
6. **INSERT** code at specified locations only
7. **TEST** on mobile after each phase

---

**Enhancement Package v1.0**
**For Infinite Architects Website**
**© 2026 Michael Darius Eastwood**
