package com.ecommerce.backend.auth;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private static final long OTP_MINUTES = 10;

    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final Random random = new Random();

    public OtpService(PasswordResetOtpRepository passwordResetOtpRepository) {
        this.passwordResetOtpRepository = passwordResetOtpRepository;
    }

    @Transactional
    public String createOtp(User user) {
        cleanupExpiredOtps();
        passwordResetOtpRepository.deleteByUser(user);

        LocalDateTime now = LocalDateTime.now();
        PasswordResetOtp otpRecord = new PasswordResetOtp();
        otpRecord.setUser(user);
        otpRecord.setOtp(String.format("%06d", random.nextInt(1_000_000)));
        otpRecord.setCreatedAt(now);
        otpRecord.setExpiresAt(now.plusMinutes(OTP_MINUTES));
        return passwordResetOtpRepository.save(otpRecord).getOtp();
    }

    @Transactional
    public boolean isValid(User user, String otp) {
        cleanupExpiredOtps();

        return passwordResetOtpRepository.findTopByUserOrderByCreatedAtDesc(user)
                .filter(record -> record.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(record -> record.getOtp().equals(otp))
                .orElse(false);
    }

    @Transactional
    public void clearOtp(User user) {
        passwordResetOtpRepository.deleteByUser(user);
    }

    @Scheduled(fixedDelayString = "${app.auth.cleanup-interval-ms:900000}")
    @Transactional
    public void cleanupExpiredOtps() {
        passwordResetOtpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
