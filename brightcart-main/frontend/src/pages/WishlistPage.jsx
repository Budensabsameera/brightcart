import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import ProductCard from "../components/product/ProductCard";
import { useWishlist } from "../context/WishlistContext";

function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <section className="wishlist-page">
      <div className="wishlist-page-hero">
        <div>
          <span className="section-kicker">Saved Items</span>
          <h1>Your wishlist</h1>
          <p>Products you saved for later.</p>
        </div>
        <div className="wishlist-page-summary">
          <span>Saved</span>
          <strong>{wishlistItems.length}</strong>
          <p>{wishlistItems.length === 1 ? "1 item" : `${wishlistItems.length} items`}</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty-state">
          <h2>No saved items yet</h2>
          <p>Save products from the shop to see them here.</p>
          <Link to="/products">
            <Button>Explore Products</Button>
          </Link>
        </div>
      ) : (
        <div className="wishlist-page-grid">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default WishlistPage;
