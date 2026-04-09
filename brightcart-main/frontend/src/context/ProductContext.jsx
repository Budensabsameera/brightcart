import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct
} from "../lib/api";
import { featuredProducts } from "../data/products";

const ProductContext = createContext(null);
const PRODUCT_STORAGE_KEY = "brightcart.products";

function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => readLocalProducts());
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [productsMode, setProductsMode] = useState("online");

  useEffect(() => {
    writeLocalProducts(products);
  }, [products]);

  const refreshProducts = async () => {
    try {
      const response = await fetchProducts();
      if (Array.isArray(response) && response.length > 0) {
        setProducts(response);
      }
      setProductsError("");
      setProductsMode("online");
    } catch (error) {
      setProducts(readLocalProducts());
      setProductsError("You are viewing the saved catalog on this device.");
      setProductsMode("local");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (payload) => {
    try {
      const response = await createProduct(payload);
      setProducts((current) => [...current, response].sort((left, right) => left.id - right.id));
      setProductsError("");
      setProductsMode("online");
      return response;
    } catch (error) {
      const fallbackProduct = {
        id: Date.now(),
        ...payload
      };
      setProducts((current) =>
        [...current, fallbackProduct].sort((left, right) => left.id - right.id)
      );
      setProductsError("Product saved on this device.");
      setProductsMode("local");
      return fallbackProduct;
    }
  };

  const editProduct = async (productId, payload) => {
    try {
      const response = await updateProduct(productId, payload);
      setProducts((current) =>
        current
          .map((product) => (product.id === productId ? response : product))
          .sort((left, right) => left.id - right.id)
      );
      setProductsError("");
      setProductsMode("online");
      return response;
    } catch (error) {
      const fallbackProduct = { id: productId, ...payload };
      setProducts((current) =>
        current
          .map((product) => (product.id === productId ? fallbackProduct : product))
          .sort((left, right) => left.id - right.id)
      );
      setProductsError("Product updated on this device.");
      setProductsMode("local");
      return fallbackProduct;
    }
  };

  const removeProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
      setProductsError("");
      setProductsMode("online");
    } catch (error) {
      if (error.message === "Failed to fetch") {
        setProducts((current) => current.filter((product) => product.id !== productId));
        setProductsError("Product removed on this device.");
        setProductsMode("local");
        return;
      }

      throw error;
    }
  };

  const applyLocalOrderStock = (items) => {
    setProducts((current) =>
      current.map((product) => {
        const orderedItem = items.find((item) => item.productId === product.id || item.id === product.id);

        if (!orderedItem) {
          return product;
        }

        const quantity = orderedItem.quantity ?? 0;
        const currentStock = product.stockQuantity ?? 0;

        return {
          ...product,
          stockQuantity: Math.max(0, currentStock - quantity)
        };
      })
    );
  };

  const value = useMemo(
    () => ({
      products,
      productsLoading,
      productsError,
      productsMode,
      refreshProducts,
      addProduct,
      editProduct,
      removeProduct,
      applyLocalOrderStock
    }),
    [products, productsLoading, productsError, productsMode]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return context;
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

function writeLocalProducts(products) {
  try {
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Ignore local storage failures and keep in-memory state.
  }
}

export { ProductProvider, useProducts };
