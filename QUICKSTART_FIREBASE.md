# ⚡ Quick Start - Firebase Configuration

## 🎯 What You Need to Do NOW

### Step 1: Get Firebase Credentials (5 minutes)
1. Go to https://console.firebase.google.com
2. Click **"Create a project"**
3. Name it: `discipline-tracker`
4. Follow the setup
5. Go to ⚙️ **Project Settings**
6. Find **Web App** config
7. Copy the Firebase config object

### Step 2: Update Your Code (1 minute)
Open `js/auth.js` and find lines 8-16:

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

**Replace with your actual credentials** from Firebase Console.

### Step 3: Enable Authentication (2 minutes)
1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get started**
3. Find **Email/Password** → Enable it
4. Find **Google** → Enable it (optional)

### Step 4: Create Realtime Database (2 minutes)
1. In Firebase Console, go to **Build** → **Realtime Database**
2. Click **Create Database**
3. Select region close to you
4. Start in **Test mode**
5. Go to **Rules** tab
6. Replace with this:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```
7. Click **Publish**

---

## ✅ Test It Now

1. Open `login.html` in your browser
2. Click **"Email Login"** tab
3. Click **"Sign up"**
4. Fill in:
   - Full Name: Your name
   - Email: your.email@example.com
   - Password: (6+ characters)
5. Click **Create Account**
6. You should see the **Profile** page
7. Edit your info and save
8. Click **Go to Dashboard**

Done! 🎉

---

## 📞 If Something Doesn't Work

### "Firebase is not defined"
- Check Firebase scripts in `login.html` are loading
- Open browser console (F12) for errors

### "Email already in use"
- Use a different email address

### "No database connection"
- Check Realtime Database is enabled
- Check rules are published
- Verify databaseURL is correct

### Still stuck?
- Read `FIREBASE_COMPLETE_SETUP.md` for detailed guide
- Check browser console for error messages

---

## 🎁 You Now Have

✨ **Professional login system** with:
- Email/Password signup & login
- Google Sign-In ready (just add credentials)
- User profile page
- All data saved to Firebase
- Offline fallback
- Beautiful UI

Let's go! 🔥
