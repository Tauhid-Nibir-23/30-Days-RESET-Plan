# 🔥 Complete Firebase Setup Guide for Discipline Tracker

## ✅ What's New

Your app now has:
- **Email/Password Authentication** with Sign Up and Login
- **Google Sign-In** integration  
- **User Profile Page** with editable information
- **Firebase Realtime Database** for storing all user data
- **Secure Authentication** with Firebase

---

## 📱 Step 1: Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com)**
2. Click **"Create a project"**
3. Enter project name: `discipline-tracker`
4. Click **Continue**
5. Disable Google Analytics (optional)
6. Click **Create project** and wait for setup

---

## 🔐 Step 2: Set Up Authentication

### Enable Email/Password Auth:
1. In left menu, click **Build** → **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** for Email/Password
6. Click **Save**

### Enable Google Sign-In:
1. In **Sign-in method** tab, click **Google**
2. Toggle **Enable**
3. Select a project support email
4. Click **Save**

---

## 💾 Step 3: Set Up Realtime Database

1. In left menu, click **Build** → **Realtime Database**
2. Click **Create Database**
3. Select region closest to you
4. Start in **Test mode** (for development)
5. Click **Enable**

### Set Database Rules:
1. Go to **Rules** tab
2. Replace with this (for development only):

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

3. Click **Publish**

⚠️ **Note:** For production, implement proper security rules

---

## 🗝️ Step 4: Get Your Credentials

1. Click ⚙️ **Settings** icon (top right)
2. Select **Project Settings**
3. Scroll to **Your apps** section
4. Find or create a Web app (`</>` icon)
5. Copy the Firebase config:

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

## 📝 Step 5: Update Your App

### In `js/auth.js` (Lines 8-16):

Find this section:
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

Replace with your actual Firebase config from Step 4.

---

## 🌐 Step 6: Set Up Google Sign-In (Optional)

If you want to enable Google Sign-In:

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized origins:
   - `http://localhost:3000`
   - `http://localhost:8000`
   - Your deployed URL
7. Copy the Client ID

### In `login.html` (Line 27):
Find:
```html
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID.

---

## 🧪 Test the App

1. Open `login.html`
2. Try **Email/Password signup** first:
   - Click on **Email Login** tab
   - Click **Sign up** link
   - Fill in details and create account
3. After signup, you'll see the **User Profile** page
4. Edit your profile and save
5. Click **Go to Dashboard**
6. Logout and try logging back in

---

## 📊 Firebase Database Structure

Your user data is stored in this structure:

```
users/
└── {userId}
    ├── uid: "user123..."
    ├── fullName: "John Doe"
    ├── email: "john@example.com"
    ├── phone: "+1234567890"
    ├── bio: "My discipline journey..."
    ├── photoURL: "https://..."
    ├── createdAt: "2024-05-18T..."
    ├── updatedAt: "2024-05-18T..."
    ├── theme: "dark"
    ├── currentDay: 1
    ├── lastCompletedDate: null
    ├── habits: {...}
    ├── journal: {...}
    └── goals: [false, false, false, false, false]
```

---

## 🎯 Page Flows

### New User:
1. **Login.html** → Email/Password Sign Up
2. → Firebase User Creation + Profile Save
3. → **User-info.html** (Complete Profile)
4. → **Dashboard.html** (Start Challenge)

### Existing User:
1. **Login.html** → Email/Password Login
2. → Authentication Check
3. → **Dashboard.html** (Resume Challenge)

### User Profile:
- Access from Dashboard profile icon
- Edit name, phone, bio, theme
- Change password
- View progress

---

## 🔒 Security Best Practices

1. **Environment Variables**: For production, store credentials in `.env` files
2. **Database Rules**: Restrict write access to authenticated users only
3. **HTTPS**: Always use HTTPS in production
4. **User Validation**: Validate all inputs server-side
5. **Password Security**: Use strong passwords (Firebase enforces 6+ characters)

---

## 🐛 Troubleshooting

### "Firebase is not defined"
- Ensure Firebase SDK scripts are loaded in HTML
- Check script order: Firebase SDK must load before auth.js

### "Database not available"
- Check if Realtime Database is enabled in Firebase Console
- Verify databaseURL is correct
- Check database rules (should allow read/write in test mode)

### Google Sign-In Not Working
- Verify Client ID is correct in login.html
- Check authorized origins in Google Cloud Console
- Allow pop-ups if blocked by browser

### User Data Not Saving
- Check Firebase database rules
- Verify user is authenticated (auth != null in rules)
- Check browser console for errors

---

## 📞 Support

For Firebase issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Authentication Guide](https://firebase.google.com/docs/auth)
- [Realtime Database Guide](https://firebase.google.com/docs/database)

---

## ✨ Features Overview

### Login System
- ✅ Email/Password authentication
- ✅ User registration with validation
- ✅ Google Sign-In
- ✅ Error handling and user feedback
- ✅ Password strength requirements

### User Profile Page
- ✅ Display user information
- ✅ Edit profile (name, phone, bio)
- ✅ Theme preference selection
- ✅ Progress visualization
- ✅ Change password option
- ✅ Logout button

### Data Storage
- ✅ Firebase Realtime Database integration
- ✅ Fallback to localStorage
- ✅ User profile data persistence
- ✅ Challenge progress tracking
- ✅ Synchronized across devices

---

## 🎉 Ready to Go!

Your Discipline Tracker app is now ready with full authentication and user management. Users can:
1. Create secure accounts
2. Sign in with Google
3. Manage their profile
4. Track their 30-day challenge
5. Save progress to the cloud

Enjoy! 🔥
