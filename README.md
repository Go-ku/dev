# ZamReal Manager

A minimalist, mobile-first real estate cockpit tailored for Zambian property managers, landlords, maintenance teams and tenants. Built with Next.js 15, Tailwind CSS, shadcn-inspired components, TanStack Query and React Table. All data is mocked in-memory to demonstrate the product experience without a live backend.

## Key capabilities
- **Role visibility** – system admin view with notes on landlord, manager, tenant and maintenance permissions.
- **Payment logging** – capture rent payments, select channels (cash, bank transfer, mobile money) and issue receipts instantly.
- **Invoices & reminders** – trigger SMS, email or WhatsApp nudges with due dates, supporting Zambia Kwacha currency formatting.
- **Lease radar** – table of active leases plus an upcoming rent increase tracker that surfaces contracts due for review.
- **Maintenance triage** – log tenant service requests, prioritise and share queue with maintenance crew.
- **Receivables overview** – toggle between pending reminders and most recent payments.

## Tech stack
- Next.js 15 (App Router, server/client components)
- React 18.3
- Tailwind CSS + shadcn-inspired primitives
- TanStack Query for data orchestration
- TanStack Table for lease grids
- date-fns for regional-friendly date formatting

## Local development
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the dev server
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000.

> **Note:** In this exercise, the backend is represented by `/lib/mockData.ts`. Replace those helpers with real MongoDB-backed APIs when wiring up production infrastructure.
