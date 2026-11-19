# Axion Creatives (Next.js)

Light-theme company site with an admin panel, client portal, demo-project manager and click analytics.

## Pages
- `/` public site. "Our work" is loaded from the database.
- `/admin` admin panel. The sign-in lives only in memory, so **every reload asks for the password again**.
- `/client` client login. No sign up: you create client logins in the admin panel.

## Setup
1. Create a Firebase project. Enable **Authentication > Email/Password** and **Firestore** (production mode).
2. In Authentication > Users, add **your admin account** (email + password).
3. Project settings > Service accounts > **Generate new private key**.
4. `cp .env.example .env.local` and fill it in. Set `ADMIN_EMAIL` to the admin account's email.
5. Paste `firestore.rules` into Firestore > Rules (blocks direct browser access; everything goes through the server).
6. `npm install` then `npm run dev`, open http://localhost:3000/admin.

## Using it
- **Demo projects**: add or delete cards shown on the home page. The Overview tab shows clicks per demo.
- **Overview**: page views, unique visitors, demo clicks and recent activity.
- **Clients**: create a login (name, email, password) and share it with the client.
- **Client projects**: assign a project to a client and set status (planning, design, development, testing, completed) and progress.
- **Messages**: when a project is marked completed, the client sees a "Request service" box. Their message lands here.

## Deploy
Vercel works well. Add the same variables from `.env.local` in the project settings.
For `FIREBASE_PRIVATE_KEY`, paste the key with its `\n` sequences intact.
