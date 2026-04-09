# BrightCart Project Guide

## 1. What This Project Is

This project is a full-stack e-commerce application.

That means it has:

- a frontend: the part the user sees and clicks
- a backend: the part that handles data, business rules, and APIs
- a database layer: the place where long-term data is stored

In simple words:

- the frontend is the shop window
- the backend is the shop manager
- the database is the store room

## 2. Main Technologies Used

### Frontend

- React
  Why we use it:
  React helps us build the UI in small reusable pieces called components.

  How it is used here:
  Pages like Home, Cart, Account, and Admin Dashboard are built with React components.

  Main files:
  - [main.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/main.jsx)
  - [App.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/App.jsx)

- React Router
  Why we use it:
  It lets the app move between pages without reloading the browser.

  How it is used here:
  It maps URLs like `/cart`, `/wishlist`, `/admin`, and `/products/:productId` to the correct page component.

  Main file:
  - [App.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/App.jsx)

- Context API
  Why we use it:
  Some data is needed in many places, like logged-in user, cart items, wishlist items, products, and categories.
  Instead of passing this data manually through many components, Context shares it globally.

  How it is used here:
  There are separate contexts for auth, cart, wishlist, products, and categories.

  Main files:
  - [AuthContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/AuthContext.jsx)
  - [CartContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/CartContext.jsx)
  - [WishlistContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/WishlistContext.jsx)
  - [ProductContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/ProductContext.jsx)
  - [CategoryContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/CategoryContext.jsx)

- Vite
  Why we use it:
  Vite is the frontend build tool. It starts the app fast during development and builds it for production.

  How it is used here:
  It runs the React frontend and creates the optimized `dist` folder.

  Main files:
  - [frontend/package.json](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/package.json)
  - [frontend/vite.config.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/vite.config.js)

### Backend

- Spring Boot
  Why we use it:
  Spring Boot makes it easier to build Java backend APIs quickly with good structure.

  How it is used here:
  It runs the server, exposes REST APIs, handles requests, and connects to the database.

  Main files:
  - [EcommerceApplication.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/EcommerceApplication.java)
  - [backend/pom.xml](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/pom.xml)

- Spring Data JPA
  Why we use it:
  It helps Java classes talk to the database without writing too much raw SQL.

  How it is used here:
  Repositories like `UserRepository`, `ProductRepository`, `OrderRepository`, and `CartRepository` manage database access.

- H2
  Why we use it:
  H2 is a lightweight local database for easy testing and demo mode.

  How it is used here:
  The `local` Spring profile uses H2.

  Main file:
  - [application-local.properties](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/resources/application-local.properties)

- Oracle
  Why we use it:
  Oracle is the main database setup this project was designed for originally.

  How it is used here:
  The default backend profile is `oracle`.

  Main files:
  - [application.properties](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/resources/application.properties)
  - [application-oracle.properties](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/resources/application-oracle.properties)
  - [database/oracle/init/01_schema.sql](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/database/oracle/init/01_schema.sql)
  - [database/oracle/init/02_seed.sql](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/database/oracle/init/02_seed.sql)

## 3. Big Picture: How the App Works

When a user opens the website:

1. React starts from [main.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/main.jsx)
2. It wraps the app with all shared providers:
   - Auth
   - Category
   - Product
   - Wishlist
   - Cart
3. The router in [App.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/App.jsx) checks the URL
4. It loads the correct page
5. That page uses context or API calls to get the data it needs

When the frontend needs backend data:

1. It calls helper functions in [api.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/api.js)
2. Those functions send HTTP requests like:
   - `GET /api/products`
   - `POST /api/auth/login`
   - `GET /api/cart`
3. Spring Boot controllers receive the request
4. Services apply business rules
5. Repositories talk to the database
6. A response is sent back to the frontend

## 4. Frontend Folder Explanation

Frontend root:

- [frontend/src](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src)

### `main.jsx`

File:
- [main.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/main.jsx)

What it does:
- starts the React app
- adds browser routing
- wraps the app with all global providers

Why it matters:
- this is the app entry point
- if the app were a house, this is the main gate

### `App.jsx`

File:
- [App.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/App.jsx)

What it does:
- defines all routes
- decides which page belongs to which URL
- separates customer layout and admin layout
- protects account and admin routes

Examples:
- `/` -> Home page
- `/products` -> product listing
- `/wishlist` -> saved items
- `/account` -> customer account
- `/admin` -> admin dashboard

### `styles.css`

