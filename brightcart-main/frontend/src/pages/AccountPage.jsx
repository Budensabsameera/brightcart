import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import ProductCard from "../components/product/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";
import { cancelOrder, fetchOrders } from "../lib/api";
import { readLocalOrders } from "../lib/localOrders";
import { formatPrice } from "../utils/formatters";

function AccountPage() {
  const { user, updateProfile } = useAuth();
  const { refreshProducts } = useProducts();
  const { wishlistItems } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? ""
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState(null);

  useEffect(() => {
    setProfileForm({
      name: user?.name ?? "",
      phone: user?.phone ?? ""
    });
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    fetchOrders()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setOrders(Array.isArray(response) ? response : []);
        setError("");
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        const localOrders = readLocalOrders(user?.email);
        setOrders(localOrders);
        setError(
          localOrders.length > 0
            ? "Showing your saved order history from this device."
            : requestError.message
        );
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const handleProfileChange = (event) => {
    setProfileMessage("");
    setProfileForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");

    try {
      await updateProfile(profileForm);
      setProfileMessage("Profile updated successfully");
    } catch (submissionError) {
      setProfileMessage(submissionError.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId));
  };

  const handleCancelOrder = async (orderId) => {
    setOrderMessage("");
    setCancellingOrderId(orderId);

    try {
      const updatedOrder = await cancelOrder(orderId);
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.orderId === orderId ? updatedOrder : order))
      );
      try {
        await refreshProducts();
      } catch {
        // Keep the cancellation successful even if product refresh fails.
      }
      setOrderMessage(`Order #${orderId} cancelled successfully`);
    } catch (requestError) {
      setOrderMessage(requestError.message);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const openCancelModal = (orderId) => {
    setOrderMessage("");
    setPendingCancelOrderId(orderId);
  };

  const closeCancelModal = () => {
    if (cancellingOrderId) {
      return;
    }

    setPendingCancelOrderId(null);
  };

  return (
    <section className="account-page">
      <div className="account-header">
        <div>
          <span className="section-kicker">Account</span>
          <h1 className="account-title">Your account</h1>
          <p className="account-subtitle">Profile, orders, and saved items.</p>
        </div>
        <Link to="/products">
          <Button variant="ghost">Shop</Button>
        </Link>
      </div>

      <div className="account-layout">
        <aside className="account-profile-card">
          <span className="account-avatar" aria-hidden="true">
            {user?.name?.slice(0, 1) ?? "B"}
          </span>
          <div className="account-profile-copy">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>

          <div className="account-profile-meta">
            <div>
              <span>Role</span>
              <strong>{user?.role ?? "CUSTOMER"}</strong>
            </div>
            <div>
              <span>Saved Items</span>
              <strong>{wishlistItems.length}</strong>
            </div>
          </div>

          <form className="account-profile-form" onSubmit={handleProfileSubmit}>
            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
              />
            </label>

            <label className="auth-field">
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
              />
            </label>

            {profileMessage ? (
              <p className={profileMessage.includes("successfully") ? "auth-success" : "auth-error"}>
                {profileMessage}
              </p>
            ) : null}

            <Button type="submit" disabled={profileSaving}>
              {profileSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </aside>

        <div className="account-content">
          <div className="account-orders-card">
            {user?.role !== "admin" ? (
              <div className="account-business-card">
                <div>
                  <span className="section-kicker">Business Account</span>
                  <h3>Sell on BrightCart</h3>
                  <p>Open business setup for admin access.</p>
                </div>
                <Link to="/business-account">
                  <Button>Open Business Setup</Button>
                </Link>
              </div>
            ) : null}

            <div className="account-feature-grid">
              <article className="account-feature-card">
                <span>Profile</span>
                <strong>{user?.name}</strong>
                <p>Name and phone.</p>
              </article>
              <article className="account-feature-card">
                <span>Orders</span>
                <strong>{orders.length}</strong>
                <p>Recent orders.</p>
              </article>
              <article className="account-feature-card">
                <span>Wishlist</span>
                <strong>{wishlistItems.length}</strong>
                <p>Saved products.</p>
              </article>
            </div>

            <div className="account-quick-actions">
              <Link to="/wishlist">
                <Button variant="ghost">Saved Items</Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost">Cart</Button>
              </Link>
            </div>

            <div className="section-heading">
              <div>
                <span className="section-kicker">Orders</span>
                <h3>{orders.length} orders</h3>
              </div>
            </div>

            {loading ? <p className="account-empty">Loading your orders...</p> : null}
            {!loading && error ? (
              <p
                className={
                  error.includes("Showing your saved order history")
                    ? "auth-success admin-mode-banner"
                    : "auth-error"
                }
              >
                {error}
              </p>
            ) : null}
            {!loading && !error && orderMessage ? (
              <p className={orderMessage.includes("successfully") ? "auth-success" : "auth-error"}>
                {orderMessage}
              </p>
            ) : null}
            {!loading && !error && orders.length === 0 ? (
              <div className="account-empty-state">
                <h2>No orders yet</h2>
                <p>Your placed orders will appear here once you complete checkout.</p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : null}

            {!loading && !error && orders.length > 0 ? (
              <div className="account-order-list">
                {orders.map((order) => (
                  <article key={order.orderId} className="account-order-card">
                    <div className="account-order-top">
                      <div>
                        <strong>Order #{order.orderId}</strong>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <span
                        className={`account-order-status account-order-status-${order.status.toLowerCase()}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </div>

                    <div className="account-order-bottom">
                      <div className="account-order-address">
                        <span>Delivery</span>
                        <strong>{order.address}</strong>
                      </div>
                      <div className="account-order-total">
                        <span>Total</span>
                        <strong>{formatPrice(order.total)}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="account-order-toggle"
                      onClick={() => toggleOrderDetails(order.orderId)}
                    >
                      {expandedOrderId === order.orderId ? "Hide details" : "View details"}
                    </button>

                    {canCancelOrder(order.status) ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="account-order-cancel"
                        disabled={cancellingOrderId === order.orderId}
                        onClick={() => openCancelModal(order.orderId)}
                      >
                        {cancellingOrderId === order.orderId ? "Cancelling..." : "Cancel order"}
                      </Button>
                    ) : null}

                    {expandedOrderId === order.orderId ? (
                      <div className="account-order-details">
                        <div className="account-order-timeline">
                          {getOrderTimeline(order).map((step, index) => (
                            <div
                              key={`${order.orderId}-${step.label}`}
                              className={`account-order-step${
                                step.state === "complete"
                                  ? " account-order-step-complete"
                                  : step.state === "current"
                                    ? " account-order-step-current"
                                    : step.state === "cancelled"
                                      ? " account-order-step-cancelled"
                                      : ""
                              }`}
                            >
                              <span className="account-order-step-dot" aria-hidden="true">
                                {step.state === "complete" ? "OK" : index + 1}
                              </span>
                              <div className="account-order-step-copy">
                                <strong>{step.label}</strong>
                                <span>{step.caption}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="account-order-detail-grid">
                          <div className="account-order-detail-card">
                            <span>Customer</span>
                            <strong>{order.customerName}</strong>
                          </div>
                          <div className="account-order-detail-card">
                            <span>Phone</span>
                            <strong>{order.phone}</strong>
                          </div>
                          <div className="account-order-detail-card">
                            <span>Subtotal</span>
                            <strong>{formatPrice(order.subtotal)}</strong>
                          </div>
                          <div className="account-order-detail-card">
                            <span>Shipping</span>
                            <strong>{formatPrice(order.shipping)}</strong>
                          </div>
                          <div className="account-order-detail-card">
                            <span>Discount</span>
                            <strong>
                              {order.discountAmount > 0
                                ? `${order.couponCode ?? "Offer"} · ${formatPrice(order.discountAmount)}`
                                : "No discount"}
                            </strong>
                          </div>
                        </div>

                        <div className="account-order-items">
                          {order.items.map((item) => (
                            <div key={`${order.orderId}-${item.productId}`} className="account-order-item">
                              <span>{item.name}</span>
                              <strong>
                                {item.quantity} x {formatPrice(item.price)}
                              </strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <div className="account-orders-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Wishlist</span>
                <h3>{wishlistItems.length} saved items</h3>
              </div>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="account-empty-state">
                <h2>Your wishlist is empty</h2>
                <p>Save products from the shop to revisit them quickly later.</p>
                <Link to="/products">
                  <Button>Explore Products</Button>
                </Link>
              </div>
            ) : (
              <div className="account-wishlist-grid">
                {wishlistItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {pendingCancelOrderId ? (
        <div className="account-modal-backdrop" onClick={closeCancelModal}>
          <div
            className="account-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="section-kicker">Confirm Cancellation</span>
            <h2 id="cancel-order-title">Cancel order #{pendingCancelOrderId}?</h2>
            <p>
              This will cancel the order and restore the reserved inventory back to stock.
            </p>
            <div className="account-modal-actions">
              <Button
                variant="ghost"
                onClick={closeCancelModal}
                disabled={Boolean(cancellingOrderId)}
              >
                Keep order
              </Button>
              <Button
                onClick={async () => {
                  await handleCancelOrder(pendingCancelOrderId);
                  setPendingCancelOrderId(null);
                }}
                disabled={Boolean(cancellingOrderId)}
              >
                {cancellingOrderId ? "Cancelling..." : "Yes, cancel order"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatDate(value) {
  if (!value) {
    return "Recently placed";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently placed"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
}

function formatStatus(status) {
  return status?.charAt(0)?.toUpperCase() + status?.slice(1).toLowerCase() || "Placed";
}

function canCancelOrder(status) {
  return ["PLACED", "PROCESSING"].includes(status);
}

function getOrderTimeline(order) {
  if (order.status === "CANCELLED") {
    return [
      {
        label: "Placed",
        caption: formatTimelineTime(order.placedAt ?? order.createdAt, "Order created"),
        state: "complete"
      },
      {
        label: "Cancelled",
        caption: formatTimelineTime(order.cancelledAt, "Stock restored"),
        state: "cancelled"
      }
    ];
  }

  const steps = [
    { label: "Placed", caption: formatTimelineTime(order.placedAt ?? order.createdAt, "Order received") },
    { label: "Processing", caption: formatTimelineTime(order.processingAt, "Preparing your items") },
    { label: "Shipped", caption: formatTimelineTime(order.shippedAt, "On the way") },
    { label: "Delivered", caption: formatTimelineTime(order.deliveredAt, "Completed") }
  ];
  const activeIndex = steps.findIndex((step) => step.label.toUpperCase() === order.status);

  return steps.map((step, index) => ({
    ...step,
    state:
      index < activeIndex
        ? "complete"
        : index === activeIndex
          ? "current"
          : "upcoming"
  }));
}

function formatTimelineTime(value, fallbackLabel) {
  if (!value) {
    return fallbackLabel;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallbackLabel;
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export default AccountPage;
