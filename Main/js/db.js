/* ============================================
   FIREBASE DATABASE FUNCTIONS WITH FALLBACK
   ============================================ */

async function saveUser(userId, data) {
  if (!db) {
    console.warn('Firebase not available, using localStorage');
    localStorage.setItem(`user_${userId}_data`, JSON.stringify(data));
    return;
  }

  try {
    const db_ref = firebase.database().ref("users/" + userId);
    await db_ref.set(data);
    // Also save to localStorage as backup
    localStorage.setItem(`user_${userId}_data`, JSON.stringify(data));
  } catch (error) {
    console.warn('Firebase save failed, using localStorage:', error);
    localStorage.setItem(`user_${userId}_data`, JSON.stringify(data));
  }
}

async function getUser(userId) {
  if (!db) {
    console.warn('Firebase not available, using localStorage');
    const data = localStorage.getItem(`user_${userId}_data`);
    return data ? JSON.parse(data) : null;
  }

  try {
    const db_ref = firebase.database().ref("users/" + userId);
    const snapshot = await db_ref.once('value');

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      // Check localStorage if Firebase is empty
      const data = localStorage.getItem(`user_${userId}_data`);
      return data ? JSON.parse(data) : null;
    }
  } catch (error) {
    console.warn('Firebase get failed, using localStorage:', error);
    const data = localStorage.getItem(`user_${userId}_data`);
    return data ? JSON.parse(data) : null;
  }
}

async function updateUserProfile(userId, updates) {
  if (!db) {
    console.warn('Firebase not available, using localStorage');
    const existing = localStorage.getItem(`user_${userId}_data`);
    const data = existing ? JSON.parse(existing) : {};
    const updated = { ...data, ...updates };
    localStorage.setItem(`user_${userId}_data`, JSON.stringify(updated));
    return updated;
  }

  try {
    const db_ref = firebase.database().ref("users/" + userId);
    await db_ref.update(updates);
    // Also update localStorage
    const existing = localStorage.getItem(`user_${userId}_data`);
    const data = existing ? JSON.parse(existing) : {};
    const updated = { ...data, ...updates };
    localStorage.setItem(`user_${userId}_data`, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('Firebase update failed:', error);
    const existing = localStorage.getItem(`user_${userId}_data`);
    const data = existing ? JSON.parse(existing) : {};
    const updated = { ...data, ...updates };
    localStorage.setItem(`user_${userId}_data`, JSON.stringify(updated));
    return updated;
  }
}

async function getLatestUserData(userId) {
  return getUser(userId);
}
