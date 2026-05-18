# 🔥 Firebase Setup Guide

## ✅ Quick Fix Applied

Your app now has **fallback to localStorage** while you set up Firebase properly. This means:
- You can test the app right now without Firebase
- Your data will be saved locally on your device
- Once you add Firebase credentials, it will sync to the cloud

---

## 📱 How to Get Firebase Credentials

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com
2. Sign in with your Google account

### Step 2: Create a New Project
1. Click **"Create a project"** (or select existing)
2. Enter project name: `discipline-tracker`
3. Click **Continue**
4. Disable Google Analytics (optional)
5. Click **Create project**
6. Wait for setup to complete

### Step 3: Set Up Realtime Database
1. In left menu, click **Build** → **Realtime Database**
2. Click **Create Database**
3. Select region: `asia-southeast1` (or closest to you)
4. Start in **test mode**
5. Click **Enable**

### Step 4: Get Your Credentials
1. Click the **settings icon** ⚙️ in top right
2. Select **Project Settings**
3. Scroll down to find **Your Apps** section
4. Look for Web app with `</>` icon
5. Copy the Firebase config

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "project-abc123.firebaseapp.com",
  databaseURL: "https://project-abc123-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-abc123",
  storageBucket: "project-abc123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## 📝 Update Your App

### In 3 Files, Replace the Placeholder Config:

**1. `login.html` (lines 13-20)**
**2. `dashboard.html` (lines 11-18)**
**3. `success.html` (lines 7-14)**

Find this:
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

Replace with your actual config from Step 4.

---

## 🔐 Set Database Rules

1. Go to **Realtime Database** in Firebase Console
2. Click **Rules** tab
3. Replace all with this (for development):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Click **Publish**

⚠️ **Note:** This allows anyone to read/write. For production, use proper authentication.

---

## ✅ Test Firebase

1. Open `index.html` in browser
2. Click **"Start Your Journey"**
3. Enter your name (e.g., "Tauhid")
4. Click **"Begin Challenge"**
5. If it works, check Firebase Console:
   - Go to **Realtime Database** → **Data** tab
   - You should see your user data there!

---

## 🆘 If Still Stuck on "Loading..."

The app now uses **localStorage as backup**, so:
1. **Clear browser cache** (Ctrl+Shift+Del)
2. **Refresh the page** (Ctrl+R)
3. Try logging in again

The app will work with localStorage until Firebase is configured.

---

## 📊 What Gets Saved

Once configured, your data in Firebase will look like:

```json
{
  "users": {
    "tauhid": {
      "username": "tauhid",
      "currentDay": 1,
      "lastCompletedDate": "2026-05-18",
      "habits": {
        "day1": {
          "wakeEarly": true,
          "workout": false,
          ...
        }
      },
      "journal": { ... },
      "goals": [true, false, true, ...],
      "theme": "dark"
    }
  }
}
```

---

## 🎯 Next Steps

1. ✅ Go to Firebase Console
2. ✅ Create project
3. ✅ Set up Realtime Database
4. ✅ Get your config
5. ✅ Update the 3 HTML files
6. ✅ Set database rules
7. ✅ Test login

Done! Your app will now sync to the cloud! 🚀

---

## 💡 Tips

- **Multiple devices?** Once Firebase is set up, log in on any device and your data syncs!
- **Lost data?** Check Firebase Console → Realtime Database → Data tab
- **Want to delete user?** Delete from the Database tab in Firebase Console
- **Production?** Set up proper authentication rules later

---

**Questions?** Check browser console (F12) for error messages!
