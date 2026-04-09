const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const AUTH_STORAGE_KEY = "brightcart.auth";

function getAuthToken() {
  try {
    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
      return null;
    }

    const parsedAuth = JSON.parse(storedAuth);
    return parsedAuth?.token ?? null;
  } catch {
    return null;
  }
}

async function requestJson(path, options = {}) {
  const method = options.method ?? "GET";
  const url = `${API_BASE_URL}${path}`;
  const token = getAuthToken();

  console.log("[API request]", { method, url, body: options.body ?? null });

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {})
      },
      ...options
    });

    const responseBody = await response.json().catch(() => ({}));

    console.log("[API response]", {
      method,
      url,
      status: response.status,
      ok: response.ok,
      body: responseBody
    });

    if (!response.ok) {
      throw new Error(responseBody.message ?? `Request failed: ${response.status}`);
    }

    return responseBody;
  } catch (error) {
    console.error("[API error]", { method, url, error });
    throw error;
  }
}

function fetchProducts() {
  return requestJson("/products");
}

function fetchAdminCoupons() {
  return requestJson("/coupons");
}

function createCoupon(payload) {
  return requestJson("/coupons", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function updateCoupon(couponId, payload) {
  return requestJson(`/coupons/${couponId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

function deleteCoupon(couponId) {
  return requestJson(`/coupons/${couponId}`, {
    method: "DELETE"
  });
}

function validateCoupon(payload) {
  return requestJson("/coupons/validate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function fetchCategories() {
  return requestJson("/categories");
}

function createCategory(payload) {
  return requestJson("/categories", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function updateCategory(categoryId, payload) {
  return requestJson(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

function deleteCategory(categoryId) {
  return requestJson(`/categories/${categoryId}`, {
    method: "DELETE"
  });
}

function fetchProductById(productId) {
  return requestJson(`/products/${productId}`);
}

function createProduct(payload) {
  return requestJson("/products", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function updateProduct(productId, payload) {
  return requestJson(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

function deleteProduct(productId) {
  return requestJson(`/products/${productId}`, {
    method: "DELETE"
  });
}

function fetchCart() {
  return requestJson("/cart");
}

function fetchOrders() {
  return requestJson("/orders");
}

function cancelOrder(orderId) {
  return requestJson(`/orders/${orderId}/cancel`, {
    method: "PATCH"
  });
}

function fetchAdminOrders() {
  return requestJson("/orders/admin");
}

function updateAdminOrderStatus(orderId, status) {
  return requestJson(`/orders/admin/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

function fetchAdminOverview() {
  return requestJson("/admin/overview");
}

function fetchAdminCustomers() {
  return requestJson("/admin/customers");
}

function fetchWishlist() {
  return requestJson("/wishlist");
}

function addWishlistItem(productId) {
  return requestJson(`/wishlist/items/${productId}`, {
    method: "POST"
  });
}

function deleteWishlistItem(productId) {
  return requestJson(`/wishlist/items/${productId}`, {
    method: "DELETE"
  });
}

function fetchProfile() {
  return requestJson("/account/profile");
}

function updateProfile(payload) {
  return requestJson("/account/profile", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

function createBusinessAccount(payload) {
  return requestJson("/account/business-account", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function signup(payload) {
  return requestJson("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function login(payload) {
  return requestJson("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function fetchCurrentUser() {
  return requestJson("/auth/me");
}

function logout() {
  return requestJson("/auth/logout", {
    method: "POST"
  });
}

function requestPasswordOtp(payload) {
  return requestJson("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function verifyPasswordOtp(payload) {
  return requestJson("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function resetPassword(payload) {
  return requestJson("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

function addCartItem(productId, quantity = 1) {
  return requestJson("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity })
  });
}

function updateCartItem(productId, quantity) {
  return requestJson(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity })
  });
}

function deleteCartItem(productId) {
  return requestJson(`/cart/items/${productId}`, {
    method: "DELETE"
  });
}

function placeOrder(payload) {
  return requestJson("/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export {
  addCartItem,
  cancelOrder,
  addWishlistItem,
  createBusinessAccount,
  createCategory,
  createCoupon,
  createProduct,
  deleteCategory,
  deleteCoupon,
  deleteCartItem,
  deleteProduct,
  deleteWishlistItem,
  fetchAdminCoupons,
  fetchCart,
  fetchAdminOrders,
  fetchAdminOverview,
  fetchAdminCustomers,
  fetchCategories,
  fetchCurrentUser,
  fetchOrders,
  fetchProfile,
  fetchProductById,
  fetchProducts,
  fetchWishlist,
  login,
  logout,
  placeOrder,
  requestPasswordOtp,
  resetPassword,
  signup,
  updateAdminOrderStatus,
  updateCategory,
  updateCoupon,
  updateProfile,
  updateCartItem,
  updateProduct,
  validateCoupon,
  verifyPasswordOtp
};
