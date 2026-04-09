# E-Commerce Project

Full-stack e-commerce application built incrementally with:

- React.js frontend
- Spring Boot backend
- Oracle database

## Structure

- `frontend/` React application shell
- `backend/` Spring Boot API shell
- `database/` Oracle schema and seed scripts
- `docs/` project structure, pages, and feature roadmap

## Initial Build Plan

1. Define project structure, pages, and features
2. Build shared frontend layout and routing
3. Build backend domain modules and APIs
4. Create Oracle schema and seed data
5. Connect frontend to backend flows incrementally

## Next Steps

Start with the pages and user flows in `docs/architecture.md`, then implement each slice one by one.

## Oracle Migration Note

If your Oracle database was created before the order lifecycle timestamp fields were added, run:

- `database/oracle/migrations/03_add_order_timeline_columns.sql`
- `database/oracle/migrations/04_add_coupons_and_order_discount.sql`

More database setup details are in `database/oracle/README.md`.

## Backend Profiles

- Default profile: `oracle`
- Local development profile: `local`

Run the backend against Oracle:

- `backend\\mvnw.cmd spring-boot:run`

Run the backend with local H2 development config:

- PowerShell: ``$env:SPRING_PROFILES_ACTIVE='local'; .\backend\mvnw.cmd spring-boot:run``
- CMD: `set SPRING_PROFILES_ACTIVE=local && backend\mvnw.cmd spring-boot:run`

## Deployment

Recommended split deployment:

- Frontend on Netlify
- Backend on Render

### Backend on Render

This repo includes [render.yaml](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/render.yaml) for the Spring Boot API.

Important environment variables:

- `SPRING_PROFILES_ACTIVE=local`
- `APP_CORS_FRONTEND_URL=https://your-netlify-site.netlify.app`

The backend now reads the host-provided `PORT` automatically.

### Frontend on Netlify

This repo includes [netlify.toml](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/netlify.toml) for the Vite frontend.

Set this environment variable in Netlify:

- `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

You can use [frontend/.env.example](/c:/Users/buden/OneDrive/Desktop/Pictures/Desktop/ecommerce_project/frontend/.env.example) as the reference.
