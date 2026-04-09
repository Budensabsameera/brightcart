import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatPrice } from "../../utils/formatters";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isOutOfStock = typeof product.stockQuantity === "number" && product.stockQuantity <= 0;
  const isLowStock =
    typeof product.stockQuantity === "number" && product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-media">
        {typeof product.stockQuantity === "number" ? (
          <span
            className={`product-stock-badge${
              isOutOfStock ? " product-stock-badge-out" : isLowStock ? " product-stock-badge-low" : ""
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isLowStock
                ? `Only ${product.stockQuantity} left`
                : `In Stock ${product.stockQuantity}`}
          </span>
        ) : null}
        <img src={product.image} alt={product.name} className="product-card-image" />
      </Link>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-badge">{product.tag}</span>
          <span className="product-rating">{product.rating} rating</span>
        </div>

        <p className="product-card-category">{product.category}</p>

        <Link to={`/products/${product.id}`} className="product-card-title">
          {product.name}
        </Link>

        <p className="product-card-description">{product.description}</p>

        <div className="product-card-footer">
          <div>
            <p className="product-price-label">Launch Price</p>
            <div className="price-row">
              <p className="product-price">{formatPrice(product.price)}</p>
              <p className="price-strike">{formatPrice(product.originalPrice)}</p>
            </div>
            <span className="product-savings">
              {isOutOfStock ? "Out of stock" : `Save ${product.savings}`}
            </span>
          </div>
          <div className="product-card-hover-action product-card-actions">
            <button
              type="button"
              className={`wishlist-button product-wishlist-button${
                isWishlisted(product.id) ? " product-wishlist-button-active" : ""
              }`}
              onClick={() => toggleWishlist(product)}
              aria-label="Save to wishlist"
            >
              {isWishlisted(product.id) ? "Saved" : "Save"}
            </button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Unavailable" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
