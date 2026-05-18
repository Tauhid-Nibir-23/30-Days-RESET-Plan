## 📁 Project Structure

Your Discipline Tracker has been completely reorganized into separate HTML and CSS files for better clarity and maintainability!

### 🏗️ Folder Structure

```
vanilla-version/
├── index.html                  # Landing page
├── login.html                  # Login/Sign-up page
├── dashboard.html              # Main tracker page
├── success.html                # Completion page
│
├── css/                        # Stylesheets (one per page)
│   ├── common.css             # Shared styles, variables, buttons, animations
│   ├── landing.css            # Landing page styles
│   ├── login.css              # Login page styles
│   ├── dashboard.css          # Dashboard/tracker styles
│   └── success.css            # Success page styles
│
├── js/                         # JavaScript modules
│   ├── db.js                  # Firebase database functions
│   ├── auth.js                # Login/authentication logic
│   ├── dashboard.js           # Main dashboard functionality
│   ├── success.js             # Success page functionality
│   ├── quotes.js              # Quote management
│   └── confetti.js            # Confetti animation
│
├── style.css                  # (Old - can be deleted)
└── script.js                  # (Old - can be deleted)
```

---

## 📄 HTML Pages

### `index.html` - Landing Page
- Entry point to your app
- Shows the 30-day challenge overview
- Links to login page

### `login.html` - Login Page
- Where users enter their name
- Creates new user or loads existing user data
- Redirects to dashboard on successful login

### `dashboard.html` - Main Tracker
- Shows all 30 days tracker
- Daily habits tracker (7 habits)
- Mood selector
- Journal entries
- 30-day goals
- Progress tracker
- Complete day button

### `success.html` - Success/Completion Page
- Shows congratulations message
- Displays final stats
- Confetti animation
- Option to start new challenge

---

## 🎨 CSS Files

### `common.css`
- CSS variables (colors, spacing)
- Base styles for all pages
- Animations (fadeIn, scaleIn, float, etc.)
- Button styles
- Shared utilities

**When to update:** Add new colors, animations, or global button styles here

### `landing.css`
- Landing page hero section
- Stats display
- Quote container

**When to update:** Change landing page layout or styling

### `login.css`
- Login form styling
- Login card design
- Form inputs and validation messages

**When to update:** Modify login form appearance

### `dashboard.css`
- Navbar styling
- Stats cards
- Progress bar
- Tracker table
- Mood selector
- Journal cards
- Goals section
- Modal styling

**When to update:** Modify dashboard layout, table, or card styling

### `success.css`
- Success page title and message
- Confetti animation styling
- Stats display

**When to update:** Change success page appearance

---

## 📜 JavaScript Files

### `db.js`
**Firebase Database Functions**
```javascript
saveUser(userId, data)    // Save user data to Firebase
getUser(userId)           // Retrieve user data from Firebase
```

### `auth.js`
**Authentication & Login**
```javascript
handleLogin(event)        // Handle login form submission
handleLogout()           // Handle logout
// Checks if user is logged in on page load
```

### `dashboard.js`
**Main Dashboard Logic** (Most Important!)
```javascript
app                       // Global app state object
loadDashboard()          // Initialize dashboard
loadUserData()           // Fetch user data
saveLiveUserData()       // Save all changes to Firebase
generateTrackerTable()   // Create 30-day tracker table
loadJournal()            // Load today's journal
saveJournal()            // Save journal entry
loadGoals()              // Load 30-day goals
saveGoals()              // Save goal changes
checkStreakReset()       // Check if streak should reset
completeDay()            // Move to next day
handleRestart()          // Restart the challenge
changeQuote()            // Change motivational quote
toggleTheme()            // Switch light/dark mode
```

### `success.js`
**Success Page Logic**
- Verifies user has completed all 30 days
- Displays username and celebrates
- Plays confetti animation

### `quotes.js`
**Quote Management**
```javascript
changeQuote()            // Get random motivational quote
```

### `confetti.js`
**Confetti Animation**
```javascript
playConfetti()          // Show confetti animation
```

---

## 🔄 How It Works

### User Flow

