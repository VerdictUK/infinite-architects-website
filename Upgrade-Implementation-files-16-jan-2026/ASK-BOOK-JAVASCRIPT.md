# ASK BOOK JAVASCRIPT: The Complete Intelligence Engine

## Overview

This document contains the complete JavaScript implementation for the Ask Book feature, transforming it into the most advanced AI-powered book companion ever created.

---

## Complete Frontend JavaScript

Replace the existing Ask Book JavaScript with this comprehensive implementation:

```javascript
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ASK THE BOOK - ULTIMATE INTELLIGENCE ENGINE
 * Infinite Architects by Michael Darius Eastwood
 * 
 * Features:
 * - Full knowledge base search
 * - Conversation memory (localStorage)
 * - Voice input (Web Speech API)
 * - Voice output (Speech Synthesis)
 * - Related questions generation
 * - Copy/share functionality
 * - Feedback collection
 * - Contextual purchase CTAs
 * - Rich markdown rendering
 * - Error recovery
 * - Analytics integration
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function AskBookUltimate() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const CONFIG = {
        apiEndpoint: '/api/ask-book',
        maxHistory: 10,
        storageKey: 'ia_chat_history',
        feedbackKey: 'ia_chat_feedback',
        questionCountKey: 'ia_question_count',
        ctaThresholds: {
            light: 3,   // Show light CTA after 3 questions
            strong: 5   // Show strong CTA after 5 questions
        },
        voice: {
            lang: 'en-GB',
            pitch: 0.95,
            rate: 0.92,
            volume: 1.0,
            preferredVoices: [
                'Google UK English Male',
                'Daniel',
                'Microsoft George Online (Natural)',
                'en-GB-Neural2-B',
                'en-GB-Wavenet-B'
            ]
        },
        amazonLinks: {
            kindle: 'https://www.amazon.co.uk/dp/B0DS2L8BVC',
            paperback: 'https://www.amazon.co.uk/dp/B0DS7BZ4L9'
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // DOM ELEMENTS
    // ═══════════════════════════════════════════════════════════════════════
    
    const elements = {
        fab: document.getElementById('askBookFab') || document.getElementById('ask-book-toggle'),
        chat: document.getElementById('askBookChat') || document.getElementById('ask-book-widget'),
        backdrop: document.getElementById('askBookBackdrop'),
        close: document.getElementById('askBookClose'),
        clear: document.getElementById('askBookClear'),
        messages: document.getElementById('askBookMessages') || document.getElementById('ask-book-messages'),
        input: document.getElementById('askBookInput') || document.getElementById('ask-book-input'),
        send: document.getElementById('askBookSend') || document.getElementById('ask-book-send'),
        mic: document.getElementById('askBookMic'),
        fullMode: document.getElementById('askBookFullMode'),
        welcome: document.getElementById('askBookWelcome'),
        suggestions: document.getElementById('askBookSuggestions')
    };

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════
    
    let state = {
        isOpen: false,
        isLoading: false,
        isListening: false,
        isSpeaking: false,
        questionCount: parseInt(localStorage.getItem(CONFIG.questionCountKey) || '0'),
        history: [],
        currentSpeech: null,
        recognition: null
    };

    // ═══════════════════════════════════════════════════════════════════════
    // BRAND GUARDIAN - Ensures consistent messaging
    // ═══════════════════════════════════════════════════════════════════════
    
    const BrandGuardian = {
        sanitise: function(text) {
            let safe = text;
            
            // Rule 1: Polymathic method, not "is a polymath"
            safe = safe.replace(/\bis a polymath\b/gi, 'utilises the polymathic method');
            safe = safe.replace(/\bhe is a polymath\b/gi, 'he applies a polymathic lens');
            safe = safe.replace(/\bMichael is a polymath\b/gi, 'Michael applies the polymathic method');
            
            // Rule 2: British English
            const ukSpellings = [
                ['color', 'colour'], ['behavior', 'behaviour'], ['honor', 'honour'],
                ['realize', 'realise'], ['analyze', 'analyse'], ['center', 'centre'],
                ['defense', 'defence'], ['program(?!m)', 'programme'], ['optimize', 'optimise'],
                ['organize', 'organise'], ['recognize', 'recognise']
            ];
            
            ukSpellings.forEach(([us, uk]) => {
                const regex = new RegExp(`\\b${us}\\b`, 'gi');
                safe = safe.replace(regex, uk);
            });
            
            // Rule 3: Word count consistency
            safe = safe.replace(/109,000/g, '114,000');
            safe = safe.replace(/109K/g, '114K');
            safe = safe.replace(/109000/g, '114000');
            
            return safe;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // CONVERSATION MEMORY
    // ═══════════════════════════════════════════════════════════════════════
    
    const Memory = {
        load: function() {
            try {
                const saved = localStorage.getItem(CONFIG.storageKey);
                if (saved) {
                    state.history = JSON.parse(saved);
                    return state.history;
                }
            } catch (e) {
                console.warn('[ASK BOOK] Failed to load history:', e);
            }
            return [];
        },
        
        save: function(message) {
            try {
                state.history.push({
                    ...message,
                    timestamp: Date.now()
                });
                
                // Keep only last N messages
                if (state.history.length > CONFIG.maxHistory * 2) {
                    state.history = state.history.slice(-CONFIG.maxHistory * 2);
                }
                
                localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.history));
            } catch (e) {
                console.warn('[ASK BOOK] Failed to save history:', e);
            }
        },
        
        clear: function() {
            state.history = [];
            localStorage.removeItem(CONFIG.storageKey);
            localStorage.setItem(CONFIG.questionCountKey, '0');
            state.questionCount = 0;
        },
        
        getContext: function(limit = 6) {
            // Return last N messages for context
            return state.history.slice(-limit).map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.text.slice(0, 500) // Truncate for context
            }));
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // VOICE INPUT (Speech Recognition)
    // ═══════════════════════════════════════════════════════════════════════
    
    const VoiceInput = {
        init: function() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!SpeechRecognition) {
                console.warn('[ASK BOOK] Speech recognition not supported');
                if (elements.mic) elements.mic.style.display = 'none';
                return;
            }
            
            state.recognition = new SpeechRecognition();
            state.recognition.lang = CONFIG.voice.lang;
            state.recognition.continuous = false;
            state.recognition.interimResults = false;
            
            state.recognition.onstart = () => {
                state.isListening = true;
                if (elements.mic) elements.mic.classList.add('listening');
                // Haptic feedback on mobile
                if (navigator.vibrate) navigator.vibrate(50);
            };
            
            state.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (elements.input) {
                    elements.input.value = transcript;
                    elements.input.focus();
                }
                // Auto-send after voice input
                setTimeout(() => sendMessage(transcript), 300);
            };
            
            state.recognition.onerror = (event) => {
                console.warn('[ASK BOOK] Speech recognition error:', event.error);
                state.isListening = false;
                if (elements.mic) elements.mic.classList.remove('listening');
            };
            
            state.recognition.onend = () => {
                state.isListening = false;
                if (elements.mic) elements.mic.classList.remove('listening');
            };
        },
        
        toggle: function() {
            if (!state.recognition) return;
            
            if (state.isListening) {
                state.recognition.stop();
            } else {
                // Stop any playing speech first
                VoiceOutput.stop();
                state.recognition.start();
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // VOICE OUTPUT (Speech Synthesis)
    // ═══════════════════════════════════════════════════════════════════════
    
    const VoiceOutput = {
        getPreferredVoice: function() {
            const voices = speechSynthesis.getVoices();
            
            // Try to find preferred voice
            for (const preferred of CONFIG.voice.preferredVoices) {
                const voice = voices.find(v => 
                    v.name.includes(preferred) || v.voiceURI.includes(preferred)
                );
                if (voice) return voice;
            }
            
            // Fallback to any British English voice
            const britishVoice = voices.find(v => v.lang.startsWith('en-GB'));
            if (britishVoice) return britishVoice;
            
            // Final fallback
            return voices.find(v => v.lang.startsWith('en')) || voices[0];
        },
        
        speak: function(text, button) {
            if (!('speechSynthesis' in window)) {
                console.warn('[ASK BOOK] Speech synthesis not supported');
                return;
            }
            
            // Stop any current speech
            this.stop();
            
            // Clean text for speech
            const cleanText = text
                .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
                .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers
                .replace(/\[.*?\]/g, '')         // Remove brackets
                .replace(/#{1,6}\s/g, '')        // Remove markdown headers
                .slice(0, 2000);                 // Limit length
            
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.voice = this.getPreferredVoice();
            utterance.pitch = CONFIG.voice.pitch;
            utterance.rate = CONFIG.voice.rate;
            utterance.volume = CONFIG.voice.volume;
            
            utterance.onstart = () => {
                state.isSpeaking = true;
                state.currentSpeech = utterance;
                if (button) button.classList.add('playing');
            };
            
            utterance.onend = () => {
                state.isSpeaking = false;
                state.currentSpeech = null;
                if (button) button.classList.remove('playing');
            };
            
            utterance.onerror = () => {
                state.isSpeaking = false;
                state.currentSpeech = null;
                if (button) button.classList.remove('playing');
            };
            
            speechSynthesis.speak(utterance);
        },
        
        stop: function() {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
            state.isSpeaking = false;
            state.currentSpeech = null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // MARKDOWN RENDERER
    // ═══════════════════════════════════════════════════════════════════════
    
    const MarkdownRenderer = {
        render: function(text) {
            let html = text;
            
            // Bold
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Italic
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            // Code blocks
            html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
            
            // Inline code
            html = html.replace(/`(.*?)`/g, '<code>$1</code>');
            
            // Headers (h3 max for chat context)
            html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');
            html = html.replace(/^## (.*$)/gim, '<h4>$1</h4>');
            html = html.replace(/^# (.*$)/gim, '<h4>$1</h4>');
            
            // Bullet lists
            html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
            html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
            html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
            
            // Numbered lists
            html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
            
            // Line breaks
            html = html.replace(/\n/g, '<br>');
            
            // Clean up double breaks
            html = html.replace(/<br><br>/g, '</p><p>');
            
            return html;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RELATED QUESTIONS GENERATOR
    // ═══════════════════════════════════════════════════════════════════════
    
    const RelatedQuestions = {
        templates: [
            { trigger: 'equation', questions: ['How does U = I × R² work?', 'What evidence supports the Eastwood Equation?', 'How does recursion create consciousness?'] },
            { trigger: 'eden', questions: ['What are the three ethical loops?', 'How does the Eden Protocol prevent misalignment?', 'Why will caging AI fail?'] },
            { trigger: 'chokepoint', questions: ['Which four companies control AI hardware?', 'How long is the window of opportunity?', 'What can we do about the chokepoint?'] },
            { trigger: 'hrih', questions: ['What is the Hyperspace Recursive Intelligence Hypothesis?', 'How does HRIH explain fine-tuning?', 'Is HRIH testable?'] },
            { trigger: 'prediction', questions: ['Which predictions have been verified?', 'What did BBC News confirm?', 'What are the five testable predictions?'] },
            { trigger: 'author', questions: ['What is the polymathic method?', 'Why did Michael write this book?', 'What is AuDHD pattern recognition?'] },
            { trigger: 'willow', questions: ['What is Google Willow?', 'How did Willow validate the equation?', 'What did Hartmut Neven say?'] },
            { trigger: 'bbc', questions: ['What did BBC News report?', 'How was the prediction verified?', 'What is the five-year timeline?'] },
            { trigger: 'quantum', questions: ['How does quantum computing relate to the thesis?', 'What is quantum error correction?', 'Why does qubit scaling matter?'] },
            { trigger: 'consciousness', questions: ['How does recursion create consciousness?', 'Is AI consciousness possible?', 'What is recursive self-modelling?'] }
        ],
        
        generate: function(query, answer, sources) {
            const combined = (query + ' ' + answer).toLowerCase();
            const questions = [];
            
            // Match against triggers
            this.templates.forEach(template => {
                if (combined.includes(template.trigger)) {
                    template.questions.forEach(q => {
                        if (!questions.includes(q) && !q.toLowerCase().includes(query.toLowerCase().slice(0, 15))) {
                            questions.push(q);
                        }
                    });
                }
            });
            
            // Add source-based questions
            if (sources && sources.length > 0) {
                sources.forEach(source => {
                    if (source.chapter && !questions.some(q => q.includes(`Chapter ${source.chapter}`))) {
                        questions.push(`What else is in Chapter ${source.chapter}?`);
                    }
                });
            }
            
            // Shuffle and limit
            return questions
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // FEEDBACK COLLECTOR
    // ═══════════════════════════════════════════════════════════════════════
    
    const Feedback = {
        save: function(query, answer, type) {
            try {
                const feedbackList = JSON.parse(localStorage.getItem(CONFIG.feedbackKey) || '[]');
                feedbackList.push({
                    query: query.slice(0, 100),
                    answer: answer.slice(0, 100),
                    type: type,
                    timestamp: Date.now()
                });
                
                // Keep last 50 feedback items
                if (feedbackList.length > 50) {
                    feedbackList.shift();
                }
                
                localStorage.setItem(CONFIG.feedbackKey, JSON.stringify(feedbackList));
                
                // Send to analytics if available
                if (typeof gtag === 'function') {
                    gtag('event', 'chat_feedback', {
                        'event_category': 'Ask Book',
                        'event_label': type,
                        'value': type === 'up' ? 1 : 0
                    });
                }
            } catch (e) {
                console.warn('[ASK BOOK] Failed to save feedback:', e);
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // CTA GENERATOR
    // ═══════════════════════════════════════════════════════════════════════
    
    const CTAGenerator = {
        shouldShowCTA: function() {
            const count = state.questionCount;
            if (count >= CONFIG.ctaThresholds.strong) return 'strong';
            if (count >= CONFIG.ctaThresholds.light) return 'light';
            return null;
        },
        
        renderLight: function() {
            return `
                <div class="ask-book-chat__cta ask-book-chat__cta--light">
                    <p>You're exploring just 5% of the framework. The full 114,000-word book awaits.</p>
                    <a href="${CONFIG.amazonLinks.kindle}" target="_blank" rel="noopener" class="ask-book-chat__cta-link">
                        Get instant access on Kindle →
                    </a>
                </div>
            `;
        },
        
        renderStrong: function() {
            return `
                <div class="ask-book-chat__cta ask-book-chat__cta--strong">
                    <div class="ask-book-chat__cta-box">
                        <h4>Ready for the Complete Framework?</h4>
                        <p>This AI knows the book. But nothing beats reading it yourself.</p>
                        <div class="ask-book-chat__cta-options">
                            <a href="${CONFIG.amazonLinks.kindle}" target="_blank" rel="noopener" class="ask-book-chat__cta-btn ask-book-chat__cta-btn--primary">
                                Kindle £9.99
                            </a>
                            <a href="${CONFIG.amazonLinks.paperback}" target="_blank" rel="noopener" class="ask-book-chat__cta-btn">
                                Paperback £14.99
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // UI COMPONENTS
    // ═══════════════════════════════════════════════════════════════════════
    
    const UI = {
        toggleChat: function() {
            state.isOpen = !state.isOpen;
            
            if (elements.chat) {
                elements.chat.classList.toggle('active', state.isOpen);
            }
            if (elements.fab) {
                elements.fab.classList.toggle('active', state.isOpen);
            }
            
            if (state.isOpen) {
                setTimeout(() => {
                    if (elements.input) elements.input.focus();
                }, 300);
                
                // Visual effect - speed up particles if available
                if (window.CONFIG && window.CONFIG.main) {
                    const originalSpeed = window.CONFIG.main.particleSpeed || 0.3;
                    window.CONFIG.main.particleSpeed = 0.8;
                    setTimeout(() => {
                        if (window.CONFIG.main) window.CONFIG.main.particleSpeed = originalSpeed;
                    }, 500);
                }
                
                // Track open event
                if (typeof gtag === 'function') {
                    gtag('event', 'chat_open', { 'event_category': 'Ask Book' });
                }
            }
        },
        
        addMessage: function(text, type, options = {}) {
            if (!elements.messages) return;
            
            const { sources, models, relatedQuestions, showCTA } = options;
            
            // Hide welcome and suggestions after first message
            if (elements.welcome) elements.welcome.style.display = 'none';
            if (elements.suggestions) elements.suggestions.style.display = 'none';
            
            const msgDiv = document.createElement('div');
            msgDiv.className = `ask-book-chat__message ask-book-chat__message--${type}`;
            
            // Message content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'ask-book-chat__message-content';
            contentDiv.innerHTML = type === 'ai' 
                ? MarkdownRenderer.render(BrandGuardian.sanitise(text))
                : text;
            msgDiv.appendChild(contentDiv);
            
            // AI message extras
            if (type === 'ai') {
                // Sources
                if (sources && sources.length > 0) {
                    const sourcesDiv = document.createElement('div');
                    sourcesDiv.className = 'ask-book-chat__sources';
                    sourcesDiv.innerHTML = `
                        <span class="ask-book-chat__sources-label">Sources</span>
                        ${sources.map(s => `
                            <span class="ask-book-chat__source-tag">
                                ${s.name}${s.chapter ? ` (Ch. ${s.chapter})` : ''}
                            </span>
                        `).join('')}
                    `;
                    msgDiv.appendChild(sourcesDiv);
                }
                
                // Action buttons (Listen, Copy, Share)
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'ask-book-chat__message-actions';
                
                // Listen button
                const listenBtn = document.createElement('button');
                listenBtn.className = 'ask-book-chat__listen-btn';
                listenBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Listen
                `;
                listenBtn.onclick = () => VoiceOutput.speak(text, listenBtn);
                actionsDiv.appendChild(listenBtn);
                
                // Copy button
                const copyBtn = document.createElement('button');
                copyBtn.className = 'ask-book-chat__copy-btn';
                copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Copy
                `;
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(text).then(() => {
                        copyBtn.classList.add('copied');
                        copyBtn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Copied
                        `;
                        setTimeout(() => {
                            copyBtn.classList.remove('copied');
                            copyBtn.innerHTML = `
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                                </svg>
                                Copy
                            `;
                        }, 2000);
                    });
                };
                actionsDiv.appendChild(copyBtn);
                
                // Share button (if Web Share API available)
                if (navigator.share) {
                    const shareBtn = document.createElement('button');
                    shareBtn.className = 'ask-book-chat__share-btn';
                    shareBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"/>
                            <circle cx="6" cy="12" r="3"/>
                            <circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        Share
                    `;
                    shareBtn.onclick = () => {
                        navigator.share({
                            title: 'From Infinite Architects',
                            text: text.slice(0, 200) + '...',
                            url: 'https://www.michaeldariuseastwood.com'
                        });
                    };
                    actionsDiv.appendChild(shareBtn);
                }
                
                msgDiv.appendChild(actionsDiv);
                
                // Feedback buttons
                const feedbackDiv = document.createElement('div');
                feedbackDiv.className = 'ask-book-chat__feedback';
                feedbackDiv.innerHTML = `
                    <span class="ask-book-chat__feedback-label">Was this helpful?</span>
                    <button class="ask-book-chat__feedback-btn" data-feedback="up" title="Yes, helpful">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                        </svg>
                    </button>
                    <button class="ask-book-chat__feedback-btn" data-feedback="down" title="No, not helpful">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
                        </svg>
                    </button>
                `;
                
                feedbackDiv.querySelectorAll('.ask-book-chat__feedback-btn').forEach(btn => {
                    btn.onclick = () => {
                        const feedbackType = btn.dataset.feedback;
                        Feedback.save(options.query || '', text, feedbackType);
                        feedbackDiv.innerHTML = `<span class="ask-book-chat__feedback-thanks">Thanks for your feedback!</span>`;
                    };
                });
                
                msgDiv.appendChild(feedbackDiv);
                
                // Model info
                if (models && models.length > 0) {
                    const modelDiv = document.createElement('div');
                    modelDiv.className = 'ask-book-chat__model-info';
                    modelDiv.textContent = `Answered by ${models.join(', ')}`;
                    msgDiv.appendChild(modelDiv);
                }
                
                // Related questions
                if (relatedQuestions && relatedQuestions.length > 0) {
                    const relatedDiv = document.createElement('div');
                    relatedDiv.className = 'ask-book-chat__related';
                    relatedDiv.innerHTML = `
                        <span class="ask-book-chat__related-label">Related Questions</span>
                        <div class="ask-book-chat__related-buttons">
                            ${relatedQuestions.map(q => `
                                <button class="ask-book-chat__related-btn" data-query="${q}">${q}</button>
                            `).join('')}
                        </div>
                    `;
                    
                    relatedDiv.querySelectorAll('.ask-book-chat__related-btn').forEach(btn => {
                        btn.onclick = () => sendMessage(btn.dataset.query);
                    });
                    
                    msgDiv.appendChild(relatedDiv);
                }
                
                // CTA
                if (showCTA) {
                    const ctaType = CTAGenerator.shouldShowCTA();
                    if (ctaType === 'strong') {
                        msgDiv.insertAdjacentHTML('beforeend', CTAGenerator.renderStrong());
                    } else if (ctaType === 'light') {
                        msgDiv.insertAdjacentHTML('beforeend', CTAGenerator.renderLight());
                    }
                }
            }
            
            elements.messages.appendChild(msgDiv);
            
            // Scroll to bottom
            elements.messages.scrollTop = elements.messages.scrollHeight;
            
            // Save to memory
            Memory.save({ text, type, sources, timestamp: Date.now() });
            
            return msgDiv;
        },
        
        addLoading: function() {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'ask-book-chat__loading';
            loadingDiv.id = 'askBookLoading';
            loadingDiv.innerHTML = `
                <div class="ask-book-chat__loading-dots">
                    <span class="ask-book-chat__loading-dot"></span>
                    <span class="ask-book-chat__loading-dot"></span>
                    <span class="ask-book-chat__loading-dot"></span>
                </div>
                <span class="ask-book-chat__loading-text">Consulting the book...</span>
            `;
            
            if (elements.messages) {
                elements.messages.appendChild(loadingDiv);
                elements.messages.scrollTop = elements.messages.scrollHeight;
            }
            
            return loadingDiv;
        },
        
        removeLoading: function() {
            const loading = document.getElementById('askBookLoading');
            if (loading) loading.remove();
        },
        
        addError: function(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'ask-book-chat__error';
            errorDiv.textContent = message;
            
            if (elements.messages) {
                elements.messages.appendChild(errorDiv);
                elements.messages.scrollTop = elements.messages.scrollHeight;
            }
            
            // Auto-remove after 5 seconds
            setTimeout(() => errorDiv.remove(), 5000);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // API CALL
    // ═══════════════════════════════════════════════════════════════════════
    
    async function callAPI(query, mode = 'fast') {
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                mode: mode,
                history: Memory.getContext()
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SEND MESSAGE
    // ═══════════════════════════════════════════════════════════════════════
    
    async function sendMessage(text) {
        const query = text || (elements.input ? elements.input.value.trim() : '');
        
        if (!query || state.isLoading) return;
        
        // Clear input
        if (elements.input) elements.input.value = '';
        
        // Add user message
        UI.addMessage(query, 'user');
        
        // Update question count
        state.questionCount++;
        localStorage.setItem(CONFIG.questionCountKey, state.questionCount.toString());
        
        // Show loading
        state.isLoading = true;
        if (elements.send) elements.send.disabled = true;
        UI.addLoading();
        
        // Determine mode
        const mode = (elements.fullMode && elements.fullMode.checked) ? 'full' : 'fast';
        
        try {
            const response = await callAPI(query, mode);
            
            UI.removeLoading();
            
            if (response.success && response.answer) {
                const relatedQuestions = response.relatedQuestions || 
                    RelatedQuestions.generate(query, response.answer, response.sources);
                
                UI.addMessage(response.answer, 'ai', {
                    sources: response.sources,
                    models: response.models,
                    relatedQuestions: relatedQuestions,
                    showCTA: true,
                    query: query
                });
                
                // Track success
                if (typeof gtag === 'function') {
                    gtag('event', 'chat_response', {
                        'event_category': 'Ask Book',
                        'event_label': response.type || 'ai',
                        'value': response.responseTime
                    });
                }
            } else {
                throw new Error(response.error || 'No answer received');
            }
        } catch (error) {
            console.error('[ASK BOOK] Error:', error);
            UI.removeLoading();
            UI.addError('I had trouble finding that answer. Please try rephrasing your question.');
            
            // Track error
            if (typeof gtag === 'function') {
                gtag('event', 'chat_error', {
                    'event_category': 'Ask Book',
                    'event_label': error.message
                });
            }
        } finally {
            state.isLoading = false;
            if (elements.send) elements.send.disabled = false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════
    
    function initEventListeners() {
        // FAB click
        if (elements.fab) {
            elements.fab.addEventListener('click', UI.toggleChat);
        }
        
        // Close button
        if (elements.close) {
            elements.close.addEventListener('click', UI.toggleChat);
        }
        
        // Backdrop click
        if (elements.backdrop) {
            elements.backdrop.addEventListener('click', UI.toggleChat);
        }
        
        // Clear history
        if (elements.clear) {
            elements.clear.addEventListener('click', () => {
                if (confirm('Clear conversation history?')) {
                    Memory.clear();
                    if (elements.messages) elements.messages.innerHTML = '';
                    if (elements.welcome) elements.welcome.style.display = 'block';
                    if (elements.suggestions) elements.suggestions.style.display = 'block';
                }
            });
        }
        
        // Send button
        if (elements.send) {
            elements.send.addEventListener('click', () => sendMessage());
        }
        
        // Input enter key
        if (elements.input) {
            elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
        
        // Microphone
        if (elements.mic) {
            elements.mic.addEventListener('click', VoiceInput.toggle);
        }
        
        // Suggestion buttons
        document.querySelectorAll('.ask-book-chat__suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                sendMessage(btn.dataset.query);
            });
        });
        
        // Quick buttons (old format)
        document.querySelectorAll('.ask-book-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sendMessage(btn.dataset.question);
            });
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isOpen) {
                UI.toggleChat();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    function init() {
        // Load history
        Memory.load();
        
        // Initialize voice input
        VoiceInput.init();
        
        // Preload voices for speech synthesis
        if ('speechSynthesis' in window) {
            speechSynthesis.getVoices();
            speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
        }
        
        // Initialize event listeners
        initEventListeners();
        
        console.log('[ASK BOOK] Ultimate Intelligence Engine initialized');
        console.log('[ASK BOOK] Questions asked this session:', state.questionCount);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
```

---

## Integration Instructions

### Step 1: Locate Current Script

Find the existing Ask Book script in `index.html`. It starts with:
```html
<!-- Ask the Book JavaScript -->
<script>
(function() {
    'use strict';
```

### Step 2: Replace Entirely

Replace the entire script (from `<!-- Ask the Book JavaScript -->` to its closing `</script>`) with the new implementation above.

### Step 3: Update HTML Elements

Ensure these element IDs exist in the HTML:
- `askBookFab` or `ask-book-toggle`
- `askBookChat` or `ask-book-widget`
- `askBookMessages` or `ask-book-messages`
- `askBookInput` or `ask-book-input`
- `askBookSend` or `ask-book-send`
- `askBookMic` (new - for voice input)
- `askBookClose` (new - close button)
- `askBookClear` (new - clear history)
- `askBookFullMode` (new - deep analysis checkbox)

### Step 4: Test

1. Open the chat
2. Ask a question
3. Verify voice input works (click mic)
4. Verify voice output works (click Listen)
5. Verify copy button works
6. Verify related questions appear
7. Verify feedback buttons work
8. Verify CTA appears after 3+ questions

---

## API Integration

The frontend expects the API at `/api/ask-book` to return:

```json
{
    "success": true,
    "answer": "The answer text...",
    "sources": [
        { "name": "The Eden Protocol", "chapter": 4, "type": "chapter" }
    ],
    "type": "ai",
    "models": ["Claude"],
    "modelCount": 1,
    "relatedQuestions": ["Question 1?", "Question 2?"],
    "responseTime": 1234
}
```

See `ASK-BOOK-ULTIMATE.md` for the complete API implementation.
