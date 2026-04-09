package com.ecommerce.backend.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AuthTokenFilter.class);

    private final SessionService sessionService;
    private final RequestUserContext requestUserContext;

    public AuthTokenFilter(
            SessionService sessionService,
            RequestUserContext requestUserContext
    ) {
        this.sessionService = sessionService;
        this.requestUserContext = requestUserContext;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        try {
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7).trim();
                sessionService.resolveUser(token).ifPresentOrElse(user -> {
                    requestUserContext.setCurrentUserId(user.getId());
                    log.debug("Resolved authenticated user {} for {}", user.getEmail(), request.getRequestURI());
                }, () -> log.warn("Ignoring invalid auth token for {}", request.getRequestURI()));
            }

            filterChain.doFilter(request, response);
        } finally {
            requestUserContext.clear();
        }
    }
}