1. **User opens app** → `index.html` (Landing page)
2. **Clicks "Start Journey"** → Redirects to `login.html`
3. **Enters name & clicks "Begin"** → 
   - `auth.js` handles login
   - `db.js` saves to Firebase
   - Redirects to `dashboard.html`
4. **On Dashboard** → `dashboard.js` loads all data and manages interactions
5. **Completes 30 days** → Redirects to `success.html`

### Data Flow

```
User Input
    ↓
Event Handler (in HTML onclick=)
    ↓
Function (in .js file)
    ↓
saveLiveUserData() (in dashboard.js)
    ↓
saveUser() (in db.js)
    ↓
Firebase Database
```

---

## 🚀 To Add New Features

### Add a new page
1. Create `newpage.html`
2. Create `css/newpage.css`
3. Create `js/newpage.js`
4. Link CSS in the HTML: `<link rel="stylesheet" href="css/newpage.css">`
5. Link JS at bottom: `<script src="js/newpage.js"></script>`

### Add new styles
- Global → `css/common.css`
- Page-specific → `css/pagename.css`

### Add new functionality
- Page logic → `js/pagename.js`
- Firebase operations → `js/db.js`
- Auth related → `js/auth.js`

---

## 🔧 Firebase Setup

### Required Config in `login.html` and `dashboard.html`

Find the `<script type="module">` section and replace:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "https://YOUR_PROJECT.firebasedatabase.app",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Get these from: **Firebase Console** → Your Project → Project Settings

---

## 📊 Data Structure

Your data in Firebase Realtime Database:

```json
users/
  └─ username/
     ├── username: "Nibir"
     ├── currentDay: 5
     ├── lastCompletedDate: "2026-05-18"
     ├── theme: "dark"
     ├── habits: {
     │   └─ day1: {
     │      ├── wakeEarly: true
     │      ├── workout: true
     │      ├── study: false
     │      ├── reading: true
     │      ├── noSocialMedia: true
     │      ├── waterIntake: true
     │      ├── sleepEarly: false
     │      └── mood: "😎"
     │   }
     │ }
     ├── journal: {
     │   └─ day1: {
     │      ├── well: "Did great at studying"
     │      ├── improve: "Need to wake up earlier"
     │      └── grateful: "Good health"
     │   }
     │ }
     └── goals: [true, false, true, true, false]
```

---

## 💡 Tips for Customization

### Change Colors
Edit `css/common.css` variables:
```css
:root {
    --primary-color: #3b82f6;      /* Main blue */
    --success-color: #10b981;      /* Green */
    --danger-color: #ef4444;       /* Red */
}
```

### Change Habits
Edit the `habitKeys` array in `js/dashboard.js`:
```javascript
const habitKeys = ['wakeEarly', 'workout', 'study', 'reading', 'noSocialMedia', 'waterIntake', 'sleepEarly'];
// Add or remove habit names here
```

### Change 30-Day Goals
Edit the goal items in `dashboard.html`:
```html
<input type="checkbox" id="goal1" class="goal-checkbox" onchange="saveGoals()">
<label for="goal1">Your goal here</label>
```

---

## ✅ Checklist Before Going Live

- [ ] Update Firebase config in `login.html`
- [ ] Update Firebase config in `dashboard.html`
- [ ] Update Firebase config in `success.html`
- [ ] Test login functionality
- [ ] Test data saving to Firebase
- [ ] Test tracker functionality
- [ ] Test journal saving
- [ ] Test theme toggle
- [ ] Test logout
- [ ] Delete old `style.css` and `script.js` (no longer needed)

---

## 🆘 Troubleshooting

### "Page not found" error
- Check file paths are correct
- Make sure `.html` and `.css` file names match links

### Login not working
- Check Firebase config is correct
- Check Firebase Realtime Database rules are set to `.read: true` and `.write: true`
- Check browser console for errors (F12)

### Data not saving
- Check Firebase config
- Check Internet connection
- Check Firebase Database Rules

### Styles not loading
- Check CSS file paths in HTML `<link>` tags
- Make sure CSS files are in `css/` folder

---

**Happy tracking! 🔥**
