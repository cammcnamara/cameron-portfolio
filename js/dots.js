const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let dots = [];
    let mouse = { x: -1000, y: -1000 };
    const COUNT = 120;
    const RADIUS = 2.5;
    const REPEL = 120;
    const SPEED = 0.3;

    function getDotColor() {
        const accent = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-accent').trim();
        return accent || '#3b82f6';
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function init() {
        dots = Array.from({ length: COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            ox: 0, // offset x from repel
            oy: 0, // offset y from repel
        }));
    }

    function addDots(n = 25) {
        for (let i = 0; i < n; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                ox: 0,
                oy: 0,
            });
        }
    }


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const color = getDotColor();

        for (const dot of dots) {
            const dx = dot.x - mouse.x;
            const dy = dot.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < REPEL) {
                const force = (REPEL - dist) / REPEL;
                dot.ox += (dx / dist) * force * 4;
                dot.oy += (dy / dist) * force * 4;
            }

            // Spring back to origin
            dot.ox *= 0.9;
            dot.oy *= 0.9;

            // Slow drift
            dot.x += (Math.random() - 0.5) * SPEED;
            dot.y += (Math.random() - 0.5) * SPEED;

            // Keep in bounds
            dot.x = Math.max(0, Math.min(canvas.width, dot.x));
            dot.y = Math.max(0, Math.min(canvas.height, dot.y));

            ctx.beginPath();
            ctx.arc(dot.x + dot.ox, dot.y + dot.oy, RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        document.body.style.setProperty('--mx', e.clientX + 'px');
        document.body.style.setProperty('--my', e.clientY + 'px');
    });

    window.addEventListener('resize', () => { resize(); init(); });

    resize();
    init();
    draw();

    document.getElementById('add-dots')?.addEventListener('click', () => addDots(25));
    document.getElementById('remove-dots')?.addEventListener('click', () => dots.splice(0, 25));
}