# ASK BOOK VOICE ENGINE: ElevenLabs Integration

## Why ElevenLabs Over Web Speech API

| Feature | Web Speech API | ElevenLabs |
|---------|----------------|------------|
| Voice Quality | Robotic, varies by browser | Film-grade, consistent |
| British Accents | Limited, often American default | Multiple professional UK voices |
| Consistency | Different on every device | Same everywhere |
| Brand Control | None | Can clone author's voice |
| Emotion | Flat | Natural, expressive |
| Cost | Free | $5-22/month |

**Verdict:** For a premium "War Room" experience, ElevenLabs is non-negotiable.

---

## Implementation

### Step 1: API Route (Vercel Serverless)

Create `/api/speak.js`:

```javascript
/**
 * ElevenLabs Text-to-Speech API Route
 * 
 * Converts text to professional British speech using ElevenLabs.
 * Returns audio stream for immediate playback.
 */

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10kb'
        }
    }
};

// Voice IDs for ElevenLabs
const VOICE_OPTIONS = {
    // Professional British voices
    'daniel': '21m00Tcm4TlvDq8ikWAM',     // Daniel - British, authoritative
    'george': 'pqHfZKP75CvOlQylNhV4',     // George - British, warm
    'charlie': 'IKne3meq5aSn9XLyUdCD',    // Charlie - British, conversational
    'james': 'ZQe5CZNOzWyzPSCn5a3c',      // James - British, distinguished
    
    // Or use cloned voice
    'michael': process.env.ELEVENLABS_MICHAEL_VOICE_ID || null
};

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { text, voice = 'daniel' } = req.body;
        
        // Validate input
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required' });
        }
        
        // Limit text length (ElevenLabs has character limits)
        const truncatedText = text.slice(0, 5000);
        
        // Clean text for speech
        const cleanedText = cleanTextForSpeech(truncatedText);
        
        // Get voice ID
        const voiceId = VOICE_OPTIONS[voice] || VOICE_OPTIONS['daniel'];
        
        if (!voiceId) {
            return res.status(400).json({ error: 'Invalid voice selection' });
        }
        
        // Call ElevenLabs API
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text: cleanedText,
                    model_id: 'eleven_turbo_v2_5', // Lowest latency model
                    voice_settings: {
                        stability: 0.5,        // Balance between stability and expressiveness
                        similarity_boost: 0.75, // How much to match original voice
                        style: 0.0,            // Style exaggeration (0 = neutral)
                        use_speaker_boost: true // Enhance clarity
                    }
                })
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[ELEVENLABS] API Error:', response.status, errorData);
            return res.status(500).json({ 
                error: 'Voice synthesis failed',
                details: errorData.detail?.message || 'Unknown error'
            });
        }
        
        // Stream audio back to client
        const audioBuffer = await response.arrayBuffer();
        
        // Set appropriate headers
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.byteLength);
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        
        return res.send(Buffer.from(audioBuffer));
        
    } catch (error) {
        console.error('[ELEVENLABS] Server Error:', error);
        return res.status(500).json({ 
            error: 'Voice synthesis failed',
            message: error.message 
        });
    }
}

/**
 * Clean text for optimal speech synthesis
 */
function cleanTextForSpeech(text) {
    return text
        // Remove markdown formatting
        .replace(/\*\*(.*?)\*\*/g, '$1')     // Bold
        .replace(/\*(.*?)\*/g, '$1')         // Italic
        .replace(/#{1,6}\s/g, '')            // Headers
        .replace(/`(.*?)`/g, '$1')           // Inline code
        .replace(/```[\s\S]*?```/g, '')      // Code blocks
        
        // Remove special characters that confuse TTS
        .replace(/\[.*?\]/g, '')             // Brackets
        .replace(/\(.*?\)/g, '')             // Parentheses (often contain citations)
        .replace(/→|←|↑|↓/g, '')             // Arrows
        .replace(/[•●○◉]/g, '')              // Bullets
        
        // Improve pronunciation
        .replace(/U = I × R²/g, 'U equals I times R squared')
        .replace(/AI/g, 'A.I.')              // Spell out AI
        .replace(/AGI/g, 'A.G.I.')           // Spell out AGI
        .replace(/TSMC/g, 'T.S.M.C.')        // Spell out TSMC
        .replace(/ASML/g, 'A.S.M.L.')        // Spell out ASML
        .replace(/BBC/g, 'B.B.C.')           // Spell out BBC
        .replace(/UK/g, 'U.K.')              // Spell out UK
        
        // Clean up whitespace
        .replace(/\s+/g, ' ')
        .trim();
}
```

### Step 2: Environment Variables

Add to `.env.local`:

```env
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_MICHAEL_VOICE_ID=optional_cloned_voice_id
```

### Step 3: Frontend Voice Engine Class

Replace the `VoiceOutput` class in the Ask Book JavaScript:

```javascript
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VOICE ENGINE - ElevenLabs Integration
 * Professional British voice synthesis for the "Voice of the Book"
 * ═══════════════════════════════════════════════════════════════════════════
 */

const VoiceEngine = {
    // Configuration
    config: {
        apiEndpoint: '/api/speak',
        defaultVoice: 'daniel',
        fallbackToNative: true, // Use Web Speech API if ElevenLabs fails
        preloadEnabled: true,
        maxCacheSize: 10
    },
    
    // State
    state: {
        isPlaying: false,
        currentAudio: null,
        audioCache: new Map(),
        nativeVoices: []
    },
    
    /**
     * Initialize the voice engine
     */
    init: function() {
        // Preload native voices as fallback
        if ('speechSynthesis' in window) {
            this.state.nativeVoices = speechSynthesis.getVoices();
            speechSynthesis.onvoiceschanged = () => {
                this.state.nativeVoices = speechSynthesis.getVoices();
            };
        }
        
        console.log('[VOICE ENGINE] Initialized');
    },
    
    /**
     * Speak text using ElevenLabs
     * @param {string} text - Text to speak
     * @param {HTMLElement} button - Button element (for visual feedback)
     * @param {string} voice - Voice ID (daniel, george, charlie, james, michael)
     */
    speak: async function(text, button = null, voice = null) {
        // Stop any current playback
        this.stop();
        
        // Validate text
        if (!text || text.trim().length === 0) {
            console.warn('[VOICE ENGINE] No text to speak');
            return;
        }
        
        // Update button state
        if (button) {
            button.classList.add('loading');
            button.disabled = true;
        }
        
        try {
            // Check cache first
            const cacheKey = this.getCacheKey(text, voice);
            let audioBlob = this.state.audioCache.get(cacheKey);
            
            if (!audioBlob) {
                // Fetch from API
                const response = await fetch(this.config.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: text.slice(0, 5000), // Limit length
                        voice: voice || this.config.defaultVoice
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                audioBlob = await response.blob();
                
                // Cache the audio
                this.addToCache(cacheKey, audioBlob);
            }
            
            // Create audio element
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // Set up event handlers
            audio.onplay = () => {
                this.state.isPlaying = true;
                if (button) {
                    button.classList.remove('loading');
                    button.classList.add('playing');
                    this.updateButtonIcon(button, 'pause');
                }
                
                // Fade background music if present
                this.fadeBackgroundMusic(0.1);
            };
            
            audio.onended = () => {
                this.state.isPlaying = false;
                this.state.currentAudio = null;
                if (button) {
                    button.classList.remove('playing');
                    button.disabled = false;
                    this.updateButtonIcon(button, 'play');
                }
                
                // Restore background music
                this.fadeBackgroundMusic(0.5);
                
                // Clean up URL
                URL.revokeObjectURL(audioUrl);
            };
            
            audio.onerror = (e) => {
                console.error('[VOICE ENGINE] Audio playback error:', e);
                this.handleError(text, button);
            };
            
            // Store reference and play
            this.state.currentAudio = audio;
            await audio.play();
            
        } catch (error) {
            console.error('[VOICE ENGINE] Error:', error);
            this.handleError(text, button);
        }
    },
    
    /**
     * Stop current playback
     */
    stop: function() {
        if (this.state.currentAudio) {
            this.state.currentAudio.pause();
            this.state.currentAudio.currentTime = 0;
            this.state.currentAudio = null;
        }
        
        // Also stop native speech if active
        if ('speechSynthesis' in window && speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        this.state.isPlaying = false;
        this.fadeBackgroundMusic(0.5);
    },
    
    /**
     * Toggle play/pause
     */
    toggle: function(text, button, voice) {
        if (this.state.isPlaying) {
            this.stop();
            if (button) {
                button.classList.remove('playing');
                this.updateButtonIcon(button, 'play');
            }
        } else {
            this.speak(text, button, voice);
        }
    },
    
    /**
     * Handle errors with fallback to native speech
     */
    handleError: function(text, button) {
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
        }
        
        if (this.config.fallbackToNative && 'speechSynthesis' in window) {
            console.log('[VOICE ENGINE] Falling back to native speech');
            this.speakNative(text, button);
        }
    },
    
    /**
     * Native speech synthesis fallback
     */
    speakNative: function(text, button) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a British voice
        const britishVoice = this.state.nativeVoices.find(v => 
            v.lang.startsWith('en-GB') || v.name.includes('UK') || v.name.includes('British')
        );
        
        if (britishVoice) {
            utterance.voice = britishVoice;
        }
        
        utterance.rate = 0.92;
        utterance.pitch = 0.95;
        
        utterance.onstart = () => {
            this.state.isPlaying = true;
            if (button) button.classList.add('playing');
        };
        
        utterance.onend = () => {
            this.state.isPlaying = false;
            if (button) button.classList.remove('playing');
        };
        
        speechSynthesis.speak(utterance);
    },
    
    /**
     * Fade background music
     */
    fadeBackgroundMusic: function(targetVolume) {
        const bgMusic = window.backgroundAudio || document.querySelector('audio#bgMusic');
        if (!bgMusic) return;
        
        const currentVolume = bgMusic.volume;
        const step = (targetVolume - currentVolume) / 20;
        let steps = 0;
        
        const fade = setInterval(() => {
            steps++;
            bgMusic.volume = Math.max(0, Math.min(1, currentVolume + (step * steps)));
            
            if (steps >= 20) {
                clearInterval(fade);
                bgMusic.volume = targetVolume;
            }
        }, 50);
    },
    
    /**
     * Update button icon (play/pause)
     */
    updateButtonIcon: function(button, state) {
        const svg = button.querySelector('svg');
        if (!svg) return;
        
        if (state === 'pause') {
            svg.innerHTML = `
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            `;
        } else {
            svg.innerHTML = `
                <polygon points="5 3 19 12 5 21 5 3"/>
            `;
        }
    },
    
    /**
     * Cache management
     */
    getCacheKey: function(text, voice) {
        return `${voice || 'default'}_${text.slice(0, 100)}`;
    },
    
    addToCache: function(key, blob) {
        // Limit cache size
        if (this.state.audioCache.size >= this.config.maxCacheSize) {
            const firstKey = this.state.audioCache.keys().next().value;
            this.state.audioCache.delete(firstKey);
        }
        
        this.state.audioCache.set(key, blob);
    },
    
    /**
     * Preload audio for common responses
     */
    preload: async function(texts) {
        if (!this.config.preloadEnabled) return;
        
        for (const text of texts) {
            const cacheKey = this.getCacheKey(text, this.config.defaultVoice);
            if (!this.state.audioCache.has(cacheKey)) {
                try {
                    const response = await fetch(this.config.apiEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text })
                    });
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        this.addToCache(cacheKey, blob);
                    }
                } catch (e) {
                    // Silent fail for preloading
                }
            }
        }
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VoiceEngine.init());
} else {
    VoiceEngine.init();
}

// Export for use
window.VoiceEngine = VoiceEngine;
```