File:
- [styles.css](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/styles.css)

What it does:
- contains the global styles of the website
- defines colors, spacing, cards, buttons, navbar, layouts, forms, dashboard styles

Why we use one big shared stylesheet here:
- to keep visual design consistent across the app

### `components/`

This folder stores reusable UI pieces.

#### `components/auth`

- [AdminRoute.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/auth/AdminRoute.jsx)
- [ProtectedRoute.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/auth/ProtectedRoute.jsx)

What they do:
- `ProtectedRoute` blocks pages unless the user is logged in
- `AdminRoute` blocks admin pages unless the user role is admin

Why they exist:
- to stop people from opening pages they should not access

#### `components/common`

- [Button.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/common/Button.jsx)
- [Toast.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/common/Toast.jsx)
- [Accordion.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/common/Accordion.jsx)
- [RevealOnScroll.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/common/RevealOnScroll.jsx)

What they do:
- reusable button styles
- toast popup messages
- collapsible sections
- scroll animation helper

Why reusable components matter:
- they reduce duplication
- they keep the UI consistent

#### `components/layout`

- [CustomerLayout.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/layout/CustomerLayout.jsx)
- [AdminLayout.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/layout/AdminLayout.jsx)
- [Navbar.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/layout/Navbar.jsx)
- [Footer.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/layout/Footer.jsx)

What they do:
- build the common page shell
- keep shared header/footer/navigation in one place

Why this is useful:
- instead of repeating navbar/footer on every page, we define them once

#### `components/product`

- [ProductCard.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/product/ProductCard.jsx)
- [CartItem.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/product/CartItem.jsx)

What they do:
- show product cards across pages
- show cart items with quantity controls

Why this matters:
- products are displayed in many places, so one reusable product card avoids repeating code

### `context/`

This is one of the most important folders.

It stores app-wide state.

Think of it like the app’s shared memory.

#### `AuthContext.jsx`

File:
- [AuthContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/AuthContext.jsx)

What it controls:
- login
- signup
- logout
- current user
- current token
- forgot password OTP flow
- profile updates
- business account upgrade
- role checks (`admin` vs `user`)

Why we use it:
- many pages need to know who is logged in
- the navbar, account page, admin route, checkout, and business flow all depend on auth state

What it stores in browser localStorage:
- `brightcart.auth`
  stores the current signed-in session
- `brightcart.auth.users`
  stores local fallback users
- `brightcart.auth.otp`
  stores local OTP values for reset flow

Important idea:
- this app supports both backend auth and local fallback auth
- if backend auth fails, local fallback still lets the demo continue

#### `CartContext.jsx`

File:
- [CartContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/CartContext.jsx)

What it controls:
- add to cart
- remove from cart
- quantity update
- coupon apply/remove
- checkout
- cart summary totals
- cart mode (`online` or `local`)
- cart toast messages

Why we use it:
- cart data is needed in many places:
  - navbar cart count
  - cart page
  - checkout page
  - order success page

What it stores:
- `brightcart.cart`
  stores cart items locally
- `brightcart.appliedCoupon`
  stores the coupon currently used
- `brightcart.lastOrder`
  stores the last placed order locally

Important idea:
- if user is not logged in, cart still works in local mode
- this was added to avoid forcing authentication just to shop

#### `WishlistContext.jsx`

File:
- [WishlistContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/WishlistContext.jsx)

What it controls:
- save product
- unsave product
- check whether product is saved
- saved item count

What it stores:
- `brightcart.wishlist`
  stores saved products by owner email or guest

Why it matters:
- saved items should be visible across product cards, detail page, account page, and wishlist page

#### `ProductContext.jsx`

File:
- [ProductContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/ProductContext.jsx)

What it controls:
- load products
- add product
- edit product
- delete product
- refresh product list
- reduce stock after local checkout

What it stores:
- `brightcart.products`
  local saved catalog copy

Why we use it:
- products are needed across customer and admin pages

#### `CategoryContext.jsx`

File:
- [CategoryContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/CategoryContext.jsx)

What it controls:
- load categories
- create category
- update category
- delete category

Why it matters:
- product forms and filters need categories

### `data/`

File:
- [products.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/data/products.js)

What it stores:
- default product list
- categories
- testimonial data

Why we use it:
- the app needs initial data even before backend responses arrive
- this helps development and demo mode

### `lib/`

This folder contains helper logic that is not a visual component.

#### `api.js`

File:
- [api.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/api.js)

What it does:
- central place for all frontend API calls

