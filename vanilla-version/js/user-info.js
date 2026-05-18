/* ============================================
   USER PROFILE PAGE LOGIC
   ============================================ */

let currentUser = null;
let editMode = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
    setupEventListeners();
});

/* ============================================
   LOAD USER PROFILE
   ============================================ */

async function loadUserProfile() {
    try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            window.location.href = 'login.html';
            return;
        }

        // Get user data from Firebase/localStorage
        currentUser = await getUser(userId);

        if (!currentUser) {
            console.error('User data not found');
            window.location.href = 'login.html';
            return;
        }

        // Display user information
        displayUserInfo();
        updateAvatarImage();
    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Error loading profile. Please refresh the page.');
    }
}

/* ============================================
   DISPLAY USER INFORMATION
   ============================================ */

function displayUserInfo() {
    if (!currentUser) return;

    // Account Information
    document.getElementById('displayName').textContent = currentUser.fullName || 'User';
    document.getElementById('displayEmail').textContent = currentUser.email || 'No email';
    
    // Join date
    if (currentUser.createdAt) {
        const joinDate = new Date(currentUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('displayJoinDate').textContent = joinDate;
    }

    // Challenge Progress
    const currentDay = currentUser.currentDay || 1;
    document.getElementById('displayCurrentDay').textContent = currentDay;
    
    const progress = (currentDay / 30) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressPercent').textContent = Math.round(progress);

    // Populate edit form
    populateEditForm();
}

/* ============================================
   POPULATE EDIT FORM
   ============================================ */

function populateEditForm() {
    if (!currentUser) return;

    document.getElementById('editName').value = currentUser.fullName || '';
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editBio').value = currentUser.bio || '';
    document.getElementById('editTheme').value = currentUser.theme || 'dark';
}

/* ============================================
   AVATAR IMAGE
   ============================================ */

function updateAvatarImage() {
    if (!currentUser) return;

    const name = currentUser.fullName || 'User';
    let avatarUrl;

    // Use Google photo if available
    if (currentUser.photoURL) {
        avatarUrl = currentUser.photoURL;
    } else {
        // Generate avatar from name
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=3b82f6&color=fff`;
    }

    document.getElementById('avatarImage').src = avatarUrl;
}

/* ============================================
   EDIT MODE FUNCTIONS
   ============================================ */

function enterEditMode() {
    editMode = true;
    document.getElementById('infoDisplay').classList.add('hidden');
    document.getElementById('infoEdit').classList.remove('hidden');
}

function exitEditMode() {
    editMode = false;
    document.getElementById('infoEdit').classList.add('hidden');
    document.getElementById('infoDisplay').classList.remove('hidden');
}

/* ============================================
   SAVE PROFILE
   ============================================ */

async function saveProfile(event) {
    event.preventDefault();

    try {
        showLoadingSpinner(true);

        const userId = localStorage.getItem('userId');
        const fullName = document.getElementById('editName').value.trim();
        const phone = document.getElementById('editPhone').value.trim();
        const bio = document.getElementById('editBio').value.trim();
        const theme = document.getElementById('editTheme').value;

        // Validation
        if (!fullName || fullName.length < 2) {
            showError('editName', 'Full name must be at least 2 characters');
            showLoadingSpinner(false);
            return;
        }

        // Update user profile
        const updates = {
            fullName,
            phone,
            bio,
            theme,
            updatedAt: new Date().toISOString()
        };

        await updateUserProfile(userId, updates);
        currentUser = { ...currentUser, ...updates };

        showLoadingSpinner(false);
        showToast('Profile updated successfully!');
        
        setTimeout(() => {
            exitEditMode();
            displayUserInfo();
        }, 1000);

    } catch (error) {
        console.error('Error saving profile:', error);
        showLoadingSpinner(false);
        showToast('Error saving profile. Please try again.');
    }
}

/* ============================================
   CHANGE PASSWORD
   ============================================ */

async function changePassword() {
    const newPassword = prompt('Enter your new password (minimum 6 characters):');
    
    if (!newPassword) return;

    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    try {
        const user = firebase.auth().currentUser;
        await user.updatePassword(newPassword);
        showToast('Password changed successfully!');
    } catch (error) {
        console.error('Error changing password:', error);
        let errorMessage = 'Error changing password';
        
        if (error.code === 'auth/requires-recent-login') {
            errorMessage = 'Please logout and login again to change password';
        }
        
        alert(errorMessage);
    }
}

/* ============================================
   NAVIGATION
   ============================================ */

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

function setupEventListeners() {
    // Character counter for bio
    const bioInput = document.getElementById('editBio');
    bioInput.addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = e.target.value.length;
    });
}

/* ============================================
   UI HELPERS
   ============================================ */

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const errorEl = element.parentElement.querySelector('.form-error');
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showToast(message) {
    const toast = document.getElementById('successToast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
