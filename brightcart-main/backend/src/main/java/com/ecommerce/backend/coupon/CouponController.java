package com.ecommerce.backend.coupon;

import com.ecommerce.backend.auth.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;
    private final CurrentUserService currentUserService;

    public CouponController(CouponService couponService, CurrentUserService currentUserService) {
        this.couponService = couponService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<CouponResponse> coupons() {
        currentUserService.requireAdmin();
        return couponService.findAll();
    }

    @PostMapping
    public CouponResponse createCoupon(@Valid @RequestBody CouponUpsertRequest request) {
        currentUserService.requireAdmin();
        return couponService.create(request);
    }

    @PutMapping("/{couponId}")
    public CouponResponse updateCoupon(
            @PathVariable Long couponId,
            @Valid @RequestBody CouponUpsertRequest request
    ) {
        currentUserService.requireAdmin();
        return couponService.update(couponId, request);
    }

    @DeleteMapping("/{couponId}")
    public void deleteCoupon(@PathVariable Long couponId) {
        currentUserService.requireAdmin();
        couponService.delete(couponId);
    }

    @PostMapping("/validate")
    public CouponValidationResponse validateCoupon(@Valid @RequestBody CouponValidationRequest request) {
        return couponService.validate(request);
    }
}
