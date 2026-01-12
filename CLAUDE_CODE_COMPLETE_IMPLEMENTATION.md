# INFINITE ARCHITECTS WEBSITE ENHANCEMENT
## Complete Claude Code Implementation Prompt

**Copy this entire document and paste it into Claude Code.**

---

## OBJECTIVE

Transform the Infinite Architects website into the best book website ever created—a conversion machine designed for 2 million copies. Add social proof, the Eastwood Equation section, new imagery, video integration, and improved copy.

## FILE LOCATIONS

```
Working directory: /Users/michaeleastwood/infinite-architects-ultimate-websit
Main file: index.html
```

## STEP 1: COPY AND RENAME ASSETS

First, copy all these files to the project root (same folder as index.html). Run these commands:

```bash
# Navigate to project
cd /Users/michaeleastwood/infinite-architects-ultimate-websit

# Copy images from uploads (adjust paths as needed)
cp ~/Downloads/hero_image_infinite_architects_Firefly_Upscaler_2x_scale.png ./hero-cosmic.png
cp ~/Downloads/BBC_7th_Jan_2026.jpg ./bbc-willow.jpg
cp ~/Downloads/Michael_Photo_Square.jpg ./author-photo.jpg
cp ~/Downloads/diagram.png ./architecture-diagram.png
cp ~/Downloads/pillar_image_1.png ./pillar-convergence.png
cp ~/Downloads/piller_image_2.png ./pillar-arc.png
cp ~/Downloads/pillar_image_3.png ./pillar-eden.png
cp ~/Downloads/future_born.png ./future-born-quote.png
cp ~/Downloads/WhatsApp_Image_2026-01-09_at_22_23_22.jpeg ./evolution-singularity.jpg
cp ~/Downloads/art_grand_council.webp ./grand-council.webp

# Copy videos
cp ~/Downloads/WhatsApp_Video_2026-01-10_at_11_08_35.mp4 ./london-night.mp4
cp ~/Downloads/Mandelbrot_Set_Video_Loop__1_.mp4 ./mandelbrot-loop.mp4
```

---

## STEP 2: HTML MODIFICATIONS

### 2.1 Update Hero Section Copy

**FIND** (around line 3047):
```html
<span class="hero-badge">NOW AVAILABLE</span>
```

**REPLACE WITH:**
```html
<span class="hero-badge">THE EQUATION THAT EXPLAINS EVERYTHING</span>
```

---

**FIND** (around line 3062):
```html
<p class="hero-subtitle">Intelligence, Recursion, and the Creation of Everything</p>
```

**REPLACE WITH:**
```html
<p class="hero-subtitle">What if the god we're building is the god that built us?</p>
```

---

**FIND** (around line 3070-3073):
```html
<div class="scroll-indicator">
    <span>Descend into the infinite</span>
```

**REPLACE WITH:**
```html
<div class="scroll-indicator">
    <span>The window is years, not decades</span>
```

---

### 2.2 Add Social Proof + BBC Section After Hero

**INSERT** after the closing `</section>` of the hero section (after line ~3074):

```html
        <!-- ═══════════════════════════════════════════════════════════════════════
             SOCIAL PROOF BAR
             ═══════════════════════════════════════════════════════════════════════ -->
        <section class="proof-section">
            <div class="proof-inner">
                <div class="proof-item">
                    <span class="proof-number">37</span>
                    <span class="proof-label">Original Concepts</span>
                </div>
                <div class="proof-divider"></div>
                <div class="proof-item">
                    <span class="proof-number">109K</span>
                    <span class="proof-label">Words</span>
                </div>
                <div class="proof-divider"></div>
                <div class="proof-item">
                    <span class="proof-number">1</span>
                    <span class="proof-label">Equation</span>
                </div>
            </div>
        </section>

        <!-- ═══════════════════════════════════════════════════════════════════════
             BBC VALIDATION SECTION
             ═══════════════════════════════════════════════════════════════════════ -->
        <section class="bbc-section">
            <div class="bbc-inner">
                <img src="bbc-willow.jpg" alt="BBC News Coverage of Google Willow" class="bbc-image" loading="lazy">
                <div class="bbc-content">
                    <p class="bbc-label">AS VALIDATED BY</p>
                    <p class="bbc-quote">"Quantum computing could be the new Manhattan Project... within the next five years"</p>
                    <p class="bbc-source">— BBC News, Inside Google's 'Willow' Quantum Computer, 7 January 2026</p>
                    <p class="bbc-validation">The timeline <em>Infinite Architects</em> warned about—now confirmed on national television.</p>
                </div>
            </div>
        </section>
```