Examples:
- login
- signup
- fetch products
- fetch cart
- fetch admin overview
- place order

Why this file is important:
- instead of calling `fetch` everywhere in many pages, we keep API code in one place

#### `localOrders.js`

File:
- [localOrders.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/localOrders.js)

What it does:
- creates local fallback orders
- reads local orders
- writes local orders

What it stores:
- `brightcart.localOrders`

Why we need it:
- guest checkout and fallback mode still need order history

#### `localCoupons.js`

File:
- [localCoupons.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/localCoupons.js)

What it does:
- stores coupon logic for local mode
- validates coupons locally
- calculates coupon discount when backend is not used

#### `demoData.js`

File:
- [demoData.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/demoData.js)

What it does:
- seeds demo cart data
- seeds demo wishlist data
- seeds demo customer accounts
- seeds demo local orders

Why we use it:
- recruiters and first-time viewers should not see a completely empty app

### `pages/`

This folder contains page-level screens.

Customer pages:

- [HomePage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/HomePage.jsx)
  landing page and featured content
- [ProductListPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/ProductListPage.jsx)
  product grid, filters, search, sort
- [ProductDetailPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/ProductDetailPage.jsx)
  single product details and related products
- [CartPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/CartPage.jsx)
  cart items, coupon apply, total summary
- [WishlistPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/WishlistPage.jsx)
  all saved items
- [CheckoutPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/CheckoutPage.jsx)
  order placement form
- [OrderSuccessPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/OrderSuccessPage.jsx)
  success message after order
- [LoginPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/LoginPage.jsx)
  sign in form
- [SignupPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/SignupPage.jsx)
  register new account
- [ForgotPasswordPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/ForgotPasswordPage.jsx)
  reset password with OTP
- [AccountPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/AccountPage.jsx)
  profile, orders, wishlist, business setup link
- [BusinessAccountPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/BusinessAccountPage.jsx)
  turns a customer account into a business/admin account

Admin pages:

- [AdminDashboardPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/AdminDashboardPage.jsx)
  overview cards and quick links
- [AdminProductsPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/AdminProductsPage.jsx)
  product management and CSV export
- [AdminCategoriesPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/AdminCategoriesPage.jsx)
  category management
- [AdminCouponsPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/AdminCouponsPage.jsx)
  coupon management
- [AdminOrdersPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/AdminOrdersPage.jsx)
  admin order list and status updates
- [AdminCustomersPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/AdminCustomersPage.jsx)
  customer list and CSV export

### `utils/`

- [csv.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/utils/csv.js)
  creates CSV downloads
- [formatters.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/utils/formatters.js)
  formatting helpers like prices

## 5. Backend Folder Explanation

Backend root:

- [backend/src/main/java/com/ecommerce/backend](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend)

### `EcommerceApplication.java`

File:
- [EcommerceApplication.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/EcommerceApplication.java)

What it does:
- starts the Spring Boot application

This is the backend entry point.

### `auth/`

This module handles identity.

Important files:

- [AuthController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/AuthController.java)
  receives auth API requests
- [AuthService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/AuthService.java)
  contains auth business logic
- [AuthTokenFilter.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/AuthTokenFilter.java)
  reads token from request and validates session
- [SessionService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/SessionService.java)
  manages login session records
- [PasswordService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/PasswordService.java)
  hashes and verifies passwords
- [OtpService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/OtpService.java)
  handles OTP generation and validation
- [CurrentUserService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/CurrentUserService.java)
  tells backend who the currently authenticated user is
- [User.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/User.java)
  user entity
- [Role.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/Role.java)
  role entity
- [UserSession.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/UserSession.java)
  session entity
- [PasswordResetOtp.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/PasswordResetOtp.java)
  OTP entity
- request/response DTO files like:
  - [LoginRequest.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/LoginRequest.java)
  - [SignupRequest.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/SignupRequest.java)
  - [AuthResponse.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/AuthResponse.java)

Why this module exists:
- every secure app needs a clear auth system

### `account/`

Files:
- [AccountController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/account/AccountController.java)
- [AccountService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/account/AccountService.java)
- [UpdateProfileRequest.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/account/UpdateProfileRequest.java)
- [CreateBusinessAccountRequest.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/account/CreateBusinessAccountRequest.java)

What this module does:
- handles profile changes
- upgrades customer account to business/admin account

Why it is separate from auth:
- auth is about entering the system
- account is about managing the user after login

### `catalog/`

This module handles categories and products.

