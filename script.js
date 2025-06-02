const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ball properties
const ball1 = {
    x: 150,
    y: 50,
    radius: 20,
    dx: 2,
    dy: 2,
    gravity: 0.5,
    bounce: 0.85, // Energy loss on bounce
    color: 'red',
    mass: 1 // Adding mass for collision physics
};

const ball2 = {
    x: 250,
    y: 100,
    radius: 20,
    dx: -2,
    dy: 1,
    gravity: 0.5,
    bounce: 0.85,
    color: 'purple',
    mass: 1 // Adding mass for collision physics
};

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function checkBallCollision(b1, b2) {
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < b1.radius + b2.radius) {
        // Collision detected - calculate collision response
        const normalX = dx / distance;
        const normalY = dy / distance;
        
        // Relative velocity
        const relativeVelocityX = b1.dx - b2.dx;
        const relativeVelocityY = b1.dy - b2.dy;
        
        // Calculate relative velocity along the normal
        const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;
        
        // Don't resolve if objects are moving apart
        if (velocityAlongNormal > 0) return;
        
        // Calculate restitution (bounciness)
        const restitution = Math.min(b1.bounce, b2.bounce);
        
        // Calculate impulse scalar
        const impulseScalar = -(1 + restitution) * velocityAlongNormal / (1/b1.mass + 1/b2.mass);
        
        // Apply impulse
        b1.dx -= (impulseScalar * normalX) / b1.mass;
        b1.dy -= (impulseScalar * normalY) / b1.mass;
        b2.dx += (impulseScalar * normalX) / b2.mass;
        b2.dy += (impulseScalar * normalY) / b2.mass;
        
        // Prevent balls from sticking together by moving them apart
        const overlap = (b1.radius + b2.radius - distance) / 2;
        b1.x -= overlap * normalX;
        b1.y -= overlap * normalY;
        b2.x += overlap * normalX;
        b2.y += overlap * normalY;
    }
}

function updateBall(ball) {
    // Update ball position
    ball.dy += ball.gravity;
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off walls
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.dx *= -0.85;
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.dx *= -0.85;
    }

    // Bounce off floor and ceiling
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy *= -ball.bounce;
    } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.dy *= -ball.bounce;
    }
}

function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update ball positions
    updateBall(ball1);
    updateBall(ball2);
    
    // Check for collision between balls
    checkBallCollision(ball1, ball2);

    // Draw both balls
    drawBall(ball1);
    drawBall(ball2);

    // Continue animation indefinitely
    requestAnimationFrame(animate);
}

// Start the animation
animate();

// Add parallax effect to floating elements
document.addEventListener('mousemove', (e) => {
    const floatingElements = document.querySelectorAll('.floating-element');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    floatingElements.forEach(element => {
        const speed = Math.random() * 20 + 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        element.style.transform = `translate(${x}px, ${y}px) rotate(${x * 5}deg)`;
    });
});

// Add hover effect to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseover', () => {
        const otherCards = Array.from(serviceCards).filter(c => c !== card);
        otherCards.forEach(c => c.style.transform = 'scale(0.95) rotate(-2deg)');
    });

    card.addEventListener('mouseout', () => {
        serviceCards.forEach(c => c.style.transform = 'rotate(-2deg)');
    });
});

// Add bounce effect to CTA button
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('mouseover', () => {
    ctaButton.style.animation = 'bounce 0.5s ease infinite alternate';
});

ctaButton.addEventListener('mouseout', () => {
    ctaButton.style.animation = '';
});

// Create random comic style effects
function createComicEffect() {
    const effects = ['POW!', 'ZOOM!', 'BANG!', 'BOOM!', 'WOW!'];
    const effect = document.createElement('div');
    effect.className = 'comic-effect';
    effect.textContent = effects[Math.floor(Math.random() * effects.length)];
    effect.style.position = 'absolute';
    effect.style.fontFamily = 'Bangers, cursive';
    effect.style.fontSize = '2rem';
    effect.style.color = '#FFD93D';
    effect.style.textShadow = '2px 2px 0 #333';
    effect.style.left = Math.random() * window.innerWidth + 'px';
    effect.style.top = Math.random() * window.innerHeight + 'px';
    effect.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
    effect.style.animation = 'popAndFade 1s forwards';
    document.querySelector('.hero').appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// Add comic effects on click
document.querySelector('.hero').addEventListener('click', createComicEffect);

// Add CSS animation for comic effects
const style = document.createElement('style');
style.textContent = `
    @keyframes popAndFade {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(-10deg); opacity: 1; }
        100% { transform: scale(1) rotate(0deg); opacity: 0; }
    }

    @keyframes bounce {
        from { transform: scale(1.1) rotate(-2deg); }
        to { transform: scale(1.15) rotate(2deg); }
    }
`;
document.head.appendChild(style); 