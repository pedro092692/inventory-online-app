# Nexastock

Nexastock is a web app for small and medium businesses in Venezuela to manage inventory, sales, and customers from one place. It's built as a POS (point of sale) + inventory management system with native support for the dual-currency reality of the local market (USD and Bolívar Digital), plus a WhatsApp-based purchase-order flow so customers can send in orders without needing an account.

The project also has a public landing page used to present the product to prospective business owners. Nexastock is sold cold/in-person (by the founder and other salespeople reaching out directly to businesses) — there is no self-service signup or online payment flow, so the landing page's calls to action point to WhatsApp instead of a signup form.

## What it does

- **Products**: catalog with dual pricing — purchase price and selling price in USD, plus an automatically calculated reference price in Bolívares based on the current exchange rate.
- **Sell (POS)**: a cart-based selling flow that supports splitting a single sale across multiple payment methods and currencies, with prices revalidated on the backend at the moment of sale.
- **Customers**: customer records with purchase history.
- **Invoices**: full invoice lifecycle (paid/unpaid), partial payments, overpayment handling, and a WhatsApp share link plus downloadable PDF comprobante for every invoice.
- **Payment methods & exchange rate**: configurable payment methods per currency (e.g. "Bolívar Digital", "Dólares") and a running record of the USD/Bolívar exchange rate used to keep reference prices current.
- **Sellers**: seller/cashier accounts with role-based actions (e.g. supervisor PIN authorization for sensitive actions) and per-seller sales tracking.
- **Reports & analytics**: dashboards and endpoints for top customers, best/worst-selling products, sales trends by day/hour, cash register closing per seller, and payment-method breakdowns (USD vs. Bolívar).
- **WhatsApp orders**: customers can put together an order, send it in, and get back a calculated total — no account needed.
- **Public landing page**: marketing site explaining the product, with WhatsApp as the only call to action (no self-serve signup/checkout).

## Project structure

This is an npm workspaces monorepo with two packages:

```
packages/
  backend/                      Express + Sequelize REST API
  frontend/inventory-online-app/  Next.js app (public site + authenticated dashboard)
```

### Backend (`packages/backend`)

REST API built with Express 5 and Sequelize 6 over PostgreSQL.

- `src/Controllers`, `src/routes`, `src/services`, `src/models` — layered by resource (Customers, Products, Sellers, Payment Methods, Dollar Value, Invoices, Pay-Invoice, Reports, security/auth).
- `src/migrations`, `src/seeders` — schema migrations (Umzug) and seed data (Faker).
- `src/middlewares`, `src/errors`, `src/validators` — auth checks, centralized error handling, request validation.
- Auth via JWT + cookies (`jsonwebtoken`, `cookie-parser`, `bcrypt`).
- File storage via AWS S3 (`@aws-sdk/client-s3`), spreadsheet import/export via `xlsx`.

For the full REST API reference (every endpoint and example payloads), see [`packages/backend/readme.md`](packages/backend/readme.md).

### Frontend (`packages/frontend/inventory-online-app`)

Next.js 15 (App Router) + React 19 app with two route groups:

- `app/(home)` — the public landing page (no auth required).
- `app/(store)/store` — the authenticated dashboard: `sell` (POS/cart), `bills` (invoices), `customers`, `payment-methods`, `reports`.

`middleware.ts` protects `/store` (and `/admin`) routes, verifying the auth session before granting access.

Styling is plain CSS Modules (one `page.module.css` per component folder) plus a small set of shared design tokens and typography classes in `app/globals.css`. Charts are built with Recharts, PDFs (invoice comprobantes) with `html2pdf.js`, and API calls go through Axios.

## Tech stack

| | |
|---|---|
| Backend | Node.js, Express 5, Sequelize 6, PostgreSQL, JWT auth, AWS S3, Umzug migrations |
| Frontend | Next.js 15, React 19, CSS Modules, Axios, Recharts, html2pdf.js |
| Tooling | npm workspaces, ESLint, nodemon, concurrently |

## Running locally

From the repository root:

```bash
npm install
```

Set up environment variables for each package (`packages/backend/.env` and `packages/frontend/inventory-online-app/.env.local`) — database connection, JWT secret, API base URL, AWS credentials, and WhatsApp contact number, as applicable.

Then, from the root `package.json`:

```bash
npm run dev:backend   # starts the API (nodemon)
npm run dev:frontend  # starts the Next.js app
npm run dev:all       # starts both at once (concurrently)
```

## More documentation

- Backend REST API reference: [`packages/backend/readme.md`](packages/backend/readme.md)
