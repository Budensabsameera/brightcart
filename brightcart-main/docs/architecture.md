# E-Commerce Architecture

## Product Direction

This project will support a modern e-commerce flow with a clean white interface and selective accents of green, yellow, and orange.

## Frontend Pages

### Customer Pages

- Home
- Shop / Product Listing
- Product Details
- Cart
- Checkout
- Order Success
- Login
- Register
- Account Dashboard
- My Orders
- Wishlist

### Admin Pages

- Admin Dashboard
- Product Management
- Category Management
- Order Management
- User Management

## Core Features

### Customer Features

- Browse featured and categorized products
- Search, sort, and filter products
- View product details with pricing and stock
- Add items to cart and update quantities
- Secure checkout flow
- Register and log in
- View profile and order history
- Wishlist support

### Admin Features

- Create, update, and delete products
- Manage categories
- View and update order status
- Manage customers
- Review dashboard metrics

## Backend Modules

- `auth` authentication and authorization
- `user` customer and admin profiles
- `category` product classification
- `product` catalog management
- `cart` active shopping cart
- `order` checkout and order history
- `wishlist` saved products
- `common` shared DTOs, exceptions, config

## API Roadmap

### Phase 1

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`

### Phase 2

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`

### Phase 3

- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/admin/orders`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`

## Database Entities

- users
- roles
- categories
- products
- carts
- cart_items
- orders
- order_items
- wishlists
- wishlist_items

## UI Theme Notes

- Background: white and soft neutral surfaces
- Secondary color: green for positive states and icons
- Accent colors: small yellow, orange, and green highlights for cards, tags, and navigation
- Keep layouts spacious, bright, and easy to scan