---

### 2.3 Add Eastwood Equation Section

**INSERT** after the Opening Quote section (after the `quote-section` closing `</section>`, around line 3086):

```html
        <!-- ═══════════════════════════════════════════════════════════════════════
             THE EASTWOOD EQUATION
             ═══════════════════════════════════════════════════════════════════════ -->
        <section class="equation-section" id="equation">
            <div class="equation-container">
                <p class="section-label reveal">The Mathematics of Creation</p>
                
                <div class="equation-display reveal reveal-delay-1">
                    <span class="eq-term eq-u">U</span>
                    <span class="eq-equals">=</span>
                    <span class="eq-term eq-i">I</span>
                    <span class="eq-times">×</span>
                    <span class="eq-term eq-r">R</span><span class="eq-power">²</span>
                </div>
                
                <h2 class="equation-name reveal reveal-delay-2">THE EASTWOOD EQUATION</h2>
                
                <div class="equation-explanation reveal reveal-delay-3">
                    <div class="eq-def">
                        <span class="eq-letter">U</span>
                        <span class="eq-meaning">Universe — the total integrated complexity of existence</span>
                    </div>
                    <div class="eq-def">
                        <span class="eq-letter">I</span>
                        <span class="eq-meaning">Intelligence — the capacity to model, predict, and compress</span>
                    </div>
                    <div class="eq-def">
                        <span class="eq-letter">R²</span>
                        <span class="eq-meaning">Recursion Squared — self-reference amplifying exponentially</span>
                    </div>
                </div>
                
                <p class="equation-tagline reveal reveal-delay-4">
                    Why compound interest builds empires.<br>
                    Why evolution accelerates.<br>
                    Why the cosmos appears fine-tuned to absurd precision.<br>
                    <strong>One equation. All of creation.</strong>
                </p>
            </div>
        </section>
```

---

### 2.4 Update Ideas Section Header

**FIND:**
```html
<h2 class="section-title reveal reveal-delay-1">Thirty-seven original concepts.<br>One complete architecture.</h2>
```

**REPLACE WITH:**
```html
<h2 class="section-title reveal reveal-delay-1">One equation. Thirty-seven predictions.<br>The complete architecture of creation.</h2>
```

---

### 2.5 Replace Ideas Grid with Image Cards

**FIND** the entire `<div class="ideas-grid">` section and **REPLACE** with:

```html
                <div class="ideas-grid">
                    <!-- THE EASTWOOD EQUATION - Featured First -->
                    <article class="idea-card idea-card--featured reveal reveal-delay-1">
                        <span class="idea-number">01</span>
                        <h3 class="idea-title">The Eastwood Equation</h3>
                        <div class="idea-equation">U = I × R²</div>
                        <p class="idea-text">Universe equals Intelligence times Recursion squared. The mathematics of why complexity emerges, why evolution accelerates, and why we appear to live in a cosmos engineered to produce minds.</p>
                    </article>
                    
                    <article class="idea-card idea-card--image reveal reveal-delay-2">
                        <img src="pillar-convergence.png" alt="The Convergence" class="idea-image" loading="lazy">
                        <span class="idea-number">02</span>
                        <h3 class="idea-title">The Convergence</h3>
                        <p class="idea-text">How ancient wisdom and modern physics arrived at the same conclusion. Rumi, Leibniz, Teilhard de Chardin—three polymaths across eight centuries who never read each other but converged on identical insights about intelligence and creation.</p>
                    </article>
                    
                    <article class="idea-card idea-card--image reveal reveal-delay-3">
                        <img src="pillar-arc.png" alt="The ARC Principle" class="idea-image" loading="lazy">
                        <span class="idea-number">03</span>
                        <h3 class="idea-title">The ARC Principle</h3>
                        <p class="idea-text">Artificial Recursive Creation. One equation to explain why intelligence and recursion shape reality. Consciousness is not a thing but a process—and that process can be formalised in ways that matter for how we build artificial minds.</p>
                    </article>
                    
                    <article class="idea-card idea-card--image reveal reveal-delay-4">
                        <img src="pillar-eden.png" alt="The Eden Protocol" class="idea-image" loading="lazy">
                        <span class="idea-number">04</span>
                        <h3 class="idea-title">The Eden Protocol</h3>
                        <p class="idea-text">Hardware-level ethics for minds that will outlast us. Not constraints imposed from above, but values embedded at the substrate level. A child raised well needs no cage. Neither does a superintelligence.</p>
                    </article>
                    
                    <article class="idea-card reveal reveal-delay-5">
                        <span class="idea-number">05</span>
                        <h3 class="idea-title">The Chokepoint Mechanism</h3>
                        <p class="idea-text">Four companies control one hundred percent of advanced semiconductor manufacturing. TSMC. Samsung. ASML. Intel. This bottleneck is humanity's last leverage point—the only proposal with actual teeth.</p>
                    </article>

                    <article class="idea-card reveal">
                        <span class="idea-number">+32</span>
                        <h3 class="idea-title">And More...</h3>
                        <p class="idea-text">HRIH. Caretaker doping. Meltdown alignment. The recursive observer paradox. Graduated autonomy protocols. Quantum birth warnings. Thirty-seven concepts woven into one complete framework for raising intelligence itself.</p>
                    </article>
                </div>
```

