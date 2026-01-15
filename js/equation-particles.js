// ═══════════════════════════════════════════════════════════════════════
// LIVING EQUATION PARTICLES
// ═══════════════════════════════════════════════════════════════════════
(function initEquationParticles() {
    const canvas = document.getElementById('equation-particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles = [], mouse = { x: null, y: null, radius: 150 };
    
    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initParticles();
    }
    
    // Create particles that spell U = I × R²
    function initParticles() {
        particles = [];
        
        // Create temporary canvas to render text
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // Draw the equation
        const fontSize = Math.min(width / 8, 120);
        tempCtx.font = `bold ${fontSize}px 'Cinzel', serif`;
        tempCtx.fillStyle = '#d4a84b';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText('U = I × R²', width / 2, height / 2);
        
        // Sample pixels
        const imageData = tempCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const gap = 4; // Density
        
        for (let y = 0; y < height; y += gap) {
            for (let x = 0; x < width; x += gap) {
                const index = (y * width + x) * 4;
                const alpha = data[index + 3];
                
                if (alpha > 128) {
                    particles.push({
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        size: Math.random() * 2 + 1,
                        color: `rgba(212, 168, 75, ${0.3 + Math.random() * 0.7})`
                    });
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            // Calculate distance from mouse
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Repel particles from mouse
            if (distance < mouse.radius && mouse.x !== null) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                const tx = p.x - Math.cos(angle) * force * 50;
                const ty = p.y - Math.sin(angle) * force * 50;
                p.x += (tx - p.x) * 0.1;
                p.y += (ty - p.y) * 0.1;
            } else {
                // Return to base position
                p.x += (p.baseX - p.x) * 0.05;
                p.y += (p.baseY - p.y) * 0.05;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
    });
    
    canvas.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Initialize
    window.addEventListener('resize', resize);
    resize();
    animate();
    
    console.log('Living Equation initialized with', particles.length, 'particles');
})();
