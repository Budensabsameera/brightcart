DECLARE
    column_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO column_count
    FROM user_tab_columns
    WHERE table_name = 'ORDERS'
      AND column_name = 'PLACED_AT';

    IF column_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE orders ADD (placed_at TIMESTAMP)';
    END IF;

    SELECT COUNT(*)
    INTO column_count
    FROM user_tab_columns
    WHERE table_name = 'ORDERS'
      AND column_name = 'PROCESSING_AT';

    IF column_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE orders ADD (processing_at TIMESTAMP)';
    END IF;

    SELECT COUNT(*)
    INTO column_count
    FROM user_tab_columns
    WHERE table_name = 'ORDERS'
      AND column_name = 'SHIPPED_AT';

    IF column_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE orders ADD (shipped_at TIMESTAMP)';
    END IF;

    SELECT COUNT(*)
    INTO column_count
    FROM user_tab_columns
    WHERE table_name = 'ORDERS'
      AND column_name = 'DELIVERED_AT';

    IF column_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE orders ADD (delivered_at TIMESTAMP)';
    END IF;

    SELECT COUNT(*)
    INTO column_count
    FROM user_tab_columns
    WHERE table_name = 'ORDERS'
      AND column_name = 'CANCELLED_AT';

    IF column_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE orders ADD (cancelled_at TIMESTAMP)';
    END IF;

    EXECUTE IMMEDIATE q'[
        UPDATE orders
        SET placed_at = COALESCE(placed_at, created_at)
        WHERE placed_at IS NULL
    ]';

    EXECUTE IMMEDIATE q'[
        UPDATE orders
        SET processing_at = COALESCE(processing_at, created_at)
        WHERE order_status IN ('PROCESSING', 'SHIPPED', 'DELIVERED')
          AND processing_at IS NULL
    ]';

    EXECUTE IMMEDIATE q'[
        UPDATE orders
        SET shipped_at = COALESCE(shipped_at, created_at)
        WHERE order_status IN ('SHIPPED', 'DELIVERED')
          AND shipped_at IS NULL
    ]';

    EXECUTE IMMEDIATE q'[
        UPDATE orders
        SET delivered_at = COALESCE(delivered_at, created_at)
        WHERE order_status = 'DELIVERED'
          AND delivered_at IS NULL
    ]';

    EXECUTE IMMEDIATE q'[
        UPDATE orders
        SET cancelled_at = COALESCE(cancelled_at, created_at)
        WHERE order_status = 'CANCELLED'
          AND cancelled_at IS NULL
    ]';
END;
/