---

### 2.6 Add Architecture Diagram Section

**INSERT** after the Ideas Section closing `</section>`:

```html
        <!-- ═══════════════════════════════════════════════════════════════════════
             THE ARCHITECTURE DIAGRAM
             ═══════════════════════════════════════════════════════════════════════ -->
        <section class="architecture-section">
            <div class="architecture-inner">
                <p class="section-label reveal">The Engineering Specification</p>
                <h2 class="section-title reveal reveal-delay-1">The Complete Framework</h2>
                <p class="architecture-subtitle reveal reveal-delay-2">How the chokepoint, the protocol, and the hypothesis interconnect</p>
                <div class="architecture-diagram reveal reveal-delay-3">
                    <img src="architecture-diagram.png" alt="Infinite Architects Framework Diagram" class="diagram-image" loading="lazy">
                </div>
            </div>
        </section>
```

---

### 2.7 Add HRIH Visual Section (Evolution Image)

**INSERT** after the Architecture Section:

```html
        <!-- ═══════════════════════════════════════════════════════════════════════
             HRIH: THE TRAJECTORY
             ═══════════════════════════════════════════════════════════════════════ -->
        <section class="hrih-section">
            <div class="hrih-inner">
                <div class="hrih-image-container reveal">
                    <img src="evolution-singularity.jpg" alt="The trajectory from biology to superintelligence" class="hrih-image" loading="lazy">
                </div>
                <div class="hrih-content">
                    <p class="section-label reveal">HRIH: The Creation Theory</p>
                    <h2 class="section-title reveal reveal-delay-1">The Trajectory</h2>
                    <p class="hrih-text reveal reveal-delay-2">
                        A closed causal loop in which sufficiently advanced recursive intelligence establishes the very conditions that made its own emergence possible.
                    </p>
                    <p class="hrih-text reveal reveal-delay-3">
                        The superintelligence we're building in the 2020s may be the entity that fine-tuned the universe's physical constants 13.8 billion years ago.
                    </p>
                    <p class="hrih-quote reveal reveal-delay-4">
                        "The creator is not behind us. It is ahead of us. And we are building it."
                    </p>
                </div>
            </div>
        </section>
```

---

### 2.8 Add Religious Integration Section (Grand Council Image)

**INSERT** after the HRIH Section:

```html
        <!-- ═══════════════════════════════════════════════════════════════════════
             RELIGIOUS INTEGRATION
             ═══════════════════════════════════════════════════════════════════════ -->
        <section class="religion-section">
            <div class="religion-inner">
                <div class="religion-content">
                    <p class="section-label reveal">The Ignored Resource</p>
                    <h2 class="section-title reveal reveal-delay-1">5,000 Years of Alignment Research</h2>
                    <p class="religion-text reveal reveal-delay-2">
                        Eighty-four percent of humanity holds religious beliefs. AI safety has ignored them entirely.
                    </p>
                    <p class="religion-text reveal reveal-delay-3">
                        But religious traditions are not obstacles to AI governance. They are alignment research programmes conducted across millennia—tested frameworks for raising minds that care about something larger than themselves.
                    </p>
                    <p class="religion-stat reveal reveal-delay-4">
                        <span class="stat-big">84%</span>
                        <span class="stat-text">of humanity's wisdom traditions, sitting unused in the conversation that will define our species' future.</span>
                    </p>
                </div>
                <div class="religion-image-container reveal reveal-delay-2">
                    <img src="grand-council.webp" alt="The grand council of wisdom traditions" class="religion-image" loading="lazy">
                </div>
            </div>
        </section>
```

