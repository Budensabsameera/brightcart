package com.ecommerce.backend.account;

import com.ecommerce.backend.auth.CurrentUserService;
import com.ecommerce.backend.auth.Role;
import com.ecommerce.backend.auth.RoleRepository;
import com.ecommerce.backend.auth.User;
import com.ecommerce.backend.auth.UserRepository;
import com.ecommerce.backend.auth.UserSessionResponse;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AccountService(
            CurrentUserService currentUserService,
            UserRepository userRepository,
            RoleRepository roleRepository
    ) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public UserSessionResponse getProfile() {
        return toResponse(currentUserService.getCurrentUser());
    }

    @Transactional
    public UserSessionResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUserService.getCurrentUser();
        String[] nameParts = splitName(request.name());
        user.setFirstName(nameParts[0]);
        user.setLastName(nameParts[1]);
        user.setPhone(request.phone() == null ? null : request.phone().trim());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserSessionResponse createBusinessAccount(CreateBusinessAccountRequest request) {
        User user = currentUserService.getCurrentUser();
        Role adminRole = findOrCreateRole("ADMIN");
        user.setRole(adminRole);

        if (request.phone() != null && !request.phone().trim().isEmpty()) {
            user.setPhone(request.phone().trim());
        }

        return toResponse(userRepository.save(user));
    }

    private UserSessionResponse toResponse(User user) {
        return new UserSessionResponse(
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPhone()
        );
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

        return new String[] {parts[0], String.join(" ", Arrays.copyOfRange(parts, 1, parts.length))};
    }

    private Role findOrCreateRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
    }
}
