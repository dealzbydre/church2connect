# Church2Connect

A responsive web app for discovering and sharing church & community events.

## Setup

**Requirements:** Node.js 18+

```bash
# Install Node.js if needed (macOS)
brew install node
# or download from https://nodejs.org

# Install dependencies
cd church2connect
npm install

# Start development (runs both server + client)
npm run dev
```

- Client: http://localhost:3000
- Server API: http://localhost:5000

## Admin Login

```
Email:    admin@church2connect.com
Password: admin123
```

## User Roles

| Role | Access |
|------|--------|
| **Visitor** | Browse events, view church profiles |
| **Organizer** | Register church, submit events, dashboard |
| **Admin** | Approve/reject churches & events, manage users |

## Workflow

1. Organizer registers → creates church profile → submits for approval
2. Admin approves church
3. Organizer submits events → pending admin review
4. Admin approves events → appear publicly

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + SQLite (better-sqlite3)
- **Auth:** JWT + bcryptjs
- **Routing:** React Router v6

## Production Build

```bash
npm run build        # builds client into /dist
NODE_ENV=production node server/index.js   # serves everything on port 5000
```
