import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { addWishlistItem, deleteWishlistItem, fetchWishlist } from "../lib/api";
import { getDemoWishlistItems } from "../lib/demoData";

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = "brightcart.wishlist";

function WishlistProvider({ children }) {
  const { isAuthenticated, token, user } = useAuth();
  const wishlistStorageOwner = user?.email ?? "guest";
  const [wishlistItems, setWishlistItems] = useState(() => readLocalWishlist(wishlistStorageOwner));

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated || !token) {
      setWishlistItems(readLocalWishlist(wishlistStorageOwner));
      return () => {
        isMounted = false;
      };
    }

    fetchWishlist()
      .then((response) => {
        if (isMounted) {
          setWishlistItems(normalizeWishlistItems(response.items));
        }
      })
      .catch(() => {
        if (isMounted) {
          setWishlistItems(readLocalWishlist(user?.email));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, wishlistStorageOwner]);

  useEffect(() => {
    writeLocalWishlist(wishlistStorageOwner, wishlistItems);
  }, [wishlistItems, wishlistStorageOwner]);

  const toggleWishlist = async (product) => {
    const isSaved = wishlistItems.some((item) => item.id === product.id);
    const nextItems = isSaved
      ? wishlistItems.filter((item) => item.id !== product.id)
      : [{ ...product }, ...wishlistItems];

    setWishlistItems(nextItems);

    if (!isAuthenticated || !token) {
      return;
    }

    try {
      const response = isSaved
        ? await deleteWishlistItem(product.id)
        : await addWishlistItem(product.id);
      setWishlistItems(normalizeWishlistItems(response.items));
    } catch {
      setWishlistItems(nextItems);
    }
  };

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted: (productId) => wishlistItems.some((item) => item.id === productId),
      toggleWishlist
    }),
    [wishlistItems]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

function normalizeWishlistItems(items = []) {
  return items.map((item) => ({
    id: item.productId,
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    originalPrice: item.originalPrice,
    stockQuantity: item.stockQuantity,
    savings: item.savings,
    rating: item.rating,
    tag: item.tag,
    image: item.image
  }));
}

function readLocalWishlist(owner = "guest") {
  try {
    const savedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : {};
    const items = parsedWishlist[owner];
    if (Array.isArray(items)) {
      return items;
    }

    return owner === "guest" ? getDemoWishlistItems() : [];
  } catch {
    return owner === "guest" ? getDemoWishlistItems() : [];
  }
}

function writeLocalWishlist(owner = "guest", items) {
  try {
    const savedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : {};
    parsedWishlist[owner] = items;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(parsedWishlist));
  } catch {
    // Ignore local storage failures and keep the in-memory state.
  }
}

function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}

export { WishlistProvider, useWishlist };
