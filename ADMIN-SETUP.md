# 🔐 Shalom Admin Panel — Setup Instructions

## What You're Getting

Three files to add to your GitHub repository:

| File | What it does |
|------|-------------|
| `retreat-manager.html` | The hidden admin panel — your new control centre |
| `retreats.json` | Stores all retreat data (replaces the hardcoded array in script.js) |
| `script.js` | Updated version that reads from retreats.json |

---

## Step 1 — Upload the Files to GitHub

1. Go to your GitHub repository: `github.com/shalomretreatcentre2025/shalomretreatcentre2025.github.io`
2. Upload all three files, replacing the existing `script.js`
3. Wait ~60 seconds for GitHub Pages to rebuild

---

## Step 2 — Create a GitHub Personal Access Token

The admin panel needs permission to update your files. Here's how to create a token:

1. Go to **GitHub.com** → click your profile photo (top right) → **Settings**
2. Scroll all the way down the left sidebar → **Developer settings**
3. Click **Personal access tokens** → **Fine-grained tokens**
4. Click **Generate new token**
5. Fill in:
   - **Token name:** Shalom CMS
   - **Expiration:** 1 year (or No expiration)
   - **Repository access:** Only select repositories → choose your site repo
   - **Permissions:** Under "Repository permissions" → find **Contents** → set to **Read and Write**
6. Click **Generate token**
7. **⚠️ Copy the token immediately** — you won't see it again!
   It will look like: `github_pat_xxxxxxxxxxxxxxxxxxxx`

---

## Step 3 — Run First-Time Setup

1. Visit: **`https://www.shalomretreatcentre.ie/retreat-manager.html`**
   *(This page has a noindex tag so Google will never find it)*

2. You'll see the Setup Wizard. Fill in:
   - **GitHub Token:** Paste the token you just copied
   - **GitHub Username:** `shalomretreatcentre2025`
   - **Repository Name:** `shalomretreatcentre2025.github.io`
   - **Branch:** `main`

3. Click **Connect Repository →**

4. Set your admin password (8+ characters, make it strong!)

5. Confirm the **Site Base URL:** `https://www.shalomretreatcentre.ie`

6. Click **Complete Setup ✓**

---

## Step 4 — Log In and Manage Retreats

Visit the admin panel URL any time:
> `https://www.shalomretreatcentre.ie/retreat-manager.html`

Log in with your password. Then you can:

- **Add retreats** — click "Add Retreat", fill in the form
- **Edit retreats** — click "Edit" on any retreat card
- **Reorder** — drag the ⠿ handle on the left to change order
- **Delete** — click "Remove" on any retreat
- **Upload photos** — switch to the "Upload & Crop" tab in the image section
- **Publish changes** — click the green **"Save & Publish"** button

Changes appear on your website within ~60 seconds of saving.

---

## Security Notes

- The URL is not linked from anywhere on the site and has a "noindex" tag, so Google won't find it
- Your GitHub token is stored only in your browser (localStorage) — never in any file on the server
- The password is stored as a one-way SHA-256 hash in `admin-config.json` on GitHub
- **Keep the admin URL private** — share it only with people who need access

---

## Troubleshooting

**"Could not reach the repository"**
→ Double-check the token was copied correctly, and that it has "Contents: Read & Write" permission.

**"Could not load admin config"**
→ The first-time setup may not have completed. Click "Change GitHub settings / reconnect" and redo setup.

**Changes not appearing on the website**
→ GitHub Pages can take 1–2 minutes to rebuild. Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R).

**"Image upload failed"**
→ Check your GitHub token is still valid (tokens expire if you set an expiry date).

**Forgot your password**
→ You can reset it: on GitHub, edit `admin-config.json` directly and delete the `passwordHash` line. Then redo Step 3.
