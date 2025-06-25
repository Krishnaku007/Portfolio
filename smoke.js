class SmokeEffect {
    constructor() {
        this.canvas = document.getElementById('smokeCanvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        this.particles = [];
        this.layers = [];
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.isDarkMode = document.body.classList.contains('dark-theme');
        
        // GSAP timeline for animations
        this.timeline = gsap.timeline({ paused: true });
        
        this.init();
        this.createLayeredSmoke();
        this.createParticles();
        this.setupScrollTrigger();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Set renderer properties with better quality
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Set camera position
        this.camera.position.z = 5;
        
        // Create smoke textures for different layers
        this.createSmokeTextures();
    }

    createSmokeTextures() {
        // Create multiple smoke textures with different characteristics
        this.smokeTextures = {
            main: this.createSmokeTexture(128, 0.8),
            detail: this.createSmokeTexture(64, 0.6),
            ambient: this.createSmokeTexture(256, 0.4)
        };
    }

    createSmokeTexture(size, intensity) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Create multiple gradients for more realistic smoke
        const gradients = [];
        for (let i = 0; i < 3; i++) {
            const gradient = ctx.createRadialGradient(
                canvas.width * (0.3 + Math.random() * 0.4),
                canvas.height * (0.3 + Math.random() * 0.4),
                0,
                canvas.width * (0.3 + Math.random() * 0.4),
                canvas.height * (0.3 + Math.random() * 0.4),
                canvas.width / 2
            );

            if (this.isDarkMode) {
                gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
                gradient.addColorStop(0.2, `rgba(255, 255, 255, ${intensity * 0.8})`);
                gradient.addColorStop(0.4, `rgba(255, 255, 255, ${intensity * 0.4})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            } else {
                gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity * 0.8})`);
                gradient.addColorStop(0.2, `rgba(0, 0, 0, ${intensity * 0.6})`);
                gradient.addColorStop(0.4, `rgba(0, 0, 0, ${intensity * 0.3})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }
            gradients.push(gradient);
        }

        // Apply gradients with blur effect
        ctx.filter = 'blur(2px)';
        gradients.forEach(gradient => {
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return texture;
    }

    createLayeredSmoke() {
        // Create three layers of smoke with different properties
        const layerConfigs = [
            { texture: this.smokeTextures.main, count: 20, scale: 2, speed: 0.02, depth: 0 },
            { texture: this.smokeTextures.detail, count: 30, scale: 1.5, speed: 0.03, depth: 1 },
            { texture: this.smokeTextures.ambient, count: 15, scale: 3, speed: 0.01, depth: 2 }
        ];

        layerConfigs.forEach(config => {
            const layer = {
                particles: [],
                material: new THREE.MeshBasicMaterial({
                    map: config.texture,
                    transparent: true,
                    opacity: this.isDarkMode ? 0.6 : 0.4,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide
                })
            };

            for (let i = 0; i < config.count; i++) {
                const geometry = new THREE.PlaneGeometry(1, 1);
                const particle = new THREE.Mesh(geometry, layer.material.clone());
                
                particle.position.set(
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    config.depth
                );
                
                particle.rotation.z = Math.random() * Math.PI;
                particle.scale.set(config.scale, config.scale, config.scale);
                
                layer.particles.push({
                    mesh: particle,
                    speed: Math.random() * config.speed + 0.01,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    initialY: particle.position.y,
                    initialX: particle.position.x,
                    hoverScale: Math.random() * 1.5 + 1
                });
                
                this.scene.add(particle);
            }

            this.layers.push(layer);
        });
    }

    setupScrollTrigger() {
        // Create ScrollTrigger animations for smoke layers
        this.layers.forEach((layer, index) => {
            ScrollTrigger.create({
                trigger: '.header',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    layer.particles.forEach(particle => {
                        gsap.to(particle.mesh.position, {
                            y: particle.initialY + progress * 2,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    });
                }
            });
        });
    }

    createParticles() {
        // Additional floating particles for ambient effect
        const particleCount = 30;
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: this.smokeTextures.ambient,
            transparent: true,
            opacity: this.isDarkMode ? 0.3 : 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(geometry, material.clone());
            
            particle.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 3
            );
            
            particle.rotation.z = Math.random() * Math.PI;
            const scale = Math.random() * 2 + 1;
            particle.scale.set(scale, scale, scale);
            
            this.particles.push({
                mesh: particle,
                speed: Math.random() * 0.02 + 0.005,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                initialY: particle.position.y,
                initialX: particle.position.x,
                hoverScale: Math.random() * 1.2 + 0.8
            });
            
            this.scene.add(particle);
        }
    }

    addEventListeners() {
        // Mouse move with GSAP animation
        let lastMove = 0;
        window.addEventListener('mousemove', (event) => {
            const now = Date.now();
            if (now - lastMove < 16) return;
            lastMove = now;
            
            const newX = (event.clientX / window.innerWidth) * 2 - 1;
            const newY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            gsap.to(this.mouse, {
                x: newX,
                y: newY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        // Theme change with GSAP animation
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    this.isDarkMode = document.body.classList.contains('dark-theme');
                    this.updateSmokeTextures();
                    
                    // Animate opacity change
                    this.layers.forEach(layer => {
                        gsap.to(layer.material, {
                            opacity: this.isDarkMode ? 0.6 : 0.4,
                            duration: 0.5,
                            ease: 'power2.inOut'
                        });
                    });
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });

        // Resize with GSAP animation
        window.addEventListener('resize', () => {
            gsap.to(this.camera, {
                aspect: window.innerWidth / window.innerHeight,
                duration: 0.5,
                onUpdate: () => this.camera.updateProjectionMatrix()
            });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    updateSmokeTextures() {
        this.createSmokeTextures();
        this.layers.forEach((layer, index) => {
            const texture = index === 0 ? this.smokeTextures.main :
                          index === 1 ? this.smokeTextures.detail :
                          this.smokeTextures.ambient;
            layer.material.map = texture;
            layer.material.needsUpdate = true;
        });
    }

    updateParticles() {
        // Update layered smoke
        this.layers.forEach(layer => {
            layer.particles.forEach((particle, index) => {
                // Update position with enhanced wave motion
                particle.mesh.position.y += particle.speed;
                particle.mesh.position.x = particle.initialX + 
                    Math.sin(Date.now() * 0.001 + index) * 0.8 +
                    Math.cos(Date.now() * 0.0005 + index) * 0.4;

                // Mouse influence
                const mouseDistance = Math.sqrt(
                    Math.pow(particle.mesh.position.x - this.mouse.x * 5, 2) +
                    Math.pow(particle.mesh.position.z - this.mouse.y * 3, 2)
                );

                if (mouseDistance < 2) {
                    gsap.to(particle.mesh.position, {
                        x: this.mouse.x * 5,
                        z: this.mouse.y * 3,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }

                // Update rotation with GSAP
                gsap.to(particle.mesh.rotation, {
                    z: particle.mesh.rotation.z + particle.rotationSpeed,
                    duration: 0.5,
                    ease: 'none'
                });

                // Update scale with GSAP
                const baseScale = this.isDarkMode ? 2 : 1.5;
                const targetScale = Math.max(0.5, baseScale - mouseDistance * 0.2) * particle.hoverScale;
                
                gsap.to(particle.mesh.scale, {
                    x: targetScale,
                    y: targetScale,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Update ambient particles
        this.particles.forEach(particle => {
            particle.mesh.position.y += particle.speed;
            particle.mesh.position.x += Math.sin(Date.now() * 0.0005) * 0.02;
            
            if (particle.mesh.position.y > 6) {
                particle.mesh.position.y = -6;
                particle.mesh.position.x = (Math.random() - 0.5) * 12;
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.updateParticles();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize smoke effect when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (THREE.WEBGL.isWebGLAvailable()) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        new SmokeEffect();
    } else {
        console.warn('WebGL is not supported in your browser');
    }
}); 