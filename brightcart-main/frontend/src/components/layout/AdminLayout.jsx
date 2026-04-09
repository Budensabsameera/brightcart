import { NavLink, Outlet } from "react-router-dom";
import Toast from "../common/Toast";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const adminLinks = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Coupons", to: "/admin/coupons" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Customers", to: "/admin/customers" }
];

function AdminLayout() {
  const { user, logout, authNotice } = useAuth();
  const { toast } = useCart();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink to="/admin" end className="admin-brand">
          <div>
            <p className="brand-kicker">Admin Workspace</p>
            <h1 className="brand-name brand-wordmark" aria-label="BrightCart">
              <span className="brand-wordmark-bright">
                Br
                <span className="brand-wordmark-i-wrap">
                  i
                  <span className="brand-wordmark-dot" />
                  <span className="brand-wordmark-beam" />
                </span>
                ght
              </span>
              <span className="brand-wordmark-cart">cart</span>
            </h1>
          </div>
        </NavLink>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {adminLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                isActive ? "admin-sidebar-link admin-sidebar-link-active" : "admin-sidebar-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-sidebar-user">{user?.name}</span>
          <button type="button" className="nav-auth-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-shell-main">
        <main className="admin-page-container page-transition">
          <Outlet />
        </main>
      </div>

      <Toast message={authNotice?.message ?? toast?.message} />
    </div>
  );
}

export default AdminLayout;
