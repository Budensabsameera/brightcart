package com.ecommerce.backend.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean matches(String rawPassword, String storedPasswordHash) {
        if (storedPasswordHash == null || storedPasswordHash.isBlank()) {
            return false;
        }

        if (isEncoded(storedPasswordHash)) {
            return passwordEncoder.matches(rawPassword, storedPasswordHash);
        }

        return storedPasswordHash.equals(rawPassword);
    }

    public boolean isEncoded(String value) {
        return value != null && value.startsWith("$2");
    }
}
