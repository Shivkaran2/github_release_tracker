# GitHub Release Tracker

A web app to track GitHub repositories and stay updated with their latest releases. Built with React, TypeScript, GraphQL, and PostgreSQL.

### 3. Environment Variables


```env for backend
# Server
PORT=4000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
JWT_SECRET=your_jwt_secret_min_32_chars
SYNC_INTERVAL_MS=600000
USE_MOCK_SERVER=false
WEBHOOK_SECRET=your_webhook_secret
```

```env for frontend
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

## What This Does

Ever find yourself checking multiple GitHub repos manually to see if there's a new release? This app does that for you. Just add the repos you care about, and it'll track their releases, show you what's new, and let you mark things as "seen" so you know what you've already checked out.

## Features

**Core Stuff:**
- Add GitHub repos by URL and track their releases
- See the latest release info (version, date, release notes)
- Mark releases as "seen" so you know what you've reviewed
- Visual badges for repos with unseen updates
- Manual refresh button to pull latest data
- Auto-syncs in the background every 10 minutes

**Bonus Features:**
- GitHub OAuth login - each user has their own tracked repos
- Filter and sort repos (by name, date, or update status)
- Works on mobile and desktop
- Webhook support for real-time updates (if you set it up)
- Mock mode for development without hitting GitHub API limits

## Tech Stack

**Frontend:** React 18 + TypeScript, Apollo Client for GraphQL, Vite  
**Backend:** Node.js + TypeScript, Apollo Server, Prisma ORM, Octokit for GitHub API  
**Database:** PostgreSQL (using Supabase)  
**Auth:** GitHub OAuth 2.0 with JWT tokens

## Project Structure

```
trackGithubRepo/
├── backend/          # GraphQL API server
│   ├── src/
│   │   ├── types/    # Type definitions
│   │   ├── services/ # Business logic
│   │   ├── resolvers/# GraphQL resolvers
│   │   └── ...
│   └── prisma/       # Database schema
├── frontend/         # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
└── package.json      # Workspace config
```

## Prerequisites

You'll need:
- Node.js (v18+) and npm
- A PostgreSQL database (I used Supabase, but local PostgreSQL works too)
- A GitHub account (for OAuth setup)

## Quick Start

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd trackGithubRepo
   npm install
   ```

2. **Set up environment variables:**
   - Create `backend/.env` file (see example format in section "3. Environment Variables" below)
   - **📖 For detailed step-by-step instructions on generating all secrets and tokens, see [GENERATE_TOKENS.md](./GENERATE_TOKENS.md)**
   - Fill in your credentials following the guide

3. **Set up the database:**
   ```bash
   cd backend
   npx prisma db push
   ```

4. **Start the app:**
   
   **Option 1: Run both together (recommended):**
   ```bash
   npm run dev
   ```
   This runs both backend and frontend in a single command from the root directory.
   
   **Option 2: Run separately:**
   ```bash
   # Terminal 1
   npm run backend:dev

   # Terminal 2
   npm run frontend:dev
   ```

5. **Open it up:**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## Setup Instructions

### Quick Overview

To set up the application, you'll need to generate several secrets and tokens. **For complete step-by-step instructions, see [GENERATE_TOKENS.md](./GENERATE_TOKENS.md)**.

### Required Environment Variables

You need to create a `backend/.env` file with the following variables:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (Supabase or local)
- `GITHUB_CLIENT_ID` - From GitHub OAuth app
- `GITHUB_CLIENT_SECRET` - From GitHub OAuth app  
- `JWT_SECRET` - Random string (minimum 32 characters)

**Optional:**
- `GITHUB_TOKEN` - Personal Access Token (for private repos or rate limits)
- `WEBHOOK_SECRET` - For GitHub webhooks (optional)
- `PORT` - Server port (default: 4000)
- `SYNC_INTERVAL_MS` - Sync frequency in milliseconds (default: 600000)
- `USE_MOCK_SERVER` - Use mock data (default: false)

### Where to Get Each Secret

