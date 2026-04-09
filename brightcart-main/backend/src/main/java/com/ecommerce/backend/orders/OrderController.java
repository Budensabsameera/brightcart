package com.ecommerce.backend.orders;

import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderHistoryResponse> orders() {
        log.info("Received current user order history request");
        return orderService.getCurrentUserOrders();
    }

    @GetMapping("/admin")
    public List<OrderAdminResponse> adminOrders() {
        log.info("Received admin order management request");
        return orderService.getAllOrdersForAdmin();
    }

    @PostMapping
    public OrderResponse placeOrder(@Valid @RequestBody CreateOrderRequest request) {
        log.info("Received order request for customer={} phone={}", request.name(), request.phone());
        return orderService.placeOrder(request);
    }

    @PatchMapping("/admin/{orderId}")
    public OrderAdminResponse updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        log.info("Received admin order status update for orderId={} status={}", orderId, request.status());
        return orderService.updateOrderStatus(orderId, request);
    }

    @PatchMapping("/{orderId}/cancel")
    public OrderHistoryResponse cancelOrder(@PathVariable Long orderId) {
        log.info("Received customer order cancellation request for orderId={}", orderId);
        return orderService.cancelCurrentUserOrder(orderId);
    }
}
