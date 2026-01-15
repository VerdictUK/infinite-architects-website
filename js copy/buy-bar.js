            </div>
        </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════
         MOBILE STICKY BUY BAR - Always-visible purchase option
         ═══════════════════════════════════════════════════════════════════════ -->
    <div class="mobile-buy-bar" id="mobile-buy-bar">
        <div class="mobile-buy-bar-inner">
            <div>
                <div class="mobile-buy-bar-text">Infinite Architects</div>
                <div class="mobile-buy-bar-price">Available Now</div>
            </div>
            <a href="https://www.amazon.co.uk/dp/B0DS2L8BVC" target="_blank" rel="noopener" class="mobile-buy-bar-btn">
                Buy Now
            </a>
        </div>
    </div>

    <!-- Mobile Buy Bar Controller -->
    <script>
    (function initMobileBuyBar() {
        const bar = document.getElementById('mobile-buy-bar');
        if (!bar || window.innerWidth > 768) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateBar() {
            const scrollY = window.scrollY;
            // Show bar after scrolling past hero section (roughly 100vh)
            if (scrollY > window.innerHeight * 0.8) {
                bar.classList.add('visible');
            } else {
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
