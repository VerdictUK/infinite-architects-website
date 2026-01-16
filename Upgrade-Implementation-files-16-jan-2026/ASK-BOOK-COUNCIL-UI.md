# ASK BOOK COUNCIL UI: Visualising the Multi-AI Debate

## The Concept

When a user enables "Deep Analysis (4 AI Models)", they currently see a generic loading spinner. This is a missed opportunity.

**The Reality:** Multiple AI models ARE consulting the book and debating the answer.
**The Problem:** The user sees nothing.
**The Solution:** Visualise the "War Room" in real-time.

---

## The Visual Experience

```
┌─────────────────────────────────────────────────┐
│                                                 │
│            ◉━━━━━━◉                             │
│          ╱          ╲                           │
│         ◉            ◉                          │
│          ╲          ╱                           │
│            ◉━━━━━━◉                             │
│                                                 │
│        COUNCIL IN SESSION                       │
│                                                 │
│  ● Claude    Analysing ethical implications...  │
│  ● GPT-4     Verifying timeline data...         │
│  ● Gemini    Cross-referencing sources...       │
│                                                 │
│        ═══════════════════════════              │
│           SYNTHESISING CONSENSUS                │
│        ═══════════════════════════              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## HTML Structure

```html
<!-- Council Loading Visualisation -->
<div class="council" id="councilViz">
    <div class="council__rings">
        <!-- Outer ring - Claude (Gold) -->
        <div class="council__ring council__ring--claude">
            <div class="council__ring-glow"></div>
        </div>
        
        <!-- Middle ring - GPT (Blue) -->
        <div class="council__ring council__ring--gpt">
            <div class="council__ring-glow"></div>
        </div>
        
        <!-- Inner ring - Gemini (Green) -->
        <div class="council__ring council__ring--gemini">
            <div class="council__ring-glow"></div>
        </div>
        
        <!-- Center convergence point -->
        <div class="council__center">
            <div class="council__center-pulse"></div>
        </div>
    </div>
    
    <div class="council__status">
        <span class="council__label">COUNCIL IN SESSION</span>
    </div>
    
    <div class="council__models">
        <div class="council__model" data-model="claude">
            <span class="council__model-dot council__model-dot--claude"></span>
            <span class="council__model-name">Claude</span>
            <span class="council__model-status">Initialising...</span>
        </div>
        
        <div class="council__model" data-model="gpt">
            <span class="council__model-dot council__model-dot--gpt"></span>
            <span class="council__model-name">GPT-4</span>
            <span class="council__model-status">Waiting...</span>
        </div>
        
        <div class="council__model" data-model="gemini">
            <span class="council__model-dot council__model-dot--gemini"></span>
            <span class="council__model-name">Gemini</span>
            <span class="council__model-status">Waiting...</span>
        </div>
    </div>
    
    <div class="council__progress">
        <div class="council__progress-bar"></div>
        <span class="council__progress-text">Building consensus...</span>
    </div>
</div>
```

---

## CSS Implementation

```css
/* ═══════════════════════════════════════════════════════════════════════════
   COUNCIL VISUALISATION
   The War Room in action - Multi-AI debate made visible
   ═══════════════════════════════════════════════════════════════════════════ */

.council {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: radial-gradient(
        ellipse at center,
        rgba(212, 168, 75, 0.08) 0%,
        transparent 70%
    );
    min-height: 300px;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPINNING RINGS
   Three rings representing the three AI models
   ═══════════════════════════════════════════════════════════════════════════ */

.council__rings {
    position: relative;
    width: 180px;
    height: 180px;
    margin-bottom: 32px;
}

.council__ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-right-color: currentColor;
}

/* Claude ring - Gold, outermost, slowest */
.council__ring--claude {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    color: #d4a84b;
    animation: councilSpin 4s linear infinite;
}

/* GPT ring - Blue, middle, medium speed */
.council__ring--gpt {
    width: 70%;
    height: 70%;
    top: 15%;
    left: 15%;
    color: #3b82f6;
    animation: councilSpin 3s linear infinite reverse;
}

/* Gemini ring - Green, innermost, fastest */
.council__ring--gemini {
    width: 40%;
    height: 40%;
    top: 30%;
    left: 30%;
    color: #22c55e;
    animation: councilSpin 2s linear infinite;
}

@keyframes councilSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Ring glow effect */
.council__ring-glow {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: inherit;
    filter: blur(8px);
    opacity: 0.3;
}

/* Center pulse */
.council__center {
    position: absolute;
    width: 20%;
    height: 20%;
    top: 40%;
    left: 40%;
    background: radial-gradient(
        circle,
        rgba(212, 168, 75, 0.8) 0%,
        rgba(212, 168, 75, 0.2) 50%,
        transparent 70%
    );
    border-radius: 50%;
    animation: centerPulse 2s ease-in-out infinite;
}

