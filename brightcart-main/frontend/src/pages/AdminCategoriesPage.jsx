import { useMemo, useState } from "react";
import Button from "../components/common/Button";
import { useCategories } from "../context/CategoryContext";

const initialFormState = {
  name: "",
  description: ""
};

function AdminCategoriesPage() {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    categoriesMode,
    addCategory,
    editCategory,
    removeCategory
  } = useCategories();
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headingText = useMemo(
    () => (editingCategoryId ? "Edit category" : "Add category"),
    [editingCategoryId]
  );

  const handleChange = (event) => {
    setFormState((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.id);
    setFormState({
      name: category.name,
      description: category.description ?? ""
    });
    setError("");
  };

  const handleCancel = () => {
    setEditingCategoryId(null);
    setFormState(initialFormState);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (editingCategoryId) {
        await editCategory(editingCategoryId, formState);
      } else {
        await addCategory(formState);
      }

      handleCancel();
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await removeCategory(categoryId);

      if (editingCategoryId === categoryId) {
        handleCancel();
      }
    } catch (submissionError) {
      setError(submissionError.message);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="admin-title">Manage categories</h1>
          <p className="admin-subtitle">
            Keep the catalog structure clean so products, filters, and navigation stay organized.
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
              <span>Description</span>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <div className="admin-form-actions">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingCategoryId ? "Update Category" : "Add Category"}
              </Button>
              {editingCategoryId ? (
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
              <span className="section-kicker">Categories</span>
              <h3>{categories.length} categories</h3>
            </div>
          </div>

          {categoriesLoading ? <p className="admin-empty">Loading categories...</p> : null}
          {categoriesError ? (
            <p className={categoriesMode === "local" ? "auth-success admin-mode-banner" : "auth-error"}>
              {categoriesError}
            </p>
          ) : null}

          <div className="admin-product-list">
            {categories.map((category) => (
              <article key={category.id} className="admin-product-row">
                <div className="admin-product-copy">
                  <strong>{category.name}</strong>
                  <span>{category.description}</span>
                </div>

                <div className="admin-product-actions">
                  <button type="button" className="admin-link-button" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-link-button admin-link-danger"
                    onClick={() => handleDelete(category.id)}
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

export default AdminCategoriesPage;
