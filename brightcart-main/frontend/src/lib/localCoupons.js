const LOCAL_COUPONS_STORAGE_KEY = "brightcart.coupons";

const defaultCoupons = [
  {
    id: 1,
    code: "WELCOME10",
    description: "10% off on your first order",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 2000,
    active: true
  },
  {
    id: 2,
    code: "SAVE500",
    description: "Flat Rs. 500 off on larger baskets",
    discountType: "FIXED",
    discountValue: 500,
    minOrderAmount: 5000,
    active: true
  },
  {
    id: 3,
    code: "SHIP99",
    description: "Shipping covered on eligible orders",
    discountType: "FIXED",
    discountValue: 99,
    minOrderAmount: 1500,
    active: true
  }
];

function readLocalCoupons() {
  try {
    const savedCoupons = window.localStorage.getItem(LOCAL_COUPONS_STORAGE_KEY);

    if (!savedCoupons) {
      return defaultCoupons;
    }

    const parsedCoupons = JSON.parse(savedCoupons);
    return Array.isArray(parsedCoupons) && parsedCoupons.length > 0 ? parsedCoupons : defaultCoupons;
  } catch {
    return defaultCoupons;
  }
}

function writeLocalCoupons(coupons) {
  try {
    window.localStorage.setItem(LOCAL_COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  } catch {
    // Ignore local storage failures and keep in-memory state.
  }
}

function validateLocalCoupon(code, subtotal) {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = readLocalCoupons().find((item) => item.code.toUpperCase() === normalizedCode);

  if (!coupon) {
    throw new Error("This code could not be applied.");
  }

  if (!coupon.active) {
    throw new Error("This code is not active right now.");
  }

  if (subtotal < coupon.minOrderAmount) {
    throw new Error(`Add Rs. ${coupon.minOrderAmount - subtotal} more to use ${coupon.code}.`);
  }

  const discountAmount = calculateCouponDiscount(coupon, subtotal);

  if (discountAmount <= 0) {
    throw new Error("This code could not be applied.");
  }

  return {
    ...coupon,
    discountAmount
  };
}

function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon || subtotal <= 0 || subtotal < (coupon.minOrderAmount ?? 0)) {
    return 0;
  }

  if (coupon.discountType === "PERCENTAGE") {
    return Math.max(0, Math.round((subtotal * coupon.discountValue) / 100));
  }

  if (coupon.discountType === "FIXED") {
    return Math.max(0, Math.min(coupon.discountValue, subtotal));
  }

  return 0;
}

export { calculateCouponDiscount, readLocalCoupons, validateLocalCoupon, writeLocalCoupons };
