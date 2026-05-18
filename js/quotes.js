/* ============================================
   QUOTES
   ============================================ */

const quotes = [
    "Discipline is choosing between what you want now and what you want most. — Abraham Lincoln",
    "The secret of getting ahead is getting started. — Mark Twain",
    "Success is not final, failure is not fatal. — Winston Churchill",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Your limitation—it's only your imagination.",
    "Great things never came from comfort zones.",
    "Dream it. Believe it. Build it.",
    "Do something today your future self will thank you for.",
    "Little things matter. A lot. — Jon Kabat-Zinn",
    "The future depends on what you do today. — Mahatma Gandhi",
    "You don't have to be great to start, but you have to start to be great. — Zig Ziglar"
];

function changeQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.getElementById('dailyQuote');
    if (quoteElement) {
        quoteElement.textContent = `"${quote}`;
    }
}

// Change quote on page load
window.addEventListener('DOMContentLoaded', () => {
    changeQuote();
});
