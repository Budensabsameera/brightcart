package com.ecommerce.backend.auth;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final CurrentUserService currentUserService;
    private final SessionService sessionService;

    public AuthController(
            AuthService authService,
            CurrentUserService currentUserService,
            SessionService sessionService
    ) {
        this.authService = authService;
        this.currentUserService = currentUserService;
        this.sessionService = sessionService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        log.info("Received signup request for email={}", request.email());
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for email={}", request.email());
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserSessionResponse currentUser() {
        User user = currentUserService.getCurrentUser();
        log.info("Resolved current user for email={}", user.getEmail());
        return new UserSessionResponse(
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPhone()
        );
    }

    @PostMapping("/logout")
    public MessageResponse logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();
            sessionService.invalidate(token);
            log.info("Logged out current session");
        }

        return new MessageResponse("Logged out successfully");
    }

    @PostMapping("/forgot-password")
    public OtpResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Received forgot password request for email={}", request.email());
        return authService.requestPasswordReset(request);
    }

    @PostMapping("/verify-otp")
    public MessageResponse verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("Received verify OTP request for email={}", request.email());
        return authService.verifyOtp(request);
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Received reset password request for email={}", request.email());
        return authService.resetPassword(request);
    }
}
