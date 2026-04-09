import { useEffect, useMemo, useState } from "react";
import Button from "../components/common/Button";
import { useCategories } from "../context/CategoryContext";
import { useProducts } from "../context/ProductContext";
import { downloadCsv } from "../utils/csv";

const initialFormState = {
  name: "",
  category: "",
  description: "",
  price: "",
  originalPrice: "",
  stockQuantity: "",
  savings: "",
  rating: "",
  tag: "",
  image: ""
};

function AdminProductsPage() {
  const { categories } = useCategories();
  const {
    products,
    productsLoading,
    productsError,
    productsMode,
    addProduct,
    editProduct,
    removeProduct
  } = useProducts();
  const [editingProductId, setEditingProductId] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headingText = useMemo(
    () => (editingProductId ? "Edit product" : "Add product"),
    [editingProductId]
  );
  const availableCategories = categories.length > 0 ? categories : [];

  useEffect(() => {
    if (!editingProductId && !formState.category && availableCategories.length > 0) {
      setFormState((current) => ({
        ...current,
        category: availableCategories[0].name
      }));
    }
  }, [availableCategories, editingProductId, formState.category]);

  const handleChange = (event) => {
    setFormState((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setFormState({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      stockQuantity: String(product.stockQuantity ?? 0),
      savings: product.savings,
      rating: product.rating,
      tag: product.tag,
      image: product.image
    });
    setError("");
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setFormState({
      ...initialFormState,
      category: availableCategories[0]?.name ?? ""
    });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      ...formState,
      price: Number(formState.price),
      originalPrice: Number(formState.originalPrice),
      stockQuantity: Number(formState.stockQuantity)
    };

    try {
      if (editingProductId) {
        await editProduct(editingProductId, payload);
      } else {
        await addProduct(payload);
      }

      handleCancel();
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await removeProduct(productId);

      if (editingProductId === productId) {
        handleCancel();
      }
    } catch (submissionError) {
      setError(submissionError.message);
    }
  };

  const handleExport = () => {
    downloadCsv(
      "brightcart-products.csv",
      [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "price", label: "Price" },
        { key: "originalPrice", label: "Original Price" },
        { key: "stockQuantity", label: "Stock Quantity" },
        { key: "rating", label: "Rating" },
        { key: "tag", label: "Tag" },
        { key: "image", label: "Image URL" }
      ],
      products
    );
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="admin-title">Manage products</h1>
          <p className="admin-subtitle">
            Add, edit, and remove catalog items while keeping inventory levels under control.
          </p>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-form-card">
          <h2>{headingText}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Name</span>
              <input name="name" value={formState.name} onChange={handleChange} required />
            </label>

            <label className="auth-field">
              <span>Category</span>
              <select name="category" value={formState.category} onChange={handleChange} required>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="auth-field">
              <span>Description</span>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>

            <div className="admin-form-grid">
              <label className="auth-field">
                <span>Price</span>
                <input name="price" type="number" value={formState.price} onChange={handleChange} required />
              </label>

              <label className="auth-field">
                <span>Original Price</span>
                <input
                  name="originalPrice"
                  type="number"
                  value={formState.originalPrice}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="auth-field">
                <span>Stock Quantity</span>
                <input
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formState.stockQuantity}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="auth-field">
                <span>Savings</span>
                <input name="savings" value={formState.savings} onChange={handleChange} required />
              </label>

              <label className="auth-field">
                <span>Rating</span>
                <input name="rating" value={formState.rating} onChange={handleChange} required />
              </label>

              <label className="auth-field">
                <span>Tag</span>
                <input name="tag" value={formState.tag} onChange={handleChange} required />
              </label>
            </div>

            <label className="auth-field">
              <span>Image URL</span>
              <input name="image" value={formState.image} onChange={handleChange} required />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <div className="admin-form-actions">
              <Button type="submit" disabled={isSubmitting || availableCategories.length === 0}>
                {isSubmitting ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
              </Button>
              {editingProductId ? (
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="admin-list-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Catalog</span>
              <h3>{products.length} products</h3>
            </div>
            <Button variant="ghost" onClick={handleExport} disabled={products.length === 0}>
              Export CSV
            </Button>
          </div>

          {productsLoading ? <p className="admin-empty">Loading products...</p> : null}
          {productsError ? (
            <p className={productsMode === "local" ? "auth-success admin-mode-banner" : "auth-error"}>
              {productsError}
            </p>
          ) : null}
          {availableCategories.length === 0 ? (
            <p className="auth-error">Add a category first before creating products.</p>
          ) : null}

          <div className="admin-product-list">
            {products.map((product) => (
              <article key={product.id} className="admin-product-row">
                <div className="admin-product-copy">
                  <strong>{product.name}</strong>
                  <span>{product.category} | Stock {product.stockQuantity ?? 0}</span>
                </div>

                <div className="admin-product-actions">
                  {(product.stockQuantity ?? 0) <= 10 ? (
                    <span className="admin-stock-badge">Low Stock</span>
                  ) : null}
                  <button type="button" className="admin-link-button" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-link-button admin-link-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminProductsPage;
