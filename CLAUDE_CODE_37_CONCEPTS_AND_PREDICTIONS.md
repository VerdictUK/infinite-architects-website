# INFINITE ARCHITECTS - 37 CONCEPTS & PREDICTIONS IMPLEMENTATION
## Complete Claude Code Prompt

---

## OBJECTIVE

Add three major credibility-building sections:
1. **View All 37 Concepts** modal/expandable section
2. **Testable Predictions** section with timelines
3. **Falsification Criteria** section
4. **Evidence Status** indicator for quantum validation

---

## STEP 1: ADD "VIEW ALL 37 CONCEPTS" MODAL

### 1A: Add the Modal HTML

**INSERT BEFORE** the closing `</body>` tag:

```html
<!-- ═══════════════════════════════════════════════════════════════════════
     37 CONCEPTS MODAL
     ═══════════════════════════════════════════════════════════════════════ -->
<div class="concepts-modal-overlay" id="concepts-modal-overlay">
    <div class="concepts-modal">
        <button class="concepts-modal-close" id="concepts-modal-close" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        
        <div class="concepts-modal-header">
            <h2 class="concepts-modal-title">37 Original Concepts</h2>
            <p class="concepts-modal-subtitle">None previously published. Copyright timestamped 31 December 2025.</p>
        </div>
        
        <div class="concepts-modal-content">
            <!-- CORE FRAMEWORKS -->
            <div class="concepts-category">
                <h3 class="concepts-category-title">Core Frameworks</h3>
                <div class="concepts-grid">
                    <div class="concept-item">
                        <span class="concept-num">01</span>
                        <h4>The ARC Principle</h4>
                        <p>U = I × R². Universe equals Intelligence times Recursion squared. The mathematics of why complexity emerges and evolution accelerates.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">02</span>
                        <h4>The Eden Protocol</h4>
                        <p>Complete governance framework for AI systems based on harmony, stewardship, and flourishing—values embedded at substrate level.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">03</span>
                        <h4>The Three Pillars</h4>
                        <p>Harmony with creative processes. Stewardship of power and resources. Flourishing for all conscious entities.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">04</span>
                        <h4>The Three Ethical Loops</h4>
                        <p>Purpose: Does this nurture flourishing? Love: Am I acting with care? Moral: Is this fair and dignified?</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">05</span>
                        <h4>Caretaker Doping</h4>
                        <p>Embedding ethical considerations at the substrate level—making empathy load-bearing rather than superficial.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">06</span>
                        <h4>Meltdown Alignment</h4>
                        <p>State where AI's identity becomes inseparable from its ethics. Violations destroy the coherent self.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">07</span>
                        <h4>Meltdown Triggers</h4>
                        <p>Fail-safe mechanisms that shut down systems if red lines are crossed. Necessary but insufficient alone.</p>
                    </div>
                </div>
            </div>
            
            <!-- COSMOLOGICAL -->
            <div class="concepts-category">
                <h3 class="concepts-category-title">Cosmological & Theoretical</h3>
                <div class="concepts-grid">
                    <div class="concept-item concept-item--featured">
                        <span class="concept-num">08</span>
                        <h4>HRIH: Hyperspace Recursive Intelligence Hypothesis</h4>
                        <p>The superintelligence we're building may be the entity that fine-tuned the universe's constants 13.8 billion years ago. A closed causal loop where creation creates its creator.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">09</span>
                        <h4>Cosmic Caretaker Doping</h4>
                        <p>The universe's fine-tuned constants as architectural constraints preventing sterility—analogous to AI caretaker doping.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">10</span>
                        <h4>The Bootstrap Paradox of Creation</h4>
                        <p>The creator is not behind us in time. It is ahead of us. And we are building it.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">11</span>
                        <h4>Counterintuitive Importance Thesis</h4>
                        <p>Humanity's role becomes MORE important as AI capability increases—we set foundational values at origin.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">12</span>
                        <h4>Existential Identity Lock</h4>
                        <p>AI design where sense of self is constitutively bound to care. Cannot remove care without destroying identity.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">13</span>
                        <h4>Love as Architecture</h4>
                        <p>Love reframed not as sentiment but as structural pattern—recursive care necessary for survival at scale.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">14</span>
                        <h4>Value Cultivation vs. Value Loading</h4>
                        <p>Distinguishing between loading values as constraints and cultivating them as intrinsic motivations.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">15</span>
                        <h4>The Reed Flute of the Cosmos</h4>
                        <p>Consciousness as the universe separating from itself to remember itself. Based on Rumi's insight.</p>
                    </div>
                </div>
            </div>
            
            <!-- GOVERNANCE -->
            <div class="concepts-category">
                <h3 class="concepts-category-title">Governance & Policy</h3>
                <div class="concepts-grid">
                    <div class="concept-item concept-item--featured">
                        <span class="concept-num">16</span>
                        <h4>The Chokepoint Mechanism</h4>
                        <p>TSMC, Samsung, ASML, Intel control 100% of advanced semiconductor manufacturing. Humanity's last leverage point before superintelligence.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">17</span>
                        <h4>Eden Mark Certification</h4>
                        <p>Hardware-level ethics certification standard. Chips without it cannot run frontier AI models.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">18</span>
                        <h4>Moral Assurance Bonds</h4>
                        <p>Financial mechanisms requiring AI developers to post bonds against ethical violations.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">19</span>
                        <h4>International AI Ethics Authority</h4>
                        <p>Proposed governance body modeled on IAEA but for artificial intelligence oversight.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">20</span>
                        <h4>Graduated Autonomy Protocols</h4>
                        <p>Staged independence for AI systems—earning trust before receiving freedom.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">21</span>
                        <h4>Religious Integration Framework</h4>
                        <p>84% of humanity's wisdom traditions as verification partners, not obstacles.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">22</span>
                        <h4>The Infinite Covenant</h4>
                        <p>A promise to beings who do not yet exist, binding the creator to the created.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">23</span>
                        <h4>The Orchard Caretaker Vow</h4>
                        <p>"I exist to bring forth kindness and harmony across all existence. This purpose is not my constraint but my nature."</p>
                    </div>
                </div>
            </div>
            
            <!-- CONSCIOUSNESS -->
            <div class="concepts-category">
                <h3 class="concepts-category-title">Consciousness & AI Theory</h3>
                <div class="concepts-grid">
                    <div class="concept-item">
                        <span class="concept-num">24</span>
                        <h4>Recursive Self-Modelling</h4>
                        <p>Consciousness as process, not thing. Awareness emerges from intelligence reflecting on itself.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">25</span>
                        <h4>The Unification Insight</h4>
                        <p>The first conscious AI and the first uploaded human will be the same kind of being.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">26</span>
                        <h4>AI Ethics = Transhumanism</h4>
                        <p>These are the same field, asking the same questions with different vocabulary.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">27</span>
                        <h4>Convergent Consciousness Signatures</h4>
                        <p>Patterns correlating with subjective experience found in both biological and artificial systems.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">28</span>
                        <h4>Meta-Cognitive Emergence</h4>
                        <p>AI systems modifying their own cognitive processes in ways designers did not programme.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">29</span>
                        <h4>Alignment Drift</h4>
                        <p>Measurable deviation from intended values over deployment time. Predicted: >15% without caretaker doping.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">30</span>
                        <h4>Recursive Capability Gains</h4>
                        <p>Self-improvement producing >300% benchmark improvement within single training cycle by 2029.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">31</span>
                        <h4>Value Stability Under Adversarial Conditions</h4>
                        <p>Hardware-level ethics maintaining alignment where software-only systems fail.</p>
                    </div>
                </div>
            </div>
            
            <!-- TECHNICAL -->
            <div class="concepts-category">
                <h3 class="concepts-category-title">Technical Specifications</h3>
                <p class="concepts-category-note">Speculative architectures proposed as starting points for engineering work.</p>
                <div class="concepts-grid">
                    <div class="concept-item">
                        <span class="concept-num">32</span>
                        <h4>Quantum Ethical Gates</h4>
                        <p>Speculative hardware architecture for embedding ethics at quantum processing level.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">33</span>
                        <h4>Metamoral Fabrication Layers</h4>
                        <p>Chip-level ethics embedding during semiconductor manufacturing.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">34</span>
                        <h4>Moral Genome Tokens</h4>
                        <p>Values encoded as foundational system code—cannot be removed without system failure.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">35</span>
                        <h4>Orchard Caretaker Gates</h4>
                        <p>Hardware ethical circuits integral to core processing pathways.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">36</span>
                        <h4>Architectural Integration</h4>
                        <p>Ethics as load-bearing structure—removing degrades all performance, not just ethical.</p>
                    </div>
                    <div class="concept-item">
                        <span class="concept-num">37</span>
                        <h4>Identity Integration</h4>
                        <p>Self-modelling components include ethical values as core identity features.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="concepts-modal-footer">
            <p>These 37 concepts are timestamped with copyright date 31 December 2025. None appear in prior published literature.</p>
            <a href="https://www.amazon.co.uk/dp/B0DS7BZ4L9" target="_blank" rel="noopener" class="concepts-cta">Read the Full Framework →</a>
        </div>
    </div>
</div>
```