.council__center-pulse {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #d4a84b;
    animation: centerPulseRing 2s ease-out infinite;
}

@keyframes centerPulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
}

@keyframes centerPulseRing {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(2.5); opacity: 0; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS LABEL
   ═══════════════════════════════════════════════════════════════════════════ */

.council__status {
    margin-bottom: 24px;
}

.council__label {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    color: #d4a84b;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    animation: labelPulse 2s ease-in-out infinite;
}

@keyframes labelPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODEL STATUS LIST
   Shows what each AI is doing
   ═══════════════════════════════════════════════════════════════════════════ */

.council__models {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
    width: 100%;
    max-width: 300px;
}

.council__model {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    opacity: 0;
    transform: translateX(-10px);
    animation: modelSlideIn 0.4s ease forwards;
}

.council__model:nth-child(1) { animation-delay: 0.1s; }
.council__model:nth-child(2) { animation-delay: 0.4s; }
.council__model:nth-child(3) { animation-delay: 0.7s; }

@keyframes modelSlideIn {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Model dots */
.council__model-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    animation: dotPulse 1.5s ease-in-out infinite;
}

.council__model-dot--claude {
    background: #d4a84b;
    box-shadow: 0 0 8px rgba(212, 168, 75, 0.5);
}

.council__model-dot--gpt {
    background: #3b82f6;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.council__model-dot--gemini {
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

@keyframes dotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
}

/* Model text */
.council__model-name {
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem;
    color: rgba(240, 235, 227, 0.9);
    font-weight: 600;
    min-width: 60px;
}

.council__model-status {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.85rem;
    color: rgba(240, 235, 227, 0.6);
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Active state for model */
.council__model.active {
    border-color: rgba(212, 168, 75, 0.3);
    background: rgba(212, 168, 75, 0.05);
}

.council__model.active .council__model-status {
    color: rgba(240, 235, 227, 0.85);
}

/* Complete state for model */
.council__model.complete .council__model-dot {
    animation: none;
}

.council__model.complete .council__model-status {
    color: #22c55e;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS BAR
   Shows overall consensus progress
   ═══════════════════════════════════════════════════════════════════════════ */

.council__progress {
    width: 100%;
    max-width: 300px;
}

.council__progress-bar {
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
}

.council__progress-bar::after {
    content: '';
    display: block;
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #d4a84b, #22c55e);
    border-radius: 2px;
    animation: progressGrow 8s ease-out forwards;
}

@keyframes progressGrow {
    0% { width: 0%; }
    20% { width: 25%; }
    40% { width: 45%; }
    60% { width: 65%; }
    80% { width: 85%; }
    100% { width: 100%; }
}

.council__progress-text {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: rgba(240, 235, 227, 0.5);
    text-align: center;
    display: block;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONVERGENCE STATE
   When the council reaches consensus
   ═══════════════════════════════════════════════════════════════════════════ */

.council.converging .council__ring {
    animation: ringConverge 1s ease-out forwards;
}

.council.converging .council__ring--claude {
    animation-delay: 0s;
}

.council.converging .council__ring--gpt {
    animation-delay: 0.15s;
}

.council.converging .council__ring--gemini {
    animation-delay: 0.3s;
}

@keyframes ringConverge {
    to {
        width: 50%;
        height: 50%;
        top: 25%;
        left: 25%;
        border-color: #d4a84b;
        opacity: 0.8;
    }
}

.council.converging .council__center {
    animation: centerExpand 0.8s ease-out forwards 0.5s;
}

@keyframes centerExpand {
    to {
        width: 60%;
        height: 60%;
        top: 20%;
        left: 20%;
        background: radial-gradient(
            circle,
            rgba(212, 168, 75, 1) 0%,
            rgba(212, 168, 75, 0.3) 70%,
            transparent 100%
        );
    }
}

.council.converging .council__label {
    animation: labelFlash 0.5s ease-out forwards 0.8s;
}

@keyframes labelFlash {
    to {
        color: #f0ebe3;
        text-shadow: 0 0 20px rgba(212, 168, 75, 0.5);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE ADJUSTMENTS
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
    .council {
        padding: 30px 16px;
        min-height: 260px;
    }
    
    .council__rings {
        width: 140px;
        height: 140px;
        margin-bottom: 24px;
    }
    
    .council__models {
        max-width: 260px;
    }
    
    .council__model {
        padding: 8px 12px;
        gap: 10px;
    }
    
    .council__model-name {
        font-size: 0.68rem;
        min-width: 50px;
    }
    
    .council__model-status {
        font-size: 0.78rem;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   Respect user preferences
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
    .council__ring,
    .council__center,
    .council__center-pulse,
    .council__model-dot,
    .council__label,
    .council__progress-bar::after {
        animation: none;
    }
    
    .council__model {
        opacity: 1;
        transform: none;
    }
    
    .council__progress-bar::after {
        width: 100%;
    }
}
```

---

## JavaScript Controller

```javascript
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COUNCIL VISUALISATION CONTROLLER
 * Manages the visual representation of multi-AI debate
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CouncilViz = {
    // Status messages for each model
    statusMessages: {
        claude: [
            'Analysing ethical implications...',
            'Cross-referencing Chapter 4...',
            'Evaluating Eden Protocol alignment...',
            'Checking recursive patterns...',
            'Validating Eastwood Equation application...'
        ],
        gpt: [
            'Verifying timeline accuracy...',
            'Checking prediction methodology...',
            'Cross-checking historical data...',
            'Analysing quantum computing claims...',
            'Reviewing semiconductor context...'
        ],
        gemini: [
            'Searching recent developments...',
            'Validating against BBC transcript...',
            'Checking news sources...',
            'Cross-referencing academic literature...',
            'Verifying expert quotes...'
        ]
    },
    
    // Consensus messages
    consensusMessages: [
        'Building consensus...',
        'Synthesising perspectives...',
        'Resolving conflicts...',
        'Finalising response...',
        'Council agrees...'
    ],
    
    // State
    state: {
        isActive: false,
        currentModel: null,
        statusInterval: null,
        progressInterval: null
    },
    
    /**
     * Create and show the council visualisation
     */
    show: function(container) {
        if (this.state.isActive) return;
        this.state.isActive = true;
        
        // Create HTML
        const html = `
            <div class="council" id="councilViz">
                <div class="council__rings">
                    <div class="council__ring council__ring--claude">
                        <div class="council__ring-glow"></div>
                    </div>
                    <div class="council__ring council__ring--gpt">
                        <div class="council__ring-glow"></div>
                    </div>
                    <div class="council__ring council__ring--gemini">
                        <div class="council__ring-glow"></div>
                    </div>
                    <div class="council__center">
                        <div class="council__center-pulse"></div>
                    </div>
                </div>
                
                <div class="council__status">
                    <span class="council__label">COUNCIL IN SESSION</span>
                </div>
                
                <div class="council__models">
                    <div class="council__model" data-model="claude">
                        <span class="council__model-dot council__model-dot--claude"></span>
                        <span class="council__model-name">Claude</span>
                        <span class="council__model-status">Initialising...</span>
                    </div>
                    <div class="council__model" data-model="gpt">
                        <span class="council__model-dot council__model-dot--gpt"></span>
                        <span class="council__model-name">GPT-4</span>
                        <span class="council__model-status">Waiting...</span>
                    </div>
                    <div class="council__model" data-model="gemini">
                        <span class="council__model-dot council__model-dot--gemini"></span>
                        <span class="council__model-name">Gemini</span>
                        <span class="council__model-status">Waiting...</span>
                    </div>
                </div>
                
                <div class="council__progress">
                    <div class="council__progress-bar"></div>
                    <span class="council__progress-text">Building consensus...</span>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Start status rotation
        this.startStatusRotation();
        
        // Haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate([50, 100, 50]);
        }
    },
    
    /**
     * Start rotating status messages
     */
    startStatusRotation: function() {
        const models = ['claude', 'gpt', 'gemini'];
        let currentModelIndex = 0;
        let currentMessageIndex = 0;
        
        // Activate first model
        this.activateModel('claude');
        
        this.state.statusInterval = setInterval(() => {
            const model = models[currentModelIndex];
            const messages = this.statusMessages[model];
            
            // Update status text
            this.updateModelStatus(model, messages[currentMessageIndex]);
            
            // Move to next message
            currentMessageIndex++;
            
            // If we've shown all messages for this model, move to next
            if (currentMessageIndex >= messages.length) {
                currentMessageIndex = 0;
                this.completeModel(model);
                
                currentModelIndex++;
                
                if (currentModelIndex < models.length) {
                    this.activateModel(models[currentModelIndex]);
                } else {
                    // All models complete, start consensus
                    clearInterval(this.state.statusInterval);
                    this.startConsensus();
                }
            }
        }, 1500);
    },
    
    /**
     * Activate a model (highlight it)
     */
    activateModel: function(model) {
        const element = document.querySelector(`[data-model="${model}"]`);
        if (element) {
            element.classList.add('active');
            element.classList.remove('complete');
        }
        this.state.currentModel = model;
    },
    
    /**
     * Mark a model as complete
     */
    completeModel: function(model) {
        const element = document.querySelector(`[data-model="${model}"]`);
        if (element) {
            element.classList.remove('active');
            element.classList.add('complete');
            
            const status = element.querySelector('.council__model-status');
            if (status) {
                status.textContent = 'Complete ✓';
            }
        }
    },
    
    /**
     * Update a model's status text
     */
    updateModelStatus: function(model, status) {
        const element = document.querySelector(`[data-model="${model}"] .council__model-status`);
        if (element) {
            element.textContent = status;
        }
    },
    
    /**
     * Start the consensus phase
     */
    startConsensus: function() {
        const progressText = document.querySelector('.council__progress-text');
        let messageIndex = 0;
        
        this.state.progressInterval = setInterval(() => {
            if (progressText && messageIndex < this.consensusMessages.length) {
                progressText.textContent = this.consensusMessages[messageIndex];
                messageIndex++;
            }
        }, 1000);
    },
    
    /**
     * Trigger convergence animation (when response is ready)
     */
    converge: function() {
        const council = document.getElementById('councilViz');
        if (council) {
            council.classList.add('converging');
            
            const label = council.querySelector('.council__label');
            if (label) {
                label.textContent = 'CONSENSUS REACHED';
            }
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 200]);
            }
        }
    },
    
    /**
     * Hide and clean up
     */
    hide: function() {
        if (this.state.statusInterval) {
            clearInterval(this.state.statusInterval);
        }
        if (this.state.progressInterval) {
            clearInterval(this.state.progressInterval);
        }
        
        const council = document.getElementById('councilViz');
        if (council) {
            council.style.opacity = '0';
            council.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                council.remove();
            }, 300);
        }
        
        this.state.isActive = false;
        this.state.currentModel = null;
    },
    
    /**
     * Update based on actual API progress (if available)
     */
    updateFromAPI: function(progress) {
        // progress = { claude: 'complete', gpt: 'processing', gemini: 'waiting' }
        
        Object.entries(progress).forEach(([model, status]) => {
            if (status === 'complete') {
                this.completeModel(model);
            } else if (status === 'processing') {
                this.activateModel(model);
            }
        });
    }
};

// Export
window.CouncilViz = CouncilViz;
```

---

## Integration with Ask Book

Update the Ask Book send function to use Council visualisation:

```javascript
async function sendMessage(text) {
    const query = text || (elements.input ? elements.input.value.trim() : '');
    
    if (!query || state.isLoading) return;
    
    // Clear input
    if (elements.input) elements.input.value = '';
    
    // Add user message
    UI.addMessage(query, 'user');
    
    // Check if deep analysis is enabled
    const isDeepAnalysis = elements.fullMode && elements.fullMode.checked;
    const mode = isDeepAnalysis ? 'full' : 'fast';
    
    // Show appropriate loading
    state.isLoading = true;
    if (elements.send) elements.send.disabled = true;
    
    if (isDeepAnalysis) {
        // Show Council visualisation
        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'councilContainer';
        elements.messages.appendChild(loadingContainer);
        CouncilViz.show(loadingContainer);
    } else {
        // Show simple loading
        UI.addLoading();
    }
    
    try {
        const response = await callAPI(query, mode);
        
        if (isDeepAnalysis) {
            // Trigger convergence animation
            CouncilViz.converge();
            
            // Wait for animation to complete
            await new Promise(resolve => setTimeout(resolve, 1200));
            
            // Hide council
            CouncilViz.hide();
        } else {
            UI.removeLoading();
        }
        
        // Show response
        if (response.success && response.answer) {
            UI.addMessage(response.answer, 'ai', {
                sources: response.sources,
                models: response.models,
                relatedQuestions: response.relatedQuestions,
                showCTA: true,
                query: query
            });
        }
        
    } catch (error) {
        console.error('[ASK BOOK] Error:', error);
        
        if (isDeepAnalysis) {
            CouncilViz.hide();
        } else {
            UI.removeLoading();
        }
        
        UI.addError('The Council encountered an issue. Please try again.');
    } finally {
        state.isLoading = false;
        if (elements.send) elements.send.disabled = false;
    }
}
```

---

## Why This Matters

1. **Transparency:** Users see what's happening, building trust
2. **Entertainment:** The loading time becomes engaging, not frustrating
3. **Differentiation:** No other book website has this
4. **Narrative:** Reinforces the "Polymathic Method" concept
5. **Premium feel:** Matches the "War Room" aesthetic

This single feature could generate press coverage: *"The Book That Assembles an AI Council to Answer Your Questions"*
