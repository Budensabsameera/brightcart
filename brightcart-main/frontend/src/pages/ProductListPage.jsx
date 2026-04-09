import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import ProductCard from "../components/product/ProductCard";
import { useCategories } from "../context/CategoryContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../utils/formatters";

function ProductListPage() {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortValue, setSortValue] = useState("featured");
  const categoryOptions = [
    "All",
    ...(categories.length > 0
      ? categories.map((category) => category.name)
      : [...new Set(products.map((product) => product.category))])
  ];

  const normalizedSearch = searchTerm.trim().toLowerCase();

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  if (sortValue === "price-low-high") {
    filteredProducts = [...filteredProducts].sort((left, right) => left.price - right.price);
  }

  const featuredProduct = filteredProducts[0];
  const gridProducts = filteredProducts.slice(1);
  const featuredOutOfStock =
    typeof featuredProduct?.stockQuantity === "number" && featuredProduct.stockQuantity <= 0;
  const featuredLowStock =
    typeof featuredProduct?.stockQuantity === "number" &&
    featuredProduct.stockQuantity > 0 &&
    featuredProduct.stockQuantity <= 5;

  return (
    <section className="shop-page">
      <div className="shop-header">
        <div>
          <span className="section-kicker">Shop</span>
          <h1 className="shop-title">Curated products with a cleaner way to browse.</h1>
          <p className="shop-subtitle">
            Explore standout picks across electronics, fashion, home, and essentials.
          </p>
        </div>

        <label className="shop-search" htmlFor="shop-search">
          <span className="shop-search-label">Search products</span>
          <input
            id="shop-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by product name"
          />
        </label>
      </div>

      <div className="shop-toolbar">
        <div className="shop-filter-pills" role="tablist" aria-label="Filter products by category">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              className={`shop-filter-pill${
                activeCategory === category ? " shop-filter-pill-active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="shop-sort" htmlFor="shop-sort">
          <span>Sort by</span>
          <select
            id="shop-sort"
            value={sortValue}
            onChange={(event) => setSortValue(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
          </select>
        </label>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="shop-results">
          <article className="shop-feature-card">
            <div className="shop-feature-copy">
              <div className="shop-feature-badges">
                <span className="product-badge">{featuredProduct.tag}</span>
                {typeof featuredProduct.stockQuantity === "number" ? (
                  <span
                    className={`product-stock-badge shop-stock-badge${
                      featuredOutOfStock
                        ? " product-stock-badge-out"
                        : featuredLowStock
                          ? " product-stock-badge-low"
                          : ""
                    }`}
                  >
                    {featuredOutOfStock
                      ? "Out of Stock"
                      : featuredLowStock
                        ? `Only ${featuredProduct.stockQuantity} left`
                        : `${featuredProduct.stockQuantity} in stock`}
                  </span>
                ) : null}
              </div>
              <p className="shop-feature-category">{featuredProduct.category}</p>
              <h2>{featuredProduct.name}</h2>
              <p className="shop-feature-description">{featuredProduct.description}</p>

              <div className="shop-feature-metrics">
                <div>
                  <span>Price</span>
                  <strong>{formatPrice(featuredProduct.price)}</strong>
                </div>
                <div>
                  <span>Rating</span>
                  <strong>{featuredProduct.rating}</strong>
                </div>
                <div>
                  <span>Offer</span>
                  <strong>{featuredProduct.savings} off</strong>
                </div>
              </div>

              <div className="shop-feature-actions">
                <Link to={`/products/${featuredProduct.id}`}>
                  <Button>View Product</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => addToCart(featuredProduct)}
                  disabled={featuredOutOfStock}
                >
                  {featuredOutOfStock ? "Unavailable" : "Add to Cart"}
                </Button>
              </div>
            </div>

            <Link to={`/products/${featuredProduct.id}`} className="shop-feature-image-wrap">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="shop-feature-image"
              />
            </Link>
          </article>

          <div className="shop-product-grid">
            {gridProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="shop-empty-state">
          <span className="section-kicker">No Match</span>
          <h2>No products found</h2>
          <p>Try a different search or switch to another category.</p>
        </div>
      )}
    </section>
  );
}

export default ProductListPage;
