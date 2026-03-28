# 🌿 Shalom Retreat Centre - Complete Setup Guide

## ✅ Animation Fix Applied!

The flickering animation issue has been **completely fixed**. The problem was:
- CSS animations and JavaScript scroll animations were conflicting
- Elements were being animated twice, causing the disappear/reappear effect

**What was fixed:**
- Removed the JavaScript scroll observer that was interfering
- Simplified animations to use pure CSS
- All fade-in animations now work smoothly without flickering

---

## 📋 Easy Retreat Management System

### Quick Overview
You can now manage ALL your retreats by editing just **ONE simple file**: `retreats.json`

**No HTML knowledge needed!** Just edit a simple text file.

---

## 🎯 How to Add/Edit/Remove Retreats

### Step 1: Open `retreats.json`
Open the file in any text editor:
- **Windows:** Notepad, Notepad++, VS Code
- **Mac:** TextEdit, VS Code, Sublime Text
- **Online:** Any code editor

### Step 2: Understanding the Format

Each retreat looks like this:

```json
{
  "id": "silent",
  "name": "Silent Contemplation Retreat",
  "tag": "Weekend Retreat",
  "date": "March 14-16, 2026",
  "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "description": "Experience the profound peace of silence in nature.",
  "sheetName": "Silent Retreat"
}
```

