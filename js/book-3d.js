/**
 * THE ARTIFACT - Photorealistic 3D Talisman
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Renders a physical, interactive 3D book in the hero section.
 */

class Book3D {
    constructor(container, scene, renderer, camera) {
        this.container = container;
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.mesh = null;
        this.pivot = new THREE.Group();
        this.rotationSpeed = 0;
        this.isWormholeTriggered = false;
        
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0.2, y: -0.4 };
        
        this.init();
    }

    async init() {
        const loader = new THREE.TextureLoader();
        
        // PBR Textures
        const textures = await Promise.all([
            loader.load('book-cover.webp'),           // Front
            loader.load('book-cover-paperback.webp'), // Back
            loader.load('InfiniteArchitectsKindle20260103.jpg'), // Spine (using front as placeholder)
        ]);

        // Box Geometry: Width, Height, Depth
        const geometry = new THREE.BoxGeometry(320, 480, 45);
        
        // Material array for [Right, Left, Top, Bottom, Front, Back]
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xffffff }), // Right (Pages)
            new THREE.MeshStandardMaterial({ map: textures[2], roughness: 0.3, metalness: 0.5 }), // Left (Spine)
            new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Top (Pages)
            new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Bottom (Pages)
            new THREE.MeshStandardMaterial({ map: textures[0], roughness: 0.3, metalness: 0.5 }), // Front
            new THREE.MeshStandardMaterial({ map: textures[1], roughness: 0.3, metalness: 0.5 })  // Back
        ];

        this.mesh = new THREE.Mesh(geometry, materials);
        this.mesh.castShadow = true;
        this.pivot.add(this.mesh);
        
        // Initial position in hero section - scaled down for THREE units
        this.pivot.scale.set(0.8, 0.8, 0.8);
        this.pivot.position.set(400, 0, 0); // Positioned to the right for desktop
        
        this.scene.add(this.pivot);

        // Lights specifically for the book
        const bookLight = new THREE.SpotLight(0xd4a84b, 2, 2000);
        bookLight.position.set(600, 500, 500);
        bookLight.target = this.pivot;
        this.scene.add(bookLight);

        this.addEventListeners();
    }

    addEventListeners() {
        // PERF: Throttled Input Handling (Proper Fix - Step 5)
        let isTicking = false;
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.rawX = e.clientX;
            this.mouse.rawY = e.clientY;

            if (!isTicking) {
                requestAnimationFrame(() => {
                    this.mouse.x = (this.mouse.rawX / window.innerWidth) * 2 - 1;
                    this.mouse.y = -(this.mouse.rawY / window.innerHeight) * 2 + 1;
                    
                    if (window.innerWidth > 1024) {
                        this.targetRotation.y = this.mouse.x * 0.5 - 0.4;
                        this.targetRotation.x = -this.mouse.y * 0.3 + 0.2;
                    }
                    isTicking = false;
                });
                isTicking = true;
            }
        });

        // Click to spin / Wormhole trigger
        if (this.container) {
            this.container.addEventListener('click', () => {
                this.rotationSpeed = 0.5; // Trigger fast spin
            });
        }
    }

    update() {
        if (!this.mesh) return;

        // Smooth rotation following mouse
        this.pivot.rotation.y += (this.targetRotation.y - this.pivot.rotation.y) * 0.05;
        this.pivot.rotation.x += (this.targetRotation.x - this.pivot.rotation.x) * 0.05;

        // Fast spin logic
        if (this.rotationSpeed > 0.01) {
            this.pivot.rotation.y += this.rotationSpeed;
            this.rotationSpeed *= 0.95; // Dampening
            
            // Trigger wormhole if spinning fast
            if (this.rotationSpeed > 0.3 && !this.isWormholeTriggered) {
                this.triggerWormhole();
            }
        }

        // Floating animation
        this.pivot.position.y = Math.sin(performance.now() * 0.001) * 20;
    }

    triggerWormhole() {
        this.isWormholeTriggered = true;
        console.log("🌀 WORMHOLE PROTOCOL INITIATED");
        
        // Visual feedback
        const overlay = document.getElementById('edge-pulse');
        if (overlay) {
            overlay.style.opacity = '1';
            setTimeout(() => {
                const nextSection = document.querySelector('#equation');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
                setTimeout(() => { 
                    overlay.style.opacity = '0';
                    this.isWormholeTriggered = false;
                }, 1000);
            }, 500);
        }
    }
}

window.Book3D = Book3D;
