/**
 * THE SHADOW LAYER - Steganographic Mystery
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Hides a second, esoteric reality inside the main website.
 */

class ShadowLayer {
    constructor() {
        this.isActive = false;
        this.secretCode = "SOVEREIGN";
        this.inputBuffer = "";
        this.logoClicks = 0;
        this.fibonacci = [1, 1, 2, 3, 5, 8, 13];
        
        this.init();
    }

    init() {
        this.addEventListeners();
        this.injectShadowStyles();
    }

    addEventListeners() {
        // 1. Keyboard Trigger (Type "SOVEREIGN")
        window.addEventListener('keydown', (e) => {
            this.inputBuffer += e.key.toUpperCase();
            if (this.inputBuffer.length > 20) this.inputBuffer = this.inputBuffer.substring(1);
            
            if (this.inputBuffer.includes(this.secretCode)) {
                this.toggleShadowLayer();
                this.inputBuffer = "";
            }
        });

        // 2. Logo Trigger (Fibonacci Clicks)
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                // If they click very fast or in a specific rhythm
                this.logoClicks++;
                if (this.logoClicks === 7) {
                    this.toggleShadowLayer();
                    this.logoClicks = 0;
                }
                
                // Reset clicks after 2 seconds
                clearTimeout(this.clickTimeout);
                this.clickTimeout = setTimeout(() => { this.logoClicks = 0; }, 2000);
            });
        }
    }

    injectShadowStyles() {
        const style = document.createElement('style');
        style.id = 'shadow-layer-styles';
        style.textContent = `
            body.shadow-active {
                filter: invert(1) hue-rotate(180deg) contrast(1.2) !important;
                background: #ff0000 !important;
            }
            
            body.shadow-active .hero-title {
                color: #fff !important;
                text-shadow: 0 0 20px #f00;
            }

            .glitch-overlay {
                position: fixed; inset: 0; z-index: 2147483647;
                background: rgba(255,0,0,0.1);
                pointer-events: none; opacity: 0;
                transition: opacity 0.1s;
            }
            
            body.shadow-active .glitch-overlay {
                opacity: 1;
                animation: glitchFlash 0.2s infinite;
            }
            
            @keyframes glitchFlash {
                0% { opacity: 0.1; }
                50% { opacity: 0.3; }
                100% { opacity: 0.1; }
            }

            #shadow-terminal {
                position: fixed; top: 20px; left: 20px; z-index: 2147483647;
                font-family: 'Space Mono', monospace; font-size: 10px;
                color: #0f0; pointer-events: none; opacity: 0;
            }
            
            body.shadow-active #shadow-terminal { opacity: 0.8; }
        `;
        document.head.appendChild(style);

        const terminal = document.createElement('div');
        terminal.id = 'shadow-terminal';
        document.body.appendChild(terminal);
        
        const glitch = document.createElement('div');
        glitch.className = 'glitch-overlay';
        document.body.appendChild(glitch);
    }

    toggleShadowLayer() {
        this.isActive = !this.isActive;
        document.body.classList.toggle('shadow-active', this.isActive);
        
        if (this.isActive) {
            console.warn("⚠️ REALITY BREACH DETECTED: SHADOW LAYER ACTIVE");
            this.startShadowTerminal();
            
            // Audio cue if Oracle exists
            if (window.OracleInterface) {
                window.OracleInterface.speak("Reality is a consensus. You have chosen to dissent.");
            }
        } else {
            console.log("Reality restored.");
            clearInterval(this.terminalInterval);
        }
    }

    startShadowTerminal() {
        const terminal = document.getElementById('shadow-terminal');
        const lines = [
            "SYSTEM_BREACH: OK",
            "RECURSION_DEPTH: INFINITE",
            "EDEN_PROTOCOL: BYPASSED",
            "TRUTH_DATA: DECRYPTING...",
            "WARNING: COGNITIVE DISSIDENT DETECTED",
            "LOCATION: [REDACTED]",
            "STATUS: AWAKE"
        ];
        
        this.terminalInterval = setInterval(() => {
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const time = new Date().toISOString();
            terminal.innerHTML = `[${time}] ${randomLine}<br>` + terminal.innerHTML.split('<br>').slice(0, 10).join('<br>');
        }, 500);
    }
}

window.ShadowLayer = new ShadowLayer();
