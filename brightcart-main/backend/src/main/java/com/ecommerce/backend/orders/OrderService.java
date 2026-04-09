package com.ecommerce.backend.orders;

import com.ecommerce.backend.auth.CurrentUserService;
import com.ecommerce.backend.auth.User;
import com.ecommerce.backend.cart.CartItem;
import com.ecommerce.backend.cart.CartItemRepository;
import com.ecommerce.backend.cart.CartResponse;
import com.ecommerce.backend.cart.CartService;
import com.ecommerce.backend.catalog.Product;
import com.ecommerce.backend.catalog.ProductRepository;
import com.ecommerce.backend.coupon.CouponApplication;
import com.ecommerce.backend.coupon.CouponService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final CartService cartService;
    private final CartItemRepository cartItemRepository;
    private final CurrentUserService currentUserService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CouponService couponService;

    public OrderService(
            CartService cartService,
            CartItemRepository cartItemRepository,
            CurrentUserService currentUserService,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            CouponService couponService
    ) {
        this.cartService = cartService;
        this.cartItemRepository = cartItemRepository;
        this.currentUserService = currentUserService;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.couponService = couponService;
    }

    @Transactional
    public OrderResponse placeOrder(CreateOrderRequest request) {
        CartResponse cart = cartService.getCart();

        if (cart.items().isEmpty()) {
            throw new EmptyCartException();
        }

        User user = currentUserService.getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByCart(cartService.getOrCreateCartForCurrentUser());
        validateStockForCartItems(cartItems);
        CouponApplication appliedCoupon = couponService.previewCoupon(request.couponCode(), cart.subtotal());
        int discountAmount = appliedCoupon == null ? 0 : appliedCoupon.discountAmount();
        int finalTotal = Math.max(cart.subtotal() + cart.shipping() - discountAmount, 0);

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setTotalAmount(finalTotal);
        order.setShippingAddress(request.address().trim());
        order.setCustomerName(request.name().trim());
        order.setPhoneNumber(request.phone().trim());
        order.setCouponCode(appliedCoupon == null ? null : appliedCoupon.code());
        order.setDiscountAmount(discountAmount);
        applyStatusTimestamps(order, "PLACED", LocalDateTime.now());
        OrderEntity savedOrder = orderRepository.save(order);

        log.info("Creating order {} for customer={} with {} items",
                savedOrder.getId(), request.name(), cart.totalItems());

        cartItems.forEach(item -> reduceStock(item.getProduct(), item.getQuantity()));

        List<OrderItemResponse> items = cartItems.stream()
                .map(item -> {
                    OrderItemEntity orderItem = new OrderItemEntity();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProduct(item.getProduct());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setUnitPrice(item.getUnitPrice());
                    orderItemRepository.save(orderItem);
                    return new OrderItemResponse(
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getUnitPrice(),
                            item.getQuantity()
                    );
                })
                .toList();

        cartService.clearCart();
        log.info("Order {} created successfully", savedOrder.getId());

        return new OrderResponse(
                savedOrder.getId(),
                request.name().trim(),
                request.address().trim(),
                request.phone().trim(),
                items,
                cart.subtotal(),
                cart.shipping(),
                appliedCoupon == null ? null : appliedCoupon.code(),
                discountAmount,
                finalTotal
        );
    }

    @Transactional
    public List<OrderHistoryResponse> getCurrentUserOrders() {
        User user = currentUserService.getCurrentUser();

        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toOrderHistoryResponse)
                .toList();
    }

    @Transactional
    public OrderHistoryResponse cancelCurrentUserOrder(Long orderId) {
        User user = currentUserService.getCurrentUser();
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new OrderNotFoundException(orderId);
        }

        if (!List.of("PLACED", "PROCESSING").contains(order.getOrderStatus())) {
            throw new InvalidOrderCancellationException(order.getOrderStatus());
        }

        List<OrderItemEntity> orderItems = orderItemRepository.findByOrder(order);
        orderItems.forEach(item -> increaseStock(item.getProduct(), item.getQuantity()));
        applyStatusTimestamps(order, "CANCELLED", LocalDateTime.now());
        return toOrderHistoryResponse(orderRepository.save(order));
    }

    @Transactional
    public List<OrderAdminResponse> getAllOrdersForAdmin() {
        currentUserService.requireAdmin();

        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toOrderAdminResponse)
                .toList();
    }

    @Transactional
    public OrderAdminResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        currentUserService.requireAdmin();

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        String currentStatus = order.getOrderStatus();
        String normalizedStatus = normalizeStatus(request.status());

        if (currentStatus.equals(normalizedStatus)) {
            return toOrderAdminResponse(order);
        }

        List<OrderItemEntity> orderItems = orderItemRepository.findByOrder(order);

        if (!"CANCELLED".equals(currentStatus) && "CANCELLED".equals(normalizedStatus)) {
            orderItems.forEach(item -> increaseStock(item.getProduct(), item.getQuantity()));
        } else if ("CANCELLED".equals(currentStatus) && !"CANCELLED".equals(normalizedStatus)) {
            validateStockForOrderItems(orderItems);
            orderItems.forEach(item -> reduceStock(item.getProduct(), item.getQuantity()));
        }

        applyStatusTimestamps(order, normalizedStatus, LocalDateTime.now());
        return toOrderAdminResponse(orderRepository.save(order));
    }

    private OrderHistoryResponse toOrderHistoryResponse(OrderEntity order) {
        List<OrderItemResponse> items = orderItemRepository.findByOrder(order).stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getUnitPrice(),
                        item.getQuantity()
                ))
                .toList();

        int subtotal = items.stream()
                .mapToInt(item -> item.price() * item.quantity())
                .sum();
        int shipping = Math.max(order.getTotalAmount() - subtotal, 0);

        return new OrderHistoryResponse(
                order.getId(),
                order.getOrderStatus(),
                order.getCreatedAt(),
                order.getPlacedAt(),
                order.getProcessingAt(),
                order.getShippedAt(),
                order.getDeliveredAt(),
                order.getCancelledAt(),
                order.getCustomerName(),
                order.getShippingAddress(),
                order.getPhoneNumber(),
                items,
                subtotal,
                shipping,
                order.getCouponCode(),
                order.getDiscountAmount(),
                order.getTotalAmount()
        );
    }

    private OrderAdminResponse toOrderAdminResponse(OrderEntity order) {
        List<OrderItemResponse> items = orderItemRepository.findByOrder(order).stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getUnitPrice(),
                        item.getQuantity()
                ))
                .toList();

        int subtotal = items.stream()
                .mapToInt(item -> item.price() * item.quantity())
                .sum();
        int shipping = Math.max(order.getTotalAmount() - subtotal, 0);

        return new OrderAdminResponse(
                order.getId(),
                order.getOrderStatus(),
                order.getCreatedAt(),
                order.getPlacedAt(),
                order.getProcessingAt(),
                order.getShippedAt(),
                order.getDeliveredAt(),
                order.getCancelledAt(),
                order.getCustomerName(),
                order.getUser().getEmail(),
                order.getShippingAddress(),
                order.getPhoneNumber(),
                items,
                subtotal,
                shipping,
                order.getCouponCode(),
                order.getDiscountAmount(),
                order.getTotalAmount()
        );
    }

    private String normalizeStatus(String rawStatus) {
        String normalizedStatus = rawStatus == null ? "" : rawStatus.trim().toUpperCase();

        if (!List.of("PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED").contains(normalizedStatus)) {
            throw new InvalidOrderStatusException(rawStatus);
        }

        return normalizedStatus;
    }

    private void validateStockForCartItems(List<CartItem> cartItems) {
        cartItems.forEach(item -> {
            Product product = item.getProduct();
            int availableQuantity = product.getStockQuantity() == null ? 0 : product.getStockQuantity();

            if (item.getQuantity() > availableQuantity) {
                throw new InsufficientStockException(product.getName(), item.getQuantity(), availableQuantity);
            }
        });
    }

    private void validateStockForOrderItems(List<OrderItemEntity> orderItems) {
        orderItems.forEach(item -> {
            Product product = item.getProduct();
            int availableQuantity = product.getStockQuantity() == null ? 0 : product.getStockQuantity();

            if (item.getQuantity() > availableQuantity) {
                throw new InsufficientStockException(product.getName(), item.getQuantity(), availableQuantity);
            }
        });
    }

    private void reduceStock(Product product, int orderedQuantity) {
        int currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        product.setStockQuantity(currentStock - orderedQuantity);
        productRepository.save(product);
    }

    private void increaseStock(Product product, int quantityToRestore) {
        int currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        product.setStockQuantity(currentStock + quantityToRestore);
        productRepository.save(product);
    }

    private void applyStatusTimestamps(OrderEntity order, String status, LocalDateTime timestamp) {
        order.setOrderStatus(status);
        order.setPlacedAt(order.getPlacedAt() == null ? timestamp : order.getPlacedAt());

        switch (status) {
            case "PLACED" -> {
                order.setProcessingAt(null);
                order.setShippedAt(null);
                order.setDeliveredAt(null);
                order.setCancelledAt(null);
            }
            case "PROCESSING" -> {
                order.setProcessingAt(order.getProcessingAt() == null ? timestamp : order.getProcessingAt());
                order.setShippedAt(null);
                order.setDeliveredAt(null);
                order.setCancelledAt(null);
            }
            case "SHIPPED" -> {
                order.setProcessingAt(order.getProcessingAt() == null ? timestamp : order.getProcessingAt());
                order.setShippedAt(order.getShippedAt() == null ? timestamp : order.getShippedAt());
                order.setDeliveredAt(null);
                order.setCancelledAt(null);
            }
            case "DELIVERED" -> {
                order.setProcessingAt(order.getProcessingAt() == null ? timestamp : order.getProcessingAt());
                order.setShippedAt(order.getShippedAt() == null ? timestamp : order.getShippedAt());
                order.setDeliveredAt(order.getDeliveredAt() == null ? timestamp : order.getDeliveredAt());
                order.setCancelledAt(null);
            }
            case "CANCELLED" -> order.setCancelledAt(timestamp);
            default -> {
            }
        }
    }
}
