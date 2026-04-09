import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from "../lib/api";
import { categories as defaultCategories } from "../data/products";

const CategoryContext = createContext(null);
const CATEGORY_STORAGE_KEY = "brightcart.categories";

function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(() => readLocalCategories());
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [categoriesMode, setCategoriesMode] = useState("online");

  useEffect(() => {
    writeLocalCategories(categories);
  }, [categories]);

  const refreshCategories = async () => {
    try {
      const response = await fetchCategories();
      if (Array.isArray(response) && response.length > 0) {
        setCategories(response);
      }
      setCategoriesError("");
      setCategoriesMode("online");
    } catch {
      setCategories(readLocalCategories());
      setCategoriesError("You are viewing the saved categories on this device.");
      setCategoriesMode("local");
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const addCategory = async (payload) => {
    try {
      const response = await createCategory(payload);
      setCategories((current) => [...current, response].sort(compareCategories));
      setCategoriesError("");
      setCategoriesMode("online");
      return response;
    } catch (error) {
      const fallbackCategory = {
        id: Date.now(),
        slug: slugify(payload.name),
        ...payload
      };
      setCategories((current) => [...current, fallbackCategory].sort(compareCategories));
      setCategoriesError("Category saved on this device.");
      setCategoriesMode("local");
      return fallbackCategory;
    }
  };

  const editCategory = async (categoryId, payload) => {
    try {
      const response = await updateCategory(categoryId, payload);
      setCategories((current) =>
        current.map((category) => (category.id === categoryId ? response : category)).sort(compareCategories)
      );
      setCategoriesError("");
      setCategoriesMode("online");
      return response;
    } catch (error) {
      const fallbackCategory = {
        id: categoryId,
        slug: slugify(payload.name),
        ...payload
      };
      setCategories((current) =>
        current
          .map((category) => (category.id === categoryId ? fallbackCategory : category))
          .sort(compareCategories)
      );
      setCategoriesError("Category updated on this device.");
      setCategoriesMode("local");
      return fallbackCategory;
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories((current) => current.filter((category) => category.id !== categoryId));
      setCategoriesError("");
      setCategoriesMode("online");
    } catch (error) {
      if (error.message === "Failed to fetch") {
        const category = categories.find((item) => item.id === categoryId);

        if (category && hasProductsInLocalCategory(category.name)) {
          throw new Error(`Category "${category.name}" cannot be deleted while products still use it.`);
        }

        setCategories((current) => current.filter((category) => category.id !== categoryId));
        setCategoriesError("Category removed on this device.");
        setCategoriesMode("local");
        return;
      }

      throw error;
    }
  };

  const value = useMemo(
    () => ({
      categories,
      categoriesLoading,
      categoriesError,
      categoriesMode,
      refreshCategories,
      addCategory,
      editCategory,
      removeCategory
    }),
    [categories, categoriesLoading, categoriesError, categoriesMode]
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

function useCategories() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }

  return context;
}

function readLocalCategories() {
  try {
    const savedCategories = window.localStorage.getItem(CATEGORY_STORAGE_KEY);

    if (!savedCategories) {
      return mapDefaultCategories();
    }

    const parsedCategories = JSON.parse(savedCategories);
    return Array.isArray(parsedCategories) && parsedCategories.length > 0
      ? parsedCategories
      : mapDefaultCategories();
  } catch {
    return mapDefaultCategories();
  }
}

function writeLocalCategories(categories) {
  try {
    window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // Ignore local storage failures and keep in-memory state.
  }
}

function mapDefaultCategories() {
  return defaultCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: slugify(category.name),
    description: category.description
  }));
}

function compareCategories(left, right) {
  return left.name.localeCompare(right.name);
}

function hasProductsInLocalCategory(categoryName) {
  try {
    const savedProducts = window.localStorage.getItem("brightcart.products");

    if (!savedProducts) {
      return false;
    }

    const parsedProducts = JSON.parse(savedProducts);
    return Array.isArray(parsedProducts)
      ? parsedProducts.some((product) => product.category === categoryName)
      : false;
  } catch {
    return false;
  }
}

function slugify(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export { CategoryProvider, useCategories };
