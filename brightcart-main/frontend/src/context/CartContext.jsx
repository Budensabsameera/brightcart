import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateCouponDiscount, validateLocalCoupon } from "../lib/localCoupons";
import { createLocalOrder, writeLocalOrders } from "../lib/localOrders";
import { readLocalOrders } from "../lib/localOrders";
import { getDemoCartItems } from "../lib/demoData";
import { useAuth } from "./AuthContext";
import { useProducts } from "./ProductContext";
import {
  addCartItem,
  validateCoupon as validateCouponRequest,
  deleteCartItem,
  fetchCart,
  placeOrder,
  updateCartItem
} from "../lib/api";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "brightcart.cart";
const COUPON_STORAGE_KEY = "brightcart.appliedCoupon";

const initialCartItems = getDemoCartItems();

function CartProvider({ children }) {
  const { isAuthenticated, token, user } = useAuth();
  const { refreshProducts, applyLocalOrderStock } = useProducts();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return initialCartItems;
    }

    try {
      const parsedCart = JSON.parse(savedCart);
      return Array.isArray(parsedCart) && parsedCart.length > 0 ? parsedCart : initialCartItems;
    } catch {
      return initialCartItems;
    }
  });
  const [toast, setToast] = useState(null);
  const [cartError, setCartError] = useState("");
  const [cartMode, setCartMode] = useState("online");
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const savedCoupon = window.localStorage.getItem(COUPON_STORAGE_KEY);
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch {
      return null;
    }
  });
  const [lastOrder, setLastOrder] = useState(() => {
    const savedOrder = window.localStorage.getItem("brightcart.lastOrder");

    if (!savedOrder) {
      return null;
    }

    try {
      return JSON.parse(savedOrder);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      return;
    }

    window.localStorage.removeItem(COUPON_STORAGE_KEY);
  }, [appliedCoupon]);

  useEffect(() => {
    if (lastOrder) {
      window.localStorage.setItem("brightcart.lastOrder", JSON.stringify(lastOrder));
    }
  }, [lastOrder]);

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated || !token) {
      setCartError("");
      setCartMode("local");
      return () => {
        isMounted = false;
      };
    }

    fetchCart()
      .then((response) => {
        if (isMounted) {
          setCartItems(normalizeCartItems(response.items));
          setCartError("");
          setCartMode("online");
        }
      })
      .catch((error) => {
        if (isMounted) {
          if (shouldUseLocalCart(error)) {
            setCartError("Your cart is saved on this device.");
            setCartMode("local");
            return;
          }

          setCartError(error.message);
          setCartMode("online");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showToast = (message) => {
    setToast({ id: Date.now(), message });
  };

  const addToCart = async (product, quantity = 1) => {
    const previousItems = cartItems;
    const optimisticItems = addItemLocally(cartItems, product, quantity);

    setCartError("");
    setCartItems(optimisticItems);
    showToast(`${product.name} added to cart`);

    if (!isAuthenticated || !token) {
      setCartError("");
      setCartMode("local");
      return null;
    }

    try {
      const response = await addCartItem(product.id, quantity);
      setCartItems(normalizeCartItems(response.items));
      setCartMode("online");
      return response;
    } catch (error) {
      if (shouldUseLocalCart(error)) {
        setCartItems(optimisticItems);
        setCartError("Your cart update was saved on this device.");
        setCartMode("local");
        showToast("Saved to cart on this device");
        return null;
      }

      setCartItems(previousItems);
      setCartError(error.message);
      setCartMode("online");
      showToast(error.message);
      return null;
    }
  };

  const increaseQuantity = async (itemId) => {
    const previousItems = cartItems;
    let updatedQuantity = 1;
    const optimisticItems = cartItems.map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      updatedQuantity = item.quantity + 1;
      return { ...item, quantity: updatedQuantity };
    });

    setCartError("");
    setCartItems(optimisticItems);

    if (!isAuthenticated || !token) {
      setCartMode("local");
      showToast("Cart quantity saved on this device");
      return null;
    }

    try {
      const response = await updateCartItem(itemId, updatedQuantity);
      setCartItems(normalizeCartItems(response.items));
      setCartMode("online");
      return response;
    } catch (error) {
      if (shouldUseLocalCart(error)) {
        setCartItems(optimisticItems);
        setCartError("Your cart quantity was updated on this device.");
        setCartMode("local");
        showToast("Cart quantity saved on this device");
        return null;
      }

      setCartItems(previousItems);
      setCartError(error.message);
      setCartMode("online");
      showToast(error.message);
      return null;
    }
  };

  const decreaseQuantity = async (itemId) => {
    const previousItems = cartItems;
    let updatedQuantity = 1;
    const optimisticItems = cartItems.map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      updatedQuantity = Math.max(1, item.quantity - 1);
      return { ...item, quantity: updatedQuantity };
    });

    setCartError("");
    setCartItems(optimisticItems);

    if (!isAuthenticated || !token) {
      setCartMode("local");
      showToast("Cart quantity saved on this device");
      return null;
    }

    try {
      const response = await updateCartItem(itemId, updatedQuantity);
      setCartItems(normalizeCartItems(response.items));
      setCartMode("online");
      return response;
    } catch (error) {
      if (shouldUseLocalCart(error)) {
        setCartItems(optimisticItems);
        setCartError("Your cart quantity was updated on this device.");
        setCartMode("local");
        showToast("Cart quantity saved on this device");
        return null;
      }

      setCartItems(previousItems);
      setCartError(error.message);
      setCartMode("online");
      showToast(error.message);
      return null;
    }
  };

  const removeFromCart = async (itemId) => {
    const previousItems = cartItems;
    const itemToRemove = cartItems.find((item) => item.id === itemId);
    setCartError("");
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== itemId));

    if (itemToRemove) {
      showToast(`${itemToRemove.name} removed from cart`);
    }

    if (!isAuthenticated || !token) {
      setCartMode("local");
      return null;
    }

    try {
      const response = await deleteCartItem(itemId);
      setCartItems(normalizeCartItems(response.items));
      setCartMode("online");
      return response;
    } catch (error) {
      if (shouldUseLocalCart(error)) {
        setCartItems((currentItems) => currentItems);
        setCartError("The item was removed from your cart on this device.");
        setCartMode("local");
        showToast("Removed from cart on this device");
        return null;
      }

      setCartItems(previousItems);
      setCartError(error.message);
      setCartMode("online");
      showToast(error.message);
      return null;
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCartError("");
    setCartMode(!isAuthenticated || !token ? "local" : "online");
  };

  const applyCoupon = async (code) => {
    const normalizedCode = code.trim();

    if (!normalizedCode) {
      throw new Error("Enter a discount code.");
    }

    setCartError("");

    if (!isAuthenticated || !token) {
      const fallbackCoupon = validateLocalCoupon(normalizedCode, calculateSubtotal(cartItems));
      setAppliedCoupon(fallbackCoupon);
      setCartMode("local");
      showToast(`${fallbackCoupon.code} applied`);
      return fallbackCoupon;
    }

    try {
      const response = await validateCouponRequest({
        code: normalizedCode,
        subtotal: calculateSubtotal(cartItems)
      });
      setAppliedCoupon(response);
      setCartMode("online");
      showToast(`${response.code} applied`);
      return response;
    } catch (error) {
      if (shouldUseLocalCart(error)) {
        const fallbackCoupon = validateLocalCoupon(normalizedCode, calculateSubtotal(cartItems));
        setAppliedCoupon(fallbackCoupon);
        setCartError("Your discount was saved on this device.");
        setCartMode("local");
        showToast(`${fallbackCoupon.code} applied`);
        return fallbackCoupon;
      }

      setAppliedCoupon(null);
      setCartError(error.message);
      throw error;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCartError("");
  };

  const checkout = async (payload) => {
    setCartError("");

    if (!isAuthenticated || !token) {
      const fallbackOrder = createLocalOrder({
        user,
        payload: {
          ...payload,
          couponCode: summary.discount > 0 ? appliedCoupon?.code ?? null : null
        },
        cartItems,
        summary,
        appliedCoupon
      });
      const currentOrders = readLocalOrders(user?.email);
      writeLocalOrders(user?.email, [fallbackOrder, ...currentOrders]);
      applyLocalOrderStock(fallbackOrder.items);
      setLastOrder(fallbackOrder);
      setCartItems([]);
      setAppliedCoupon(null);
      setCartMode("local");
      showToast(`Order #${fallbackOrder.orderId} saved on this device`);
      return fallbackOrder;
    }

    try {
      const response = await placeOrder({
        ...payload,
        couponCode: summary.discount > 0 ? appliedCoupon?.code ?? null : null
      });
      setLastOrder(response);
      setCartItems([]);
      setAppliedCoupon(null);
      setCartMode("online");
      try {
        await refreshProducts();
      } catch {
        // Keep checkout successful even if the product refresh request fails.
      }
      showToast(`Order #${response.orderId} placed successfully`);
      return response;
    } catch (error) {
      if (shouldUseLocalCart(error)) {
        const fallbackOrder = createLocalOrder({
          user,
          payload: {
            ...payload,
            couponCode: summary.discount > 0 ? appliedCoupon?.code ?? null : null
          },
          cartItems,
          summary,
          appliedCoupon
        });
        const currentOrders = readLocalOrders(user?.email);
        writeLocalOrders(user?.email, [fallbackOrder, ...currentOrders]);
        applyLocalOrderStock(fallbackOrder.items);
        setLastOrder(fallbackOrder);
        setCartItems([]);
        setAppliedCoupon(null);
        setCartError("Your order was saved on this device.");
        setCartMode("local");
        showToast(`Order #${fallbackOrder.orderId} saved on this device`);
        return fallbackOrder;
      }

      setCartError(error.message);
      setCartMode("online");
      throw error;
    }
  };

  const summary = useMemo(() => {
    const subtotal = calculateSubtotal(cartItems);
    const shipping = cartItems.length > 0 ? 99 : 0;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const discount = calculateCouponDiscount(appliedCoupon, subtotal);

    return {
      subtotal,
      shipping,
      discount,
      totalItems,
      total: Math.max(subtotal + shipping - discount, 0)
    };
  }, [appliedCoupon, cartItems]);

  const value = {
    cartItems,
    cartCount: summary.totalItems,
    summary,
    cartError,
    cartMode,
    appliedCoupon,
    toast,
    lastOrder,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
    checkout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function addItemLocally(currentItems, product, quantity) {
  const existingItem = currentItems.find((item) => item.id === product.id);

  if (existingItem) {
    return currentItems.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [...currentItems, { ...product, quantity }];
}

function normalizeCartItems(items = []) {
  return items.map((item) => ({
    id: item.productId,
    name: item.name,
    category: item.category,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    stockQuantity: item.stockQuantity
  }));
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function shouldUseLocalCart(error) {
  return error?.message === "Failed to fetch" || error?.message === "Authentication required";
}

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

export { CartProvider, useCart };
