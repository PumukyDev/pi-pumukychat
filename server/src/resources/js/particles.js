document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // Particle class to define behavior of individual particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;              // Random x position
            this.y = Math.random() * canvas.height;             // Random y position
            this.size = Math.random() * 1 + 0.2;                // Random size
            this.speedX = Math.random() * 0.25 - 0.125;         // Random horizontal speed
            this.speedY = Math.random() * 0.25 - 0.125;         // Random vertical speed
            this.opacity = Math.random();                       // Random opacity
            this.opacityChange = (Math.random() * 0.02) - 0.01; // Random opacity change rate
        }

        // Update particle position and opacity
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap particles around the canvas edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            this.opacity += this.opacityChange;
            // Reverse opacity change when it reaches extremes
            if (this.opacity <= 0 || this.opacity >= 1) {
                this.opacityChange *= -1;
            }
        }

        // Draw the particle on the canvas
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const particleColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--particle-color')
                .trim();
            ctx.fillStyle = particleColor;  // Set the particle color
            ctx.globalAlpha = this.opacity; // Set particle opacity
            ctx.fill();
        }
    }

    // Initialize particles
    function init() {
        for (let i = 0; i < 600; i++) {
            particles.push(new Particle());
        }
    }

    // Animate particles
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        particles.forEach((particle) => {
            particle.update(); // Update each particle
            particle.draw();   // Draw each particle
        });

        requestAnimationFrame(animate); // Repeat animation
    }

    // Handle canvas resizing
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles.length = 0; // Clear the particles array
        init(); // Reinitialize particles
    });

    init();    // Initialize particles
    animate(); // Start the animation
});