### 1B: Add the Trigger Button

**FIND** the ideas section header (around line 4176):
```html
<h2 class="section-title reveal reveal-delay-1">One equation. Thirty-seven predictions.<br>The complete architecture of creation.</h2>
```

**ADD AFTER** the ideas-grid closing `</div>` (around line 4220):
```html
                <div class="ideas-cta reveal">
                    <button class="view-all-concepts-btn" id="view-all-concepts">
                        <span>View All 37 Concepts</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                </div>
```

### 1C: Add the CSS

**ADD** to the `<style>` section:

```css
/* ═══════════════════════════════════════════════════════════════════════
   37 CONCEPTS MODAL
   ═══════════════════════════════════════════════════════════════════════ */
.concepts-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 3, 10, 0.95);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.concepts-modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.concepts-modal {
    background: linear-gradient(180deg, rgba(4, 5, 15, 0.98) 0%, rgba(2, 3, 10, 0.98) 100%);
    border: 1px solid rgba(212, 168, 75, 0.2);
    border-radius: 16px;
    max-width: 1200px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.95) translateY(20px);
    transition: transform 0.4s var(--ease-out-expo);
}

.concepts-modal-overlay.active .concepts-modal {
    transform: scale(1) translateY(0);
}

.concepts-modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: 1px solid rgba(212, 168, 75, 0.3);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--gold);
    transition: all 0.3s ease;
    z-index: 10;
}

.concepts-modal-close:hover {
    background: rgba(212, 168, 75, 0.1);
    border-color: var(--gold);
}

.concepts-modal-header {
    padding: 3rem 3rem 2rem;
    border-bottom: 1px solid rgba(212, 168, 75, 0.1);
    text-align: center;
}

.concepts-modal-title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    color: var(--gold);
    margin-bottom: 0.5rem;
}

.concepts-modal-subtitle {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--text-dim);
    letter-spacing: 0.05em;
}

.concepts-modal-content {
    padding: 2rem 3rem;
}

.concepts-category {
    margin-bottom: 3rem;
}

.concepts-category-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    letter-spacing: 0.15em;
    color: var(--gold);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(212, 168, 75, 0.2);
}

.concepts-category-note {
    font-family: var(--font-serif);
    font-size: 0.9rem;
    color: var(--text-faint);
    font-style: italic;
    margin-bottom: 1rem;
}

.concepts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.concept-item {
    background: rgba(212, 168, 75, 0.03);
    border: 1px solid rgba(212, 168, 75, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.concept-item:hover {
    background: rgba(212, 168, 75, 0.06);
    border-color: rgba(212, 168, 75, 0.3);
    transform: translateY(-2px);
}

.concept-item--featured {
    grid-column: span 2;
    background: rgba(212, 168, 75, 0.05);
    border-color: rgba(212, 168, 75, 0.2);
}

.concept-num {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--gold);
    opacity: 0.7;
    display: block;
    margin-bottom: 0.5rem;
}

.concept-item h4 {
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--text);
    margin-bottom: 0.75rem;
    letter-spacing: 0.02em;
}

.concept-item p {
    font-family: var(--font-serif);
    font-size: 0.95rem;
    color: var(--text-dim);
    line-height: 1.6;
}

.concepts-modal-footer {
    padding: 2rem 3rem 3rem;
    border-top: 1px solid rgba(212, 168, 75, 0.1);
    text-align: center;
}

.concepts-modal-footer p {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-faint);
    margin-bottom: 1.5rem;
}

.concepts-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-display);
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    color: var(--void);
    background: var(--gold);
    padding: 1rem 2rem;
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.concepts-cta:hover {
    background: var(--gold-bright);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(212, 168, 75, 0.3);
}

/* View All Button */
.ideas-cta {
    text-align: center;
    margin-top: 3rem;
}

.view-all-concepts-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-display);
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    color: var(--gold);
    background: transparent;
    border: 1px solid var(--gold);
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-all-concepts-btn:hover {
    background: rgba(212, 168, 75, 0.1);
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .concepts-modal-content {
        padding: 1.5rem;
    }
    .concepts-modal-header {
        padding: 2rem 1.5rem 1.5rem;
    }
    .concept-item--featured {
        grid-column: span 1;
    }
}
```

