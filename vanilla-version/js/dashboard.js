/* ============================================
   DASHBOARD APP STATE & FUNCTIONS
   ============================================ */

const app = {
    username: null,
    currentDay: 1,
    lastCompletedDate: null,
    habits: {},
    journal: {},
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

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', async () => {
    let username = localStorage.getItem('username');

    if (!username) {
        const userId = localStorage.getItem('userId');
        if (userId && typeof getUser === 'function') {
            try {
                const profile = await getUser(userId);
                username = (profile && profile.fullName) || (profile && profile.email) || null;
            } catch (error) {
                console.warn('Could not load user profile:', error);
            }
        }

        if (!username && window.auth && window.auth.currentUser) {
            username = window.auth.currentUser.displayName || window.auth.currentUser.email || null;
        }

        if (username) {
            localStorage.setItem('username', username);
        }
    }

    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    app.username = username;
    loadTheme();
    loadDashboard();
});

// ============================================
// LOAD DATA
// ============================================

async function loadDashboard() {
    try {
        loadUserData();
        checkStreakReset();
        generateTrackerTable();
        loadJournal();
        loadGoals();
        updateDashboard();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadUserData() {
    try {
        // Try to load from localStorage first
        const key = `user_${app.username}_data`;
        const localData = localStorage.getItem(key);
        
        if (localData) {
            const userData = JSON.parse(localData);
            app.currentDay = userData.currentDay || 1;
            app.lastCompletedDate = userData.lastCompletedDate;
            app.habits = userData.habits || {};
            app.journal = userData.journal || {};
            app.goals = userData.goals || [false, false, false, false, false];
            app.theme = userData.theme || 'dark';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }

    document.getElementById('navUsername').textContent = app.username;
}

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
    
    // Save to localStorage
    const key = `user_${app.username}_data`;
    localStorage.setItem(key, JSON.stringify(userData));
    
    // Try Firebase in background (no await, so doesn't slow down UI)
    if (window.saveUser && typeof window.saveUser === 'function') {
        saveUser(app.username, userData).catch(err => console.log('Firebase save skipped:', err));
    }
}

// ============================================
// TRACKER TABLE
// ============================================

function generateTrackerTable() {
    const tbody = document.getElementById('trackerBody');
    tbody.innerHTML = '';
    
    for (let day = 1; day <= 30; day++) {
        const row = document.createElement('tr');
        
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
        const isFutureDay = day > app.currentDay;
        
        const dayCell = document.createElement('td');
        dayCell.className = 'day-cell';
        dayCell.textContent = `Day ${day}`;
        row.appendChild(dayCell);
        
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
        
        const moodCell = document.createElement('td');
        moodCell.className = 'mood-cell';
        
        const moodSelector = document.createElement('div');
        moodSelector.className = 'mood-selector';
        
        const moods = ['🙂', '😐', '😎', '😢', '😴'];
        moods.forEach((mood) => {
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
        
        if (isFutureDay) {
            row.classList.add('disabled');
        }
        
        tbody.appendChild(row);
    }
}

// ============================================
// JOURNAL
// ============================================

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

// ============================================
// GOALS
// ============================================

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

// ============================================
// STREAK & RESET
// ============================================

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function canCompleteToday() {
    return app.lastCompletedDate !== getTodayDate();
}

function checkStreakReset() {
    // Only check reset if user has completed at least one day
    if (!app.lastCompletedDate) {
        return;
    }
    
    const lastDate = new Date(app.lastCompletedDate);
    const today = new Date();
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
        app.currentDay = 1;
        app.habits = {};
        app.journal = {};
        app.goals = [false, false, false, false, false];
        saveLiveUserData();
        showResetModal();
    }
}

function showResetModal() {
    document.getElementById('resetModal').classList.remove('hidden');
}

function closeResetModal() {
    document.getElementById('resetModal').classList.add('hidden');
}

// ============================================
// DASHBOARD UPDATES
// ============================================

function updateDashboard() {
    document.getElementById('navUsername').textContent = app.username;
    document.getElementById('statCurrentDay').textContent = app.currentDay;
    document.getElementById('statDaysLeft').textContent = 30 - app.currentDay;
    document.getElementById('statStreak').textContent = app.currentDay;
    document.getElementById('statProgress').textContent = Math.round((app.currentDay / 30) * 100) + '%';
    
    const percentage = (app.currentDay / 30) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPercent').textContent = Math.round(percentage) + '%';
    
    // Disable Complete Day button if already completed today
    const completeBtn = document.getElementById('completeDayBtn');
    const completionMsg = document.getElementById('completionMessage');
    
    if (completeBtn && completionMsg) {
        if (!canCompleteToday()) {
            completeBtn.disabled = true;
            completeBtn.style.opacity = '0.5';
            completeBtn.style.cursor = 'not-allowed';
            completionMsg.style.display = 'block';
        } else {
            completeBtn.disabled = false;
            completeBtn.style.opacity = '1';
            completeBtn.style.cursor = 'pointer';
            completionMsg.style.display = 'none';
        }
    }
    
    changeQuote();
}

async function completeDay() {
    // Prevent completing more than once per calendar day
    if (!canCompleteToday()) {
        alert('You already completed today! Come back tomorrow to continue your challenge.');
        return;
    }

    if (app.currentDay < 30) {
        app.currentDay++;
        app.lastCompletedDate = getTodayDate();
        await saveLiveUserData();
        updateDashboard();
        generateTrackerTable();
        loadJournal();
        alert('Day completed! Great job! 🎉');
    } else if (app.currentDay === 30) {
        app.currentDay++;
        app.lastCompletedDate = getTodayDate();
        await saveLiveUserData();
        window.location.href = 'success.html';
    }
}

async function handleRestart() {
    if (confirm('Are you sure you want to restart the challenge?')) {
        app.currentDay = 1;
        app.habits = {};
        app.journal = {};
        app.goals = [false, false, false, false, false];
        app.lastCompletedDate = getTodayDate();
        await saveLiveUserData();
        await loadDashboard();
    }
}

// ============================================
// QUOTES
// ============================================

function changeQuote() {
    const quote = app.quotes[Math.floor(Math.random() * app.quotes.length)];
    document.getElementById('dailyQuote').textContent = `"${quote}`;
}

// ============================================
// THEME
// ============================================

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
        document.getElementById('themeBtn').textContent = '🌙';
    } else {
        document.body.classList.remove('light-mode');
        document.getElementById('themeBtn').textContent = '☀️';
    }
}
