import { featuredProducts } from "../data/products";

const LOCAL_USERS_STORAGE_KEY = "brightcart.auth.users";
const LOCAL_ORDERS_STORAGE_KEY = "brightcart.localOrders";

const demoCartItems = featuredProducts.slice(0, 1).map((product) => ({
  ...product,
  quantity: 1
}));

const demoWishlistItems = featuredProducts.slice(3, 5).map((product) => ({ ...product }));

const demoCustomers = [
  {
    id: 2001,
    name: "Ananya Rao",
    email: "ananya@brightcart.demo",
    password: "demo123",
    role: "user",
    phone: "9876543201"
  },
  {
    id: 2002,
    name: "Rohan Mehta",
    email: "rohan@brightcart.demo",
    password: "demo123",
    role: "user",
    phone: "9876543202"
  },
  {
    id: 2003,
    name: "Nisha Kapoor",
    email: "nisha@brightcart.demo",
    password: "demo123",
    role: "user",
    phone: "9876543203"
  }
];

const demoOrdersByEmail = {
  "ananya@brightcart.demo": [
    {
      orderId: 8801001,
      status: "DELIVERED",
      createdAt: "2026-04-02T11:30:00.000Z",
      placedAt: "2026-04-02T11:30:00.000Z",
      processingAt: "2026-04-02T13:00:00.000Z",
      shippedAt: "2026-04-03T08:30:00.000Z",
      deliveredAt: "2026-04-05T14:45:00.000Z",
      cancelledAt: null,
      customerName: "Ananya Rao",
      email: "ananya@brightcart.demo",
      address: "12 Lake View Road, Bengaluru",
      phone: "9876543201",
      items: [
        {
          productId: featuredProducts[0].id,
          name: featuredProducts[0].name,
          price: featuredProducts[0].price,
          quantity: 1
        },
        {
          productId: featuredProducts[2].id,
          name: featuredProducts[2].name,
          price: featuredProducts[2].price,
          quantity: 1
        }
      ],
      subtotal: featuredProducts[0].price + featuredProducts[2].price,
      shipping: 99,
      couponCode: "SHIP99",
      discountAmount: 99,
      total: featuredProducts[0].price + featuredProducts[2].price
    }
  ],
  "rohan@brightcart.demo": [
    {
      orderId: 8801002,
      status: "PROCESSING",
      createdAt: "2026-04-08T09:15:00.000Z",
      placedAt: "2026-04-08T09:15:00.000Z",
      processingAt: "2026-04-08T12:10:00.000Z",
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
      customerName: "Rohan Mehta",
      email: "rohan@brightcart.demo",
      address: "44 MG Road, Hyderabad",
      phone: "9876543202",
      items: [
        {
          productId: featuredProducts[4].id,
          name: featuredProducts[4].name,
          price: featuredProducts[4].price,
          quantity: 1
        }
      ],
      subtotal: featuredProducts[4].price,
      shipping: 99,
      couponCode: null,
      discountAmount: 0,
      total: featuredProducts[4].price + 99
    }
  ]
};

function getDemoCartItems() {
  return demoCartItems.map((item) => ({ ...item }));
}

function getDemoWishlistItems() {
  return demoWishlistItems.map((item) => ({ ...item }));
}

function ensureDemoLocalState() {
  seedLocalUsers();
  seedLocalOrders();
}

function seedLocalUsers() {
  try {
    const savedUsers = window.localStorage.getItem(LOCAL_USERS_STORAGE_KEY);

    if (savedUsers) {
      return;
    }

    window.localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(demoCustomers));
  } catch {
    // Ignore local storage failures and keep the demo optional.
  }
}

function seedLocalOrders() {
  try {
    const savedOrders = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);

    if (savedOrders) {
      return;
    }

    window.localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(demoOrdersByEmail));
  } catch {
    // Ignore local storage failures and keep the demo optional.
  }
}

export { ensureDemoLocalState, getDemoCartItems, getDemoWishlistItems };
