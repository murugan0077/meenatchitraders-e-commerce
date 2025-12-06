# 🚀 Deployment Guide: How to Host Your Site for Free

Since you are already using Firebase for your database and authentication, the **best and easiest free option** is **Firebase Hosting**.

It is free, fast, and integrates perfectly with your project.

## Option 1: Firebase Hosting (Recommended)

### Prerequisites
You need to have Node.js installed (which you already do).

### Step 1: Install Firebase Tools
Run this command in your terminal:
```bash
npm install -g firebase-tools
```
*If you get a permission error, try `sudo npm install -g firebase-tools`*

### Step 2: Login to Firebase
```bash
firebase login
```
This will open your browser. Login with the same Google account you used to create the Firebase project.

### Step 3: Initialize the Project
Run this command in your project folder:
```bash
firebase init hosting
```

**Answer the questions as follows:**
1. **Are you ready to proceed?** -> `Yes`
2. **Please select an option:** -> `Use an existing project`
3. **Select a default Firebase project for this directory:** -> Choose `meenatchitraders-882a5` (your current project)
4. **What do you want to use as your public directory?** -> `dist`
   *(Note: Vite builds to the `dist` folder, not `public`)*
5. **Configure as a single-page app (rewrite all urls to /index.html)?** -> `Yes`
6. **Set up automatic builds and deploys with GitHub?** -> `No` (unless you want to set that up later)
7. **File dist/index.html already exists. Overwrite?** -> `No` (Important! Say No so we don't lose our work)

### Step 4: Build Your Site
Before deploying, we must create the production version of your site:
```bash
npm run build
```

### Step 5: Deploy!
```bash
firebase deploy
```

**🎉 Done!**
The terminal will give you a "Hosting URL" (e.g., `https://meenatchitraders-882a5.web.app`). Click it to see your live site!

---

## Option 2: Vercel (Alternative)

Vercel is also excellent for React/Vite apps.

1. Go to [Vercel.com](https://vercel.com) and sign up.
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in your terminal.
4. Follow the prompts (accept defaults).
5. It will deploy instantly.

*Note: If you use Vercel, you might need to add your Vercel domain to the "Authorized Domains" list in Firebase Console -> Authentication -> Settings.*
