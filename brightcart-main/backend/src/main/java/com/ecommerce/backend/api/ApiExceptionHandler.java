package com.ecommerce.backend.api;

import com.ecommerce.backend.auth.EmailAlreadyExistsException;
import com.ecommerce.backend.auth.ForbiddenException;
import com.ecommerce.backend.auth.InvalidCredentialsException;
import com.ecommerce.backend.auth.InvalidOtpException;
import com.ecommerce.backend.auth.UnauthorizedException;
import com.ecommerce.backend.auth.UserNotFoundException;
import com.ecommerce.backend.cart.CartItemNotFoundException;
import com.ecommerce.backend.catalog.CategoryDeleteBlockedException;
import com.ecommerce.backend.catalog.CategoryNotFoundException;
import com.ecommerce.backend.catalog.ProductDeleteBlockedException;
import com.ecommerce.backend.catalog.ProductNotFoundException;
import com.ecommerce.backend.coupon.CouponNotFoundException;
import com.ecommerce.backend.coupon.InvalidCouponException;
import com.ecommerce.backend.orders.EmptyCartException;
import com.ecommerce.backend.orders.InsufficientStockException;
import com.ecommerce.backend.orders.InvalidOrderCancellationException;
import com.ecommerce.backend.orders.InvalidOrderStatusException;
import com.ecommerce.backend.orders.OrderNotFoundException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleProductNotFound(ProductNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(ProductDeleteBlockedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleProductDeleteBlocked(ProductDeleteBlockedException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(InvalidCouponException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInvalidCoupon(InvalidCouponException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(CouponNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleCouponNotFound(CouponNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleCategoryNotFound(CategoryNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(CategoryDeleteBlockedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleCategoryDeleteBlocked(CategoryDeleteBlockedException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleEmailExists(EmailAlreadyExistsException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleInvalidCredentials(InvalidCredentialsException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleUnauthorized(UnauthorizedException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, String> handleForbidden(ForbiddenException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleUserNotFound(UserNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(InvalidOtpException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInvalidOtp(InvalidOtpException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(EmptyCartException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleEmptyCart(EmptyCartException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(InsufficientStockException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInsufficientStock(InsufficientStockException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleOrderNotFound(OrderNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(InvalidOrderStatusException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInvalidOrderStatus(InvalidOrderStatusException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(InvalidOrderCancellationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInvalidOrderCancellation(InvalidOrderCancellationException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(CartItemNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleCartItemNotFound(CartItemNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + " " + error.getDefaultMessage())
                .orElse("Validation failed");

        return Map.of("message", message);
    }
}
