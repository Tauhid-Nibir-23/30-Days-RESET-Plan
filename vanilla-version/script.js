/* ============================================
   APPLICATION STATE & CONFIG
   ============================================ */

async function saveUser(userId, data) {
  const { ref, set } = window.firebaseDB;

  await set(ref(window.db, "users/" + userId), data);
}

async function getUser(userId) {
  const { ref, get, child } = window.firebaseDB;

  const snapshot = await get(child(ref(window.db), "users/" + userId));

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
}


const app = {
    username: null,
    currentDay: 1,
    lastCompletedDate: null,
    habits: {}, // { day1: { wakeEarly: bool, workout: bool, ... }, ... }
    journal: {}, // { day1: { well: string, improve: string, grateful: string }, ... }
    goals: [false, false, false, false, false],
    theme: 'dark',
    
    quotes: [
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
    ]
};

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    loadTheme();
    await checkUserSession();
});

/* ============================================
   SECTION NAVIGATION
   ============================================ */

function goToSection(sectionId) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function goToLanding() {
    goToSection('landing');
}

function goToLogin() {
    goToSection('login');
}

async function goToDashboard() {
    await loadUserData();
    await checkStreakReset();
    generateTrackerTable();
    loadJournal();
    loadGoals();
    updateDashboard();
    goToSection('dashboard');
}

function goToSuccess() {
    document.getElementById('successUsername').textContent = app.username;
    playConfetti();
    goToSection('success');
}

/* ============================================
   LOGIN & AUTHENTICATION
   ============================================ */

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value.trim();
    const errorEl = document.querySelector('.form-error');
    
    if (!username) {
        errorEl.textContent = 'Please enter your name';
        return;
    }
    
    if (username.length < 2) {
        errorEl.textContent = 'Name must be at least 2 characters';
        return;
    }
    
    app.username = username;
    localStorage.setItem('username', username);
    
    // Initialize user data in Firebase
    let userData = await getUser(username);
    
    if (!userData) {
        const initialData = {
            username: username,
            currentDay: 1,
            lastCompletedDate: new Date().toISOString().split('T')[0],
            habits: {},
            journal: {},
            goals: [false, false, false, false, false],
            theme: 'dark'
        };
        await saveUser(username, initialData);
    }
    
    goToDashboard();
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Save data before logout
        await saveUser(app.username, {
            username: app.username,
            currentDay: app.currentDay,
            lastCompletedDate: app.lastCompletedDate,
            habits: app.habits,
            journal: app.journal,
            goals: app.goals,
            theme: app.theme
        });
        
        localStorage.removeItem('username');
        app.username = null;
        document.getElementById('usernameInput').value = '';
        document.querySelector('.form-error').textContent = '';
        goToLogin();
    }
}

async function checkUserSession() {
    const username = localStorage.getItem('username');
    if (username) {
        app.username = username;
        await loadUserData();
        goToDashboard();
    } else {
        goToLanding();
    }
}

/* ============================================
   DATA MANAGEMENT
   ============================================ */
async function saveLiveUserData() {
    const userData = {
        username: app.username,
        currentDay: app.currentDay,
        lastCompletedDate: app.lastCompletedDate,
        habits: app.habits,
        journal: app.journal,
        goals: app.goals,
        theme: app.theme
    };
    
    await saveUser(app.username, userData);
}

async function loadUserData() {
    const userData = await getUser(app.username);
    
    if (userData) {
        app.currentDay = userData.currentDay || 1;
        app.lastCompletedDate = userData.lastCompletedDate;
        app.habits = userData.habits || {};
        app.journal = userData.journal || {};
        app.goals = userData.goals || [false, false, false, false, false];
        app.theme = userData.theme || 'dark';
    }
    
    document.getElementById('navUsername').textContent = app.username;
}

/* ============================================
   TRACKER TABLE GENERATION
   ============================================ */

function generateTrackerTable() {
    const tbody = document.getElementById('trackerBody');
    tbody.innerHTML = '';
    
    const habits = ['Wake Early', 'Workout', 'Study', 'Reading', 'No Social Media', 'Water Intake', 'Sleep Early', 'Mood'];
    
    for (let day = 1; day <= 30; day++) {
        const row = document.createElement('tr');
        
        // Initialize day data if not exists
        if (!app.habits[`day${day}`]) {
            app.habits[`day${day}`] = {
                wakeEarly: false,
                workout: false,
                study: false,
                reading: false,
                noSocialMedia: false,
                waterIntake: false,
                sleepEarly: false,
                mood: null
            };
        }
        
        const dayData = app.habits[`day${day}`];
        const isCurrentDay = day === app.currentDay;
        const isPastDay = day < app.currentDay;
        const isFutureDay = day > app.currentDay;
        
        // Day cell
        const dayCell = document.createElement('td');
        dayCell.className = 'day-cell';
        dayCell.textContent = `Day ${day}`;
        if (isCurrentDay) dayCell.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        row.appendChild(dayCell);
        
        // Habit checkboxes
        const habitKeys = ['wakeEarly', 'workout', 'study', 'reading', 'noSocialMedia', 'waterIntake', 'sleepEarly'];
        habitKeys.forEach(habitKey => {
            const cell = document.createElement('td');
            cell.className = 'habit-cell';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'habit-checkbox';
            checkbox.checked = dayData[habitKey] || false;
            checkbox.disabled = isFutureDay;
            
            checkbox.addEventListener('change', async () => {
                dayData[habitKey] = checkbox.checked;
                await saveLiveUserData();
            });
            
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-wrapper';
            wrapper.appendChild(checkbox);
            cell.appendChild(wrapper);
            row.appendChild(cell);
        });
        
        // Mood selector
        const moodCell = document.createElement('td');
        moodCell.className = 'mood-cell';
        
        const moodSelector = document.createElement('div');
        moodSelector.className = 'mood-selector';
        
        const moods = ['🙂', '😐', '😎', '😢', '😴'];
        moods.forEach((mood, idx) => {
            const btn = document.createElement('button');
            btn.className = 'mood-btn';
            btn.textContent = mood;
            btn.disabled = isFutureDay;
            
            if (dayData.mood === mood) {
                btn.classList.add('selected');
            }
            
            btn.addEventListener('click', async () => {
                document.querySelectorAll(`#trackerBody tr:nth-child(${day}) .mood-btn`).forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                dayData.mood = mood;
                await saveLiveUserData();
            });
            
            moodSelector.appendChild(btn);
        });
        
        moodCell.appendChild(moodSelector);
        row.appendChild(moodCell);
        
        // Disable row if not current/past day
        if (isFutureDay) {
            row.classList.add('disabled');
        }
        
        tbody.appendChild(row);
    }
}

