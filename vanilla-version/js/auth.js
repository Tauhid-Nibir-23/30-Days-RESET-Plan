/* ============================================
   FIREBASE CONFIGURATION & INITIALIZATION
   ============================================ */

// Initialize Firebase (Replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyBvYImzlXkQf3i7AAzFGgiAERCmGiNPUco",
  authDomain: "discipline-tracker-ee654.firebaseapp.com",
  databaseURL: "https://discipline-tracker-ee654-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "discipline-tracker-ee654",
  storageBucket: "discipline-tracker-ee654.firebasestorage.app",
  messagingSenderId: "980135552353",
  appId: "1:980135552353:web:3958d33e0a8b327eee1120"
};

let auth, db;
let firebaseReady = false;

// Wait for Firebase SDK to load
function initializeFirebase() {
    return new Promise((resolve) => {
        // Check if Firebase is already loaded
        if (typeof firebase !== 'undefined' && firebase.apps) {
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                
                auth = firebase.auth();
                db = firebase.database();
                window.firebaseAuth = firebase.auth;
                window.firebaseDB = firebase.database;
                window.auth = auth;
                window.db = db;
                firebaseReady = true;
                console.log('✅ Firebase initialized successfully');
                resolve(true);
                return;
            } catch (error) {
                console.error('❌ Firebase initialization error:', error);
                resolve(false);
                return;
            }
        }

        // Firebase not ready yet, wait and try again
        let attempts = 0;
        const checkFirebase = setInterval(() => {
            attempts++;
            if (typeof firebase !== 'undefined' && firebase.apps) {
                clearInterval(checkFirebase);
                try {
                    if (!firebase.apps.length) {
                        firebase.initializeApp(firebaseConfig);
                    }
                    auth = firebase.auth();
                    db = firebase.database();
                    window.firebaseAuth = firebase.auth;
                    window.firebaseDB = firebase.database;
                    window.auth = auth;
                    window.db = db;
                    firebaseReady = true;
                    console.log('✅ Firebase initialized successfully');
                    resolve(true);
                } catch (error) {
                    console.error('❌ Firebase initialization error:', error);
                    resolve(false);
                }
            } else if (attempts > 50) {
                // Tried for 5 seconds, give up
                clearInterval(checkFirebase);
                console.error('❌ Firebase SDK failed to load');
                resolve(false);
            }
        }, 100);
    });
}

// Initialize Firebase immediately
initializeFirebase();

// Also initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (!firebaseReady) {
        initializeFirebase();
    }
});


/* ============================================
   TAB SWITCHING FOR LOGIN
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formContainers = document.querySelectorAll('.auth-form-container');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all
            tabButtons.forEach(b => b.classList.remove('active'));
            formContainers.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked
            btn.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });

    // Check if user is already logged in
    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user && window.location.pathname.includes('login.html')) {
                window.location.href = 'dashboard.html';
            }
        });
    }
});

/* ============================================
   SIGNUP / LOGIN TOGGLE
   ============================================ */

function toggleSignup(event) {
    event.preventDefault();
    const loginForm = document.getElementById('emailLoginForm');
    const signupForm = document.getElementById('emailSignupForm');
    const backToLoginText = document.getElementById('backToLoginText');

    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
    backToLoginText.classList.toggle('hidden');

    // Clear errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

/* ============================================
   EMAIL SIGNUP
   ============================================ */

async function handleEmailSignup(event) {
    event.preventDefault();
    const nameInput = document.getElementById('signupNameInput');
    const emailInput = document.getElementById('signupEmailInput');
    const passwordInput = document.getElementById('signupPasswordInput');
    const errors = document.querySelectorAll('#emailSignupForm .form-error');
    
    // Clear errors
    errors.forEach(el => el.textContent = '');

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validation
    if (!fullName || fullName.length < 2) {
        errors[0].textContent = 'Please enter your full name';
        return;
    }

    if (!email || !isValidEmail(email)) {
        errors[1].textContent = 'Please enter a valid email';
        return;
    }

    if (password.length < 6) {
        errors[2].textContent = 'Password must be at least 6 characters';
        return;
    }

    try {
        // Make sure Firebase is initialized
        if (!auth || !firebaseReady) {
            // Wait for Firebase to initialize (with timeout)
            let waitCount = 0;
            while (!firebaseReady && waitCount < 50) {
                await new Promise(r => setTimeout(r, 100));
                waitCount++;
            }

            if (!auth || !firebaseReady) {
                errors[1].textContent = '❌ Firebase not initialized. Refresh page and try again.';
                console.error('Firebase still not ready after waiting');
                return;
            }
        }

        // Create Firebase user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // Save user profile data
        const userData = {
            uid: uid,
            fullName: fullName,
            email: email,
            createdAt: new Date().toISOString(),
            currentDay: 1,
            lastCompletedDate: null,
            habits: {},
            journal: {},
            goals: [false, false, false, false, false],
            theme: 'dark'
        };

        await saveUser(uid, userData);
        localStorage.setItem('userId', uid);
        localStorage.setItem('username', fullName);
        
        // Redirect to user info page
        window.location.href = 'user-info.html';
    } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = getFirebaseErrorMessage(error.code);
        errors[1].textContent = errorMessage;
    }
}