Category files:
- [Category.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/Category.java)
- [CategoryRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/CategoryRepository.java)
- [CategoryService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/CategoryService.java)
- [CategoryController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/CategoryController.java)

Product files:
- [Product.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/Product.java)
- [ProductRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/ProductRepository.java)
- [ProductCatalogService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/ProductCatalogService.java)
- [ProductController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/catalog/ProductController.java)

What this module does:
- reads products for customer view
- allows admin to manage products
- handles category structure

Why this matters:
- products are the center of an e-commerce app

### `cart/`

Files:
- [Cart.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/Cart.java)
- [CartItem.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/CartItem.java)
- [CartRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/CartRepository.java)
- [CartItemRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/CartItemRepository.java)
- [CartService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/CartService.java)
- [CartController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/CartController.java)

What it does:
- creates user cart
- adds items
- updates quantity
- removes items
- returns cart response to frontend

Why it is a separate module:
- cart rules are different from order rules
- cart is a temporary shopping state

### `orders/`

This module handles checkout and order tracking.

Important files:
- [OrderEntity.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderEntity.java)
- [OrderItemEntity.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderItemEntity.java)
- [OrderRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderRepository.java)
- [OrderItemRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderItemRepository.java)
- [OrderService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderService.java)
- [OrderController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderController.java)
- [CreateOrderRequest.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/CreateOrderRequest.java)
- [UpdateOrderStatusRequest.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/UpdateOrderStatusRequest.java)

Response files:
- [OrderResponse.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderResponse.java)
- [OrderHistoryResponse.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderHistoryResponse.java)
- [OrderAdminResponse.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/OrderAdminResponse.java)

Exception files:
- [EmptyCartException.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/EmptyCartException.java)
- [InsufficientStockException.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/InsufficientStockException.java)
- [InvalidOrderStatusException.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/InvalidOrderStatusException.java)
- [InvalidOrderCancellationException.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/orders/InvalidOrderCancellationException.java)

What this module does:
- creates order from cart
- stores delivery information
- stores order items
- updates order status
- supports admin tracking

Why it matters:
- this is the actual purchase step

### `wishlist/`

Files:
- [Wishlist.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/wishlist/Wishlist.java)
- [WishlistItem.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/wishlist/WishlistItem.java)
- [WishlistRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/wishlist/WishlistRepository.java)
- [WishlistItemRepository.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/wishlist/WishlistItemRepository.java)
- [WishlistService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/wishlist/WishlistService.java)
- [WishlistController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/wishlist/WishlistController.java)

What it does:
- stores saved products for users

### `coupon/`

This module manages offers.

It contains coupon entity, controller, service, repository, requests, responses, and validation logic.

Why it matters:
- discounts affect checkout totals
- admin needs to create and manage offers

### `admin/`

Files:
- [AdminController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/admin/AdminController.java)
- [AdminService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/admin/AdminService.java)
- [AdminOverviewResponse.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/admin/AdminOverviewResponse.java)
- [AdminCustomerResponse.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/admin/AdminCustomerResponse.java)

What it does:
- dashboard overview counts
- customer lists for admin

### `health/`

Files:
- [HealthController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/health/HealthController.java)
- [SchemaHealthService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/health/SchemaHealthService.java)
- [SchemaHealthReport.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/health/SchemaHealthReport.java)

What it does:
- checks backend health
- checks schema condition

### `config/`

Files:
- [WebConfig.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/config/WebConfig.java)
- [OrderSchemaMigrationRunner.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/config/OrderSchemaMigrationRunner.java)

What they do:
- `WebConfig` sets CORS rules
- `OrderSchemaMigrationRunner` helps handle schema migration logic for Oracle profile

## 6. Request Flow Example

Let us explain one flow like a story.

### Example: Add to cart

Frontend side:

1. User clicks `Add to Cart` in [ProductCard.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/product/ProductCard.jsx)
2. That calls `addToCart()` from [CartContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/CartContext.jsx)
3. `CartContext` first updates UI immediately
4. Then it tries backend API through [api.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/api.js)
5. If backend is unavailable or user is not logged in, it keeps the cart locally

Backend side:

1. request goes to `POST /api/cart/items`
2. [CartController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/CartController.java) receives it
3. [CartService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/cart/CartService.java) applies logic
4. repositories save changes
5. response returns updated cart

### Example: Login

Frontend:

1. User submits login form on [LoginPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/LoginPage.jsx)
2. Page calls `login()` from [AuthContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/AuthContext.jsx)
3. `AuthContext` calls [api.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/api.js)
4. if backend login fails, local fallback login is tried
5. auth state is stored in `brightcart.auth`

