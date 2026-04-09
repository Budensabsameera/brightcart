import { Link, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../utils/formatters";

function ProductDetailPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { products } = useProducts();
  const product = products.find((item) => String(item.id) === productId) ?? products[0];
  const isOutOfStock = typeof product.stockQuantity === "number" && product.stockQuantity <= 0;
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  return (
    <section className="product-detail-page product-detail-page-minimal">
      <div className="product-detail-layout product-detail-layout-minimal">
        <div className="product-detail-gallery product-detail-gallery-minimal">
          <div className="product-detail-main-image-wrap product-detail-main-image-wrap-minimal">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-main-image product-detail-main-image-minimal"
            />
          </div>
        </div>

        <div className="product-detail-copy product-detail-copy-minimal">
          <span className="product-card-category">{product.category}</span>
          <h1 className="product-detail-title-minimal">{product.name}</h1>

          <div className="product-detail-price-block product-detail-price-block-minimal">
            <p className="product-price">{formatPrice(product.price)}</p>
            <span className="product-savings">
              {isOutOfStock ? "Currently unavailable" : `Save ${product.savings}`}
            </span>
          </div>

          <p className="product-detail-description product-detail-description-minimal">
            {product.description}
          </p>

          <div className="product-detail-inline-actions">
            <Button
              className="product-detail-add product-detail-add-minimal"
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <button
              type="button"
              className={`wishlist-button product-detail-wishlist${
                isWishlisted(product.id) ? " product-wishlist-button-active" : ""
              }`}
              onClick={() => toggleWishlist(product)}
            >
              {isWishlisted(product.id) ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>
          </div>

          <Link to="/products" className="section-link product-detail-back-link">
            Back to shop
          </Link>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <div className="product-detail-related product-detail-related-minimal">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Related Products</span>
              <h3>More in {product.category}</h3>
            </div>
            <Link to="/products" className="section-link">
              Browse all
            </Link>
          </div>

          <div className="product-detail-related-track product-detail-related-track-minimal">
            {relatedProducts.map((item) => {
              const relatedOutOfStock =
                typeof item.stockQuantity === "number" && item.stockQuantity <= 0;
              const relatedLowStock =
                typeof item.stockQuantity === "number" &&
                item.stockQuantity > 0 &&
                item.stockQuantity <= 5;

              return (
                <article key={item.id} className="related-product-card">
                  <Link to={`/products/${item.id}`} className="related-product-media">
                    <span
                      className={`product-stock-badge${
                        relatedOutOfStock
                          ? " product-stock-badge-out"
                          : relatedLowStock
                            ? " product-stock-badge-low"
                            : ""
                      }`}
                    >
                      {relatedOutOfStock
                        ? "Out of Stock"
                        : relatedLowStock
                          ? `Only ${item.stockQuantity} left`
                          : `${item.stockQuantity} in stock`}
                    </span>
                    <img src={item.image} alt={item.name} className="related-product-image" />
                  </Link>

                  <div className="related-product-body">
                    <p className="product-card-category">{item.category}</p>
                    <Link to={`/products/${item.id}`} className="related-product-title">
                      {item.name}
                    </Link>
                    <div className="related-product-footer">
                      <div>
                        <p className="product-price">{formatPrice(item.price)}</p>
                        <span className="product-savings">
                          {relatedOutOfStock ? "Currently unavailable" : `Save ${item.savings}`}
                        </span>
                      </div>
                      <div className="related-product-actions">
                        <button
                          type="button"
                          className={`wishlist-button related-product-wishlist${
                            isWishlisted(item.id) ? " product-wishlist-button-active" : ""
                          }`}
                          onClick={() => toggleWishlist(item)}
                        >
                          {isWishlisted(item.id) ? "Saved" : "Save"}
                        </button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => addToCart(item)}
                          disabled={relatedOutOfStock}
                        >
                          {relatedOutOfStock ? "Unavailable" : "Add"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ProductDetailPage;
