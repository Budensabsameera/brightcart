import { Route, Routes } from "react-router-dom";
import AdminRoute from "./components/auth/AdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import CustomerLayout from "./components/layout/CustomerLayout";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import BusinessAccountPage from "./pages/BusinessAccountPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AccountPage from "./pages/AccountPage";
import WishlistPage from "./pages/WishlistPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCustomersPage from "./pages/AdminCustomersPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminCouponsPage from "./pages/AdminCouponsPage";

function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/business-account" element={<BusinessAccountPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/coupons" element={<AdminCouponsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