/* ============================================
   EMAIL LOGIN
   ============================================ */

async function handleEmailLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errors = document.querySelectorAll('#emailLoginForm .form-error');
    
    // Clear errors
    errors.forEach(el => el.textContent = '');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !isValidEmail(email)) {
        errors[0].textContent = 'Please enter a valid email';
        return;
    }

    if (password.length < 6) {
        errors[1].textContent = 'Password must be at least 6 characters';
        return;
    }

    try {
        // Make sure Firebase is initialized
        if (!auth || !firebaseReady) {
            // Wait for Firebase to initialize (with timeout)
            let waitCount = 0;
            while (!firebaseReady && waitCount < 50) {
                await new Promise(r => setTimeout(r, 100));
                waitCount++;
            }

            if (!auth || !firebaseReady) {
                errors[0].textContent = '❌ Firebase not initialized. Refresh page and try again.';
                console.error('Firebase still not ready after waiting');
                return;
            }
        }

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;
        localStorage.setItem('userId', uid);
        const profile = await getUser(uid);
        const displayName = (profile && profile.fullName) || userCredential.user.displayName || email.split('@')[0];
        localStorage.setItem('username', displayName);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = getFirebaseErrorMessage(error.code);
        errors[0].textContent = errorMessage;
    }
}

/* ============================================
   GOOGLE SIGN-IN
   ============================================ */

async function handleGoogleLogin(response) {
    try {
        const credential = google.accounts.id.decodeCredentialResponse(response);
        const token = response.credential;

        // Sign in with Google credential
        const googleProvider = new window.firebaseAuth.GoogleAuthProvider();
        const userCredential = await auth.signInWithCredential(
            window.firebaseAuth.GoogleAuthProvider.credential(null, token)
        );

        const user = userCredential.user;
        const uid = user.uid;
        localStorage.setItem('userId', uid);

        // Check if user exists in database
        const existingUser = await getUser(uid);
        const displayName = (existingUser && existingUser.fullName) || user.displayName || user.email || 'User';
        localStorage.setItem('username', displayName);
        
        if (!existingUser) {
            // New user - save profile
            const userData = {
                uid: uid,
                fullName: user.displayName || 'User',
                email: user.email,
                photoURL: user.photoURL || null,
                createdAt: new Date().toISOString(),
                currentDay: 1,
                lastCompletedDate: null,
                habits: {},
                journal: {},
                goals: [false, false, false, false, false],
                theme: 'dark'
            };
            await saveUser(uid, userData);
            window.location.href = 'user-info.html';
        } else {
            // Existing user - go to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Google login error:', error);
        alert('Google login failed: ' + error.message);
    }
}

/* ============================================
   LOGOUT
   ============================================ */

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            if (auth && typeof auth.signOut === 'function') {
                await auth.signOut();
            }
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback: clear local session even if Firebase logout fails
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        }
    }
}

/* ============================================
   CHECK AUTHENTICATION ON PAGE LOAD
   ============================================ */

async function setupAuthStateListener() {
    // Wait for auth to be ready (up to 5 seconds)
    let attempts = 0;
    while (!auth && attempts < 50) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
    }

    if (!auth) {
        return;
    }

    auth.onAuthStateChanged(async (user) => {
        const isLoginPage = window.location.pathname.includes('login.html');
        const isProtectedPage = window.location.pathname.includes('dashboard.html') || 
                               window.location.pathname.includes('success.html') ||
                               window.location.pathname.includes('user-info.html');

        if (!user && isProtectedPage) {
            window.location.href = 'login.html';
            return;
        }

        if (user && isLoginPage) {
            // Ensure localStorage has required fields to avoid redirect loop
            localStorage.setItem('userId', user.uid);

            let username = localStorage.getItem('username');
            if (!username) {
                try {
                    const profile = await getUser(user.uid);
                    username = (profile && profile.fullName) || user.displayName || user.email || 'User';
                } catch (error) {
                    username = user.displayName || user.email || 'User';
                }
                localStorage.setItem('username', username);
            }

            window.location.href = 'dashboard.html';
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setupAuthStateListener();
});

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getFirebaseErrorMessage(errorCode) {
    const messages = {
        'auth/email-already-in-use': 'This email is already registered. Try login or use a different email.',
        'auth/invalid-email': 'Invalid email address format',
        'auth/weak-password': 'Password is too weak. Use 6+ characters.',
        'auth/user-not-found': 'User not found. Please sign up first.',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid credentials',
        'auth/operation-not-allowed': 'Email/Password auth is not enabled in Firebase. See setup guide.',
        'auth/too-many-requests': 'Too many login attempts. Try again later.',
        'auth/network-request-failed': '❌ Network error. Check your internet connection.',
        'auth/firebase-config': '❌ Firebase not configured. Add credentials to js/auth.js'
    };
    return messages[errorCode] || `❌ Error: ${errorCode}. Check Firebase setup guide.`;
}

/* ============================================
   GET CURRENT USER ID
   ============================================ */

function getCurrentUserId() {
    if (auth && auth.currentUser) {
        return auth.currentUser.uid;
    }
    return localStorage.getItem('userId');
}
