# 🎯 QUICK REFERENCE: Managing Retreats

## ⚡ The Fastest Way to Update Retreats

**EDIT THIS ONE FILE:** `retreats.json`

---

## 📝 Retreat Template

Copy this and fill in your details:

```json
{
  "id": "your-retreat-id-here",
  "name": "Your Retreat Name Here",
  "tag": "Weekend Retreat",
  "date": "Month Day-Day, Year",
  "image": "https://images.unsplash.com/YOUR-IMAGE-URL",
  "description": "Brief description of what happens in this retreat.",
  "sheetName": "Your Retreat"
}
```

---

## 🔤 Field Guide

| Field | What It Does | Example | Tips |
|-------|-------------|---------|------|
| **id** | URL identifier | `"silent"` | No spaces, lowercase, unique |
| **name** | Card title | `"Silent Retreat"` | Full retreat name |
| **tag** | Badge label | `"Weekend Retreat"` | Keep it short |
| **date** | When it happens | `"March 14-16, 2026"` | Any format you want |
| **image** | Picture URL | `"https://images.unsplash.com/..."` | From Unsplash |
| **description** | Card text | `"Three days of silence..."` | 1-2 sentences |
| **sheetName** | Google Sheet tab | `"Silent Retreat"` | Must match tab name exactly |

---

## ➕ Add a Retreat (3 Steps)

1. **Copy** an existing retreat (everything from `{` to `}`)
2. **Paste** it before the final `]`
3. **Edit** the details

**Don't forget the comma!** `,` between retreats

---

## ➖ Remove a Retreat (2 Steps)

1. **Delete** the entire block (`{` to `}`)
2. **Check commas** - last item has NO comma

---

## 🖼️ Finding Images

**[Unsplash.com](https://unsplash.com)**
1. Search: "meditation" or "nature" or "peaceful"
2. Click image
3. Right-click → "Copy image address"
4. Paste into `image` field

**Good search terms:**
- meditation
- peaceful landscape
- nature sunset
- mountain lake
- forest path
- prayer hands

---

## ✅ Before You Save

**Checklist:**
- [ ] All fields have quotes `"like this"`
- [ ] Commas between retreats (but not after last one)
- [ ] Brackets match: `{` has `}`, `[` has `]`
- [ ] Image URL starts with `https://`
- [ ] ID has no spaces

---

## 🎯 Google Sheets Setup

**Create tabs in your Google Sheet with these EXACT names:**

Match the `sheetName` in your JSON:
- Silent Retreat
- Renewal Retreat
- Healing Retreat
- (whatever you put in `sheetName`)

**Headers for each tab (Row 1):**
```
Timestamp | Retreat Name | First Name | Last Name | Email | Phone | Address | Accommodation | Dietary | Medical | Emergency Contact | Notes
```

---

## 💾 How to Upload

1. Save `retreats.json`
2. Upload to your web server (same folder as your HTML files)
3. Refresh your website!

**Changes appear instantly - no need to edit HTML!**

---

## 🚨 Common Mistakes

❌ **Missing comma between retreats**
```json
{...}  ← needs comma here!
{...}
```

❌ **Extra comma after last retreat**
```json
{...},
{...},  ← remove this comma!
]
```

❌ **Forgetting quotes**
```json
"name": Your Retreat  ← WRONG
"name": "Your Retreat"  ← CORRECT
```

---

## 📞 File Locations

```
your-website/
├── retreats.json         ← EDIT THIS FILE
├── bookings.html         ← Don't edit (loads from JSON)
├── retreat-signup.html   ← Don't edit (loads from JSON)
└── (other files)
```

**You only need to edit `retreats.json`!**

---

## 💡 Pro Tips

✨ **Test your JSON:** Use [JSONLint.com](https://jsonlint.com) to check for errors
✨ **Keep a backup:** Save a copy of `retreats.json` before making changes
✨ **Use a code editor:** Notepad++ or VS Code highlight syntax errors
✨ **Consistent IDs:** Use simple names like `silent`, `advent`, `lent`

---

**That's it!** Managing retreats is now as easy as editing a text file. No coding knowledge needed! 🎉
