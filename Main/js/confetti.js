/* ============================================
   CONFETTI ANIMATION
   ============================================ */

function playConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)];
        piece.style.width = Math.random() * 10 + 5 + 'px';
        piece.style.height = piece.style.width;
        piece.style.opacity = Math.random() * 0.7 + 0.3;
        confettiContainer.appendChild(piece);
        
        setTimeout(() => piece.remove(), 2500);
    }
}
