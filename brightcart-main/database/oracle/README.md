# Oracle Setup

This folder contains the starting Oracle schema and seed scripts for the e-commerce application.

## Planned Usage

- Run schema scripts first
- Insert seed data after schema creation
- Point the Spring Boot datasource to the Oracle instance

## Current Scripts

- `init/01_schema.sql`
- `init/02_seed.sql`

## Migrations

For an existing Oracle database that was created before order lifecycle timestamps were added, run:

- `migrations/03_add_order_timeline_columns.sql`

This migration:

- adds `placed_at`, `processing_at`, `shipped_at`, `delivered_at`, and `cancelled_at` to `orders`
- backfills reasonable values from `created_at` for existing rows based on the current `order_status`

## Suggested Order

For a brand-new database:

1. Run `init/01_schema.sql`
2. Run `init/02_seed.sql`

For an existing database:

1. Back up the database
2. Run the needed scripts from `migrations/`
3. Start the backend and verify order history/admin orders render correctly

## Backend Schema Checks

The backend now exposes lightweight schema validation endpoints:

- `GET /api/health`
- `GET /api/health/schema`

These report whether required Oracle tables and columns are present.

Startup behavior is configurable in `backend/src/main/resources/application.properties`:

- `app.schema.fail-on-mismatch=false`

Set it to `true` if you want startup to fail immediately when required schema pieces are missing.
