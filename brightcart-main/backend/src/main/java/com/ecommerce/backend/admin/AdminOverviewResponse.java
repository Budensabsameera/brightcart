package com.ecommerce.backend.admin;

public record AdminOverviewResponse(
        Long totalProducts,
        Long totalCustomers,
        Long totalOrders,
        Integer totalRevenue,
        Long lowStockProducts,
        Long placedOrders,
        Long processingOrders,
        Long shippedOrders,
        Long deliveredOrders
) {
}
