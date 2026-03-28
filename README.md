# 🌿 The Shalom Retreat Centre - UPDATED Website Package

## ✨ What's New & Fixed

### 🎯 Animation Issue - FIXED! ✅
The flickering/disappearing animation bug has been **completely resolved**:
- ❌ **Before:** Elements would disappear and reappear during scroll
- ✅ **After:** Smooth, professional fade-in animations that work perfectly
- **What was wrong:** JavaScript and CSS were both trying to animate elements, causing conflicts
- **Solution:** Simplified to pure CSS animations with no conflicts

### 🚀 New Easy Retreat Management System
You can now **manage ALL retreats by editing ONE simple file** - no HTML knowledge needed!

---

## 📂 What's Included

```
📦 Your Website Package
├── 📄 index.html                 - Home page
├── 📄 bookings.html              - Retreats page (loads from JSON!)
├── 📄 retreat-signup.html        - Registration form (dynamic!)
├── 📄 about.html                 - About page
├── 📄 contact.html               - Contact page
├── 🎨 styles.css                 - Styling (animations FIXED)
├── ⚡ script.js                  - Functionality (conflicts removed)
├── 🖼️ Shalom_logo_transparent.png - Your logo
│
├── 🎯 retreats.json              ⭐ EDIT THIS to manage retreats!
│
├── 📘 SETUP-GUIDE.md             - Complete setup instructions
├── 📝 QUICK-REFERENCE.md         - Quick how-to guide
└── 🔧 google-apps-script.js      - Google Sheets integration code
```

---

## 🎯 Quick Start (3 Steps)

### 1️⃣ Upload Everything
Upload all files to your web server in the same folder.

### 2️⃣ Set Up Google Sheets (Optional but Recommended)
- Open your Google Sheet
- Create tabs matching your retreat names (e.g., "Silent Retreat", "Renewal Retreat")
- Your forms will automatically organize submissions by retreat!

### 3️⃣ You're Done! 🎉
Visit your website - everything works!

---

## 🔧 Managing Retreats - THE EASY WAY

### To Add/Edit/Remove Retreats:

**JUST EDIT:** `retreats.json`

**That's it!** No HTML knowledge needed.

#### Adding a Retreat:
1. Open `retreats.json`
2. Copy an existing retreat section
3. Paste and update the details
4. Save and upload
5. Done! ✅

#### Example:
```json
{
  "id": "advent",
  "name": "Advent Preparation Retreat",
  "tag": "Day Retreat",
  "date": "December 3, 2026",
  "image": "https://images.unsplash.com/photo-YOURIMAGE",
  "description": "Prepare your heart for Christmas.",
  "sheetName": "Advent Retreat"
}
```

**Full instructions in:** `QUICK-REFERENCE.md`

---

## 📊 Google Sheets Integration

### Current Setup
Your forms are **already connected** to Google Sheets with this URL:
```
https://script.google.com/macros/s/AKfycbzMTzUntXwILEshQC1yCfrL_0h07oDUvFPJBVGoWK53LrcUM3KP3_3Sqj_CTnMh_ya9/exec
```

### How It Works:
1. Someone fills out a form
2. Data automatically goes to your Google Sheet
3. Data is sorted into the correct tab based on retreat name
4. You have organized data for each retreat!

### To Set Up/Update:
See `SETUP-GUIDE.md` for detailed instructions, or use the code in `google-apps-script.js`

---

## 🎨 Getting Images

