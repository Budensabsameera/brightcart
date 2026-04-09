import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatters";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, summary, checkout, cartError, cartMode, appliedCoupon } = useCart();
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormState((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      await checkout(formState);
      navigate("/order-success", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="checkout-page">
      <div className="checkout-layout">
        <div className="checkout-form-card">
          <span className="section-kicker">Checkout</span>
          <h1 className="checkout-title">Delivery details</h1>
          <p className="checkout-subtitle">Add your details and place the order in one clean step.</p>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </label>

            <label className="auth-field">
              <span>Address</span>
              <input
                type="text"
                name="address"
                value={formState.address}
                onChange={handleChange}
                placeholder="Enter delivery address"
                required
              />
            </label>

            <label className="auth-field">
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                value={formState.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </label>

            {error || cartError ? (
              <p className={cartMode === "local" && !error ? "auth-success admin-mode-banner" : "auth-error"}>
                {error || cartError}
              </p>
            ) : null}

            <Button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Placing order..." : "Place Order"}
            </Button>
          </form>
        </div>

        <aside className="checkout-summary-card">
          <span className="section-kicker">Order Summary</span>
          <h2>{summary.totalItems} items</h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <span>{item.name} x {item.quantity}</span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

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

          {appliedCoupon ? (
            <div className="checkout-coupon-note">
              <span>Code applied</span>
              <strong>{appliedCoupon.code}</strong>
            </div>
          ) : null}

          <div className="cart-summary-total">
            <span>Total</span>
            <strong>{formatPrice(summary.total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
