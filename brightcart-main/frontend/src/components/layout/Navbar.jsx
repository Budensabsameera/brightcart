import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const customerNavItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "Saved", to: "/wishlist" },
  { label: "Cart", to: "/cart" }
];

function Navbar() {
  const { cartCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const accountTarget = isAdmin ? "/admin" : "/account";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div>
            <p className="brand-kicker">Shop Smart. Live Bright</p>
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
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {customerNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {!isAdmin ? (
                <Link to="/business-account" className="nav-auth-link">
                  Business
                </Link>
              ) : null}
              <Link to={accountTarget} className="nav-account-card">
                <span className="nav-account-label">Account</span>
                <strong>{user?.name ?? "My account"}</strong>
              </Link>
              <button type="button" className="nav-auth-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-auth-link">
                Login
              </Link>
              <Link to="/signup" className="nav-auth-button">
                Signup
              </Link>
            </>
          )}

          <Link to="/cart" className="cart-link" aria-label="Cart">
            <span className="cart-icon" aria-hidden="true">
              Cart
            </span>
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
