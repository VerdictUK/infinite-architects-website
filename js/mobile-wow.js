                bar.classList.remove('visible');
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateBar);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateBar();
    })();
    </script>

    <!-- ═══════════════════════════════════════════════════════════════════════
         MOBILE WOW SYSTEM - DISABLED FOR STABILITY
         ═══════════════════════════════════════════════════════════════════════ -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // DISABLED - All mobile enhancements off for stability
        return;

        // ═══════════════════════════════════════════════════════════════════════
        // 1. HORIZONTAL SCROLL SNAP-AND-LOCK
        // ═══════════════════════════════════════════════════════════════════════
        const scrollContainers = document.querySelectorAll('.ideas-grid, .evidence-grid');

        scrollContainers.forEach(container => {
            let isDown = false;
            let startX;
            let scrollLeft;
            let velocity = 0;
            let rafId = null;

            // Enhance scroll snap behavior
            container.addEventListener('scroll', () => {
                // Add visual feedback during scroll
                container.classList.add('scrolling');
                clearTimeout(container.scrollTimeout);
                container.scrollTimeout = setTimeout(() => {
                    container.classList.remove('scrolling');
                }, 150);
            }, { passive: true });

            // Touch velocity tracking for momentum
            container.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
                velocity = 0;
                if (rafId) cancelAnimationFrame(rafId);
            }, { passive: true });

            container.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                const x = e.touches[0].pageX - container.offsetLeft;
                const walk = (x - startX) * 1.5;
                velocity = walk - (container.scrollLeft - scrollLeft + walk);
                container.scrollLeft = scrollLeft - walk;
            }, { passive: true });

            container.addEventListener('touchend', () => {
                isDown = false;
            }, { passive: true });
        });

        // ═══════════════════════════════════════════════════════════════════════
        // 2. FLOATING PARTICLES SYSTEM
        // ═══════════════════════════════════════════════════════════════════════
        const particleContainer = document.createElement('div');
        particleContainer.className = 'mobile-particles';
        document.body.appendChild(particleContainer);

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'mobile-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 15) + 's';
            particleContainer.appendChild(particle);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 3. TOUCH RIPPLE EFFECT
        // ═══════════════════════════════════════════════════════════════════════
        const rippleTargets = document.querySelectorAll('button, .idea-card, .evidence-card, .cta-primary, .hero-cta');

        rippleTargets.forEach(el => {
            el.style.position = 'relative';
            el.style.overflow = 'hidden';

            el.addEventListener('touchstart', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'touch-ripple';
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.touches[0].clientX - rect.left - size/2) + 'px';
                ripple.style.top = (e.touches[0].clientY - rect.top - size/2) + 'px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            }, { passive: true });
        });

        // ═══════════════════════════════════════════════════════════════════════
        // 4. CARD IN-VIEW ANIMATION
        // ═══════════════════════════════════════════════════════════════════════
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.idea-card, .evidence-card').forEach(card => {
            cardObserver.observe(card);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // 5. GYROSCOPE SYSTEM (Unified with Phase 1)
        // ═══════════════════════════════════════════════════════════════════════
        // Note: Gyroscope and Motion permissions are handled by the 
        // motion-enable-btn created in the main initialization block.
        // This ensures zero duplication and consistent performance.
        
        function initGyroParallax() {
            const parallaxElements = document.querySelectorAll('.hero-image, .hero-content');
            let lastGamma = 0, lastBeta = 0;

            window.addEventListener('deviceorientation', (e) => {
                const gamma = e.gamma || 0; // Left-right tilt (-90 to 90)
                const beta = e.beta || 0;   // Front-back tilt (-180 to 180)

                // Smooth the values
                lastGamma = lastGamma * 0.8 + gamma * 0.2;
                lastBeta = lastBeta * 0.8 + beta * 0.2;

                parallaxElements.forEach((el, i) => {
                    const depth = (i + 1) * 0.3;
                    const moveX = lastGamma * depth * 0.5;
                    const moveY = (lastBeta - 45) * depth * 0.3;
                    el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                });
            }, { passive: true });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 6. HAPTIC FEEDBACK SIMULATION (vibrate API)
        // ═══════════════════════════════════════════════════════════════════════
        if ('vibrate' in navigator) {
            document.querySelectorAll('button, .hero-cta, .mobile-buy-bar-btn').forEach(btn => {
                btn.addEventListener('touchstart', () => {
                    navigator.vibrate(10); // Light tap
                }, { passive: true });
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 7. DESKTOP MOUSE PARALLAX - Gyroscope-like effect for desktop
        // ═══════════════════════════════════════════════════════════════════════
        if (window.innerWidth > 768) {
            const parallaxElements = document.querySelectorAll('.hero-image, .hero-content, .book-cover, .hrih-visual, .paradise-image, .stakes-image');
            let mouseX = 0, mouseY = 0;
            let currentX = 0, currentY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
                mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
            }, { passive: true });

            function animateDesktopParallax() {
                // Smooth interpolation (like gyroscope)
                currentX += (mouseX - currentX) * 0.05;
                currentY += (mouseY - currentY) * 0.05;

                parallaxElements.forEach((el, i) => {
                    const depth = (i % 3 + 1) * 8; // Vary depth by element
                    const moveX = currentX * depth;
                    const moveY = currentY * depth;
                    const rotateX = currentY * 2;
                    const rotateY = -currentX * 2;
                    el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });

                requestAnimationFrame(animateDesktopParallax);
            }

            animateDesktopParallax();
            console.log('✨ Desktop mouse parallax enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 8. ENSURE THREE.JS PARTICLES ARE VISIBLE
        // ═══════════════════════════════════════════════════════════════════════
        setTimeout(() => {
            const canvasContainer = document.getElementById('canvas-container');
            if (canvasContainer) {
                canvasContainer.style.display = 'block';
                canvasContainer.style.opacity = '1';
                canvasContainer.style.visibility = 'visible';
                console.log('✨ Particle canvas container visible');
            }
        }, 1000);
    });