**Free, beautiful images from:**
- [Unsplash.com](https://unsplash.com) - Search "meditation", "nature", "peaceful"
- [Pexels.com](https://pexels.com) - Another great source

**How to use:**
1. Find an image you like
2. Right-click → "Copy image address"
3. Paste the URL into the `image` field in `retreats.json`

---

## 📱 Features

✅ **Responsive Design** - Perfect on phones, tablets, computers
✅ **Smooth Animations** - No flicker, no conflicts
✅ **Easy Retreat Management** - Edit one JSON file
✅ **Automatic Registration Pages** - Each retreat gets its own page
✅ **Google Sheets Integration** - Organized by retreat
✅ **Mobile Menu** - Hamburger menu for small screens
✅ **Professional Look** - Beautiful design with peaceful colors
✅ **Form Validation** - Built-in error checking
✅ **Success Messages** - Users know their form submitted

---

## 🛠️ Customization

### Changing Colors
Edit the `:root` section in `styles.css`:
```css
:root {
    --primary-color: #5a7d9a;      /* Main blue */
    --secondary-color: #8ba5b8;    /* Light blue */
    --accent-color: #c9a66b;       /* Gold accent */
}
```

### Changing Text
- **Home page:** Edit `index.html`
- **About page:** Edit `about.html`
- **Contact info:** Edit `contact.html`
- **Retreats:** Edit `retreats.json` ⭐

---

## 🆘 Troubleshooting

### Animation flicker?
✅ **Fixed!** The new `styles.css` and `script.js` resolve this completely.

### Retreats not showing?
- Check `retreats.json` is uploaded to the server
- Verify JSON syntax (use JSONLint.com to check)
- Check browser console (F12) for errors

### Forms not submitting?
- Verify Google Apps Script is deployed
- Check the script URL in `script.js`
- Make sure Google Sheet tabs match retreat names

### Images not loading?
- Verify image URLs start with `https://`
- Test URL by pasting into browser
- Use Unsplash or Pexels for reliable hosting

---

## 📖 Documentation

📘 **SETUP-GUIDE.md** - Complete setup and Google Sheets instructions
📝 **QUICK-REFERENCE.md** - Quick guide for managing retreats
🔧 **google-apps-script.js** - Code for Google Sheets integration

---

## 🎓 No Admin Panel, But Better!

**You asked about an admin mode for remote editing.**

**Why no admin panel:**
- Requires database, login system, hosting
- Security concerns
- More complex to maintain
- Much more expensive to host

**What you have instead (BETTER!):**
- ✅ Edit `retreats.json` in any text editor
- ✅ Upload one file via FTP/hosting panel
- ✅ Changes appear instantly
- ✅ Simple, secure, no login needed
- ✅ Version control possible (keep backups)
- ✅ Can edit on any device with text editor

**How to edit remotely:**
1. Download `retreats.json` from your server
2. Edit on your computer
3. Upload back to server
4. Done! Changes are live

Or use your hosting panel's file editor to edit directly online!

---

## 💡 Best Practices

1. **Backup `retreats.json`** before making changes
2. **Test changes** by viewing the website after uploading
3. **Use a code editor** (Notepad++, VS Code) for syntax highlighting
4. **Check JSON syntax** at JSONLint.com before uploading
5. **Keep image URLs organized** - save them somewhere for reference

---

## 🎯 Common Tasks

### Add New Retreat
1. Edit `retreats.json`
2. Add new retreat block
3. Upload file
4. Visit website - new retreat appears!

### Change Retreat Date
1. Edit `retreats.json`
2. Find retreat by `id`
3. Update `date` field
4. Upload - done!

### Remove Old Retreat
1. Edit `retreats.json`
2. Delete retreat block
3. Upload - it's gone!

### View Registrations
1. Open Google Sheet
2. Click retreat tab
3. See all registrations!

---

## ✨ What Makes This Better

**Before:** Had to edit HTML, copy/paste sections, risk breaking code
**After:** Edit simple JSON file, automatic updates, impossible to break

**Before:** All registrations in one messy list
**After:** Organized by retreat in separate tabs

**Before:** Flickering animations
**After:** Smooth, professional animations

---

## 🚀 You're All Set!

Everything is configured and ready to use:
- ✅ Animations fixed
- ✅ Easy retreat management with JSON
- ✅ Google Sheets integration ready
- ✅ Responsive design
- ✅ Professional appearance

**Just upload the files and start using your beautiful retreat website!**

---

## 📞 Questions?

- Check `SETUP-GUIDE.md` for detailed instructions
- Check `QUICK-REFERENCE.md` for quick answers
- Test JSON at JSONLint.com if you have syntax errors
- Check browser console (F12) for JavaScript errors

---

**Version:** 2.0 - Fixed Animations + JSON Management
**Created:** February 2026
**For:** The Shalom Retreat Centre

Enjoy your peaceful, professional retreat website! 🌿✨
