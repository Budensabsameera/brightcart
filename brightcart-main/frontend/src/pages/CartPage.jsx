import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import CartItem from "../components/product/CartItem";
import { useCart } from "../context/CartContext";
import { readLocalCoupons } from "../lib/localCoupons";
import { formatPrice } from "../utils/formatters";

function CartPage() {
  const [couponInput, setCouponInput] = useState("");
  const {
    cartItems,
    cartError,
    cartMode,
    appliedCoupon,
    summary,
    applyCoupon,
    removeCoupon,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();
  const availableCoupons = useMemo(
    () => readLocalCoupons().filter((coupon) => coupon.active),
    []
  );

  const handleApplyCoupon = async () => {
    try {
      const response = await applyCoupon(couponInput);
      setCouponInput(response.code);
    } catch {
      // Keep the inline cart error visible without extra handling here.
    }
  };

  const handleCouponToggle = async (coupon, eligible) => {
    const isApplied = appliedCoupon?.code === coupon.code;
    setCouponInput(coupon.code);

    if (isApplied) {
      removeCoupon();
      return;
    }

    if (!eligible) {
      return;
    }

    try {
      const response = await applyCoupon(coupon.code);
      setCouponInput(response.code);
    } catch {
      setCouponInput(coupon.code);
    }
  };

  return (
    <section className="cart-page">
      <div className="cart-header">
        <div>
          <span className="section-kicker">Cart</span>
          <h1 className="cart-title">Review your items before checkout.</h1>
          <p className="cart-subtitle">
            A clean summary of what you&apos;re about to buy, with quick quantity updates.
          </p>
        </div>
      </div>

      {cartError ? (
        <p className={cartMode === "local" ? "auth-success admin-mode-banner" : "auth-error"}>
          {cartError}
        </p>
      ) : null}

      {cartItems.length > 0 ? (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary-sticky">
              <span className="section-kicker">Order Summary</span>
              <h2>{summary.totalItems} items</h2>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(summary.subtotal)}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <strong>{formatPrice(summary.shipping)}</strong>
                </div>
                {summary.discount > 0 ? (
                  <div className="cart-summary-row cart-summary-discount">
                    <span>Discount</span>
                    <strong>-{formatPrice(summary.discount)}</strong>
                  </div>
                ) : null}
              </div>

              <div className="cart-coupon-box">
                <span className="cart-coupon-label">Discount code</span>
                {availableCoupons.length > 0 ? (
                  <div className="cart-coupon-list">
                    {availableCoupons.map((coupon) => {
                      const eligible = summary.subtotal >= coupon.minOrderAmount;
                      const isApplied = appliedCoupon?.code === coupon.code;

                      return (
                        <button
                          key={coupon.id}
                          type="button"
                          className={`cart-coupon-card${eligible ? "" : " cart-coupon-card-muted"}${
                            isApplied ? " cart-coupon-card-active" : ""
                          }`}
                          onClick={() => {
                            void handleCouponToggle(coupon, eligible);
                          }}
                        >
                          <div className="cart-coupon-card-top">
                            <strong>{coupon.code}</strong>
                            <span>{formatCouponMeta(coupon)}</span>
                          </div>
                          <small>{coupon.description}</small>
                          <em>
                            {isApplied
                              ? "Tap to remove"
                              : eligible
                                ? "Tap to apply"
                                : `Add ${formatPrice(coupon.minOrderAmount - summary.subtotal)} more to use this`}
                          </em>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                <div className="cart-coupon-form">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                    placeholder="Enter code"
                  />
                  <Button type="button" variant="ghost" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <strong>{formatPrice(summary.total)}</strong>
              </div>

              <Link to="/checkout">
                <Button className="cart-checkout-button">Proceed to Checkout</Button>
              </Link>

              <Link to="/products" className="section-link">
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      ) : (
        <div className="cart-empty-state">
          <span className="section-kicker">Your Cart</span>
          <h2>Your cart is empty</h2>
          <p>Add a few products to see your order summary here.</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </section>
  );
}

function formatCouponMeta(coupon) {
  const discountLabel =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% off`
      : `${formatPrice(coupon.discountValue)} off`;

  return `${discountLabel} - Min ${formatPrice(coupon.minOrderAmount)}`;
}

export default CartPage;
