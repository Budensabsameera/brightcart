package com.ecommerce.backend.auth;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    private static final long SESSION_DAYS = 7;

    private final UserSessionRepository userSessionRepository;

    public SessionService(UserSessionRepository userSessionRepository) {
        this.userSessionRepository = userSessionRepository;
    }

    @Transactional
    public String createSession(User user) {
        cleanupExpiredSessions();

        LocalDateTime now = LocalDateTime.now();
        UserSession session = new UserSession();
        session.setUser(user);
        session.setToken("token-" + UUID.randomUUID());
        session.setCreatedAt(now);
        session.setLastUsedAt(now);
        session.setExpiresAt(now.plusDays(SESSION_DAYS));
        return userSessionRepository.save(session).getToken();
    }

    @Transactional
    public Optional<User> resolveUser(String token) {
        cleanupExpiredSessions();

        return userSessionRepository.findByToken(token)
                .filter(session -> session.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(session -> {
                    session.setLastUsedAt(LocalDateTime.now());
                    userSessionRepository.save(session);
                    return session.getUser();
                });
    }

    @Transactional
    public void invalidate(String token) {
        userSessionRepository.deleteByToken(token);
    }

    @Transactional
    @Scheduled(fixedDelayString = "${app.auth.cleanup-interval-ms:900000}")
    public void cleanupExpiredSessions() {
        userSessionRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