---

## Section Narration Feature

Add "Listen to this section" buttons throughout the site:

```html
<!-- Add to each major section -->
<button class="section-listen-btn" onclick="VoiceEngine.speak(getSectionText('the-mind'), this)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
    <span>Listen</span>
</button>
```

```javascript
// Get section text for narration
function getSectionText(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return '';
    
    // Get text content, excluding buttons and labels
    const textElements = section.querySelectorAll('h1, h2, h3, h4, p, blockquote, li');
    let text = '';
    
    textElements.forEach(el => {
        if (!el.closest('button') && !el.closest('.section-label')) {
            text += el.textContent.trim() + '. ';
        }
    });
    
    return text.slice(0, 5000);
}
```

---

## CSS for Voice Buttons

```css
/* Voice button styles */
.section-listen-btn,
.ask-book-chat__listen-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: rgba(212, 168, 75, 0.1);
    border: 1px solid rgba(212, 168, 75, 0.3);
    border-radius: 100px;
    color: #d4a84b;
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.section-listen-btn:hover,
.ask-book-chat__listen-btn:hover {
    background: rgba(212, 168, 75, 0.2);
    border-color: rgba(212, 168, 75, 0.5);
}

.section-listen-btn svg,
.ask-book-chat__listen-btn svg {
    width: 14px;
    height: 14px;
}

/* Loading state */
.section-listen-btn.loading,
.ask-book-chat__listen-btn.loading {
    opacity: 0.6;
    pointer-events: none;
}

.section-listen-btn.loading svg,
.ask-book-chat__listen-btn.loading svg {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Playing state */
.section-listen-btn.playing,
.ask-book-chat__listen-btn.playing {
    background: rgba(212, 168, 75, 0.25);
    border-color: #d4a84b;
}

.section-listen-btn.playing svg,
.ask-book-chat__listen-btn.playing svg {
    animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}
```

---

## Voice Cloning Option

For ultimate brand consistency, clone Michael's voice:

1. **Record 5 minutes** of clear speech
2. **Upload to ElevenLabs** Voice Lab
3. **Get custom Voice ID**
4. **Add to environment:** `ELEVENLABS_MICHAEL_VOICE_ID=xxx`

This way, the book literally speaks in the author's voice.

---

## Cost Estimates

| Plan | Characters/Month | Cost | Enough For |
|------|------------------|------|------------|
| Free | 10,000 | $0 | ~10 responses |
| Starter | 30,000 | $5 | ~30 responses |
| Creator | 100,000 | $22 | ~100 responses |

For a book launch, Creator tier is recommended.

---

## Testing Checklist

- [ ] API route responds correctly
- [ ] Audio plays on first click
- [ ] Cache works (second play is instant)
- [ ] Fallback to native speech works
- [ ] Button states update correctly
- [ ] Background music fades appropriately
- [ ] Section narration works
- [ ] Mobile playback works
- [ ] Error states handled gracefully