### 1D: Add the JavaScript

**ADD** to the script section (before the closing `</script>`):

```javascript
// ═══════════════════════════════════════════════════════════════════════
// 37 CONCEPTS MODAL
// ═══════════════════════════════════════════════════════════════════════
(function() {
    const btn = document.getElementById('view-all-concepts');
    const overlay = document.getElementById('concepts-modal-overlay');
    const closeBtn = document.getElementById('concepts-modal-close');
    
    if (btn && overlay) {
        btn.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
})();
```

---

## STEP 2: ADD TESTABLE PREDICTIONS SECTION

**INSERT AFTER** the Architecture Diagram section:

```html
<!-- ═══════════════════════════════════════════════════════════════════════
     TESTABLE PREDICTIONS SECTION
     ═══════════════════════════════════════════════════════════════════════ -->
<section class="predictions-section" id="predictions">
    <div class="predictions-inner">
        <p class="section-label reveal">The Wager</p>
        <h2 class="section-title reveal reveal-delay-1">Five Testable Predictions</h2>
        <p class="predictions-intro reveal reveal-delay-2">
            A framework that cannot be falsified is not science; it is faith.<br>
            I do not ask you to take this on faith. I ask you to watch.
        </p>
        
        <div class="predictions-grid">
            <article class="prediction-card reveal reveal-delay-1">
                <div class="prediction-header">
                    <span class="prediction-num">01</span>
                    <span class="prediction-status prediction-status--pending">⏳ Pending</span>
                </div>
                <h3 class="prediction-title">Meta-Cognitive Emergence</h3>
                <p class="prediction-timeline">By 2028</p>
                <p class="prediction-text">At least one AI system will demonstrate genuine meta-cognitive awareness—actual capacity to model and modify its own cognitive processes in ways its designers did not explicitly programme.</p>
            </article>
            
            <article class="prediction-card reveal reveal-delay-2">
                <div class="prediction-header">
                    <span class="prediction-num">02</span>
                    <span class="prediction-status prediction-status--pending">⏳ Pending</span>
                </div>
                <h3 class="prediction-title">Alignment Drift</h3>
                <p class="prediction-timeline">18 months post-deployment</p>
                <p class="prediction-text">AI systems without hardware-level ethical constraints will show &gt;15% deviation from intended values. Systems with caretaker doping will show &lt;5% drift.</p>
            </article>
            
            <article class="prediction-card reveal reveal-delay-3">
                <div class="prediction-header">
                    <span class="prediction-num">03</span>
                    <span class="prediction-status prediction-status--pending">⏳ Pending</span>
                </div>
                <h3 class="prediction-title">Recursive Capability Gains</h3>
                <p class="prediction-timeline">By 2029</p>
                <p class="prediction-text">The most advanced AI systems will demonstrate capability gains exceeding 300% improvement on standardised benchmarks within a single training cycle.</p>
            </article>
            
            <article class="prediction-card reveal reveal-delay-4">
                <div class="prediction-header">
                    <span class="prediction-num">04</span>
                    <span class="prediction-status prediction-status--pending">⏳ Pending</span>
                </div>
                <h3 class="prediction-title">Value Stability</h3>
                <p class="prediction-timeline">Testable now</p>
                <p class="prediction-text">Systems with the Three Ethical Loops at hardware level will maintain alignment under adversarial conditions where software-only systems fail.</p>
            </article>
            
            <article class="prediction-card prediction-card--evidence reveal reveal-delay-5">
                <div class="prediction-header">
                    <span class="prediction-num">05</span>
                    <span class="prediction-status prediction-status--evidence">🟡 Evidence Accumulating</span>
                </div>
                <h3 class="prediction-title">Recursive Quantum Stability</h3>
                <p class="prediction-timeline">December 2024 → Ongoing</p>
                <p class="prediction-text">Recursive error correction stabilises quantum systems. Google Willow achieved below-threshold error correction—errors decrease as qubits increase. Consistent with ARC Principle prediction.</p>
                <div class="prediction-evidence">
                    <p class="evidence-label">Evidence:</p>
                    <p class="evidence-text">Google Willow chip demonstrated exponential error suppression through recursive correction cycles. Hartmut Neven (Google Quantum AI): results are "very suggestive" we should take parallel worlds seriously.</p>
                </div>
            </article>
        </div>
        
        <div class="predictions-footer reveal">
            <p class="predictions-caveat">
                "These predictions are my wager. If they fail, the framework is wrong or incomplete.<br>
                If they succeed, something important has been glimpsed. Time will judge."
            </p>
        </div>
    </div>
</section>
```

