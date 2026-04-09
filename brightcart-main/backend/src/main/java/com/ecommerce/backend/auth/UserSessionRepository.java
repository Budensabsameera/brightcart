package com.ecommerce.backend.auth;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    Optional<UserSession> findByToken(String token);

    void deleteByToken(String token);

    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}
