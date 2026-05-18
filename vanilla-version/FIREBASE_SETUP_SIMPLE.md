# 🔥 Firebase Setup - Step by Step (REQUIRED TO FIX)

## ⚠️ Why Account Creation Fails

Your app shows **"Authentication failed"** because Firebase is not set up. You MUST do these steps:

---

## 📋 STEP 1: Create Firebase Project (2 minutes)

1. Open: **https://console.firebase.google.com**
2. Click **"Add Project"** button
3. Enter name: `discipline-tracker` (or any name)
4. Click **Continue**
5. Disable "Google Analytics" (click the checkbox)
6. Click **Create project**
7. Wait for setup (about 1 minute)
8. You'll see the Firebase dashboard

✅ **You should now see your project name at the top**

---

## 📋 STEP 2: Get Your Firebase Credentials (2 minutes)

1. In Firebase Console, click ⚙️ **Settings** (top right corner)
2. Click **Project Settings**
3. Scroll down to **"Your apps"** section
4. You should see a web app. If not, click **"Web"** icon `</>`
5. Find the Firebase config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "discipline-tracker-abc123.firebaseapp.com",
  projectId: "discipline-tracker-abc123",
  storageBucket: "discipline-tracker-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

6. **Copy the entire config object** (highlight and Ctrl+C)

✅ **You now have your credentials**

---

## 📋 STEP 3: Add Credentials to Your App (1 minute)

1. Open `js/auth.js` file in VS Code
2. Find lines 8-16 (near the top):

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

3. **Replace EVERYTHING** (keep just the const declaration) with your config from Step 2
4. **Save the file** (Ctrl+S)

✅ **Your credentials are now in the app**

---

## 📋 STEP 4: Enable Email/Password Authentication (2 minutes)

This is the MOST IMPORTANT step!

1. Go back to **Firebase Console**
2. Click **Build** → **Authentication** (left menu)
3. Click **Get Started** button
4. Click on **"Email/Password"** option
5. Toggle the **Enable** switch ON (it becomes blue)
6. Click **Save** button
7. You should see a checkmark ✅ next to Email/Password

✅ **Email/Password is now enabled**

---

## 📋 STEP 5: Set Up Realtime Database (2 minutes)

1. In Firebase Console, click **Build** → **Realtime Database**
2. Click **"Create Database"** button
3. Choose region closest to you (e.g., `us-central1` or `asia-southeast1`)
4. Choose **"Start in test mode"**
5. Click **"Enable"**
6. Wait for database to create
7. You'll see a URL like: `https://discipline-tracker-abc123.firebasedatabase.app`

✅ **Database is created**

---

## 📋 STEP 6: Set Database Security Rules (1 minute)

1. In your Realtime Database, click **"Rules"** tab (top)
2. Delete all the existing text
3. Paste this:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

4. Click **"Publish"** button (top right)
5. Click **"Publish"** again to confirm

✅ **Database rules are set**

---

## ✅ YOU'RE DONE! Now Test:

1. **Refresh** your browser (F5)
2. Open `login.html`
3. Click **"Email Login"** tab
4. Click **"Sign up"** link
5. Fill in:
   - Full Name: `Your Name`
   - Email: `test@example.com`
   - Password: `password123`
6. Click **"Create Account"**

✅ **You should see the Profile page!**

---

## 🐛 Still Getting Error?

### Error: "Firebase not configured"
- You forgot Step 3
- Make sure you replaced the credentials in `js/auth.js`
- Save the file with Ctrl+S
- Refresh browser with F5

### Error: "Email already in use"
- Use a different email address
- Or delete the user from Firebase Console

### Error: "Authentication failed"
- You didn't do Step 4 (Enable Email/Password)
- Go to Firebase Console → Authentication → Sign-in method
- Make sure Email/Password is ENABLED (blue toggle)

### Nothing happens when clicking Sign Up
- Open browser console (Press F12)
- Look for red error messages
- Take a screenshot and check what it says
- This helps identify the exact problem

---

## 🎯 Firebase Project Checklist

Before testing, verify in Firebase Console:

- ✅ Project created
- ✅ Web app added
- ✅ Email/Password enabled (blue toggle)
- ✅ Realtime Database created
- ✅ Database rules published
- ✅ Credentials added to `js/auth.js`

---

## 📞 Quick Reference

| What | Where |
|------|-------|
| Get Credentials | Settings → Project Settings → Your apps |
| Enable Email Auth | Build → Authentication → Sign-in method → Email/Password |
| Create Database | Build → Realtime Database → Create |
| Set Rules | Realtime Database → Rules → Publish |
| Check Status | See green checkmarks on left menu |

---

## 🚀 After First Account Works

Once you can create an account:
1. Try logging out (click Logout)
2. Try logging back in
3. Edit your profile
4. Go to dashboard

Everything should work! 🎉

---

**Questions?** Check your Firebase Console for any warning messages or error alerts.
