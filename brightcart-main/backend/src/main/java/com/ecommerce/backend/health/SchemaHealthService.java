package com.ecommerce.backend.health;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;

@Service
public class SchemaHealthService implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SchemaHealthService.class);

    private static final Map<String, List<String>> REQUIRED_SCHEMA = Map.of(
            "ORDERS", List.of(
                    "ORDER_STATUS",
                    "TOTAL_AMOUNT",
                    "SHIPPING_ADDRESS",
                    "CUSTOMER_NAME",
                    "PHONE_NUMBER",
                    "COUPON_CODE",
                    "DISCOUNT_AMOUNT",
                    "PLACED_AT",
                    "PROCESSING_AT",
                    "SHIPPED_AT",
                    "DELIVERED_AT",
                    "CANCELLED_AT"
            ),
            "COUPONS", List.of(
                    "CODE",
                    "DISCOUNT_TYPE",
                    "DISCOUNT_VALUE",
                    "MIN_ORDER_AMOUNT",
                    "IS_ACTIVE"
            ),
            "PRODUCTS", List.of(
                    "STOCK_QUANTITY",
                    "PRICE",
                    "ORIGINAL_PRICE"
            ),
            "USERS", List.of(
                    "EMAIL",
                    "PASSWORD_HASH"
            )
    );

    private final DataSource dataSource;
    private final boolean failOnSchemaMismatch;

    private volatile SchemaHealthReport latestReport = new SchemaHealthReport("UNKNOWN", List.of());

    public SchemaHealthService(
            DataSource dataSource,
            @Value("${app.schema.fail-on-mismatch:false}") boolean failOnSchemaMismatch
    ) {
        this.dataSource = dataSource;
        this.failOnSchemaMismatch = failOnSchemaMismatch;
    }

    @Override
    public void run(ApplicationArguments args) {
        SchemaHealthReport report = inspectSchema();
        latestReport = report;

        if ("UP".equals(report.status())) {
            log.info("Schema health check passed");
            return;
        }

        log.warn("Schema health check found issues: {}", String.join(" | ", report.issues()));

        if (failOnSchemaMismatch) {
            throw new IllegalStateException("Schema validation failed: " + String.join(" | ", report.issues()));
        }
    }

    public SchemaHealthReport currentReport() {
        latestReport = inspectSchema();
        return latestReport;
    }

    private SchemaHealthReport inspectSchema() {
        List<String> issues = new ArrayList<>();
        Set<String> existingTables = readTables();

        for (Map.Entry<String, List<String>> entry : REQUIRED_SCHEMA.entrySet()) {
            String tableName = entry.getKey();

            if (!existingTables.contains(tableName)) {
                issues.add("Missing table: " + tableName);
                continue;
            }

            Set<String> existingColumns = readColumns(tableName);
            for (String columnName : entry.getValue()) {
                if (!existingColumns.contains(columnName)) {
                    issues.add("Missing column: " + tableName + "." + columnName);
                }
            }
        }

        return new SchemaHealthReport(issues.isEmpty() ? "UP" : "DEGRADED", issues);
    }

    private Set<String> readTables() {
        Set<String> tables = new HashSet<>();

        try (var connection = dataSource.getConnection();
             var resultSet = connection.getMetaData().getTables(null, null, "%", new String[]{"TABLE"})) {
            while (resultSet.next()) {
                tables.add(resultSet.getString("TABLE_NAME").toUpperCase());
            }
        } catch (Exception exception) {
            log.warn("Unable to inspect schema tables: {}", exception.getMessage());
        }

        return tables;
    }

    private Set<String> readColumns(String tableName) {
        Set<String> columns = new HashSet<>();

        try (var connection = dataSource.getConnection();
             var resultSet = connection.getMetaData().getColumns(null, null, "%", "%")) {
            while (resultSet.next()) {
                String currentTableName = resultSet.getString("TABLE_NAME");

                if (currentTableName != null && currentTableName.equalsIgnoreCase(tableName)) {
                    columns.add(resultSet.getString("COLUMN_NAME").toUpperCase());
                }
            }
        } catch (Exception exception) {
            log.warn("Unable to inspect schema columns for {}: {}", tableName, exception.getMessage());
        }

        return columns;
    }
}
