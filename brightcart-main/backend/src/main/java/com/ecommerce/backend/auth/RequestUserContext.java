package com.ecommerce.backend.auth;

import org.springframework.stereotype.Component;

@Component
public class RequestUserContext {

    private static final ThreadLocal<Long> CURRENT_USER_ID = new ThreadLocal<>();

    public void setCurrentUserId(Long userId) {
        CURRENT_USER_ID.set(userId);
    }

    public Long getCurrentUserId() {
        return CURRENT_USER_ID.get();
    }

    public void clear() {
        CURRENT_USER_ID.remove();
    }
}
