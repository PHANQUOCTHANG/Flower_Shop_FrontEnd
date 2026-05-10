# 🌸 Flower Shop Frontend

Flower Shop Frontend is a modern **e-commerce web application** built with **Next.js, React, and TypeScript**.  
It provides an intuitive interface for customers to browse and purchase flowers online, while allowing administrators to manage products and orders efficiently.

---

## 🛠 Technology Stack

| Technology | Description |
|---|---|
| Next.js | React framework with hybrid SSR/SSG rendering |
| React | Library for building user interfaces |
| TypeScript | Adds static typing to JavaScript |
| Tailwind CSS | Utility-first CSS framework for styling |
| React Query | Data fetching and server state management |
| Zustand | Lightweight client-side state management |
| Axios | HTTP client for communicating with backend APIs |
| Socket.IO Client | Real-time bidirectional communication for chat |

---

## ✨ Features

| Feature | Description |
|---|---|
| Authentication | User registration, login, and password reset via email OTP |
| Social Login | Google and Facebook OAuth integration |
| Product Browsing | Browse products, search, filter by category, and view product details |
| Shopping Cart | Add, update, and remove products from the cart |
| Checkout | Review order information and place orders |
| Orders | View order history and real-time order status updates via Socket.IO |
| Favorites | Save and manage favorite products |
| User Profile | Manage personal info, shipping addresses, and account password |
| Customer Support Chat | Real-time chat with customer support including rich media attachments |
| Rich Media Chat | Send and preview images, videos, and file cards (Zalo-style) in chat threads |

---

## ⚙️ Admin Features

| Feature | Description |
|---|---|
| Dashboard | Overview of revenue, orders, and customer statistics |
| Product Management | Create, update, and delete products with image uploads |
| Order Management | View orders, update order status, and monitor processing queue |
| Customer Management | View customer profiles and purchase history |
| Support Chat | Respond to customer messages with text and rich media attachments |

---

## 🏗 Architecture & Performance

### Hybrid Rendering (SSR + CSR)
- **Server Components** are used for SEO-critical pages (product listings, product detail, home page) to enable fast initial load and proper metadata generation
- **Client Components** handle interactive UI such as cart, checkout, and chat

### Custom Hook Pattern
- Business logic is fully decoupled from UI through a **custom hook architecture** (e.g., `useCheckout`, `useProductDetail`, `useProfile`, `useCollection`)
- Improves testability, reusability, and separation of concerns across all feature modules

### Performance Optimizations
- **Debounced search** via a shared `useDebouncedCallback` hook to minimize redundant API calls
- **Memoized helper functions** moved outside component scopes to prevent redundant re-initialization
- **Proper cleanup** for `setTimeout`-based navigation handlers to eliminate memory leaks
- **Lazy-loaded sections** and scroll-triggered animations via Intersection Observer for smooth UX

---

## 📁 Project Structure

| Folder | Description |
|---|---|
| app/ | Next.js application pages (main, admin, auth routes) |
| components/ | Reusable UI components |
| features/ | Feature-based modules with co-located hooks and components |
| hooks/ | Shared custom hooks (useDebouncedCallback, etc.) |
| stores/ | Zustand state management |
| lib/ | API configuration, Axios instance, and utilities |
| types/ | Global TypeScript types and DTOs |
| public/ | Static assets |

---

## 🔧 Environment Variables

| Variable | Description | Example |
|---|---|---|
| NEXT_PUBLIC_API_URL | Backend API base URL | http://localhost:5000 |
| NEXT_PUBLIC_APP_URL | Frontend application URL | http://localhost:3000 |
| NEXT_PUBLIC_SOCKET_URL | Socket.IO server URL | http://localhost:5000 |

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/PHANQUOCTHANG/Flower_Shop_FrontEnd.git
cd flower-frontend
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Application runs at

```
http://localhost:3000
```

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| npm run dev | Run development server |
| npm run build | Build production application |
| npm start | Start production server |

---

## 📄 License

This project is licensed under the **MIT License**.
