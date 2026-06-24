<div align="center">

## 🚀 DealDrop — AI-Powered Product Price Tracker

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3FCF8E?logo=supabase&logoColor=white) ![Firecrawl](https://img.shields.io/badge/Firecrawl-AI%20Web%20Scraping-FA5D19) ![Resend](https://img.shields.io/badge/Resend-Transactional%20Email-000000?logo=resend&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix%20Primitives-18181B) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

</div>

## 📌 Overview

**DealDrop** is a full-stack price-intelligence platform built on the **Next.js 16 App Router**. Users paste a product URL from virtually any online store, and DealDrop uses **AI-powered structured web scraping** to extract the product's name, price, currency, and image — no per-site scraper required. A scheduled background job then re-checks every tracked product, logs price movement over time, and **proactively emails users the moment a price drops**.

The project intentionally avoids a traditional client-fetch + REST API + global-store stack. Data flows through **React Server Components** and **Server Actions**, authentication state is synchronized via Next.js 16's new **Proxy** network boundary, and all third-party integrations (Supabase, Firecrawl, Resend, Google OAuth) are isolated behind a clean `lib/` integration layer.

## 🎯 Problem Statement

E-commerce prices fluctuate constantly, making it difficult for users to:

- Identify genuine discounts
- Track historical pricing behavior
- Monitor expensive products efficiently
- Receive alerts at the right time
- Avoid manually checking pricing repeatedly

DealDrop solves this problem through an automated monitoring pipeline powered by AI-based product extraction and scheduled price intelligence workflows.

## ✨ Key Features

### 🔍 AI-Powered Product Tracking

- Track products via direct product URLs
- Structured product extraction using Firecrawl
- Automatic metadata parsing
- Smart product normalization

### 📈 Historical Price Analytics

- Persistent price history storage
- Interactive trend visualization
- Time-series product analytics
- Historical price comparison support

### 🔔 Automated Price Drop Notifications

- Real-time email alerts
- Percentage drop calculations
- Rich HTML transactional emails
- Automated cron-based monitoring

### 🔐 Secure Authentication

- Google OAuth authentication
- Session-based user management
- Secure auth callback flow
- Protected product ownership

### ⚡ Modern UX Experience

- Fully responsive UI
- Toast-based user feedback
- Mobile-first interface
- Optimized loading states

## 🧠 Real-World Use Cases

| Persona                       | How DealDrop helps                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Bargain hunters**           | Track electronics, fashion, or appliances across unrelated retailers from one dashboard instead of juggling site-specific extensions. |
| **Gift shoppers**             | Add a wishlist item early and get notified only when it's actually worth buying.                                                      |
| **Budget-conscious buyers**   | Replace manual "check the price every few days" habits with automated, passive monitoring.                                            |
| **Resellers / small sellers** | Keep an eye on supplier or competitor pricing without building internal tooling.                                                      |

## 🏗️ Tech Stack

| Category               | Technology                         |
| ---------------------- | ---------------------------------- |
| ⚡ **Framework**       | Next.js 16 (App Router)            |
| ⚛️ **UI Library**      | React 19                           |
| 🎨 **Styling**         | Tailwind CSS v4                    |
| 🧩 **Components**      | shadcn/ui + Radix UI               |
| 🗄️ **Database & Auth** | Supabase (Postgres + Google OAuth) |
| 🕷️ **Web Scraping**    | Firecrawl (AI-powered extraction)  |
| 📧 **Email**           | Resend                             |
| 📊 **Charts**          | Recharts                           |
| 🔔 **Notifications**   | Sonner                             |
| 🖼️ **Icons**           | Lucide React                       |
| ☁️ **Deployment**      | Vercel                             |

## 📂 Folder Structure

```
dealdrop/
├── actions/
│   ├── auth.actions.js          # Sign-in / sign-out
│   └── product.actions.js       # Add, delete & fetch products + price history
├── app/
│   ├── api/cron/                # Scheduled price-check endpoint
│   ├── auth/callback/           # Google OAuth callback handler
│   ├── error/                   # Auth error fallback page
│   ├── layout.js                # Root layout & global providers
│   └── page.js                  # Landing page + dashboard
├── components/
│   ├── ui/                      # Shadcn/UI primitives (Button, Card, Dialog...)
│   ├── AddProductForm.js        # Product URL submission form
│   ├── AuthModal.js             # Google sign-in dialog
│   ├── ProductCard.js           # Tracked product card
│   └── PriceChart.js            # Price history chart (Recharts)
├── lib/
│   ├── supabase/                # Browser, server & proxy Supabase clients
│   ├── firecrawl.js             # AI-powered product scraping
│   ├── email.js                 # Price-drop email template (Resend)
│   └── utils.js                 # Shared helper functions
├── public/
│   └── dealdrop-logo.png
├── proxy.js                     # Refreshes auth session on every request
└── package.json
```

## 🗄️ Database Schema

DealDrop uses two main tables in Supabase (PostgreSQL).

#### `products`

Stores each product a user is tracking.

| Field             | Type      | Description                                |
| ----------------- | --------- | ------------------------------------------ |
| **id**            | uuid      | Primary key                                |
| **user_id**       | uuid      | Owner of the product (linked to auth user) |
| **product_url**   | text      | URL of the tracked product                 |
| **product_name**  | text      | Scraped product name                       |
| **current_price** | numeric   | Latest known price                         |
| **currency**      | text      | Currency code (USD, INR, etc.)             |
| **image_url**     | text      | Product image URL                          |
| **created_at**    | timestamp | When tracking started                      |
| **updated_at**    | timestamp | Last price update                          |

#### `price_history`

Stores a price snapshot every time the price changes.

| Field          | Type      | Description                  |
| -------------- | --------- | ---------------------------- |
| **id**         | uuid      | Primary key                  |
| **product_id** | uuid      | Linked product (foreign key) |
| **price**      | numeric   | Price at this point in time  |
| **currency**   | text      | Currency code                |
| **checked_at** | timestamp | When this price was recorded |

## 🔌 API Reference

### Server Actions (`actions/`)

| Action                       | Description                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addProduct(formData)`       | Validates the session, scrapes the submitted URL via Firecrawl, and upserts the product keyed on `(user_id, product_url)`. Writes a `price_history` row on first insert or on price change. |
| `deleteProduct(productId)`   | Removes a tracked product.                                                                                                                                                                  |
| `getProducts()`              | Returns all products visible to the current authenticated session, newest first.                                                                                                            |
| `getPriceHistory(productId)` | Returns the chronological price log powering the Recharts visualization.                                                                                                                    |
| `signOut()`                  | Ends the Supabase session and revalidates `/`.                                                                                                                                              |

### Route Handler — `/api/cron/check-product-prices`

| Method | Auth                                  | Purpose                                                                                                                                                                                                                |
| ------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | None                                  | Lightweight health check — confirms the endpoint is deployed and reachable.                                                                                                                                            |
| `POST` | `Authorization: Bearer <CRON_SECRET>` | Re-scrapes **every** tracked product across all users, updates current prices, appends price-history rows on change, and emails price-drop alerts. Intended to be invoked by an external scheduler (e.g. Vercel Cron). |

**Example response from `POST`:**

```json
{
  "success": true,
  "message": "Price Check Completed",
  "results": {
    "totalProducts": 42,
    "updated": 40,
    "failed": 2,
    "priceChanges": 7,
    "alertsSent": 3
  }
}
```

### External integrations consumed

| Service          | Used for                                                |
| ---------------- | ------------------------------------------------------- |
| **Supabase**     | Postgres data storage, Google OAuth, session management |
| **Firecrawl**    | AI-structured scraping of arbitrary product pages       |
| **Resend**       | Transactional price-drop alert emails                   |
| **Google OAuth** | Identity provider behind Supabase Auth                  |

## 🔧 Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Firecrawl
FIRECRAWL_API_KEY=your-firecrawl-api-key

# Cron / automation
CRON_SECRET=a-long-random-shared-secret

# Resend
RESEND_FROM_EMAIL=alerts@yourdomain.com
RESEND_API_KEY=your-resend-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ⚙️ Installation & Local Setup

**Prerequisites:** Node.js 18.18+ (20+ recommended), npm, and a [Supabase](https://supabase.com) project with Google OAuth configured.

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/dealdrop.git
cd dealdrop

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local   # then fill in the values above

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

**Database setup:** create a `products` table and a `price_history` table in your Supabase project matching the [schema](#-database-schema) above, with a composite unique constraint on `products (user_id, product_url)`.

## 📜 Available Scripts

| Command         | Description                                             |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Starts the Next.js development server (Turbopack).      |
| `npm run build` | Builds the application for production.                  |
| `npm run start` | Runs the production build.                              |
| `npm run lint`  | Runs ESLint with the `core-web-vitals` Next.js ruleset. |

## 📚 Learning Outcomes

Building DealDrop involved working through several real architectural decisions:

- **Server Actions-first architecture** — Learned when to rely on Server Actions for mutations versus when a standalone Route Handler is genuinely needed, like for the scheduler-invoked cron job.
- **Three-client Supabase pattern** — Set up separate browser, server, and proxy-level Supabase clients to keep auth sessions valid across Server Components and Server Actions.
- **Next.js 16 Proxy adoption** — Migrated from the Middleware convention to Proxy early, and understood how it changes the request lifecycle.
- **AI-driven data extraction** — Used Firecrawl's schema-based scraping to pull structured product data without writing a custom parser per retailer.
- **Delta-aware data writes** — Designed upsert and price-change-only logic to avoid duplicate records and keep price history meaningful.
- **Custom transactional emails** — Built a responsive HTML email template from scratch with template literals, including conditional content blocks.

---

<div align="center">
Built with ❤️ using Next.js, Supabase, and Firecrawl.
</div>
