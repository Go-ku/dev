# ZamReal Manager

A minimalist, mobile-first workspace that helps Zambian property managers, landlords, maintenance teams and tenants coordinate rent, leases, reminders and service tickets. The app now runs on a stable Next.js 14 + React 18 stack with JavaScript-only source files that live inside the `src/` directory.

## Feature highlights
- **Role-aware navigation** – Admins and managers sign in via NextAuth credentials before accessing the dashboard. The navbar surfaces role context plus a quick logout action.
- **Payments & receivables** – Capture payments from the field, instantly issue receipts and watch arrears drop from the KPI tiles.
- **Invoices & reminders** – Fire SMS, email or WhatsApp notices with Zambia Kwacha currency formatting.
- **Lease intelligence** – TanStack Table powers live rent review radar plus upcoming increases in a glanceable card list.
- **Maintenance triage** – Accept tenant requests, enrich them with notes and prioritise the crew queue so emergencies float to the top.

## Project structure
```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.js   # NextAuth route handler
│   ├── dashboard/admin/page.js           # Protected admin dashboard
│   ├── login/page.js                     # Credential-based sign-in
│   ├── layout.js                         # Root layout & providers
│   └── page.js                           # Redirects to /login
├── components/
│   ├── auth/                             # Login + logout controls
│   ├── dashboard/                        # Admin dashboard surface
│   ├── layout/NavBar.js                  # Role-aware header
│   ├── providers.js                      # Session + Query providers
│   └── ui/                               # Minimalist UI primitives
├── lib/
│   ├── actions/auth.js                   # Mongo-backed auth actions
│   ├── auth.js                           # NextAuth configuration
│   ├── auth-utils.js                     # Role helpers
│   ├── mongodb.js                        # Connection helper
│   └── mockData.js + utils.js            # Demo data + helpers
├── models/User.js                        # Mongoose user schema
└── middleware.js                         # Protects /dashboard/*
```

## Demo credentials
Use either of the following accounts on the `/login` page:
- `admin@zamreal.co` / `admin123`
- `manager@zamreal.co` / `manager123`

## Local development
1. Install dependencies
   ```bash
   npm install
   ```
2. (Optional) provide a MongoDB connection string for real persistence
   ```bash
   export MONGODB_URI="mongodb+srv://<user>:<pass>@cluster/zamreal"
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 and sign in with the demo credentials above.

TanStack Query + Table currently read/write against `src/lib/mockData.js` to showcase the product experience without requiring a live API. Replace those helpers with real MongoDB-backed routes as you integrate the rest of your infrastructure.
