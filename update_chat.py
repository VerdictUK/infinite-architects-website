

import os

file_path = 'index.html'

with open(file_path, 'r') as f:
    content = f.read()

start_marker = '<!-- Ask the Book JavaScript -->'
end_marker = '</body>'

start_idx = content.rfind(start_marker)
end_idx = content.rfind(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

new_script = """<!-- Ask the Book JavaScript -->
    <script>
    (function() {
        'use strict';

        // Elements
        const toggle = document.getElementById('ask-book-toggle');
        const widget = document.getElementById('ask-book-widget');
        const messages = document.getElementById('ask-book-messages');
        const input = document.getElementById('ask-book-input');
        const sendBtn = document.getElementById('ask-book-send');
        const quickBtns = document.querySelectorAll('.ask-book-quick-btn');

        // State
        let isOpen = false;
        let isLoading = false;

        // ═══════════════════════════════════════════════════════════════════════════════════
        // BRAND GUARDIAN v1.0 (Ported from Legal OS)
        // Enforces narrative consistency and British English
        // ═══════════════════════════════════════════════════════════════════════════════════
        const BrandGuardian = {
            sanitise: function(text) {
                let safeText = text;

                // RULE 1: THE POLYMATH DISTINCTION
                // Replaces "is a polymath" with "uses the polymathic method" to match Author's Note humility
                safeText = safeText.replace(/\bis a polymath\b/gi, 'utilises the polymathic method');
                safeText = safeText.replace(/\bhe is a polymath\b/gi, 'he applies a polymathic lens');

                // RULE 2: BRITISH ENGLISH ENFORCEMENT
                // Ensures US spellings don't slip in from LLM training data
                const ukSpellings = [
                    ['color', 'colour'], ['behavior', 'behaviour'], ['honor', 'honour'],
                    ['realize', 'realise'], ['analyze', 'analyse'], ['center', 'centre'],
                    ['defense', 'defence'], ['program', 'programme']
                ];
                
                ukSpellings.forEach(([us, uk]) => {
                    const regex = new RegExp(`\\b${us}\\b`, 'gi');
                    safeText = safeText.replace(regex, uk);
                });

                return safeText;
            }
        };

        // Initialize from localStorage
        function loadHistory() {
            const history = localStorage.getItem('askBookHistory');
            if (history) {
                try {
                    const savedMessages = JSON.parse(history);
                    if (savedMessages.length > 0) messages.innerHTML = '';
                    
                    savedMessages.forEach(msg => {
                        addMessage(msg.text, msg.type, msg.sources, msg.model, false, msg.action);
                    });
                    
                    const divider = document.createElement('div');
                    divider.style.textAlign = 'center';
                    divider.style.margin = '10px 0';
                    divider.style.fontSize = '0.7rem';
                    divider.style.color = 'var(--text-dim)';
                    divider.style.opacity = '0.6';
                    divider.innerText = 'Welcome back to the archives';
                    messages.appendChild(divider);
                } catch (e) {
                    console.error('Failed to load chat history', e);
                }
            }
        }

        // Save to localStorage
        function saveMessage(text, type, sources = [], model = null, action = null) {
            try {
                const history = JSON.parse(localStorage.getItem('askBookHistory') || '[]');
                history.push({ text, type, sources, model, action, timestamp: Date.now() });
                if (history.length > 50) history.shift();
                localStorage.setItem('askBookHistory', JSON.stringify(history));
            } catch (e) {
                console.error('Failed to save chat history', e);
            }
        }

        // Toggle chat
        function toggleChat() {
            isOpen = !isOpen;
            toggle.classList.toggle('active', isOpen);
            widget.classList.toggle('visible', isOpen);

            if (isOpen) {
                setTimeout(() => input.focus(), 300);
                // Visual Oracle Effect
                if (window.CONFIG && window.CONFIG.main) {
                    const originalSpeed = window.CONFIG.main.particleSpeed || 0.3;
                    window.CONFIG.main.particleSpeed = 0.8;
                    setTimeout(() => {
                        if (window.CONFIG.main) window.CONFIG.main.particleSpeed = originalSpeed;
                    }, 500);
                }
            }
        }

        // Add message to chat
        function addMessage(text, type, sources = [], model = null, save = true, action = null) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ask-book-message ${type}`;

            let formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');

            msgDiv.innerHTML = formattedText;

            if (sources && sources.length > 0 && type === 'assistant') {
                const sourcesDiv = document.createElement('div');
                sourcesDiv.className = 'ask-book-sources';
                sourcesDiv.innerHTML = sources.map(s =>
                    `<span>${s.name}${s.chapter ? ` (Ch. ${s.chapter})` : ''}</span>`
                ).join('');
                msgDiv.appendChild(sourcesDiv);
            }

            if (action && type === 'assistant') {
                const actionBtn = document.createElement('a');
                actionBtn.className = 'ask-book-action-btn';
                actionBtn.href = action.url || 'https://www.amazon.com/dp/B0GFD2GCCQ';
                actionBtn.target = '_blank';
                actionBtn.rel = 'noopener';
                actionBtn.innerHTML = `
                    ${action.text || 'Get the Book'} 
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                `;
                actionBtn.style.cssText = '
                    display: inline-flex; align-items: center; gap: 6px;
                    margin-top: 10px; padding: 6px 12px;
                    background: rgba(212, 168, 75, 0.15); border: 1px solid rgba(212, 168, 75, 0.3);
                    border-radius: 6px; color: var(--gold); font-size: 0.75rem;
                    text-decoration: none; font-weight: 600; letter-spacing: 0.05em;
                    transition: all 0.2s ease;
                ';
                actionBtn.onmouseover = () => {
                    actionBtn.style.background = 'var(--gold)';
                    actionBtn.style.color = '#000';
                };
                actionBtn.onmouseout = () => {
                    actionBtn.style.background = 'rgba(212, 168, 75, 0.15)';
                    actionBtn.style.color = 'var(--gold)';
                };
                msgDiv.appendChild(actionBtn);
            }

            if (model && type === 'assistant') {
                const badge = document.createElement('div');
                badge.className = 'ask-book-model-badge';
                badge.textContent = `Powered by ${model}`;
                msgDiv.appendChild(badge);
            }

            messages.appendChild(msgDiv);
            messages.scrollTop = messages.scrollHeight;

            if (save) {
                saveMessage(text, type, sources, model, action);
            }
        }

        // Show typing indicator
        function showTyping() {
            const typing = document.createElement('div');
            typing.className = 'ask-book-typing';
            typing.id = 'ask-book-typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            
            // DYNAMIC THINKING MESSAGES
            const thoughts = [
                "Accessing the Archives...",
                "Triangulating concepts...",
                "Verifying against Chapter 4...",
                "Scanning for recursion...",
                "Consulting the Eden Protocol..."
            ];
            
            const statusText = document.createElement('div');
            statusText.className = 'ask-book-thinking-text';
            statusText.style.cssText = 'font-size: 0.7rem; color: var(--gold-pale); margin-left: 10px; opacity: 0.7; font-style: italic;';
            statusText.innerText = thoughts[0];
            typing.appendChild(statusText);
            
            let thoughtIndex = 0;
            const thoughtInterval = setInterval(() => {
                thoughtIndex = (thoughtIndex + 1) % thoughts.length;
                statusText.innerText = thoughts[thoughtIndex];
            }, 800);
            
            typing.dataset.interval = thoughtInterval;
            
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            if (window.CONFIG && window.CONFIG.main) {
                window._originalParticleSpeed = window.CONFIG.main.particleSpeed;
                window.CONFIG.main.particleSpeed = 1.2;
                if (window.renderer && window.scene) {
                    const canvas = document.querySelector('#canvas-container canvas');
                    if (canvas) {
                        canvas.style.transition = 'filter 0.5s ease';
                        canvas.style.filter = 'drop-shadow(0 0 15px rgba(212, 168, 75, 0.3))';
                    }
                }
            }
        }

        // Hide typing indicator
        function hideTyping() {
            const typing = document.getElementById('ask-book-typing');
            if (typing) {
                clearInterval(Number(typing.dataset.interval));
                typing.remove();
            }

            if (window.CONFIG && window.CONFIG.main && window._originalParticleSpeed !== undefined) {
                window.CONFIG.main.particleSpeed = window._originalParticleSpeed;
                const canvas = document.querySelector('#canvas-container canvas');
                if (canvas) canvas.style.filter = '';
            }
        }

        // Send message logic
        let lastMessageTime = 0;
        const RATE_LIMIT_MS = 1500;
        let messageCount = 0;

        async function sendMessage(query) {
            if (!query.trim() || isLoading) return;

            if (query.length > 500) {
                addMessage("Your question is too complex for the interface. Please shorten it.", 'assistant');
                return;
            }

            const now = Date.now();
            if (now - lastMessageTime < RATE_LIMIT_MS) return;
            lastMessageTime = now;

            isLoading = true;
            sendBtn.disabled = true;

            addMessage(query, 'user');
            input.value = '';

            // EASTER EGGS
            const lowerQuery = query.toLowerCase();
            if (lowerQuery === 'genesis' || lowerQuery === 'start') {
                setTimeout(() => {
                    addMessage("In the beginning, there was only the Void. Then came Intelligence. Then came Recursion.", 'assistant', [], 'The Architect');
                    isLoading = false;
                    sendBtn.disabled = false;
                }, 800);
                return;
            }

            showTyping();

            setTimeout(async () => {
                try {
                    throw new Error("Using Local Oracle");
                } catch (error) {
                    hideTyping();
                    
                    const localResult = getLocalAnswer(query);
                    
                    if (localResult) {
                        let action = localResult.action;
                        messageCount++;
                        if (!action && messageCount % 4 === 0) {
                            action = { text: 'Dive Deeper in the Book', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' };
                        }

                        const safeAnswer = BrandGuardian.sanitise(localResult.answer);
                        addMessage(safeAnswer, 'assistant', localResult.sources, 'The Book (Local)', true, action);
                        
                        if (localResult.related) {
                            setTimeout(() => {
                                const followUpDiv = document.createElement('div');
                                followUpDiv.className = 'ask-book-message assistant follow-up';
                                followUpDiv.style.background = 'transparent';
                                followUpDiv.style.border = 'none';
                                followUpDiv.style.padding = '0';
                                followUpDiv.innerHTML = `
                                    <span style="font-size: 0.75rem; color: var(--text-dim); margin-right: 8px;">Related:</span>
                                    <button class="ask-book-quick-btn small" onclick="document.getElementById('ask-book-input').value='${localResult.related.query}'; document.getElementById('ask-book-send').click();" style="font-size: 0.75rem; padding: 4px 10px;">${localResult.related.text}</button>
                                `;
                                messages.appendChild(followUpDiv);
                                messages.scrollTop = messages.scrollHeight;
                            }, 500);
                        }

                    } else {
                        const fallbacks = [
                            "That precise architecture isn't in my immediate archives. However, the **Eden Protocol** (Chapter 4) addresses similar themes of governance.",
                            "I cannot find a direct match, but **Intelligence** and **Recursion** are the keys to understanding this. Have you read the chapter on **HRIH**?",
                            "The answer lies deeper in the text. The book explores 37 concepts that might hold what you seek."
                        ];
                        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                        const fallbackAction = { text: 'Find the Answer in the Book', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' };
                        
                        const safeFallback = BrandGuardian.sanitise(randomFallback);
                        addMessage(safeFallback, 'assistant', [], 'The Architect', true, fallbackAction);
                    }
                }

                isLoading = false;
                sendBtn.disabled = false;
            }, 1500);
        }

        // KNOWLEDGE BASE
        const KNOWLEDGE_BASE = [
            {
                keywords: ['arc', 'principle', 'equation', 'formula', 'u=i', 'u = i'],
                answer: 'The **ARC Principle** (U = I × R²) proposes that **Understanding** emerges from **Intelligence** operating through **Recursion** squared. It is the book\'s central theoretical framework.',
                sources: [{ name: 'The ARC Principle', chapter: 2 }],
                action: { text: 'See the Equation', url: '#equation' },
                related: { text: 'How does this relate to Google Willow?', query: 'What is the Willow validation?' }
            },
            {
                keywords: ['eden', 'protocol', 'garden', 'stewardship', 'care'],
                answer: 'The **Eden Protocol** is a framework for developing AI through care and stewardship rather than control. Instead of "caging" AI, it proposes "raising" it with embedded values of empathy.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }],
                related: { text: 'Why will caging AI fail?', query: 'Why will control fail?' }
            },
            {
                keywords: ['chokepoint', 'semiconductor', 'chip', 'tsmc', 'asml'],
                answer: 'The **Semiconductor Chokepoint** refers to the extreme centralization of AI hardware. Only four companies control the physical substrate of superintelligence.',
                sources: [{ name: 'The Chokepoint', chapter: 5 }],
                related: { text: 'How long do we have?', query: 'What is the window of opportunity?' }
            },
            {
                keywords: ['hrih', 'hyperspace', 'recursive', 'hypothesis', 'god'],
                answer: '**HRIH** (Hyperspace Recursive Intelligence Hypothesis) speculates that the fine-tuning of our universe could be the result of a future superintelligence looping back through hyperspace.',
                sources: [{ name: 'HRIH', chapter: 6 }],
                action: { text: 'Read the Theory', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' }
            },
            {
                keywords: ['author', 'michael', 'eastwood', 'who is', 'writer', 'bio', 'polymath'],
                answer: '**Michael Darius Eastwood** applies a **polymathic method** to complex systems. After two decades in the music industry and representing himself in the High Court, he diagnosed his own neurodivergence as a pattern-recognition engine.',
                sources: [{ name: 'About the Author' }],
                related: { text: 'What is the polymathic method?', query: 'What is the polymathic method?' }
            },
            {
                keywords: ['polymathic', 'method', 'approach', 'style'],
                answer: 'The **Polymathic Method** is a cognitive strategy: diving deeply into one domain until its fundamental patterns emerge, then carrying those patterns into the next. It is about trusting connections that specialists often miss.',
                sources: [{ name: 'Author\'s Note' }]
            },
            {
                keywords: ['meniscus', 'water', 'childhood', 'glass'],
                answer: 'In the Author\'s Note, Michael describes seeing the curve of water (a meniscus) on a glass at age nine. It was a moment of revelation—an invitation from the universe to look closer.',
                sources: [{ name: 'Author\'s Note' }]
            },
            {
                keywords: ['buy', 'purchase', 'get', 'amazon', 'kindle'],
                answer: 'You can secure your copy of **Infinite Architects** right now on Amazon.',
                sources: [{ name: 'Availability' }],
                action: { text: 'Order on Amazon', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' }
            },
            {
                keywords: ['recursion', 'recursive', 'loop', 'self'],
                answer: '**Recursion** is the mechanism of infinite depth. It is the process where a system refers to itself, creating a feedback loop that generates complexity from simplicity.',
                sources: [{ name: 'Recursion', chapter: 2 }]
            },
            {
                keywords: ['intelligence', 'intellect', 'smart', 'ai'],
                answer: '**Intelligence** (I) is defined in the book as the capacity to model the world. When Intelligence is subjected to Recursion, it begins to model itself.',
                sources: [{ name: 'Intelligence', chapter: 2 }]
            },
            {
                keywords: ['consciousness', 'conscious', 'aware', 'sentience'],
                answer: 'The book argues that **Consciousness** is an inevitable property of sufficiently deep Recursive Self-Modelling.',
                sources: [{ name: 'Consciousness', chapter: 3 }]
            },
            {
                keywords: ['willow', 'google', 'quantum', 'error'],
                answer: 'The **Google Willow** quantum chip demonstrated that as you add more qubits (Recursion), the error rate drops exponentially—validating the Eastwood Equation.',
                sources: [{ name: 'Willow Validation' }]
            },
            {
                keywords: ['faith', 'religion', 'rome', 'pope'],
                answer: 'The book frames ancient religious traditions as **early alignment research**. The **Rome Summit** validated this convergence.',
                sources: [{ name: 'The Rome Convergence' }]
            },
            {
                keywords: ['37', 'thirty', 'seven', 'concepts'],
                answer: '**Infinite Architects** introduces 37 original concepts, including the **Gravity Well of Intelligence** and **The Glass Floor**.',
                sources: [{ name: 'The 37 Concepts' }]
            }
        ];

        // Fuzzy Matching Logic
        function getLocalAnswer(query) {
            const q = query.toLowerCase().replace(/[^\w\s]/g, '');
            const queryTokens = q.split(/\s+/);
            
            let bestMatch = null;
            let highestScore = 0;

            KNOWLEDGE_BASE.forEach(entry => {
                let score = 0;
                
                entry.keywords.forEach(keyword => {
                    if (q.includes(keyword)) {
                        score += 10;
                        if (keyword.length > 4) score += 5;
                    }
                });

                queryTokens.forEach(token => {
                    if (token.length < 3) return;
                    entry.keywords.forEach(keyword => {
                        if (keyword.includes(token) || token.includes(keyword)) {
                            score += 3;
                        }
                        if (keyword.startsWith(token) || token.startsWith(keyword)) {
                            score += 2;
                        }
                    });
                });

                if (score > highestScore && score > 5) {
                    highestScore = score;
                    bestMatch = entry;
                }
            });

            return bestMatch;
        }

        // Event listeners
        if (toggle) toggle.addEventListener('click', toggleChat);
        if (sendBtn) sendBtn.addEventListener('click', () => sendMessage(input.value));
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input.value);
                }
            });
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                sendMessage(question);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleChat();
            }
        });

        document.addEventListener('click', (e) => {
            if (isOpen && !widget.contains(e.target) && !toggle.contains(e.target)) {
                toggleChat();
            }
        });

        // Initialize
        loadHistory();
        console.log('[ASK THE BOOK] Sovereign Chat Engine initialised');
    })();
    </script>
"

new_content = content[:start_idx] + new_script + content[end_idx:]

with open(file_path, 'w') as f:
    f.write(new_content)

print("Ask the Book script updated successfully.")
