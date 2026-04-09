package com.ecommerce.backend.auth;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByUserOrderByCreatedAtDesc(User user);

    void deleteByUser(User user);

    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}