Backend:

1. `POST /api/auth/login`
2. [AuthController.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/AuthController.java)
3. [AuthService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/AuthService.java)
4. [PasswordService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/PasswordService.java)
5. [SessionService.java](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/backend/src/main/java/com/ecommerce/backend/auth/SessionService.java)

## 7. What Is Stored Where

### In Browser localStorage

These are the main browser keys used by the frontend:

- `brightcart.auth`
  current user session
- `brightcart.auth.users`
  local users for fallback/demo
- `brightcart.auth.otp`
  local OTP store
- `brightcart.cart`
  local cart items
- `brightcart.appliedCoupon`
  current coupon used in local mode
- `brightcart.lastOrder`
  latest order stored locally
- `brightcart.localOrders`
  local order history
- `brightcart.wishlist`
  saved items
- `brightcart.products`
  local product catalog copy

Why localStorage is used here:
- to support demo mode
- to keep guest shopping working
- to preserve local changes even if backend is unavailable

### In Database

Database scripts:

- [01_schema.sql](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/database/oracle/init/01_schema.sql)
- [02_seed.sql](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/database/oracle/init/02_seed.sql)
- [03_add_order_timeline_columns.sql](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/database/oracle/migrations/03_add_order_timeline_columns.sql)
- [04_add_coupons_and_order_discount.sql](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/database/oracle/migrations/04_add_coupons_and_order_discount.sql)

Main tables:

- roles
- users
- user_sessions
- password_reset_otps
- categories
- products
- carts
- cart_items
- orders
- order_items
- wishlists
- wishlist_items
- coupons

## 8. Why Some Features Work Without Login

This project was improved so users are not blocked too early.

That means:

- cart can work locally
- wishlist can work locally
- checkout can save locally
- dashboard can show local demo data

Why this was done:
- better demo experience
- better recruiter experience
- better user experience

This logic mainly lives in:

- [AuthContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/AuthContext.jsx)
- [CartContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/CartContext.jsx)
- [WishlistContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/WishlistContext.jsx)
- [demoData.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/demoData.js)

## 9. Why There Are Customer and Admin Sides

This app supports two roles:

- `user`
  normal customer who buys products
- `admin`
  seller/business account who manages the store

Where this is checked:

- frontend:
  - [AuthContext.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/context/AuthContext.jsx)
  - [AdminRoute.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/components/auth/AdminRoute.jsx)
- backend:
  - auth/session/current-user logic in the `auth` module

Business flow:

- a user starts as customer
- if they go through [BusinessAccountPage.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/pages/BusinessAccountPage.jsx)
- backend account logic upgrades them
- then they can access `/admin`

## 10. Why This Project Is Good for Learning

This project teaches:

- frontend routing
- global state management
- forms and validation
- API integration
- authentication
- role-based routing
- local fallback state
- admin dashboards
- CRUD operations
- order flow
- coupon logic
- deployment prep

It is not only a design project.

It teaches how a real full-stack product is organized.

## 11. If You Want To Study This Project Step By Step

Best order to learn it:

1. Read [docs/architecture.md](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/docs/architecture.md)
2. Read [frontend/src/main.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/main.jsx)
3. Read [frontend/src/App.jsx](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/App.jsx)
4. Read all files in `frontend/src/context`
5. Read [frontend/src/lib/api.js](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/src/lib/api.js)
6. Read customer pages
7. Read admin pages
8. Read backend controllers
9. Read backend services
10. Read backend entities and repositories
11. Read database SQL files

This order is good because:

- first you understand the UI map
- then the shared state
- then the API calls
- then the backend logic
- then the database

## 12. Short Summary

If we explain BrightCart in one simple paragraph:

BrightCart is a full-stack e-commerce system built with React on the frontend and Spring Boot on the backend. It supports customer shopping, admin store management, authentication, cart, wishlist, checkout, coupons, orders, CSV export, business-account upgrade flow, and local fallback/demo state using browser storage. The frontend handles page rendering and interaction, the backend handles APIs and business rules, and the database stores the long-term data.

## 13. What To Read Next

If you want, the next helpful documents I can create are:

- `docs/frontend-explained.md`
  only frontend in baby steps
- `docs/backend-explained.md`
  only backend in baby steps
- `docs/database-explained.md`
  only tables and SQL in simple words
- `docs/api-explained.md`
  every API endpoint explained one by one