1. **GitHub Personal Access Token** → https://github.com/settings/tokens
2. **GitHub OAuth App** → https://github.com/settings/developers
3. **Database URL** → Supabase (https://supabase.com) or Local PostgreSQL
4. **JWT Secret** → Generate using Node.js, OpenSSL, or online generator
5. **Webhook Secret** → Generate random string (optional)

**📖 Full instructions with screenshots and troubleshooting: [GENERATE_TOKENS.md](./GENERATE_TOKENS.md)**

### 4. Database Migration

**Important:** If you're using a new database or changed the DATABASE_URL, you need to create the tables:

```bash
cd backend
npx prisma db push
```

This creates all the tables (Repository, Release, User, etc.) and sets up relationships. If you skip this step, you'll get errors about missing tables.

### 5. Run It

Open two terminals:

**Terminal 1 - Backend:**
```bash
npm run backend:dev
```

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```

Then open http://localhost:5173 in your browser.

## Changing Database URL

If you switch databases or change your connection string:

1. Update `DATABASE_URL` in `backend/.env`
2. **Run migrations again** (this is important!):
   ```bash
   cd backend
   npx prisma db push
   ```
3. Restart the backend

The migration step is crucial - without it, the new database won't have the tables and you'll get errors.

## What's Implemented

**All core requirements:**
- ✅ React + TypeScript frontend
- ✅ GraphQL API with Apollo Server
- ✅ PostgreSQL database with Prisma
- ✅ GitHub API integration
- ✅ Add/track repositories
- ✅ View release information
- ✅ Mark releases as seen
- ✅ Visual indicators for new updates
- ✅ Manual refresh
- ✅ Auto-sync in background

**All MVP user stories:**
- ✅ Track repos with persistent storage
- ✅ Show latest release details
- ✅ Mark as seen functionality
- ✅ Visual distinction for unseen updates
- ✅ Manual data reload

**Most stretch goals:**
- ✅ Release notes display
- ✅ Filtering and sorting
- ✅ Mobile responsive design
- ✅ GitHub OAuth authentication
- ✅ Webhook support
- ✅ Mock server for development
- ❌ Desktop notifications (not done)

## Trade-offs and Decisions

**Why npm workspaces?**
Makes it easier to manage dependencies for both frontend and backend in one repo. Downside is you need to understand how workspaces work, but it's pretty straightforward.

**Why Prisma instead of raw SQL?**
Type safety and easier migrations. The downside is another layer of abstraction, but it's worth it for the developer experience.

**Why Apollo Client caching?**
Makes the app feel fast by caching queries. Sometimes you need to manually invalidate cache, but for this use case it works well.

**Why server-side OAuth?**
More secure - the client secret stays on the server. Trade-off is you need a backend running, but that's fine for this app.

**Why setInterval for sync?**
Simple and works. For production with lots of users, you'd want a proper job queue (like Bull or Agenda), but for now this is fine.

**Performance notes:**
- All repos load at once - works fine for small lists, but if someone tracks 100+ repos, pagination would help
- Filtering happens client-side - works great, but server-side would scale better
- Refreshes happen one at a time - could be parallelized but hasn't been an issue

**Security notes:**
- JWT tokens stored in localStorage - there's an XSS risk, but for an MVP it's acceptable. For production, consider httpOnly cookies
- Webhook verification is implemented but you need to set WEBHOOK_SECRET
- Database credentials in .env - make sure .env is in .gitignore (it should be)

## Future Improvements

If I had more time, here's what I'd add:

**High priority:**
1. Notifications - desktop or in-app alerts when new releases come out
2. Pagination - for users tracking lots of repos
3. Better error handling - more user-friendly error messages
4. Loading states - skeleton screens instead of just "Loading..."
5. Tests - unit tests for critical paths

**Medium priority:**
1. Job queue - replace setInterval with Bull or Agenda for better reliability
2. Rate limiting - protect the API from abuse
3. Redis caching - cache GitHub API responses to reduce API calls
4. Search - let users search their tracked repos
5. Export - download tracked repos as JSON/CSV

**Nice to have:**
1. Dark mode toggle
2. Repository groups/folders
3. Compare releases side-by-side
4. Email notifications
5. Analytics dashboard

## API Reference

The GraphQL endpoint is at `http://localhost:4000/graphql`. You can use the GraphQL Playground to explore the API.

**Main queries:**
- `repositories` - Get all repos for the current user
- `repository(owner, name)` - Get a specific repo
- `me` - Get current user info

**Main mutations:**
- `addRepository(url)` - Add a repo to track
- `markReleaseSeen(repositoryId, releaseId)` - Mark a release as seen
- `refreshRepositories` - Refresh all repos
- `deleteRepository(id)` - Remove a repo

**REST endpoints:**
- `GET /auth/github` - Start OAuth login
- `GET /auth/github/callback` - OAuth callback (handled automatically)
- `POST /webhook/github` - GitHub webhook endpoint

## Troubleshooting

**"Can't reach database server"**
- Check your DATABASE_URL is correct
- Make sure your database is running
- For Supabase, check your IP is allowed in the firewall settings

**OAuth not working / "redirect_uri mismatch"**
- Make sure the callback URL in your GitHub OAuth app is exactly: `http://localhost:4000/auth/github/callback`
- Check GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in `.env`
- Make sure the backend is running on port 4000

**"Table 'User' does not exist"**
- You need to run migrations: `cd backend && npx prisma db push`
- Check your DATABASE_URL is correct
- Make sure Prisma schema is up to date

**"Prisma Client did not initialize"**
- Run: `cd backend && npx prisma generate`
- Restart the backend server
- Make sure you ran `npm install`

**Port already in use**
- Change PORT in `backend/.env` to something else (like 5000)
- Or kill whatever's using port 4000

## License

This is a demo project. Feel free to use it however you want.

---

That's it! If you run into issues, check the troubleshooting section or open an issue on GitHub.
