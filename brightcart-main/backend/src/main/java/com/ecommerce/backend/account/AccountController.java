package com.ecommerce.backend.account;

import com.ecommerce.backend.auth.UserSessionResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/profile")
    public UserSessionResponse profile() {
        return accountService.getProfile();
    }

    @PutMapping("/profile")
    public UserSessionResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return accountService.updateProfile(request);
    }

    @PostMapping("/business-account")
    public UserSessionResponse createBusinessAccount(@Valid @RequestBody CreateBusinessAccountRequest request) {
        return accountService.createBusinessAccount(request);
    }
}
