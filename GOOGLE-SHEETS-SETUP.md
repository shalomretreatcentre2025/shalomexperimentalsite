# 📊 Google Sheets Setup - Complete Guide

## ✅ What This Does

When someone fills out a retreat registration form:
1. ✅ Automatically creates a new tab/sheet if it doesn't exist
2. ✅ Names the tab based on the retreat (e.g., "Pre-Lenten", "Day of Prayer")
3. ✅ Adds proper headers automatically
4. ✅ Fills in all the data from the form

---

## 🔧 Step-by-Step Setup

### Step 1: Open Your Google Sheet

1. Go to your Google Sheet where you want the data
2. Make sure you're logged in with the account that will manage this

### Step 2: Open Apps Script

1. Click **Extensions** → **Apps Script**
2. You'll see a code editor

### Step 3: Replace the Code

1. **Delete everything** in the editor
2. **Copy ALL the code** from the file `google-apps-script.js` that I've provided
3. **Paste it** into the Apps Script editor
4. Click the **Save** icon (💾)

### Step 4: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description:** "Shalom Retreat Centre Forms"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. You may need to authorize:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**
7. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbw.../exec
   ```

### Step 5: Update Your Website

1. Open **`script.js`** from your website files
2. Find this line (around line 21):
   ```javascript
   const scriptURL = 'https://script.google.com/macros/s/AKfycbwWBv-YG6oeGxnTBB9KepI_WxDvkqpCSWXHYLC1X5p4EEew3DLbIov6r2cP4lSaMswHfg/exec';
   ```
3. **Replace it** with your new URL:
   ```javascript
   const scriptURL = 'YOUR_NEW_URL_HERE';
   ```
4. Save and upload `script.js` to your web server

---

## 🧪 Testing

### Test the Script (Before Deploying):

1. In Apps Script editor, find the `testScript()` function
2. Click the **Run** button
3. Check your Google Sheet - you should see a new tab called "Test Retreat" with test data

### Test Your Live Website:

1. Go to your retreat booking page
2. Click "Learn More & Register" on any retreat
3. Fill out the form completely
4. Submit
5. Check your Google Sheet:
   - You should see a new tab with the retreat name
   - The tab should have headers
   - Your data should be in the first row

---

## 📋 What Each Sheet Will Look Like

When someone registers for a retreat, a new tab is automatically created with these columns:

| Timestamp | Retreat Name | Name | Email | Phone | Address | Dietary Requirements | Medical Information | Additional Notes |
|-----------|--------------|------|-------|-------|---------|---------------------|---------------------|------------------|
| 2/11/2026 10:30 | Pre-Lenten Mini-Retreat | John Doe | john@email.com | 555-1234 | 123 Main St | Vegetarian | None | Looking forward to it! |

---

## 🎯 How It Organizes Data

The script automatically sorts data into tabs:

- **"Pre-Lenten"** tab → Pre-Lenten Mini-Retreat registrations
- **"Day of Prayer"** tab → Day of Prayer With Fr. Keane registrations
- **"Newsletter Signups"** tab → Homepage newsletter signups
- **"Contact Inquiries"** tab → Contact form submissions
- **Any new retreat** → Creates its own tab automatically!

---

## ➕ Adding New Retreats

When you add a new retreat to your website, the sheet will automatically create a new tab for it. Here's what you need to do:

### In `bookings.html`:
```javascript
{
    "id": "advent",
    "name": "Advent Preparation Retreat",
    "tag": "Day Retreat",
    "date": "December 3, 2026",
    "image": "https://images.unsplash.com/...",
    "description": "Prepare for Christmas...",
    "sheetName": "Advent Retreat"  ← This becomes the tab name
}
```

### In `retreat-signup.html`:
```javascript
const retreatInfo = {
    'silent': {...},
    'keane': {...},
    'advent': {  ← Add this
        name: 'Advent Preparation Retreat',
        sheetName: 'Advent Retreat'  ← Must match above
    }
};
```

**The tab will be created automatically** when the first person registers!

---

## 🔍 Troubleshooting

### "Script URL not found" error
- Make sure you deployed the script as a **Web app**
- Make sure you selected **"Anyone"** for "Who has access"
- Try re-deploying and copying the new URL

### Data not appearing in the sheet
1. Check browser console (F12) for errors
2. Verify the script URL in `script.js` is correct
3. Make sure you authorized the script
4. Try the `testScript()` function in Apps Script

### Tab not being created
- The tab is created on the **first submission**
- Check that `sheetName` is set in both `bookings.html` and `retreat-signup.html`
- Check Apps Script execution logs: **Executions** tab in Apps Script

### Wrong data appearing
- The field names in the form must match what the script expects:
  - `Name` (not firstName/lastName)
  - `email`
  - `phone`
  - `address`
  - `dietary`
  - `medical`
  - `notes`

### Need to see what went wrong?
1. In Apps Script, click **Executions** (clock icon on left)
2. Click on a recent execution
3. You'll see any error messages

---

## 🔄 Updating the Script Later

If you need to modify the script:

1. Make changes in Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the **Edit** icon (pencil) next to your deployment
4. **Version:** Select "New version"
5. Click **Deploy**
6. The URL stays the same - no need to update your website!

---

## 📊 Manual Setup (If Auto-Creation Fails)

If for some reason tabs aren't being created automatically, you can create them manually:

### Create a Tab:
1. Click **+** at bottom of Google Sheet
2. Name it exactly as specified in `sheetName` (e.g., "Pre-Lenten")

### Add Headers (Row 1):
```
Timestamp | Retreat Name | Name | Email | Phone | Address | Dietary Requirements | Medical Information | Additional Notes
```

**But** the script should do this automatically, so only do this if there's a problem!

---

## 💡 Pro Tips

1. **Don't delete or rename tabs** while people are registering - it could cause issues
2. **Keep the Google Sheet open** in a tab to see registrations come in real-time
3. **Sort/Filter data** as needed - the script only adds rows, it won't mess with your formatting
4. **Download backups** periodically: File → Download → CSV or Excel
5. **Set up email notifications**: Tools → Notification rules → "When a user submits a form"

---

## ✅ Checklist

Before going live, verify:

- [ ] Apps Script is deployed as Web app
- [ ] "Who has access" is set to "Anyone"
- [ ] Script URL is updated in `script.js`
- [ ] `script.js` is uploaded to your web server
- [ ] Both `bookings.html` and `retreat-signup.html` have matching retreat info
- [ ] Tested a form submission and saw data appear
- [ ] Tab was created automatically with correct headers

---

## 🎉 You're Done!

Your retreat registration system is now fully integrated with Google Sheets. Every registration will be automatically organized by retreat in its own tab with all the information you need!