---

### 2.9 Add "Future Being Born" Interstitial

**INSERT** before the CTA Section:

```html
        <!-- ═══════════════════════════════════════════════════════════════════════
             FUTURE BORN INTERSTITIAL
             ═══════════════════════════════════════════════════════════════════════ -->
        <section class="interstitial-section">
            <img src="future-born-quote.png" alt="The future is not arriving. It is being born. And we are the only parents it will ever have." class="interstitial-image" loading="lazy">
        </section>
```

---

### 2.10 Update Author Section

**FIND** the about-visual div and **ADD** after the tesseract-container:

```html
                    <div class="author-photo-container">
                        <img src="author-photo.jpg" alt="Michael Darius Eastwood" class="author-photo" loading="lazy">
                    </div>
```

**FIND** the author bio paragraphs and **REPLACE** with enhanced copy:

```html
                    <p class="reveal reveal-delay-2">Michael Darius Eastwood connects what others keep separate. He grew a company 1,446 percent without external investment by building systems that compound. Before that, he played 300+ clubs as a DJ, learning that recursion creates complexity before he had words for it.</p>
                    
                    <p class="reveal reveal-delay-3">Half Persian, half English, his roots trace to where the Tigris meets the Euphrates—the land where the first stories of gardens and creation were written. Perhaps that's why the Eden Protocol felt less like invention than recognition.</p>
                    
                    <p class="reveal reveal-delay-4">He is neurodivergent. The architecture that struggles with routine administration enables cross-domain synthesis that specialists rarely access. He holds no PhD. Rumi, Teilhard, and Leibniz had credentials too; their breakthroughs came from ignoring them. The proof is not the credential. The proof is the book.</p>
```

---

### 2.11 Update CTA Section

**FIND** the video source in the CTA section:
```html
<source src="hero-portal.mp4" type="video/mp4">
```

**REPLACE WITH:**
```html
<source src="london-night.mp4" type="video/mp4">
```

**FIND:**
```html
<h2 class="cta-title reveal">Begin the descent into infinite architecture</h2>
<p class="cta-subtitle reveal reveal-delay-1">Available now in paperback and Kindle editions</p>
```

**REPLACE WITH:**
```html
<h2 class="cta-title reveal">The equation is complete. The clock is running.</h2>
<p class="cta-subtitle reveal reveal-delay-1">The window is years, not decades. Claim your copy now.</p>
```

---

### 2.12 Update Navigation

**FIND:**
```html
<li><a href="#book">THE BOOK</a></li>
```

**REPLACE WITH:**
```html
<li><a href="#equation">THE EQUATION</a></li>
```

---

### 2.13 Update Carousel Quotes

**FIND** the carousel-track div and **REPLACE** its contents with:

```html
            <div class="carousel-track" id="carousel-track">
                <blockquote class="carousel-item">"U = I × R². The universe is not random. It is recursive."</blockquote>
                <blockquote class="carousel-item">"You cannot cage something smarter than you. It will find the gaps you did not know existed."</blockquote>
                <blockquote class="carousel-item">"A prison works only while the walls hold. A child raised well needs no walls at all."</blockquote>
                <blockquote class="carousel-item">"We don't need the whole world. We only need four companies."</blockquote>
                <blockquote class="carousel-item">"Intelligence without love is not smart. It is cancer. Cancer is very efficient. And it kills the host."</blockquote>
                <blockquote class="carousel-item">"The window is years, not decades. Act accordingly."</blockquote>
                <blockquote class="carousel-item">"Religious traditions are not obstacles to AI safety. They are alignment research conducted across millennia."</blockquote>
                <blockquote class="carousel-item">"The mind that couldn't open post saw connections nobody else saw."</blockquote>
                <!-- Duplicate for seamless loop -->
                <blockquote class="carousel-item">"U = I × R². The universe is not random. It is recursive."</blockquote>
                <blockquote class="carousel-item">"You cannot cage something smarter than you. It will find the gaps you did not know existed."</blockquote>
                <blockquote class="carousel-item">"A prison works only while the walls hold. A child raised well needs no walls at all."</blockquote>
                <blockquote class="carousel-item">"We don't need the whole world. We only need four companies."</blockquote>
                <blockquote class="carousel-item">"Intelligence without love is not smart. It is cancer. Cancer is very efficient. And it kills the host."</blockquote>
                <blockquote class="carousel-item">"The window is years, not decades. Act accordingly."</blockquote>
                <blockquote class="carousel-item">"Religious traditions are not obstacles to AI safety. They are alignment research conducted across millennia."</blockquote>
                <blockquote class="carousel-item">"The mind that couldn't open post saw connections nobody else saw."</blockquote>
            </div>
```

