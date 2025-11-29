# Firebase Firestore Setup Guide

## ⚠️ CRITICAL: You must complete these steps for the app to work!

### Step 1: Create Firestore Database

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `meenatchitraders-882a5`
3. **In the left sidebar**, click: **Build** → **Firestore Database**
4. **You will see one of two things:**

   **Option A: "Create database" button**
   - ✅ Click the button
   - Choose location: **asia-south1** (Mumbai, India)
   - Select: **"Start in test mode"**
   - Click: **"Enable"**
   - ⏳ Wait 1-2 minutes for it to finish

   **Option B: Database already exists**
   - ✅ You should see collections or an empty database
   - Skip to Step 2

### Step 2: Set Security Rules (IMPORTANT!)

1. In Firestore Database, click the **"Rules"** tab
2. **Replace ALL the text** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes (TEST MODE ONLY!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**
4. You should see: "Rules published successfully"

### Step 3: Enable Authentication (REQUIRED for Login)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `meenatchitraders-882a5`
3. **In the left sidebar**, click: **Build** → **Authentication**
4. Click **"Get started"** (if you haven't already)
5. Select the **"Sign-in method"** tab
6. Click **"Email/Password"**
7. Toggle **"Enable"** to ON
8. Click **"Save"**

### Step 3.5: Add More Admins (Optional)

Since your security rules allow access to **any authenticated user**, adding a new admin is easy:

1. Go to **Firebase Console** → **Authentication** → **Users** tab.
2. Click the **"Add user"** button.
3. Enter the **Email** and **Password** for the new admin.
4. Click **"Add user"**.
5. **Done!** They can now log in to the admin panel immediately.

### Step 4: Verify It Works

1. **Refresh your admin page**: http://localhost:3001/admin
2. **Login** with:
   - Username: `admin@gmail.com`
   - Password: `admin@123`
3. **First time login**: The system will automatically create this user for you.
4. **Success**: You should see the Admin Dashboard.

---

## 🔍 Troubleshooting

### If you get "auth/configuration-not-found":
- You skipped **Step 3**. You MUST enable Email/Password in the Firebase Console.

### If you still get "Connection timed out":
1. **Check your internet connection**
2. **Disable VPN** if you're using one
3. **Check browser console** (F12) for detailed errors
4. **Verify the database was created** - go back to Firebase Console and check

### If you get "Permission denied":
- Your security rules might be blocking you. Ensure you are logged in.

---

## 📝 Next Steps After It Works

Once you are logged in:
1. Click **"Load Default Products"** to add sample products
2. Go to the home page to see them displayed
3. Try adding your own products via the "Add Product" button

