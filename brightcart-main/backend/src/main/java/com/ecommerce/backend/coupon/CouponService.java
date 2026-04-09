package com.ecommerce.backend.coupon;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Locale;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @PostConstruct
    @Transactional
    public void ensureSeedCoupons() {
        if (couponRepository.count() > 0) {
            return;
        }

        create(new CouponUpsertRequest("WELCOME10", "10% off on your first order", "PERCENTAGE", 10, 2000, true));
        create(new CouponUpsertRequest("SAVE500", "Flat Rs. 500 off on larger baskets", "FIXED", 500, 5000, true));
        create(new CouponUpsertRequest("SHIP99", "Shipping covered on eligible orders", "FIXED", 99, 1500, true));
    }

    @Transactional
    public List<CouponResponse> findAll() {
        return couponRepository.findAll(Sort.by(Sort.Direction.ASC, "code")).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CouponResponse create(CouponUpsertRequest request) {
        Coupon coupon = new Coupon();
        applyRequest(coupon, request);
        return toResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponResponse update(Long couponId, CouponUpsertRequest request) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));
        applyRequest(coupon, request);
        return toResponse(couponRepository.save(coupon));
    }

    @Transactional
    public void delete(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new CouponNotFoundException(couponId));
        couponRepository.delete(coupon);
    }

    @Transactional
    public CouponValidationResponse validate(CouponValidationRequest request) {
        CouponApplication application = resolveCoupon(request.code(), request.subtotal());
        return new CouponValidationResponse(
                application.code(),
                application.description(),
                application.discountType(),
                application.discountValue(),
                application.minOrderAmount(),
                application.discountAmount()
        );
    }

    @Transactional
    public CouponApplication previewCoupon(String code, Integer subtotal) {
        if (code == null || code.isBlank()) {
            return null;
        }

        return resolveCoupon(code, subtotal == null ? 0 : subtotal);
    }

    private CouponApplication resolveCoupon(String rawCode, Integer subtotal) {
        String normalizedCode = rawCode == null ? "" : rawCode.trim().toUpperCase(Locale.ENGLISH);
        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizedCode)
                .orElseThrow(() -> new InvalidCouponException("This code could not be applied."));

        if (!isActive(coupon)) {
            throw new InvalidCouponException("This code is not active right now.");
        }

        int minimumAmount = coupon.getMinOrderAmount() == null ? 0 : coupon.getMinOrderAmount();
        int currentSubtotal = subtotal == null ? 0 : subtotal;

        if (currentSubtotal < minimumAmount) {
            throw new InvalidCouponException(
                    "Add Rs. " + (minimumAmount - currentSubtotal) + " more to use " + coupon.getCode() + "."
            );
        }

        int discountAmount = calculateDiscountAmount(coupon, currentSubtotal);

        if (discountAmount <= 0) {
            throw new InvalidCouponException("This code could not be applied.");
        }

        return new CouponApplication(
                coupon.getCode(),
                coupon.getDescription(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                minimumAmount,
                discountAmount
        );
    }

    private int calculateDiscountAmount(Coupon coupon, int subtotal) {
        String discountType = coupon.getDiscountType() == null
                ? ""
                : coupon.getDiscountType().trim().toUpperCase(Locale.ENGLISH);
        int discountValue = coupon.getDiscountValue() == null ? 0 : coupon.getDiscountValue();

        return switch (discountType) {
            case "PERCENTAGE" -> Math.max(0, (int) Math.round((subtotal * discountValue) / 100.0));
            case "FIXED" -> Math.max(0, Math.min(discountValue, subtotal));
            default -> throw new InvalidCouponException("This code has an unsupported discount type.");
        };
    }

    private CouponResponse toResponse(Coupon coupon) {
        return new CouponResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDescription(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getMinOrderAmount(),
                isActive(coupon)
        );
    }

    private void applyRequest(Coupon coupon, CouponUpsertRequest request) {
        coupon.setCode(request.code().trim().toUpperCase(Locale.ENGLISH));
        coupon.setDescription(request.description().trim());
        coupon.setDiscountType(request.discountType().trim().toUpperCase(Locale.ENGLISH));
        coupon.setDiscountValue(request.discountValue());
        coupon.setMinOrderAmount(request.minOrderAmount());
        coupon.setIsActive(Boolean.TRUE.equals(request.active()) ? 1 : 0);
    }

    private boolean isActive(Coupon coupon) {
        return coupon.getIsActive() != null && coupon.getIsActive() == 1;
    }
}
