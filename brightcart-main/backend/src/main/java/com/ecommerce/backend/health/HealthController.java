package com.ecommerce.backend.health;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final SchemaHealthService schemaHealthService;

    public HealthController(SchemaHealthService schemaHealthService) {
        this.schemaHealthService = schemaHealthService;
    }

    @GetMapping
    public Map<String, Object> health() {
        SchemaHealthReport schema = schemaHealthService.currentReport();

        return Map.of(
                "status", "UP".equals(schema.status()) ? "UP" : "DEGRADED",
                "service", "ecommerce-backend",
                "schemaStatus", schema.status(),
                "schemaIssues", schema.issues()
        );
    }

    @GetMapping("/schema")
    public SchemaHealthReport schemaHealth() {
        return schemaHealthService.currentReport();
    }
}
