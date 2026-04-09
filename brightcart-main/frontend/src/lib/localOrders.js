const LOCAL_ORDERS_STORAGE_KEY = "brightcart.localOrders";

function readLocalOrders(email) {
  if (!email) {
    return [];
  }

  try {
    const savedOrders = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : {};
    const orders = parsedOrders[email];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function writeLocalOrders(email, orders) {
  if (!email) {
    return;
  }

  try {
    const savedOrders = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : {};
    parsedOrders[email] = orders;
    window.localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(parsedOrders));
  } catch {
    // Ignore local storage failures and keep the in-memory state.
  }
}

function createLocalOrder({ user, payload, cartItems, summary, appliedCoupon }) {
  const now = new Date().toISOString();

  return {
    orderId: Date.now(),
    status: "PLACED",
    createdAt: now,
    placedAt: now,
    processingAt: null,
    shippedAt: null,
    deliveredAt: null,
    cancelledAt: null,
    customerName: payload.name,
    email: user?.email ?? "",
    address: payload.address,
    phone: payload.phone,
    items: cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    couponCode: appliedCoupon?.code ?? payload.couponCode ?? null,
    discountAmount: summary.discount ?? 0,
    total: summary.total
  };
}

export { createLocalOrder, readLocalOrders, writeLocalOrders };
