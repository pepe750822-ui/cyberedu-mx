// Confetti Simple - Efecto de confeti para el simulador
function triggerConfetti() {
    // Crear múltiples confetis
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';

    document.body.appendChild(confetti);

    // Animación
    const duration = 3000 + Math.random() * 2000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            confetti.style.top = (progress * 100) + 'vh';
            confetti.style.opacity = (1 - progress);
            confetti.style.transform = `rotate(${progress * 360}deg)`;
            requestAnimationFrame(animate);
        } else {
            confetti.remove();
        }
    }

    requestAnimationFrame(animate);
}

function getRandomColor() {
    const colors = ['#00f3ff', '#ff006e', '#ffbe0b', '#8338ec', '#3a86ff', '#06ffa5'];
    return colors[Math.floor(Math.random() * colors.length)];
}
