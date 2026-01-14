/**
 * THE SENTIENT VOID - GLSL Fluid Simulation
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Simulates Dark Matter Fluid in real-time using Fragment Shaders.
 */

// Helper: Linear interpolation fallback
function lerp(a, b, t) {
    return a + (b - a) * t;
}

class FluidSimulation {
    constructor(scene, renderer, camera) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.uniforms = {
            u_time: { value: 0 },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_intensity: { value: 0.0 }
        };

        this.init();
    }

    init() {
        // Full screen plane for shader
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform vec2 u_resolution;
            uniform float u_intensity;
            varying vec2 vUv;

            // Simplex 2D noise
            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod(i, 289.0);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec4(dot(x0,x0), dot(x12.xy,x12.xy),
                    dot(x12.zw,x12.zw), 0.0), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 a0 = x - floor(x + 0.5);
                vec3 m0 = m * ( 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ) );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m0, g);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 mouse = u_mouse;
                
                // Aspect ratio correction
                float aspect = u_resolution.x / u_resolution.y;
                uv.x *= aspect;
                mouse.x *= aspect;

                // Create fluid motion based on mouse
                float dist = distance(uv, mouse);
                float ripple = sin(dist * 15.0 - u_time * 2.0) * exp(-dist * 3.0);
                
                // Dark matter fluid layers
                float n1 = snoise(uv * 2.0 + u_time * 0.1 + ripple * 0.5);
                float n2 = snoise(uv * 4.0 - u_time * 0.15 + n1 * 0.2);
                float n3 = snoise(uv * 8.0 + u_time * 0.05 + n2 * 0.1);
                
                // Combine layers for "physically dense" look
                float fluid = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
                fluid += ripple * 0.2;
                
                // Color mapping: Void (Black) to Deep Gold
                vec3 voidColor = vec3(0.007, 0.011, 0.039); // --void-deep
                vec3 goldColor = vec3(0.83, 0.66, 0.29);    // --gold-primary
                
                // Intensify near mouse
                float interaction = smoothstep(0.4, 0.0, dist);
                vec3 finalColor = mix(voidColor, goldColor * 0.15, fluid + interaction * 0.1);
                
                // Add some specular-like highlights
                float highlights = smoothstep(0.7, 1.0, fluid);
                finalColor += goldColor * highlights * 0.1;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            depthWrite: false,
            depthTest: false
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.renderOrder = -1; // Background
        this.scene.add(this.mesh);
    }

    update(time, mouseX, mouseY) {
        this.uniforms.u_time.value = time * 0.001;
        
        // Map normalized mouse (-1 to 1) to (0 to 1) for shader
        const mx = (mouseX + 1.0) * 0.5;
        const my = (1.0 - mouseY) * 0.5;
        
        this.uniforms.u_mouse.value.lerp(new THREE.Vector2(mx, my), 0.05);
        this.uniforms.u_intensity.value = lerp(this.uniforms.u_intensity.value, 1.0, 0.02);
    }

    onResize(width, height) {
        this.uniforms.u_resolution.value.set(width, height);
    }
}

window.FluidSimulation = FluidSimulation;
