# Complete Guide to Generate All Secrets and Tokens

This guide will walk you through generating **all** the required secrets and credentials for the GitHub Release Tracker application. Since we cannot commit `.env` files to git, you'll need to create your own `backend/.env` file with these values.

## Table of Contents

1. [Create the `.env` File](#step-1-create-the-env-file)
2. [Generate GitHub Personal Access Token](#step-2-generate-github-personal-access-token-github_token)
3. [Create GitHub OAuth App](#step-3-create-github-oauth-app-github_client_id--github_client_secret)
4. [Set Up Database](#step-4-set-up-database-database_url)
5. [Generate JWT Secret](#step-5-generate-jwt-secret-jwt_secret)
6. [Generate Webhook Secret](#step-6-generate-webhook-secret-webhook_secret-optional)
7. [Configure Other Variables](#step-7-configure-other-environment-variables)
8. [Frontend Environment Variables](#step-8-frontend-environment-variables)
9. [Complete Example](#complete-env-file-example)
10. [Security Notes](#important-security-notes)
11. [Troubleshooting](#troubleshooting)

---

## Step 1: Create the `.env` File

1. Navigate to the `backend` directory in your project
2. Create a new file named `.env` (no extension, starts with a dot)
3. Copy the structure from the README.md section "3. Environment Variables"
4. Replace all placeholder values with your actual credentials (follow steps below)

**File location:** `backend/.env`

---

## Step 2: Generate GitHub Personal Access Token (GITHUB_TOKEN)

**Purpose:** Allows the app to access GitHub API for fetching repository and release data. Required for accessing private repositories or to avoid rate limits.

### Steps:

1. **Go to GitHub Token Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - You may need to enter your password for security

3. **Configure Token**
   - **Note:** Give it a descriptive name (e.g., "GitHub Release Tracker")
   - **Expiration:** Choose based on your needs:
     - For development: "No expiration" (easier, but less secure)
     - For production: Set a specific expiration date
   - **Description:** (Optional) "For GitHub Release Tracker app"

4. **Select Scopes (Permissions)**
   - ✅ **`repo`** - Full control of private repositories
     - **Required if:** You want to track private repositories
     - **Includes:** Read/write access to code, issues, pull requests, etc.
   - ✅ **`public_repo`** - Access public repositories
     - **Required if:** You only need to track public repositories
     - **Note:** If you select `repo`, you don't need `public_repo` separately
   - ✅ **`read:org`** - Read org and team membership (optional)
     - **Required if:** You want to track repositories from organizations you belong to

5. **Generate and Copy**
   - Click **"Generate token"** at the bottom
   - **⚠️ CRITICAL:** Copy the token immediately (starts with `ghp_`)
   - **You won't be able to see it again!** If you lose it, you'll need to generate a new one.

6. **Add to `.env` File**
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

### Token Format:
- Starts with: `ghp_`
- Length: Usually 40+ characters
- Example: `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`

### Important Notes:
- If you lose the token, generate a new one and revoke the old one
- Tokens with `repo` scope have full access to your repositories - keep them secure
- For production, use tokens with limited scopes and expiration dates

---

## Step 3: Create GitHub OAuth App (GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET)

**Purpose:** Enables user authentication via GitHub OAuth. Allows users to log in with their GitHub accounts.

### Steps:

1. **Go to GitHub OAuth Apps**
   - Visit: https://github.com/settings/developers
   - Or: GitHub Profile → Settings → Developer settings → OAuth Apps

2. **Create New OAuth App**
   - Click **"New OAuth App"** (or "OAuth Apps" → "New OAuth App")

3. **Fill in Application Details**
   - **Application name:** `GitHub Release Tracker` (or any name you prefer)
   - **Homepage URL:** 
     - For development: `http://localhost:5173`
     - For production: Your production domain (e.g., `https://yourdomain.com`)
   - **Authorization callback URL:** 
     - For development: `http://localhost:4000/auth/github/callback`
     - For production: `https://yourdomain.com/auth/github/callback`
   - **Application description:** (Optional) "Track GitHub repository releases"

4. **Register Application**
   - Click **"Register application"**
   - You'll be redirected to the application page

5. **Get Client ID**
   - Your **Client ID** is displayed on the application page
   - Copy it immediately (it's a public identifier, safe to share)

6. **Generate Client Secret**
   - Click **"Generate a new client secret"**
   - **⚠️ CRITICAL:** Copy the client secret immediately
   - **You won't be able to see it again!** If you lose it, generate a new one.

7. **Add to `.env` File**
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

### Format:
- **Client ID:** Usually starts with `Ov` followed by alphanumeric characters
- **Client Secret:** Long hexadecimal string (40+ characters)

### For Production:
- Update the Homepage URL and Callback URL to your production domain
- You may need separate OAuth apps for development and production

---

## Step 4: Set Up Database (DATABASE_URL)

You have two options for the database: Supabase (cloud, easier) or Local PostgreSQL.

### Option A: Supabase (Recommended for Quick Setup)

**Why Supabase?** Free tier, easy setup, cloud-hosted, no local installation needed.

#### Steps:

1. **Sign Up**
   - Go to https://supabase.com
   - Click "Start your project" or "Sign up"
   - Sign up with GitHub (easiest) or email
   - Free tier works perfectly for this project

2. **Create New Project**
   - Click **"New Project"**
   - Fill in:
     - **Name:** Your project name (e.g., "github-release-tracker")
     - **Database Password:** 
       - Create a **strong password** (save it securely!)
       - You'll need this to connect to the database
       - Minimum 12 characters recommended
     - **Region:** Choose the region closest to you for better performance
     - **Pricing Plan:** Free tier is sufficient

3. **Wait for Project Creation**
   - Takes 1-2 minutes
   - You'll see a loading screen

4. **Get Connection String**
   - Once project is ready, go to **Project Settings** (gear icon in sidebar)
   - Click **"Database"** in the left menu
   - Scroll to **"Connection string"** section
   - Select **"URI"** tab (not "JDBC" or "Connection pooling")
   - You'll see a connection string like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - Or the direct connection:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

5. **Replace Password Placeholder**
   - The connection string will have `[YOUR-PASSWORD]` placeholder
   - Replace it with the password you created in step 2
   - **Example:**
     ```
     postgresql://postgres:MyStrongPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```

6. **Add to `.env` File**
   ```
   DATABASE_URL=postgresql://postgres:your_password@db.project_ref.supabase.co:5432/postgres
   ```

### Option B: Local PostgreSQL

**Why Local?** Full control, no internet required, good for development.

#### Steps:

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Choose your operating system
   - During installation:
     - Remember the password you set for the `postgres` user
     - Default port is `5432` (keep it unless you have conflicts)
     - Install pgAdmin (optional, but helpful GUI tool)

2. **Create Database**
   - Open **pgAdmin** (GUI) or **psql** (command line)
   - **Using pgAdmin:**
     - Connect to your PostgreSQL server
     - Right-click "Databases" → "Create" → "Database"
     - Name: `github_tracker`
     - Click "Save"
   - **Using psql:**
     ```sql
     CREATE DATABASE github_tracker;
     ```

3. **Build Connection String**
   - Format: `postgresql://username:password@host:port/database`
   - **Example:**
     ```
     postgresql://postgres:your_password@localhost:5432/github_tracker
     ```
   - Replace:
     - `your_password` with your PostgreSQL password
     - `localhost` with your host (if remote)
     - `5432` with your port (if different)
     - `github_tracker` with your database name

4. **Add to `.env` File**
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/github_tracker
   ```

---

## Step 5: Generate JWT Secret (JWT_SECRET)

**Purpose:** Used to sign and verify JWT (JSON Web Token) authentication tokens. This ensures tokens haven't been tampered with.

**Requirements:** Minimum 32 characters recommended for security.

### Method 1: Using Node.js (Recommended)

If you have Node.js installed:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This generates a 64-character hexadecimal string (32 bytes = 64 hex characters).

### Method 2: Using OpenSSL

If you have OpenSSL installed:

```bash
openssl rand -hex 32
```

This also generates a 64-character hexadecimal string.

### Method 3: Using PowerShell (Windows)

```powershell
-join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})
```

### Method 4: Online Generator

1. Visit: https://randomkeygen.com/
2. Select **"CodeIgniter Encryption Keys"** section
3. Copy any of the generated keys (they're 32+ characters)
4. Or use: https://www.lastpass.com/features/password-generator
   - Set length to 32+
   - Include numbers and letters

### Method 5: Manual Generation

You can create a random string manually, but ensure it's:
- At least 32 characters long
- Contains a mix of letters, numbers, and special characters
- Is random and unpredictable

**Example:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

### Add to `.env` File

```
JWT_SECRET=your_generated_secret_here
```

---

## Step 6: Generate Webhook Secret (WEBHOOK_SECRET) - Optional

**Purpose:** Used to verify GitHub webhook requests. Only needed if you want to set up GitHub webhooks for real-time updates when repositories have new releases.

**Note:** This is **optional**. The app works without webhooks - it just polls for updates periodically.

### Steps:

1. **Generate Random String**
   - Use the same methods as JWT_SECRET (Step 5)
   - Can be shorter (16-32 characters is fine)
   - Should be random and unpredictable

2. **Add to `.env` File**
   ```
   WEBHOOK_SECRET=your_webhook_secret_here
   ```

### Setting Up Webhooks (Advanced)

If you want to use webhooks:

1. Go to your GitHub repository settings
2. Navigate to "Webhooks"
3. Add a new webhook
4. Set Payload URL to: `http://your-domain.com/webhook/github`
5. Set Content type to: `application/json`
6. Set Secret to: The same value as `WEBHOOK_SECRET` in your `.env`
7. Select events: "Releases"
8. Save the webhook

---

## Step 7: Configure Other Environment Variables

These are standard configuration values. Add them to your `.env` file:

```env
# Server port (default: 4000)
# Change if port 4000 is already in use
PORT=4000

# Background sync interval in milliseconds
# 600000 = 10 minutes
# 300000 = 5 minutes
# 3600000 = 1 hour
SYNC_INTERVAL_MS=600000

# Use mock server for development
# false = use real GitHub API
# true = use mock data (for testing without API calls)
USE_MOCK_SERVER=false
```

### Explanation:

- **PORT:** The port your backend server will run on. Default is 4000.
- **SYNC_INTERVAL_MS:** How often the app checks for new releases (in milliseconds). 600000 = 10 minutes.
- **USE_MOCK_SERVER:** Set to `true` for testing without hitting GitHub API limits. Set to `false` for production.

---

## Step 8: Frontend Environment Variables

Create a `frontend/.env` file (if it doesn't exist):

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

### For Production:

Update this to your production GraphQL endpoint:
```env
VITE_GRAPHQL_URL=https://api.yourdomain.com/graphql
```

---

## Complete `.env` File Example

After completing all steps, your `backend/.env` should look like this:

```env
# Server Configuration
PORT=4000

# Database Connection
DATABASE_URL=postgresql://postgres:your_password@db.project_ref.supabase.co:5432/postgres

# GitHub Personal Access Token
GITHUB_TOKEN=ghp_your_personal_access_token_here

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret

# JWT Secret (minimum 32 characters)
JWT_SECRET=your_64_character_jwt_secret_here

# Background Sync (10 minutes = 600000 milliseconds)
SYNC_INTERVAL_MS=600000

# Development Mode
USE_MOCK_SERVER=false

# Webhook Secret (optional)
WEBHOOK_SECRET=your_webhook_secret_here
```

---

## Important Security Notes

### ⚠️ Never Commit `.env` Files to Git!

- The `.env` file is already in `.gitignore` - it won't be committed automatically
- **Double-check** that `.env` is in `.gitignore` before committing
- Never share your `.env` file publicly
- Use placeholders in documentation (like this file)

### Best Practices:

1. **Different Secrets for Different Environments**
   - Use different tokens/secrets for development and production
   - Never use production secrets in development

2. **Rotate Secrets Regularly**
   - If a secret is accidentally exposed, rotate it immediately
   - GitHub tokens can be revoked and regenerated
   - OAuth client secrets can be regenerated
   - JWT secrets: Change and force all users to re-authenticate

3. **Limit Token Scopes**
   - Only grant the minimum permissions needed
   - For production, use tokens with limited scopes

4. **Use Environment-Specific Files**
   - `.env.development` for development
   - `.env.production` for production
   - Never commit either to git

5. **Backup Your Secrets Securely**
   - Store them in a password manager
   - Don't store them in plain text files (except `.env` which is gitignored)
   - Share with team members via secure channels

---

## Troubleshooting

### "Bad credentials" Error

**Problem:** GitHub API returns "Bad credentials" error.

**Solutions:**
- ✅ Check if your `GITHUB_TOKEN` is valid and not expired
- ✅ Verify the token has the correct scopes (`repo` for private repos)
- ✅ Make sure there are no extra spaces in your `.env` file
- ✅ Generate a new token if the old one is expired
- ✅ Check token format: Should start with `ghp_`

### "Repository not found" for Private Repositories

**Problem:** Can't access private repositories even though they exist.

**Solutions:**
- ✅ Ensure your `GITHUB_TOKEN` has the `repo` scope (not just `public_repo`)
- ✅ Verify you have access to the private repository
- ✅ Check if the repository owner has granted you access
- ✅ Try accessing the repository directly via GitHub API to test token

### Database Connection Errors

**Problem:** Can't connect to the database.

**Solutions:**
- ✅ Check your `DATABASE_URL` is correct (no typos)
- ✅ Verify database password is correct
- ✅ For Supabase:
  - Check your IP is allowed in firewall settings
  - Ensure project is not paused (free tier pauses after inactivity)
  - Verify connection string format
- ✅ For Local PostgreSQL:
  - Ensure PostgreSQL service is running
  - Check if port 5432 is correct
  - Verify database name exists
  - Check if password is correct

### OAuth Authentication Not Working

**Problem:** Users can't log in with GitHub.

**Solutions:**
- ✅ Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- ✅ Check OAuth callback URL matches exactly: `http://localhost:4000/auth/github/callback`
- ✅ Ensure backend server is running on port 4000
- ✅ Check browser console for errors
- ✅ Verify OAuth app is not deleted or disabled on GitHub

### "Table 'User' does not exist" Error

**Problem:** Database tables are missing.

**Solutions:**
- ✅ Run database migrations: `cd backend && npx prisma db push`
- ✅ Check your `DATABASE_URL` is correct
- ✅ Verify Prisma schema is up to date
- ✅ Ensure you're connected to the correct database

### Token Expired

**Problem:** GitHub token stopped working.

**Solutions:**
- ✅ Check token expiration date in GitHub settings
- ✅ Generate a new token with longer expiration
- ✅ Update `GITHUB_TOKEN` in your `.env` file
- ✅ Restart your backend server

---

## Quick Reference

### Required Variables:
- ✅ `DATABASE_URL` - Database connection string
- ✅ `GITHUB_CLIENT_ID` - OAuth app client ID
- ✅ `GITHUB_CLIENT_SECRET` - OAuth app client secret
- ✅ `JWT_SECRET` - JWT signing secret (32+ chars)

### Optional Variables:
- ⚪ `GITHUB_TOKEN` - For private repos or rate limit avoidance
- ⚪ `WEBHOOK_SECRET` - For GitHub webhooks
- ⚪ `PORT` - Server port (default: 4000)
- ⚪ `SYNC_INTERVAL_MS` - Sync frequency (default: 600000)
- ⚪ `USE_MOCK_SERVER` - Use mock data (default: false)

---

## Need Help?

If you're stuck:
1. Check the troubleshooting section above
2. Review the main README.md for general setup
3. Check GitHub issues for similar problems
4. Verify all environment variables are set correctly
5. Ensure all services (database, backend) are running

---

**Last Updated:** 2025
**Version:** 1.0