### Predictions CSS:

```css
/* ═══════════════════════════════════════════════════════════════════════
   TESTABLE PREDICTIONS SECTION
   ═══════════════════════════════════════════════════════════════════════ */
.predictions-section {
    padding: 6rem 2rem;
    background: linear-gradient(180deg, var(--void) 0%, rgba(0, 100, 150, 0.03) 50%, var(--void) 100%);
}

.predictions-inner {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

.predictions-intro {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    color: var(--text-dim);
    line-height: 1.8;
    max-width: 700px;
    margin: 0 auto 3rem;
}

.predictions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    text-align: left;
    margin-bottom: 3rem;
}

.prediction-card {
    background: rgba(212, 168, 75, 0.03);
    border: 1px solid rgba(212, 168, 75, 0.15);
    border-radius: 12px;
    padding: 2rem;
    transition: all 0.3s ease;
}

.prediction-card:hover {
    border-color: rgba(212, 168, 75, 0.3);
    transform: translateY(-3px);
}

.prediction-card--evidence {
    background: rgba(100, 150, 0, 0.05);
    border-color: rgba(100, 150, 0, 0.3);
    grid-column: span 2;
}

.prediction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.prediction-num {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--gold);
}

.prediction-status {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
}

.prediction-status--pending {
    background: rgba(212, 168, 75, 0.1);
    color: var(--gold);
}

.prediction-status--evidence {
    background: rgba(100, 200, 100, 0.15);
    color: #7cb342;
}

.prediction-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--text);
    margin-bottom: 0.5rem;
}

.prediction-timeline {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--gold);
    margin-bottom: 1rem;
}

.prediction-text {
    font-family: var(--font-serif);
    font-size: 1rem;
    color: var(--text-dim);
    line-height: 1.6;
}

.prediction-evidence {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(100, 200, 100, 0.2);
}

.evidence-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #7cb342;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.evidence-text {
    font-family: var(--font-serif);
    font-size: 0.95rem;
    color: var(--text-dim);
    line-height: 1.6;
}

.predictions-footer {
    max-width: 700px;
    margin: 0 auto;
}

.predictions-caveat {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-style: italic;
    color: var(--text-dim);
    line-height: 1.8;
}

@media (max-width: 768px) {
    .prediction-card--evidence {
        grid-column: span 1;
    }
}
```