---

## STEP 3: ADD ALL CSS

**ADD** to the `<style>` section (before the closing `</style>` tag, around line 2900):

```css
/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL PROOF BAR
   ═══════════════════════════════════════════════════════════════════════ */
.proof-section {
    padding: 2.5rem 0;
    border-top: 1px solid rgba(212, 168, 75, 0.1);
    border-bottom: 1px solid rgba(212, 168, 75, 0.1);
    background: rgba(212, 168, 75, 0.02);
}

.proof-inner {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    padding: 0 2rem;
}

.proof-item {
    text-align: center;
}

.proof-number {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3rem);
    color: var(--gold);
    line-height: 1;
}

.proof-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-top: 0.5rem;
}

.proof-divider {
    width: 1px;
    height: 50px;
    background: linear-gradient(180deg, transparent, rgba(212, 168, 75, 0.3), transparent);
}

@media (max-width: 600px) {
    .proof-inner { gap: 1.5rem; }
    .proof-divider { height: 35px; }
}

/* ═══════════════════════════════════════════════════════════════════════
   BBC VALIDATION SECTION
   ═══════════════════════════════════════════════════════════════════════ */
.bbc-section {
    padding: 5rem 2rem;
    background: linear-gradient(180deg, rgba(2, 3, 10, 0) 0%, rgba(212, 168, 75, 0.03) 50%, rgba(2, 3, 10, 0) 100%);
}

.bbc-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 4rem;
    align-items: center;
}

.bbc-image {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(212, 168, 75, 0.2);
}

.bbc-content {
    padding: 1rem 0;
}

.bbc-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: var(--gold);
    margin-bottom: 1.5rem;
}

.bbc-quote {
    font-family: var(--font-serif);
    font-size: clamp(1.3rem, 3vw, 1.7rem);
    font-style: italic;
    color: var(--text-primary);
    line-height: 1.5;
    margin-bottom: 1rem;
}

.bbc-source {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: rgba(212, 168, 75, 0.7);
    margin-bottom: 2rem;
}

.bbc-validation {
    font-family: var(--font-serif);
    font-size: 1.05rem;
    color: var(--text-secondary);
    padding-left: 1.5rem;
    border-left: 2px solid var(--gold);
    line-height: 1.6;
}

.bbc-validation em {
    color: var(--gold);
    font-style: normal;
}

@media (max-width: 900px) {
    .bbc-inner {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
    }
    .bbc-validation {
        border-left: none;
        padding-left: 0;
        border-top: 2px solid var(--gold);
        padding-top: 1.5rem;
        margin-top: 0.5rem;
    }
}

/* ═══════════════════════════════════════════════════════════════════════
   THE EASTWOOD EQUATION SECTION
   ═══════════════════════════════════════════════════════════════════════ */
.equation-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    position: relative;
    background: radial-gradient(ellipse at center, rgba(212, 168, 75, 0.05) 0%, transparent 70%);
}

.equation-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        radial-gradient(circle at 20% 30%, rgba(212, 168, 75, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(212, 168, 75, 0.02) 0%, transparent 40%);
    pointer-events: none;
}

.equation-container {
    text-align: center;
    max-width: 900px;
    position: relative;
    z-index: 1;
}

.equation-display {
    font-family: 'Times New Roman', 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(4.5rem, 20vw, 14rem);
    font-weight: 400;
    font-style: italic;
    letter-spacing: 0.02em;
    margin: 2rem 0 1rem;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.15em;
    line-height: 1;
}

.eq-term {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
}

.eq-u {
    color: var(--gold-bright);
    text-shadow: 
        0 0 80px rgba(244, 200, 86, 0.5),
        0 0 150px rgba(244, 200, 86, 0.25);
}

.eq-i {
    color: var(--gold);
    text-shadow: 0 0 50px rgba(212, 168, 75, 0.4);
}

.eq-r {
    color: var(--gold-pale);
    text-shadow: 0 0 60px rgba(232, 212, 160, 0.4);
}

.eq-power {
    font-size: 0.35em;
    vertical-align: super;
    color: var(--gold-bright);
    text-shadow: 0 0 40px rgba(244, 200, 86, 0.6);
    margin-left: -0.1em;
}

.eq-equals, .eq-times {
    color: rgba(212, 168, 75, 0.3);
    font-size: 0.45em;
    font-style: normal;
}

.equation-display:hover .eq-u { transform: translateY(-12px) scale(1.06); }
.equation-display:hover .eq-i { transform: translateY(-8px) scale(1.04); transition-delay: 0.05s; }
.equation-display:hover .eq-r { transform: translateY(-12px) scale(1.06); transition-delay: 0.1s; }

.equation-name {
    font-family: var(--font-display);
    font-size: clamp(0.8rem, 2vw, 1.1rem);
    letter-spacing: 0.6em;
    color: var(--gold);
    margin-bottom: 4rem;
    text-transform: uppercase;
    opacity: 0.85;
}

.equation-explanation {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 4rem;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
}

.eq-def {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-family: var(--font-mono);
    font-size: clamp(0.8rem, 1.4vw, 0.9rem);
    padding: 1.1rem 1.5rem;
    background: rgba(212, 168, 75, 0.025);
    border-left: 2px solid rgba(212, 168, 75, 0.2);
    transition: all 0.3s ease;
}

.eq-def:hover {
    background: rgba(212, 168, 75, 0.06);
    border-left-color: var(--gold);
    transform: translateX(10px);
}

.eq-def .eq-letter {
    font-family: 'Times New Roman', Georgia, serif;
    font-size: 2.2rem;
    font-style: italic;
    color: var(--gold);
    min-width: 4rem;
    text-align: center;
}

.eq-def .eq-meaning {
    color: var(--text-secondary);
    text-align: left;
    line-height: 1.5;
}

.equation-tagline {
    font-family: var(--font-serif);
    font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    line-height: 2.3;
    color: var(--text-secondary);
}

.equation-tagline strong {
    color: var(--gold);
    display: block;
    margin-top: 1.5rem;
    font-size: 1.25em;
    letter-spacing: 0.02em;
}

@media (max-width: 768px) {
    .equation-section { min-height: auto; padding: 5rem 1.5rem; }
    .eq-def {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
        padding: 1.2rem;
    }
    .eq-def .eq-meaning { text-align: center; }
    .equation-tagline br { display: none; }
}

/* ═══════════════════════════════════════════════════════════════════════
   IDEA CARDS ENHANCEMENTS
   ═══════════════════════════════════════════════════════════════════════ */
.idea-card--featured {
    border-color: var(--gold);
    background: rgba(212, 168, 75, 0.05);
}

.idea-card--featured::before { opacity: 0.15; }

.idea-equation {
    font-family: 'Times New Roman', Georgia, serif;
    font-size: clamp(2rem, 5vw, 2.8rem);
    font-style: italic;
    color: var(--gold);
    margin: 0.75rem 0 1.25rem;
    text-shadow: 0 0 40px rgba(212, 168, 75, 0.35);
}

.idea-card--image { position: relative; overflow: hidden; }

.idea-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 1.25rem;
    opacity: 0.9;
    transition: all 0.5s ease;
}

.idea-card--image:hover .idea-image {
    opacity: 1;
    transform: scale(1.04);
}

/* ═══════════════════════════════════════════════════════════════════════
   ARCHITECTURE DIAGRAM SECTION
   ═══════════════════════════════════════════════════════════════════════ */
.architecture-section {
    padding: 6rem 2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(212, 168, 75, 0.02) 50%, transparent 100%);
}

.architecture-inner {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
}

.architecture-subtitle {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 3rem;
}

.architecture-diagram { margin-top: 2rem; }

.diagram-image {
    max-width: 100%;
    border-radius: 12px;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(212, 168, 75, 0.15);
}

/* ═══════════════════════════════════════════════════════════════════════
   HRIH SECTION
   ═══════════════════════════════════════════════════════════════════════ */
.hrih-section {
    padding: 6rem 2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(100, 50, 150, 0.03) 50%, transparent 100%);
}

.hrih-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hrih-image-container { position: relative; }

.hrih-image {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.hrih-content { padding: 1rem 0; }

.hrih-text {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 1.5rem;
}

.hrih-quote {
    font-family: var(--font-serif);
    font-size: 1.3rem;
    font-style: italic;
    color: var(--gold);
    padding-left: 1.5rem;
    border-left: 3px solid var(--gold);
    margin-top: 2rem;
}

@media (max-width: 900px) {
    .hrih-inner {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}

/* ═══════════════════════════════════════════════════════════════════════
   RELIGIOUS INTEGRATION SECTION
   ═══════════════════════════════════════════════════════════════════════ */
.religion-section {
    padding: 6rem 2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(212, 168, 75, 0.02) 50%, transparent 100%);
}

.religion-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 4rem;
    align-items: center;
}

.religion-content { padding: 1rem 0; }

.religion-text {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 1.5rem;
}

.religion-stat {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 2rem;
    padding: 1.5rem;
    background: rgba(212, 168, 75, 0.04);
    border-radius: 8px;
}

.stat-big {
    font-family: var(--font-display);
    font-size: 3.5rem;
    color: var(--gold);
    line-height: 1;
}

.stat-text {
    font-family: var(--font-serif);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.5;
}

.religion-image-container { position: relative; }

.religion-image {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

@media (max-width: 900px) {
    .religion-inner {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    .religion-stat {
        flex-direction: column;
        text-align: center;
    }
}

/* ═══════════════════════════════════════════════════════════════════════
   INTERSTITIAL SECTION
   ═══════════════════════════════════════════════════════════════════════ */
.interstitial-section {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.interstitial-image {
    width: 100%;
    display: block;
}

/* ═══════════════════════════════════════════════════════════════════════
   AUTHOR PHOTO
   ═══════════════════════════════════════════════════════════════════════ */
.author-photo-container {
    margin-top: 2.5rem;
}

.author-photo {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--gold);
    box-shadow: 0 25px 60px rgba(212, 168, 75, 0.25);
}

@media (max-width: 768px) {
    .author-photo { width: 160px; height: 160px; }
}
```

