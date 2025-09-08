# E-Commerce Web Application Documentation

## Project Overview

A full-stack e-commerce web application built with Node.js, Express, MongoDB, and vanilla JavaScript. Features user authentication, product catalog, shopping cart, and modern responsive design.

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Installation & Setup](#installation--setup)
4. [Project Structure](#project-structure)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Frontend Components](#frontend-components)
8. [Authentication System](#authentication-system)
9. [Product Management](#product-management)
10. [Shopping Cart](#shopping-cart)
11. [Theme System](#theme-system)
12. [Responsive Design](#responsive-design)
13. [Security Features](#security-features)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

## Features

### Core Features
- **User Authentication**: JWT-based signup/login with Gmail validation
- **Product Catalog**: 40+ products across Electronics, Clothing, and Books
- **Shopping Cart**: Persistent cart with add/remove functionality
- **Responsive Design**: Mobile-first approach with hamburger menu
- **Theme System**: 4 color themes (Ocean, Sunset, Forest, Midnight)
- **Product Details**: Individual product pages with image galleries
- **Search & Filter**: Category and price-based filtering with sorting

### Pages
- **Home**: Hero section, Best Sellers, Top Discounts
- **Products**: Complete catalog with advanced filters
- **Cart**: Shopping cart management
- **Profile**: User profile information
- **About**: Company information and features
- **Contact**: Contact form and business details

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database (Atlas cloud)
- **Mongoose**: ODM for MongoDB
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **JavaScript (ES6+)**: Client-side functionality
- **Responsive Design**: Mobile-first approach

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Steps
1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB**
   - Update `MONGODB_URI` in `server.js` with your Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`

4. **Start Application**
   ```bash
   npm start
   ```

5. **Access Application**
   - Open browser to `http://localhost:3000`

## Project Structure

```
ecommerce-app/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── public/                # Static files
│   ├── index.html         # Main HTML file
│   ├── style.css          # Stylesheet
│   └── script.js          # Client-side JavaScript
├── PROJECT_DOCUMENTATION.md
└── README.md
```

## API Documentation

### Authentication Endpoints

#### POST /api/signup
**Description**: Register new user
**Body**:
```json
{
  "email": "user@gmail.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```
**Response**:
```json
{
  "success": true,
  "message": "User registered successfully. Please login."
}
```

#### POST /api/login
**Description**: Authenticate user
**Body**:
```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@gmail.com"
  }
}
```

### Product Endpoints

#### GET /api/items
**Description**: Get all products with optional filters
**Query Parameters**:
- `category`: Filter by category (Electronics, Clothing, Books)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter

**Response**:
```json
[
  {
    "id": 1,
    "name": "MacBook Pro",
    "price": 999,
    "originalPrice": 1299,
    "discount": 23,
    "category": "Electronics",
    "image": "image_url",
    "images": ["url1", "url2", "url3"],
    "description": "Product description",
    "bestseller": true
  }
]
```

#### GET /api/items/:id
**Description**: Get single product by ID
**Response**: Single product object

### Cart Endpoints

#### GET /api/cart
**Description**: Get user's cart items
**Headers**: `Authorization: Bearer <token>`
**Response**: Array of cart items

#### POST /api/cart
**Description**: Add item to cart
**Headers**: `Authorization: Bearer <token>`
**Body**:
```json
{
  "itemId": 1,
  "quantity": 1
}
```

#### DELETE /api/cart/:itemId
**Description**: Remove item from cart
**Headers**: `Authorization: Bearer <token>`

### Profile Endpoint

#### GET /api/profile
**Description**: Get user profile
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "email": "user@gmail.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "memberSince": "January 2024"
}
```

## Database Schema

### User Schema
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  fullName: String (default: 'User'),
  phone: String (default: '+1 (555) 000-0000'),
  address: String (default: 'Address not provided'),
  memberSince: String (auto-generated),
  createdAt: Date (default: Date.now)
}
```

### Product Schema (In-Memory)
```javascript
{
  id: Number (unique),
  name: String,
  price: Number,
  originalPrice: Number (optional),
  discount: Number (optional),
  category: String,
  image: String (main image URL),
  images: Array (gallery URLs),
  description: String,
  bestseller: Boolean (optional)
}
```

## Frontend Components

### Main Application Class
- **ECommerceApp**: Main application controller
- **Methods**:
  - `handleAuth()`: Authentication handling
  - `loadItems()`: Product loading
  - `addToCart()`: Cart management
  - `showProductDetail()`: Product detail display
  - `changeTheme()`: Theme switching

### Page Management
- **Single Page Application**: Dynamic page switching
- **Navigation**: Active state management
- **Mobile Menu**: Responsive navigation

### Authentication Flow
1. User accesses login/signup form
2. Gmail validation on frontend
3. Server validates and stores user
4. JWT token issued for authenticated sessions
5. Token stored in localStorage
6. Protected routes require valid token

## Authentication System

### Validation Rules
- **Email**: Must end with `@gmail.com`
- **Password**: Must be unique across all users
- **Full Name**: Must be unique
- **Phone**: Must be unique
- **All Fields**: Required for signup

### Security Features
- Password hashing with bcryptjs (10 rounds)
- JWT token authentication
- Protected API routes
- Input validation on frontend and backend

## Product Management

### Categories
- **Electronics** (18 items): Laptops, phones, accessories
- **Clothing** (15 items): Shirts, jeans, shoes, accessories
- **Books** (7 items): Programming, fiction, textbooks

### Features
- **Bestsellers**: Highlighted products
- **Discounts**: Price reductions with badges
- **Image Gallery**: Multiple product images
- **Detailed Descriptions**: Comprehensive product info
- **Related Products**: Category-based suggestions

## Shopping Cart

### Functionality
- **Add Items**: Single-click add to cart
- **Remove Items**: Individual item removal
- **Quantity Management**: Automatic quantity updates
- **Persistence**: Cart maintained across sessions
- **Real-time Updates**: Live cart count display

### Storage
- Server-side cart storage per user
- In-memory storage (resets on server restart)
- User-specific cart isolation

## Theme System

### Available Themes
1. **Ocean**: Blue gradient theme
2. **Sunset**: Orange/red gradient theme
3. **Forest**: Green gradient theme
4. **Midnight**: Dark blue/purple theme

### Implementation
- CSS custom properties for theme variables
- JavaScript theme switching
- localStorage persistence
- Smooth transitions between themes

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Hamburger menu navigation
- Touch-friendly buttons
- Optimized image sizes
- Responsive grid layouts

## Security Features

### Authentication Security
- Password hashing with salt
- JWT token expiration
- Protected API endpoints
- Input sanitization

### Data Validation
- Frontend form validation
- Backend data validation
- MongoDB schema validation
- Unique constraint enforcement

## Deployment

### Production Setup
1. **Environment Variables**
   ```
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

2. **Build Process**
   ```bash
   npm install --production
   npm start
   ```

3. **Hosting Options**
   - Heroku
   - Vercel
   - AWS EC2
   - DigitalOcean

### MongoDB Atlas Setup
1. Create cluster
2. Configure network access
3. Create database user
4. Get connection string
5. Update server.js

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
**Problem**: `MongooseServerSelectionError`
**Solution**: 
- Check connection string
- Verify network access in Atlas
- Ensure correct credentials

#### Authentication Issues
**Problem**: Login/signup failures
**Solution**:
- Verify Gmail format
- Check unique constraints
- Clear localStorage

#### Missing Images
**Problem**: Product images not loading
**Solution**:
- Check image URLs
- Verify internet connection
- Update broken image links

#### Cart Not Persisting
**Problem**: Cart items disappear
**Solution**:
- Check JWT token validity
- Verify server-side storage
- Clear browser cache

### Development Tips
- Use browser developer tools for debugging
- Check console for JavaScript errors
- Monitor network requests
- Verify API responses

## Performance Optimization

### Frontend
- Image optimization
- CSS minification
- JavaScript bundling
- Lazy loading

### Backend
- Database indexing
- Query optimization
- Caching strategies
- Connection pooling

## Future Enhancements

### Planned Features
- Order management system
- Payment integration
- Product reviews and ratings
- Wishlist functionality
- Admin dashboard
- Email notifications
- Search functionality
- Inventory management

### Technical Improvements
- Database migration to persistent storage
- Image upload functionality
- Real-time notifications
- Progressive Web App (PWA)
- Server-side rendering (SSR)

## Support & Maintenance

### Regular Tasks
- Database backups
- Security updates
- Performance monitoring
- Bug fixes
- Feature updates

### Monitoring
- Server uptime
- Database performance
- User activity
- Error tracking

---

## Contact Information

**Developer**: Mounesh
**Project**: E-Commerce Web Application
**Version**: 1.0.0
**Last Updated**: 2024

---

*This documentation provides comprehensive information about the e-commerce web application. For additional support or questions, please refer to the troubleshooting section or contact the development team.*