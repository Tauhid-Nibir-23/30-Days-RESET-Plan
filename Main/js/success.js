/* ============================================
   SUCCESS PAGE
   ============================================ */

window.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const key = `user_${username}_data`;
        const userData = JSON.parse(localStorage.getItem(key));
        
        if (userData && userData.currentDay === 31) {
            document.getElementById('successUsername').textContent = username;
            playConfetti();
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error loading success page:', error);
        // Still show success page even if loading fails
        document.getElementById('successUsername').textContent = username;
        playConfetti();
    }
});