**Field Explanations:**
- `id` - Unique identifier (no spaces, lowercase) - used in the URL
- `name` - The full retreat name displayed on cards
- `tag` - Badge text (e.g., "Weekend Retreat", "5-Day Retreat")
- `date` - When the retreat happens
- `image` - URL to an image (get free images from [Unsplash](https://unsplash.com))
- `description` - Brief description shown on the card
- `sheetName` - The tab name in your Google Sheet where registrations go

### Step 3: Adding a New Retreat

1. Copy an existing retreat block (from `{` to `},`)
2. Paste it at the end (before the final `]`)
3. Add a comma after the previous retreat
4. Update all the fields with your new retreat info

**Example:**
```json
[
  {
    "id": "silent",
    "name": "Silent Contemplation Retreat",
    ...
  },
  {
    "id": "advent",
    "name": "Advent Preparation Retreat",
    "tag": "Day Retreat",
    "date": "December 3, 2026",
    "image": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80",
    "description": "Prepare your heart for Christmas through prayer and reflection.",
    "sheetName": "Advent Retreat"
  }
]
```

### Step 4: Removing a Retreat

1. Find the retreat you want to remove
2. Delete the entire block (from `{` to `},`)
3. Make sure commas are correct (last item shouldn't have a comma)

### Step 5: Save and Upload

1. Save the `retreats.json` file
2. Upload it to your web server
3. Refresh your website - changes appear instantly!

---

## 📊 Google Sheets Integration

### How It Works

Your website is **already connected** to Google Sheets! Every form submission automatically goes to your spreadsheet:

**Current Script URL:** 
```
https://script.google.com/macros/s/AKfycbzMTzUntXwILEshQC1yCfrL_0h07oDUvFPJBVGoWK53LrcUM3KP3_3Sqj_CTnMh_ya9/exec
```

### Setting Up Different Tabs for Each Retreat

To organize registrations by retreat:

1. **Open your Google Sheet**
2. **Create a tab for each retreat** - the tab name should match the `sheetName` in `retreats.json`
   
   Example tabs:
   - "Silent Retreat"
   - "Renewal Retreat"  
   - "Healing Retreat"
   - "Nature Retreat"

3. **Add headers** in row 1:
   ```
   Timestamp | Retreat Name | First Name | Last Name | Email | Phone | Address | Accommodation | Dietary | Medical | Emergency Contact | Notes
   ```

### The Magic: Automatic Sorting

When someone registers:
1. They fill out the form on your website
2. The data is sent to Google Sheets
3. Google Sheets automatically puts the registration in the correct tab based on the retreat name
4. You get organized data for each retreat!

### Updating the Google Sheets Connection

If you need to create a new Google Sheets connection:

#### Option 1: Use Your Current Setup (Recommended)
Your forms are already working! Just make sure your Google Sheet has the tabs set up.

#### Option 2: Create a New Connection

1. **Create/Open Your Google Sheet**
   - Go to Google Sheets
   - Create a new spreadsheet or open your existing one

2. **Add Apps Script**
   - Click: Extensions → Apps Script
   - Delete any code in the editor
   - Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = e.parameter.sheetName || 'General';
    
    // Get or create the sheet
    var targetSheet = sheet.getSheetByName(sheetName);
    if (!targetSheet) {
      targetSheet = sheet.insertSheet(sheetName);
      // Add headers
      targetSheet.appendRow(['Timestamp', 'Retreat Name', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Accommodation', 'Dietary', 'Medical', 'Emergency Contact', 'Notes']);
    }
    
    // Prepare data
    var timestamp = new Date();
    var rowData = [
      timestamp,
      e.parameter.retreatName || e.parameter.subject || '',
      e.parameter.firstName || e.parameter.name || '',
      e.parameter.lastName || '',
      e.parameter.email || '',
      e.parameter.phone || '',
      e.parameter.address || '',
      e.parameter.accommodation || '',
      e.parameter.dietary || '',
      e.parameter.medical || '',
      e.parameter.emergency || '',
      e.parameter.notes || e.parameter.message || ''
    ];
    
    // Append data
    targetSheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy the Script**
   - Click: Deploy → New deployment
   - Click the gear icon → Select "Web app"
   - Settings:
     - Description: "Shalom Retreat Centre Forms"
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the Web App URL

4. **Update Your Website**
   - Open `script.js`
   - Find this line:
     ```javascript
     const scriptURL = 'YOUR_OLD_URL_HERE';
     ```
   - Replace with your new URL:
     ```javascript
     const scriptURL = 'https://script.google.com/macros/s/YOUR_NEW_URL/exec';
     ```
   - Save and upload

---

## 🎨 Free Images for Retreats

Get beautiful, free images from:

1. **[Unsplash](https://unsplash.com)** - High-quality, free images
   - Search for: "meditation", "nature", "prayer", "peaceful landscape"
   - Click image → Right-click → "Copy image address"
   - Paste URL into `image` field in `retreats.json`

2. **[Pexels](https://pexels.com)** - Another great free source

**Tips for images:**
- Use landscape/horizontal images (not vertical)
- Choose peaceful, nature-themed images
- Images should be at least 800px wide

---

## 📁 File Structure

Your website files should look like this:

```
your-website-folder/
├── index.html
├── bookings.html          ← Now loads from JSON
├── retreat-signup.html    ← Now loads from JSON
├── about.html
├── contact.html
├── styles.css             ← FIXED animations
├── script.js              ← FIXED no conflicts
├── retreats.json          ← EDIT THIS to manage retreats
└── Shalom_logo_transparent.png
```

---

## 🔧 Common Tasks

### Adding a Retreat
1. Edit `retreats.json`
2. Copy-paste a retreat block
3. Update the details
4. Save and upload

### Changing Retreat Details
1. Edit `retreats.json`
2. Find the retreat by its `id`
3. Update any field you want
4. Save and upload

### Removing a Retreat
1. Edit `retreats.json`
2. Delete the entire retreat block
3. Save and upload

### Viewing Registrations
1. Open your Google Sheet
2. Click the tab for the specific retreat
3. See all registrations sorted by retreat!

---

## ❓ Troubleshooting

### Retreats not showing up?
- Make sure `retreats.json` is in the same folder as `bookings.html`
- Check that the JSON syntax is correct (commas, brackets)
- Open browser console (F12) to see any errors

### Forms not submitting?
- Check that `script.js` has the correct Google Sheets URL
- Make sure the Google Apps Script is deployed properly
- Verify your Google Sheet is accessible

### Images not loading?
- Make sure image URLs are complete (start with `https://`)
- Test the image URL by pasting it in a browser
- Use Unsplash or Pexels for reliable hosting

---

## 🎉 Benefits of This System

✅ **No HTML editing needed** - just edit one simple JSON file
✅ **Automatic registration pages** - each retreat gets its own page
✅ **Organized Google Sheets** - separate tab for each retreat
✅ **Easy to maintain** - add/remove retreats in seconds
✅ **Professional look** - beautiful cards load dynamically
✅ **No animation flicker** - smooth, polished animations

---

## 💡 Pro Tips

1. **Keep `retreats.json` backed up** - this is your retreat database
2. **Use consistent naming** - helps keep things organized
3. **Test after changes** - always check the website after uploading
4. **Use a code editor** - Notepad++ or VS Code make editing easier
5. **Get images in advance** - find and save image URLs before editing

---

## 📞 Need Help?

If something isn't working:
1. Check that all files are uploaded to your server
2. Verify `retreats.json` syntax is correct (brackets, commas, quotes)
3. Open browser console (press F12) to see error messages
4. Make sure your Google Sheet tabs match the `sheetName` in JSON

---

**Version:** 2.0 - Fixed Animations + Easy JSON Management
**Last Updated:** February 2026
**Created for:** The Shalom Retreat Centre
