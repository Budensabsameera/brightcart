package com.ecommerce.backend.admin;

import com.ecommerce.backend.auth.CurrentUserService;
import com.ecommerce.backend.auth.UserRepository;
import com.ecommerce.backend.catalog.ProductRepository;
import com.ecommerce.backend.orders.OrderRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final CurrentUserService currentUserService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminService(
            CurrentUserService currentUserService,
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository
    ) {
        this.currentUserService = currentUserService;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public AdminOverviewResponse getOverview() {
        currentUserService.requireAdmin();

        return new AdminOverviewResponse(
                productRepository.count(),
                userRepository.countByRole_NameIgnoreCase("CUSTOMER"),
                orderRepository.count(),
                orderRepository.sumTotalAmount(),
                productRepository.countByStockQuantityLessThanEqual(10),
                orderRepository.countByOrderStatus("PLACED"),
                orderRepository.countByOrderStatus("PROCESSING"),
                orderRepository.countByOrderStatus("SHIPPED"),
                orderRepository.countByOrderStatus("DELIVERED")
        );
    }

    @Transactional
    public List<AdminCustomerResponse> getCustomers() {
        currentUserService.requireAdmin();

        return userRepository.findByRole_NameIgnoreCaseOrderByIdDesc("CUSTOMER").stream()
                .map(user -> new AdminCustomerResponse(
                        user.getId(),
                        user.getDisplayName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole().getName(),
                        user.getIsActive() != null && user.getIsActive() == 1 ? "Active" : "Inactive"
                ))
                .toList();
    }
}
