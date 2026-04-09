package com.ecommerce.backend.health;

import java.util.List;

public record SchemaHealthReport(
        String status,
        List<String> issues
) {
}
