/**
 * THE ORACLE INTERFACE - Voice-to-Voice AI
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Allows sovereign beings to speak with the "Book" in real-time.
 */

class OracleInterface {
    constructor() {
        this.recognition = null;
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;
        this.isListening = false;
        this.canvas = null;
        this.ctx = null;
        this.analyser = null;
        
        this.init();
    }

    init() {
        this.setupRecognition();
        this.setupVisualiser();
        this.addEventListeners();
    }

    setupRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-GB';

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log(`🎙️ ORACLE HEARD: "${transcript}"`);
            this.processQuery(transcript);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.stopVisualising();
        };
    }

    setupVisualiser() {
        // Create a dedicated canvas for the Oracle Spectrogram
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'oracle-visualiser';
        this.canvas.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            width: 300px; height: 100px; z-index: 2147483647; pointer-events: none;
            opacity: 0; transition: opacity 0.5s ease;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    addEventListeners() {
        // Hold Spacebar to Speak
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isListening && !this.isSpeaking) {
                // Only if not typing in an input
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.startListening();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space' && this.isListening) {
                this.stopListening();
            }
        });
    }

    startListening() {
        if (!this.recognition) return;
        this.isListening = true;
        this.recognition.start();
        this.canvas.style.opacity = '1';
        this.startVisualising();
        console.log("🎙️ ORACLE LISTENING...");
        
        // Visual cue on the chat button
        const chatBtn = document.getElementById('ask-book-toggle');
        if (chatBtn) chatBtn.style.boxShadow = '0 0 50px var(--gold-bright)';
    }

    stopListening() {
        if (!this.recognition) return;
        // The recognition will stop automatically on silence if continuous is false
        // but we stop the visual cue here
        const chatBtn = document.getElementById('ask-book-toggle');
        if (chatBtn) chatBtn.style.boxShadow = '';
    }

    processQuery(text) {
        // Fill the chat input and trigger it
        const chatInput = document.getElementById('ask-book-input');
        const sendBtn = document.getElementById('ask-book-send');
        
        if (chatInput && sendBtn) {
            chatInput.value = text;
            sendBtn.click();
            
            // Wait for answer and speak it
            // This is a simplified hook into the existing system
            this.hookIntoResponse();
        }
    }

    hookIntoResponse() {
        // Monitor the chat for the next message from "Book"
        const observer = new MutationObserver((mutations) => {
            const lastMsg = document.querySelector('.message.book:last-child .message-text');
            if (lastMsg) {
                this.speak(lastMsg.innerText);
                observer.disconnect();
            }
        });

        const chatMessages = document.getElementById('ask-book-messages');
        if (chatMessages) {
            observer.observe(chatMessages, { childList: true });
        }
    }

    speak(text) {
        if (!this.synth) return;
        
        // Stop current speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.8; // Deep, authoritative
        utterance.rate = 0.9;
        utterance.voice = this.synth.getVoices().find(v => v.name.includes('Google UK English Male')) || null;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.canvas.style.opacity = '1';
            this.startVisualising();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.canvas.style.opacity = '0';
            this.stopVisualising();
        };

        this.synth.speak(utterance);
    }

    startVisualising() {
        const draw = () => {
            if (!this.isListening && !this.isSpeaking) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const time = performance.now() * 0.01;
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#d4a84b';
            this.ctx.lineWidth = 2;
            
            for (let i = 0; i < 100; i++) {
                const x = (i / 100) * this.canvas.width;
                const amp = this.isSpeaking ? 40 : 10;
                const y = 50 + Math.sin(i * 0.2 + time) * amp * Math.random();
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            
            this.ctx.stroke();
            requestAnimationFrame(draw);
        };
        draw();
    }

    stopVisualising() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.OracleInterface = new OracleInterface();