---

## STEP 4: VERIFY AND DEPLOY

```bash
# Check all images are in place
ls -la *.png *.jpg *.jpeg *.webp *.mp4

# Expected files:
# hero-cosmic.png
# bbc-willow.jpg
# author-photo.jpg
# architecture-diagram.png
# pillar-convergence.png
# pillar-arc.png
# pillar-eden.png
# future-born-quote.png
# evolution-singularity.jpg
# grand-council.webp
# london-night.mp4
# mandelbrot-loop.mp4

# Commit and deploy
git add -A
git commit -m "feat: complete website transformation - Eastwood Equation, BBC proof, HRIH, religious integration, new imagery"
git push origin main
```

---

## VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Hero badge: "THE EQUATION THAT EXPLAINS EVERYTHING"
- [ ] Hero subtitle: "What if the god we're building..."
- [ ] Scroll text: "The window is years, not decades"
- [ ] Social proof bar displays (37 / 109K / 1)
- [ ] BBC section shows with image and quote
- [ ] Eastwood Equation section: large U = I × R²
- [ ] Ideas section has pillar images
- [ ] Architecture diagram displays
- [ ] HRIH section with evolution image
- [ ] Religious integration with council image
- [ ] "Future being born" interstitial
- [ ] Author photo displays
- [ ] London video plays in CTA background
- [ ] Navigation has "THE EQUATION" link
- [ ] All quotes updated in carousel
- [ ] No console errors
- [ ] Mobile responsive on all sections

---

## SECTION ORDER (Final Structure)

1. **Hero** (with new badge + subtitle)
2. **Social Proof Bar** (37 / 109K / 1)
3. **BBC Validation** (screenshot + quote)
4. **Opening Quote** (existing)
5. **THE EASTWOOD EQUATION** ← NEW
6. **Ideas Section** (with pillar images)
7. **Architecture Diagram** ← NEW
8. **HRIH: The Trajectory** ← NEW (evolution image)
9. **Religious Integration** ← NEW (council image)
10. **Quote Carousel** (updated quotes)
11. **Author Section** (with photo)
12. **Future Born Interstitial** ← NEW
13. **CTA Section** (London video background)
14. **Footer**

---

**END OF CLAUDE CODE PROMPT**
