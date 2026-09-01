# 🍽️ POS System Backend (Express + TypeScript + Prisma)

A modern, robust, and scalable **Point of Sale (POS) & Kitchen Display System (KDS) Backend API** designed for restaurants, cafes, and F&B businesses. Built with **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Database Schema & Roles](#-database-schema--roles)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Migration & Seeding](#database-migration--seeding)
  - [Running the Server](#running-the-server)
- [Default Seed Data](#-default-seed-data)
- [API Reference](#-api-reference)
  - [Authentication (`/api/v1/auth`)](#1-authentication-apiv1auth)
  - [Users & Roles (`/api/v1/admin/users`, `/api/v1/roles`)](#2-users--roles)
  - [Categories (`/api/v1/admin/categories`)](#3-categories)
  - [Products (`/api/v1/products`)](#4-products)
  - [Orders (`/api/v1/orders`)](#5-orders)
  - [Kitchen / Station Workflow (`/api/v1/order-items`)](#6-kitchen--station-order-items)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## ✨ Features

- 🔐 **Authentication & Security**:
  - Secure password hashing with `bcrypt`.
  - JWT Authentication with dual tokens: short-lived **Access Token** (15m) and persistent **Refresh Token** (7d) stored in `HttpOnly`, `SameSite=Strict` cookies.
  - Refresh Token rotation and server-side revocation tracking.
- 👥 **Role-Based Access Control (RBAC)**:
  - Multi-role authorization middleware supporting: `admin`, `waiter`, `cashier`, `foodKitchen`, and `beverageStation`.
- 📋 **Menu & Product Management**:
  - Categorization of menu items.
  - Automatic station routing (e.g., assigning a dish to `foodKitchen` or a drink to `beverageStation`).
  - Search, filtering, and pagination on products.
- 🛎️ **Order Management & Transactions**:
  - Waiters and cashiers can initiate table orders.
  - ACID database transactions with Prisma for atomic order and order-item creation.
  - Auto subtotal & total calculation with price snapshots.
- 🍳 **Kitchen Display System (KDS) Station Workflow**:
  - Real-time station views filtered by the logged-in user's assigned station (`foodKitchen` or `beverageStation`).
  - Item status lifecycle: `pending` ➔ `in_progress` ➔ `ready` ➔ `served` (or `canceled`).
- 💳 **Billing & Payment Processing**:
  - Cashier payment settlement supporting `cash` and `qris`.
  - Automatic order status update to `paid`.
- 🛡️ **Validation & Error Handling**:
  - Strict runtime schema validation using `Zod`.
  - Standardized JSON error response handler powered by `http-errors`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime & Framework** | [Node.js](https://nodejs.org/) (ES Modules), [Express v5.2](https://expressjs.com/) |
| **Language** | [TypeScript v5.9](https://www.typescriptlang.org/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM v6.19](https://www.prisma.io/) |
| **Validation** | [Zod v4](https://zod.dev/) |
| **Authentication & Security** | [JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken), [bcrypt](https://github.com/kelektiv/node.bcrypt.js), `cookie-parser`, `cors` |
| **Dev & Build Tools** | `tsx` (TypeScript Execute & Watch), `tsc`, `eslint`, `prettier` |

---

## 📂 Project Architecture & Directory Structure

The codebase is organized by domain modules following standard MVC/Service layered architecture:

```
pos_system_backend/
├── prisma/
│   ├── migrations/            # Prisma migration history
│   ├── schema.prisma          # Database models, relations & enums
│   └── seed.ts                # Database seeder (roles & admin account)
├── src/
│   ├── config/
│   │   ├── config.ts          # App configuration & environment loader
│   │   └── prisma.ts          # Singleton Prisma Client instance
│   ├── constants/
│   │   └── cookie.ts          # Cookie options (HttpOnly, SameSite, Secure)
│   ├── generated/             # Generated Prisma client output
│   ├── middlewares/
│   │   ├── authentication.middleware.ts # Bearer token verification
│   │   ├── authorization.middleware.ts  # RBAC role verification
│   │   └── error.middleware.ts          # Global error handling
│   ├── modules/
│   │   ├── auth/              # Authentication module (login, refresh, logout)
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── validations/
│   │   ├── categories/        # Menu Category CRUD
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── validations/
│   │   ├── orders/            # Orders & Kitchen Station Workflow
│   │   │   ├── controllers/   # order.controller.ts, orderItem.controller.ts
│   │   │   ├── routes/        # orderRoutes.ts, orderItemRoutes.ts
│   │   │   ├── services/      # order.service.ts, orderItem.service.ts
│   │   │   └── validations/   # order.schema.ts, orderItem.schema.ts
│   │   ├── products/          # Menu Product CRUD & search/filter
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── validations/
│   │   └── users/             # User management & Roles
│   │       ├── controllers/   # user.controller.ts, role.controller.ts
│   │       ├── routes/        # UserRoutes.ts
│   │       ├── services/      # user.service.ts, role.service.ts
│   │       └── validations/   # user.schema.ts, role.schema.ts
│   ├── types/
│   │   └── express.d.ts       # Express Request type extensions (req.user)
│   ├── utils/
│   │   ├── asyncHandler.ts    # Async wrapper for route handlers
│   │   └── jwt.ts             # Token generation & verification helpers
│   ├── app.ts                 # Express application setup & middleware assembly
│   └── server.ts              # HTTP server entry point
├── .env.example               # Example environment configuration
├── eslint.config.ts           # ESLint configuration
├── package.json               # Project manifest & npm scripts
├── prisma.config.ts           # Prisma CLI configuration
└── tsconfig.json              # TypeScript compiler settings
```

---

## 🗄️ Database Schema & Roles

### User Roles (`RoleList` Enum)
| Role | Description |
|---|---|
| `admin` | Full system administrator. Can manage users, categories, and products. |
| `waiter` | Floor staff. Can create orders for tables. |
| `cashier` | Cashier desk staff. Can view all orders, complete transactions & payments. |
| `foodKitchen` | Kitchen station staff. Receives and processes food order items. |
| `beverageStation` | Bar / Beverage station staff. Receives and processes beverage order items. |

### Entity Models Summary
- **Role**: Definition of system roles (`admin`, `waiter`, `cashier`, `foodKitchen`, `beverageStation`).
- **User**: System accounts with role assignment, phone number, email, and encrypted password.
- **refreshToken**: Persistent refresh sessions tied to users with expiration and revocation date.
- **Category**: Product classifications (e.g., Food, Drink, Dessert).
- **Product**: Menu items containing name, price, cover image, category, and designated station (`roleId`).
- **Order**: Master order header with `tableNumber`, `totalAmount`, `status` (`open` \| `paid`), and reference to the `waiter`.
- **OrderItem**: Detailed items inside an order, price snapshot, quantity, subtotal, customer notes, status (`pending`, `in_progress`, `ready`, `served`, `canceled`), and assigned preparation station (`assignedRoleId`).
- **Payment**: Payment transaction recording payment method (`cash` \| `qris`), amount, and timestamp.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or 20.x+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database server running

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd pos_system_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Copy the `.env.example` file to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
PORT=3000
NODE_ENV=development

# JWT Secret Keys (Generate secure random strings)
ACCESS_KEY=your_super_secret_access_key
REFRESH_KEY=your_super_secret_refresh_key

# PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@localhost:5432/pos_db?schema=public"
```

### Database Migration & Seeding

1. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

2. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

3. **Seed initial roles and default admin account:**
   ```bash
   npx tsx prisma/seed.ts
   ```

### Running the Server

- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
  The server will start at `http://localhost:3000`.

- **Production Build & Start:**
  ```bash
  npm run build
  npm run start
  ```

- **Open Prisma Studio (Database GUI):**
  ```bash
  npm run prisma:studio
  ```

---

## 🔑 Default Seed Data

After running the seed script, the following default credentials are created:

- **Admin Account**:
  - **Email**: `corpadmin@gmail.com`
  - **Password**: `roleadmin123`
  - **Role**: `admin`
  - **Phone**: `0821990201`

---

## 📡 API Reference

Base URL prefix: `/api/v1`

### 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticate user, returns Access Token & sets Refresh Token cookie |
| `POST` | `/auth/refresh` | Public (Cookie) | Request a new Access Token using valid Refresh Token cookie |
| `POST` | `/auth/logout` | Public (Cookie) | Revoke Refresh Token in database and clear cookie |

#### Login Request Body
```json
{
  "email": "corpadmin@gmail.com",
  "password": "roleadmin123"
}
```

---

### 2. Users & Roles

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/users` | `admin` | Get paginated list of users (supports query: `page`, `limit`, `search`, `roleId`, `sortBy`, `orderBy`) |
| `POST` | `/admin/user` | `admin` | Create a new user (waiter, cashier, kitchen, admin) |
| `PUT` | `/admin/user/:userId` | `admin` | Update user details & role |
| `DELETE` | `/admin/user/:userId` | `admin` | Delete user account |
| `GET` | `/roles` | `admin` | Retrieve all system roles |

#### Create User Request Body
```json
{
  "name": "John Waiter",
  "email": "waiter@example.com",
  "telp": "081234567890",
  "password": "password123",
  "roleId": "<ROLE_UUID>"
}
```

---

### 3. Categories

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/categories` | Authenticated | List all product categories |
| `POST` | `/admin/category` | `admin` | Create a new category |
| `PUT` | `/admin/category/:categoryId` | `admin` | Update category name |
| `DELETE` | `/admin/category/:categoryId` | `admin` | Delete category |

#### Create Category Request Body
```json
{
  "name": "Beverages"
}
```

---

### 4. Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/products` | Authenticated | List products with pagination & filters (`page`, `limit`, `search`, `categoryId`, `roleId`, `sortBy`, `orderBy`) |
| `GET` | `/product/:productId` | Authenticated | Get detailed product by ID |
| `POST` | `/product` | `admin` | Create a new product and assign it to a station (`roleId`) |
| `PUT` | `/product/:productId` | `admin` | Update product details |
| `DELETE` | `/product/:productId` | `admin` | Delete product |

#### Create Product Request Body
```json
{
  "productName": "Iced Lemon Tea",
  "price": 18000,
  "description": "Fresh brewed iced tea with lemon slices",
  "imageCover": "https://example.com/images/lemon-tea.jpg",
  "categoryId": "<CATEGORY_UUID>",
  "roleId": "<BEVERAGE_STATION_ROLE_UUID>"
}
```

---

### 5. Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/orders` | `cashier`, `admin` | Get paginated list of orders (filter by `status=open|paid`, `search=tableNumber`) |
| `POST` | `/order` | `waiter`, `cashier` | Place a new order with multiple items |
| `POST` | `/order/:orderId` | `cashier` | Complete payment for an open order (`cash` or `qris`) |

#### Create Order Request Body
```json
{
  "tableNumber": "Table 04",
  "waiterId": "<WAITER_USER_UUID>",
  "items": [
    {
      "productId": "<PRODUCT_UUID_1>",
      "quantity": 2,
      "notes": "Less ice, no sugar"
    },
    {
      "productId": "<PRODUCT_UUID_2>",
      "quantity": 1,
      "notes": "Extra spicy"
    }
  ]
}
```

#### Complete Order / Payment Request Body
```json
{
  "method": "qris" // "cash" or "qris"
}
```

---

### 6. Kitchen & Station Order Items

Dedicated endpoints for Kitchen Display Systems (KDS) to process items assigned to their respective station.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/order-items` | `foodKitchen`, `beverageStation` | View all order items assigned to the logged-in station |
| `PATCH` | `/order-item/:itemId` | `foodKitchen`, `beverageStation` | Update order item status |

#### Update Status Item Request Body
```json
{
  "status": "in_progress" // "pending" | "in_progress" | "ready" | "served" | "canceled"
}
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `tsx watch src/server.ts` | Runs the server in development mode with live reload |
| `npm run build` | `tsc` | Compiles TypeScript source to `dist/` |
| `npm run start` | `node dist/server.js` | Starts the production server from compiled JavaScript |
| `npm run lint` | `eslint . --ext .ts` | Runs ESLint for code style inspection |
| `npm run format` | `prettier --write .` | Formats all files with Prettier |
| `npm run prisma:generate` | `prisma generate` | Generates the custom Prisma Client into `src/generated/prisma` |
| `npm run prisma:migrate` | `prisma migrate dev` | Applies database migrations in development |
| `npm run prisma:studio` | `prisma studio` | Launches Prisma Studio GUI in the browser |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