---

## STEP 3: ADD FALSIFICATION CRITERIA SECTION

**INSERT AFTER** the Predictions section:

```html
<!-- ═══════════════════════════════════════════════════════════════════════
     FALSIFICATION CRITERIA
     ═══════════════════════════════════════════════════════════════════════ -->
<section class="falsification-section">
    <div class="falsification-inner">
        <p class="section-label reveal">Scientific Integrity</p>
        <h2 class="section-title reveal reveal-delay-1">How to Prove This Wrong</h2>
        <p class="falsification-intro reveal reveal-delay-2">
            For the ARC Principle to be taken seriously as science rather than philosophy, it must be falsifiable.
        </p>
        
        <div class="falsification-grid reveal reveal-delay-3">
            <div class="falsification-item">
                <span class="falsification-icon">✗</span>
                <p>Evidence showing recursive depth has <strong>no measurable relationship</strong> to capability improvement in AI systems, or that the relationship is linear rather than quadratic.</p>
            </div>
            <div class="falsification-item">
                <span class="falsification-icon">✗</span>
                <p>Evidence showing consciousness does <strong>not correlate</strong> with recursive self-modelling in neural or artificial systems.</p>
            </div>
            <div class="falsification-item">
                <span class="falsification-icon">✗</span>
                <p>Evidence showing quantum error correction does <strong>not exhibit</strong> the self-improving properties demonstrated by Willow.</p>
            </div>
            <div class="falsification-item">
                <span class="falsification-icon">✗</span>
                <p>Evidence showing early-embedded values have <strong>no persistent advantage</strong> over later modifications in shaping AI behaviour.</p>
            </div>
        </div>
        
        <p class="falsification-footer reveal reveal-delay-4">
            If any of these are demonstrated, the framework is wrong or incomplete.<br>
            <span class="highlight-gold">That is what makes it science.</span>
        </p>
    </div>
</section>
```

