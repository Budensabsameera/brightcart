import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminOverview } from "../lib/api";
import { featuredProducts } from "../data/products";
import { formatPrice } from "../utils/formatters";

const PRODUCT_STORAGE_KEY = "brightcart.products";
const LOCAL_USERS_STORAGE_KEY = "brightcart.auth.users";
const LOCAL_ORDERS_STORAGE_KEY = "brightcart.localOrders";

function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchAdminOverview()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setOverview(response);
        setError("");
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        const fallbackOverview = buildLocalOverview();
        setOverview(fallbackOverview);
        setError(
          fallbackOverview.totalProducts > 0 ||
            fallbackOverview.totalCustomers > 0 ||
            fallbackOverview.totalOrders > 0
            ? "Showing saved admin data from this device."
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

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="admin-title">Operations dashboard</h1>
          <p className="admin-subtitle">
            Track catalog, customers, orders, and revenue from one overview.
          </p>
        </div>
      </div>

      {loading ? <p className="admin-empty">Loading dashboard...</p> : null}
      {error ? (
        <p className={error.includes("saved admin data") ? "auth-success admin-mode-banner" : "auth-error"}>
          {error}
        </p>
      ) : null}

      {!loading && overview ? (
        <>
          <div className="admin-overview-grid">
            <article className="admin-overview-card">
              <span>Products</span>
              <strong>{overview.totalProducts}</strong>
              <small>Items in your catalog</small>
            </article>
            <article className="admin-overview-card">
              <span>Customers</span>
              <strong>{overview.totalCustomers}</strong>
              <small>Registered shoppers</small>
            </article>
            <article className="admin-overview-card">
              <span>Orders</span>
              <strong>{overview.totalOrders}</strong>
              <small>Total orders placed</small>
            </article>
            <article className="admin-overview-card">
              <span>Revenue</span>
              <strong>{formatPrice(overview.totalRevenue ?? 0)}</strong>
              <small>Total order value</small>
            </article>
            <article className="admin-overview-card">
              <span>Low Stock</span>
              <strong>{overview.lowStockProducts}</strong>
              <small>Products at 10 units or below</small>
            </article>
          </div>

          <div className="admin-layout">
            <div className="admin-list-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">Status Split</span>
                  <h3>Order pipeline</h3>
                </div>
              </div>

              <div className="admin-status-list">
                <div className="admin-status-row">
                  <span>Placed</span>
                  <strong>{overview.placedOrders}</strong>
                </div>
                <div className="admin-status-row">
                  <span>Processing</span>
                  <strong>{overview.processingOrders}</strong>
                </div>
                <div className="admin-status-row">
                  <span>Shipped</span>
                  <strong>{overview.shippedOrders}</strong>
                </div>
                <div className="admin-status-row">
                  <span>Delivered</span>
                  <strong>{overview.deliveredOrders}</strong>
                </div>
              </div>
            </div>

            <div className="admin-list-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">Quick Links</span>
                  <h3>Manage your store</h3>
                </div>
              </div>

              <div className="admin-quick-links">
                <Link to="/admin/products" className="admin-quick-link">
                  <strong>Products</strong>
                  <span>Add, edit, and remove catalog items</span>
                </Link>
                <Link to="/admin/orders" className="admin-quick-link">
                  <strong>Orders</strong>
                  <span>Review and update fulfilment status</span>
                </Link>
                <Link to="/admin/coupons" className="admin-quick-link">
                  <strong>Coupons</strong>
                  <span>Create offers and control discount codes</span>
                </Link>
                <Link to="/admin/customers" className="admin-quick-link">
                  <strong>Customers</strong>
                  <span>See registered shoppers and contact details</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function buildLocalOverview() {
  const products = readLocalProducts();
  const customers = readLocalCustomers();
  const orders = readLocalOrders();

  return {
    totalProducts: products.length,
    totalCustomers: customers.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((total, order) => total + Number(order.total ?? 0), 0),
    lowStockProducts: products.filter((product) => Number(product.stockQuantity ?? 0) <= 10).length,
    placedOrders: countOrdersByStatus(orders, "PLACED"),
    processingOrders: countOrdersByStatus(orders, "PROCESSING"),
    shippedOrders: countOrdersByStatus(orders, "SHIPPED"),
    deliveredOrders: countOrdersByStatus(orders, "DELIVERED")
  };
}

function readLocalProducts() {
  try {
    const savedProducts = window.localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (!savedProducts) {
      return featuredProducts;
    }

    const parsedProducts = JSON.parse(savedProducts);
    return Array.isArray(parsedProducts) && parsedProducts.length > 0 ? parsedProducts : featuredProducts;
  } catch {
    return featuredProducts;
  }
}

function readLocalCustomers() {
  try {
    const savedUsers = window.localStorage.getItem(LOCAL_USERS_STORAGE_KEY);

    if (!savedUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(savedUsers);
    if (!Array.isArray(parsedUsers)) {
      return [];
    }

    return parsedUsers.filter((user) => String(user.role ?? "user").toLowerCase() !== "admin");
  } catch {
    return [];
  }
}

function readLocalOrders() {
  try {
    const savedOrders = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : {};

    if (!parsedOrders || typeof parsedOrders !== "object") {
      return [];
    }

    return Object.values(parsedOrders)
      .filter(Array.isArray)
      .flat();
  } catch {
    return [];
  }
}

function countOrdersByStatus(orders, status) {
  return orders.filter((order) => String(order.status).toUpperCase() === status).length;
}

export default AdminDashboardPage;
