package com.ecommerce.backend.admin;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/overview")
    public AdminOverviewResponse overview() {
        return adminService.getOverview();
    }

    @GetMapping("/customers")
    public List<AdminCustomerResponse> customers() {
        return adminService.getCustomers();
    }
}
