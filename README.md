# E-Commerce Web Application

A minimal single-page e-commerce application with authentication, item listing with filters, and persistent cart functionality.

## Features

### Backend (Node.js/Express)
- JWT-based authentication (signup/login)
- CRUD APIs for items with filters (price, category)
- Add to cart APIs
- In-memory data storage

### Frontend (Vanilla HTML/CSS/JavaScript)
- Signup and login pages
- Item listing page with category and price filters
- Cart page with add/remove functionality
- Cart persistence after logout (stored server-side)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and go to: `http://localhost:3000`

## Usage

1. **Authentication**: Sign up with email/password or login with existing credentials
2. **Browse Items**: View all items or filter by category and price range
3. **Add to Cart**: Click "Add to Cart" on any item
4. **Manage Cart**: View cart, see totals, and remove items
5. **Persistence**: Cart items remain after logout and are restored on login

## API Endpoints

- `POST /api/signup` - Create new user account
- `POST /api/login` - Login user
- `GET /api/items` - Get items (supports category, minPrice, maxPrice filters)
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart

## Default Items

The application comes with sample items:
- Electronics: Laptop ($999), Phone ($599)
- Clothing: Shirt ($29), Jeans ($79)
- Books: Book ($15)