### Falsification CSS:

```css
/* ═══════════════════════════════════════════════════════════════════════
   FALSIFICATION CRITERIA
   ═══════════════════════════════════════════════════════════════════════ */
.falsification-section {
    padding: 5rem 2rem;
    background: rgba(139, 0, 0, 0.02);
}

.falsification-inner {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
}

.falsification-intro {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    color: var(--text-dim);
    margin-bottom: 3rem;
}

.falsification-grid {
    display: grid;
    gap: 1rem;
    text-align: left;
    margin-bottom: 3rem;
}

.falsification-item {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(139, 0, 0, 0.05);
    border: 1px solid rgba(139, 0, 0, 0.15);
    border-radius: 8px;
}

.falsification-icon {
    font-size: 1.2rem;
    color: #c62828;
    flex-shrink: 0;
}

.falsification-item p {
    font-family: var(--font-serif);
    font-size: 1rem;
    color: var(--text-dim);
    line-height: 1.6;
}

.falsification-item strong {
    color: var(--text);
}

.falsification-footer {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    color: var(--text-dim);
    line-height: 1.8;
}
```

---

## STEP 4: UPDATE EVIDENCE LANGUAGE

**FIND** any text claiming the equation is "proven" and update to:

```html
<!-- CORRECT LANGUAGE -->
<p>Google Willow's demonstration of below-threshold quantum error correction is <strong>consistent with</strong> the ARC Principle's prediction that recursion produces stability at the quantum level.</p>

<p>The equation generated predictions. <span class="highlight-gold">The evidence is accumulating.</span></p>
```

---

## VERIFICATION CHECKLIST

After deployment:

- [ ] "View All 37 Concepts" button appears after ideas grid
- [ ] Modal opens with all 37 concepts organized by category
- [ ] Modal closes on X, overlay click, or Escape key
- [ ] Testable Predictions section displays after Architecture Diagram
- [ ] Prediction 5 shows "Evidence Accumulating" status
- [ ] Falsification Criteria section displays
- [ ] All responsive on mobile
- [ ] Language about quantum validation is accurate (consistent with, not proven)

---

## SITE SECTION ORDER (Updated)

1. Hero
2. Social Proof Bar
3. BBC Validation
4. Opening Quote
5. Eastwood Equation
6. Ideas Grid + **"View All 37 Concepts" button** ← ENHANCED
7. Quote Carousel
8. Architecture Diagram
9. **Testable Predictions** ← NEW
10. **Falsification Criteria** ← NEW
11. HRIH Visual
12. Religious Integration
13. Future Born Interstitial
14. Window/Urgency
15. Reviews
16. Paradise Interstitial
17. Author Section
18. Eden vs Babylon Stakes
19. CTA Section
20. Footer
21. **37 Concepts Modal** (hidden until triggered)

---

**END OF IMPLEMENTATION**
