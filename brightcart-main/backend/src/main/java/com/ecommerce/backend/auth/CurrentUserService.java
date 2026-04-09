package com.ecommerce.backend.auth;

import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final RequestUserContext requestUserContext;
    private final UserRepository userRepository;

    public CurrentUserService(RequestUserContext requestUserContext, UserRepository userRepository) {
        this.requestUserContext = requestUserContext;
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Long userId = requestUserContext.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException();
        }

        return userRepository.findById(userId)
                .orElseThrow(UnauthorizedException::new);
    }

    public void requireAdmin() {
        User user = getCurrentUser();
        String roleName = user.getRole() == null ? null : user.getRole().getName();

        if (!"ADMIN".equalsIgnoreCase(roleName)) {
            throw new ForbiddenException();
        }
    }
}
