package com.ecommerce.backend.auth;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String DEFAULT_ADMIN_EMAIL = "hello@brightcart.in";
    private static final String DEFAULT_ADMIN_PASSWORD = "password123";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SessionService sessionService;
    private final PasswordService passwordService;
    private final OtpService otpService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            SessionService sessionService,
            PasswordService passwordService,
            OtpService otpService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.sessionService = sessionService;
        this.passwordService = passwordService;
        this.otpService = otpService;
    }

    @PostConstruct
    @Transactional
    public void ensureDefaultData() {
        Role adminRole = findOrCreateRole("ADMIN");
        findOrCreateRole("CUSTOMER");

        userRepository.findByEmailIgnoreCase(DEFAULT_ADMIN_EMAIL)
                .map(existingUser -> upgradePasswordIfNeeded(existingUser, DEFAULT_ADMIN_PASSWORD))
                .orElseGet(() -> {
                    User user = new User();
                    user.setRole(adminRole);
                    user.setEmail(DEFAULT_ADMIN_EMAIL);
                    user.setFirstName("BrightCart");
                    user.setLastName("Admin");
                    user.setPasswordHash(passwordService.encode(DEFAULT_ADMIN_PASSWORD));
                    user.setPhone("9876543210");
                    user.setIsActive(1);
                    log.info("Seeding default admin user {}", DEFAULT_ADMIN_EMAIL);
                    return userRepository.save(user);
                });
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        log.info("Processing signup for email={}", normalizedEmail);

        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            log.warn("Signup rejected because email already exists: {}", normalizedEmail);
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        Role customerRole = findOrCreateRole("CUSTOMER");
        String[] nameParts = splitName(request.name());

        User user = new User();
        user.setRole(customerRole);
        user.setEmail(normalizedEmail);
        user.setFirstName(nameParts[0]);
        user.setLastName(nameParts[1]);
        user.setPasswordHash(passwordService.encode(request.password().trim()));
        user.setIsActive(1);

        User savedUser = userRepository.save(user);
        log.info("Signup successful for email={} with userId={}", normalizedEmail, savedUser.getId());
        return toAuthResponse(savedUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        log.info("Processing login for email={}", normalizedEmail);

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed for email={}", normalizedEmail);
                    return new InvalidCredentialsException();
                });

        if (!passwordService.matches(request.password(), user.getPasswordHash())) {
            log.warn("Login failed for email={}", normalizedEmail);
            throw new InvalidCredentialsException();
        }

        if (!passwordService.isEncoded(user.getPasswordHash())) {
            user.setPasswordHash(passwordService.encode(request.password()));
            userRepository.save(user);
            log.info("Upgraded legacy password storage for email={}", normalizedEmail);
        }

        log.info("Login successful for email={} with userId={}", normalizedEmail, user.getId());
        return toAuthResponse(user);
    }

    public OtpResponse requestPasswordReset(ForgotPasswordRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        log.info("Processing forgot password request for email={}", normalizedEmail);
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Forgot password rejected because user was not found: {}", normalizedEmail);
                    return new UserNotFoundException(normalizedEmail);
                });

        String otp = otpService.createOtp(user);
        log.info("Generated OTP for email={} otp={}", normalizedEmail, otp);

        return new OtpResponse("OTP sent to your email", otp);
    }

    public MessageResponse verifyOtp(VerifyOtpRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        log.info("Processing OTP verification for email={}", normalizedEmail);
        User user = ensureUserExists(normalizedEmail);
        if (!otpService.isValid(user, request.otp().trim())) {
            log.warn("OTP verification failed for email={}", normalizedEmail);
            throw new InvalidOtpException();
        }

        log.info("OTP verification successful for email={}", normalizedEmail);
        return new MessageResponse("OTP verified successfully");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        log.info("Processing reset password request for email={}", normalizedEmail);

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Reset password rejected because user was not found: {}", normalizedEmail);
                    return new UserNotFoundException(normalizedEmail);
                });

        if (!otpService.isValid(user, request.otp().trim())) {
            log.warn("Reset password rejected because OTP was invalid for email={}", normalizedEmail);
            throw new InvalidOtpException();
        }

        user.setPasswordHash(passwordService.encode(request.newPassword().trim()));
        userRepository.save(user);
        otpService.clearOtp(user);
        log.info("Password reset successful for email={}", normalizedEmail);
        return new MessageResponse("Password reset successful");
    }

    private User upgradePasswordIfNeeded(User user, String rawPassword) {
        if (!passwordService.isEncoded(user.getPasswordHash())) {
            user.setPasswordHash(passwordService.encode(rawPassword));
            log.info("Upgrading seeded password storage for email={}", user.getEmail());
            return userRepository.save(user);
        }

        return user;
    }

    private User ensureUserExists(String normalizedEmail) {
        return userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("OTP verification rejected because user was not found: {}", normalizedEmail);
                    return new UserNotFoundException(normalizedEmail);
                });
    }

    private Role findOrCreateRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
    }

    private String[] splitName(String fullName) {
        String trimmedName = fullName == null ? "" : fullName.trim();
        String[] parts = Arrays.stream(trimmedName.split("\\s+"))
                .filter(part -> !part.isBlank())
                .toArray(String[]::new);

        if (parts.length == 0) {
            return new String[] {"BrightCart", "User"};
        }

        if (parts.length == 1) {
            return new String[] {parts[0], "User"};
        }

        String firstName = parts[0];
        String lastName = String.join(" ", Arrays.copyOfRange(parts, 1, parts.length));
        return new String[] {firstName, lastName};
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
                sessionService.createSession(user),
                new UserSessionResponse(
                        user.getId(),
                        user.getDisplayName(),
                        user.getEmail(),
                        user.getRole().getName(),
                        user.getPhone()
                )
        );
    }
}
