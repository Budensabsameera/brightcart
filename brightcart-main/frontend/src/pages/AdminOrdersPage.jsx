import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { formatPrice } from "../utils/formatters";
import { fetchAdminOrders, updateAdminOrderStatus } from "../lib/api";
import { downloadCsv } from "../utils/csv";

const ORDER_STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const LOCAL_ORDERS_STORAGE_KEY = "brightcart.localOrders";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchAdminOrders()
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

        const localOrders = readAllLocalOrders();
        setOrders(localOrders);
        setError(
          localOrders.length > 0
            ? "Showing saved orders from this device."
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
  }, []);

  const handleStatusChange = async (orderId, nextStatus) => {
    setUpdatingOrderId(orderId);
    setError("");

    try {
      const updatedOrder = await updateAdminOrderStatus(orderId, nextStatus);
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.orderId === orderId ? updatedOrder : order))
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleExport = () => {
    downloadCsv(
      "brightcart-orders.csv",
      [
        { key: "orderId", label: "Order ID" },
        { key: "customerName", label: "Customer" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status" },
        { key: "total", label: "Total" },
        { key: "couponCode", label: "Coupon Code" },
        { key: "discountAmount", label: "Discount Amount" },
        { key: "createdAt", label: "Created At" }
      ],
      orders.map((order) => ({
        ...order,
        total: order.total,
        couponCode: order.couponCode ?? "",
        discountAmount: order.discountAmount ?? 0
      }))
    );
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="admin-title">Manage orders</h1>
          <p className="admin-subtitle">
            Review customer purchases, track order progress, and update fulfilment status.
          </p>
        </div>
      </div>

      <div className="admin-list-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Orders</span>
            <h3>{orders.length} orders</h3>
          </div>
          <Button variant="ghost" onClick={handleExport} disabled={orders.length === 0}>
            Export CSV
          </Button>
        </div>

        {loading ? <p className="admin-empty">Loading orders...</p> : null}
        {error ? (
          <p className={error.includes("saved orders from this device") ? "auth-success admin-mode-banner" : "auth-error"}>
            {error}
          </p>
        ) : null}

        {!loading && !error && orders.length === 0 ? (
          <p className="admin-empty">No orders available yet.</p>
        ) : null}

        {!loading && orders.length > 0 ? (
          <div className="admin-order-list">
            {orders.map((order) => (
              <article key={order.orderId} className="admin-order-card">
                <div className="admin-order-head">
                  <div>
                    <strong>Order #{order.orderId}</strong>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`account-order-status admin-order-status-${order.status.toLowerCase()}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>

                <div className="admin-order-grid">
                  <div className="admin-order-block">
                    <span>Customer</span>
                    <strong>{order.customerName}</strong>
                    <small>{order.email}</small>
                  </div>
                  <div className="admin-order-block">
                    <span>Contact</span>
                    <strong>{order.phone}</strong>
                    <small>{order.address}</small>
                  </div>
                  <div className="admin-order-block">
                    <span>Total</span>
                    <strong>{formatPrice(order.total)}</strong>
                    <small>{order.items.length} items</small>
                  </div>
                  <div className="admin-order-block">
                    <span>Discount</span>
                    <strong>{order.discountAmount > 0 ? formatPrice(order.discountAmount) : "None"}</strong>
                    <small>{order.couponCode ?? "No code used"}</small>
                  </div>
                </div>

                <div className="admin-order-timeline-grid">
                  {getAdminTimeline(order).map((step) => (
                    <div
                      key={`${order.orderId}-${step.label}`}
                      className={`admin-order-timeline-card${
                        step.state === "complete"
                          ? " admin-order-timeline-card-complete"
                          : step.state === "current"
                            ? " admin-order-timeline-card-current"
                            : step.state === "cancelled"
                              ? " admin-order-timeline-card-cancelled"
                              : ""
                      }`}
                    >
                      <span>{step.label}</span>
                      <strong>{step.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="admin-order-items">
                  {order.items.map((item) => (
                    <div key={`${order.orderId}-${item.productId}`} className="admin-order-item-row">
                      <span>{item.name}</span>
                      <strong>
                        {item.quantity} x {formatPrice(item.price)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="admin-order-actions">
                  <label className="auth-field admin-order-field">
                    <span>Status</span>
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusChange(order.orderId, event.target.value)}
                      disabled={updatingOrderId === order.orderId}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function readAllLocalOrders() {
  try {
    const savedOrders = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : {};

    if (!parsedOrders || typeof parsedOrders !== "object") {
      return [];
    }

    return Object.values(parsedOrders)
      .filter(Array.isArray)
      .flat()
      .sort((left, right) => new Date(right.createdAt ?? 0) - new Date(left.createdAt ?? 0));
  } catch {
    return [];
  }
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

function formatDateTime(value) {
  if (!value) {
    return "Not reached";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not reached"
    : date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
}

function getAdminTimeline(order) {
  if (order.status === "CANCELLED") {
    return [
      { label: "Placed", value: formatDateTime(order.placedAt ?? order.createdAt), state: "complete" },
      { label: "Cancelled", value: formatDateTime(order.cancelledAt), state: "cancelled" }
    ];
  }

  const steps = [
    { label: "Placed", value: formatDateTime(order.placedAt ?? order.createdAt) },
    { label: "Processing", value: formatDateTime(order.processingAt) },
    { label: "Shipped", value: formatDateTime(order.shippedAt) },
    { label: "Delivered", value: formatDateTime(order.deliveredAt) }
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

export default AdminOrdersPage;
