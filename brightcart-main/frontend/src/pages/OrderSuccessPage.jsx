import { Link, Navigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatters";

function OrderSuccessPage() {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return <Navigate to="/products" replace />;
  }

  return (
    <section className="order-success-page">
      <div className="order-success-card">
        <span className="section-kicker">Order Placed</span>
        <h1 className="order-success-title">Your order was placed successfully.</h1>
        <p className="order-success-subtitle">
          Order #{lastOrder.orderId} is confirmed and will be prepared for dispatch soon.
        </p>

        <div className="order-success-details">
          <div className="order-success-row">
            <span>Name</span>
            <strong>{lastOrder.customerName}</strong>
          </div>
          <div className="order-success-row">
            <span>Address</span>
            <strong>{lastOrder.address}</strong>
          </div>
          <div className="order-success-row">
            <span>Phone</span>
            <strong>{lastOrder.phone}</strong>
          </div>
          {lastOrder.couponCode ? (
            <div className="order-success-row">
              <span>Coupon</span>
              <strong>
                {lastOrder.couponCode} · {formatPrice(lastOrder.discountAmount ?? 0)} saved
              </strong>
            </div>
          ) : null}
          <div className="order-success-row">
            <span>Total</span>
            <strong>{formatPrice(lastOrder.total)}</strong>
          </div>
        </div>

        <Link to="/products">
          <Button>Back to Shopping</Button>
        </Link>
      </div>
    </section>
  );
}

export default OrderSuccessPage;