/* ============================================
   JOURNAL
   ============================================ */

function loadJournal() {
    const dayKey = `day${app.currentDay}`;
    const dayJournal = app.journal[dayKey] || {};
    
    document.getElementById('journalWell').value = dayJournal.well || '';
    document.getElementById('journalImprove').value = dayJournal.improve || '';
    document.getElementById('journalGrateful').value = dayJournal.grateful || '';
}

async function saveJournal() {
    const dayKey = `day${app.currentDay}`;
    
    app.journal[dayKey] = {
        well: document.getElementById('journalWell').value,
        improve: document.getElementById('journalImprove').value,
        grateful: document.getElementById('journalGrateful').value
    };
    
    await saveLiveUserData();
    alert('Journal entry saved!');
}

/* ============================================
   GOALS
   ============================================ */

function loadGoals() {
    for (let i = 0; i < 5; i++) {
        const checkbox = document.getElementById(`goal${i + 1}`);
        checkbox.checked = app.goals[i] || false;
        checkbox.disabled = app.currentDay !== 30;
    }
}

async function saveGoals() {
    for (let i = 0; i < 5; i++) {
        app.goals[i] = document.getElementById(`goal${i + 1}`).checked;
    }
    await saveLiveUserData();
}

/* ============================================
   STREAK & RESET LOGIC
   ============================================ */

async function checkStreakReset() {
    if (!app.lastCompletedDate) {
        app.lastCompletedDate = new Date().toISOString().split('T')[0];
        return;
    }
    
    const lastDate = new Date(app.lastCompletedDate);
    const today = new Date();
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If more than 1 day missed, reset to Day 1
    if (diffDays > 1) {
        app.currentDay = 1;
        app.habits = {};
        app.journal = {};
        app.goals = [false, false, false, false, false];
        await saveLiveUserData();
        showResetModal();
    }
}

function showResetModal() {
    document.getElementById('resetModal').classList.remove('hidden');
}

function closeResetModal() {
    document.getElementById('resetModal').classList.add('hidden');
}

/* ============================================
   DASHBOARD UPDATES
   ============================================ */

function updateDashboard() {
    // Update navbar
    document.getElementById('navUsername').textContent = app.username;
    
    // Update stats
    document.getElementById('statCurrentDay').textContent = app.currentDay;
    document.getElementById('statDaysLeft').textContent = 30 - app.currentDay;
    document.getElementById('statStreak').textContent = app.currentDay;
    document.getElementById('statProgress').textContent = Math.round((app.currentDay / 30) * 100) + '%';
    
    // Update progress bar
    const percentage = (app.currentDay / 30) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPercent').textContent = Math.round(percentage) + '%';
    
    // Update quote
    changeQuote();
}

async function completeDay() {
    if (app.currentDay < 30) {
        app.currentDay++;
        app.lastCompletedDate = new Date().toISOString().split('T')[0];
        await saveLiveUserData();
        updateDashboard();
        generateTrackerTable();
        loadJournal();
        alert('Day completed! Great job! 🎉');
    } else if (app.currentDay === 30) {
        app.currentDay++;
        app.lastCompletedDate = new Date().toISOString().split('T')[0];
        await saveLiveUserData();
        goToSuccess();
    }
}

async function restartChallenge() {
    if (confirm('Are you sure you want to restart the challenge?')) {
        app.currentDay = 1;
        app.habits = {};
        app.journal = {};
        app.goals = [false, false, false, false, false];
        app.lastCompletedDate = new Date().toISOString().split('T')[0];
        await saveLiveUserData();
        goToDashboard();
    }
}

/* ============================================
   QUOTES
   ============================================ */

function changeQuote() {
    const quote = app.quotes[Math.floor(Math.random() * app.quotes.length)];
    document.getElementById('dailyQuote').textContent = `"${quote}`;
}

/* ============================================
   THEME TOGGLE
   ============================================ */

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    app.theme = savedTheme;
    applyTheme();
}

function toggleTheme() {
    app.theme = app.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', app.theme);
    applyTheme();
}

function applyTheme() {
    if (app.theme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('themeIcon').textContent = '🌙';
    } else {
        document.body.classList.remove('light-mode');
        document.getElementById('themeIcon').textContent = '☀️';
    }
}

/* ============================================
   CONFETTI ANIMATION
   ============================================ */

function playConfetti() {
    const confettiContainer = document.getElementById('confetti');
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

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

function isNextDay(lastDate) {
    if (!lastDate) return true;
    const last = new Date(lastDate);
    const today = new Date();
    const diffTime = today - last;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
}

function hasMoreThanOneDayPassed(lastDate) {
    if (!lastDate) return false;
    const last = new Date(lastDate);
    const today = new Date();
    const diffTime = today - last;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 1;
}
