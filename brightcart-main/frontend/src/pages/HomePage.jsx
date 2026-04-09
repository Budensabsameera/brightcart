import { useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import RevealOnScroll from "../components/common/RevealOnScroll";
import ProductCard from "../components/product/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import {
  categories,
  testimonials
} from "../data/products";
import { formatPrice } from "../utils/formatters";

function HomePage() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { products } = useProducts();
  const trendingTrackRef = useRef(null);
  const featuredProducts = products;
  const heroProduct = featuredProducts[0];
  const featuredTargetProduct = featuredProducts.find((product) => !isOutOfStock(product)) ?? heroProduct;

  const scrollTrending = (direction) => {
    if (!trendingTrackRef.current) {
      return;
    }

    trendingTrackRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth"
    });
  };

  return (
    <div className="home-page">
      <RevealOnScroll>
        <section className="hero-section">
          <div className="hero-banner">
            <div className="hero-copy">
              <span className="hero-pill hero-pill-cinematic">Spring Shopping Edit</span>
              <h2>India&apos;s clean new shopping destination for everyday upgrades.</h2>
              <p>
                Discover curated electronics, fashion, and home essentials with simple pricing,
                fast delivery, and premium picks that feel worth opening the app for.
              </p>

              <div className="hero-actions">
                <Link to="/products">
                  <Button>Shop Now</Button>
                </Link>
                <Link to={`/products/${featuredTargetProduct?.id ?? 1}`}>
                  <Button variant="ghost">View Best Seller</Button>
                </Link>
              </div>

              <div className="hero-trust-row">
                <div className="hero-trust-item">
                  <strong>10k+</strong>
                  <span>weekly shoppers</span>
                </div>
                <div className="hero-trust-item">
                  <strong>48 hrs</strong>
                  <span>express delivery in major cities</span>
                </div>
                <div className="hero-trust-item">
                  <strong>Easy returns</strong>
                  <span>selected products</span>
                </div>
              </div>
            </div>

            <div className="hero-feature">
              <div className="hero-feature-top">
                <div className="hero-feature-badges">
                  <span className="hero-feature-badge">Editor&apos;s Pick</span>
                  {heroProduct ? (
                    <span className={getStockBadgeClassName(heroProduct, "shop-stock-badge")}>
                      {getStockLabel(heroProduct)}
                    </span>
                  ) : null}
                </div>
                <span className="hero-feature-chip">Top rated this week</span>
              </div>
              <div className="hero-feature-image">
                <img src={heroProduct?.image} alt={heroProduct?.name} />
              </div>
              <div className="hero-feature-body">
                <h3>{heroProduct?.name}</h3>
                <p>{heroProduct?.description}</p>
                <div className="hero-feature-price">
                  <strong>{formatPrice(heroProduct?.price ?? 0)}</strong>
                  <span>
                    {heroProduct && isOutOfStock(heroProduct)
                      ? "Currently unavailable"
                      : `Save ${heroProduct?.savings ?? "0%"}`}
                  </span>
                </div>
                <div className="hero-feature-footer">
                  {heroProduct && isOutOfStock(heroProduct) ? (
                    <Button variant="secondary" disabled>
                      Out of Stock
                    </Button>
                  ) : (
                    <Link to={`/products/${heroProduct?.id ?? 1}`}>
                      <Button variant="secondary">Explore Product</Button>
                    </Link>
                  )}
                  <div className="hero-feature-meta">
                    <strong>{heroProduct?.rating ?? "4.8"}/5</strong>
                    <span>from recent buyers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={60}>
        {isAuthenticated && !isAdmin ? (
          <section className="signed-in-banner">
            <div className="signed-in-banner-copy">
              <span className="section-kicker">Signed In</span>
              <h3>{user?.name}, your customer account is active.</h3>
              <p>
                Continue shopping now, or move forward with seller setup by adding your business
                details.
              </p>
            </div>
            <div className="signed-in-banner-actions">
              <Link to="/account">
                <Button variant="ghost">Open Account</Button>
              </Link>
              <Link to="/business-account">
                <Button>Add Business Details</Button>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Categories</span>
              <h3>Shop by category</h3>
            </div>
            <Link to="/products" className="section-link">
              View all
            </Link>
          </div>

          <div className="category-grid-clean">
            {categories.map((category) => (
              <article key={category.id} className="category-card-clean">
                <div className="category-card-clean-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-card-clean-body">
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                  <span>{category.stat}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Featured Products</span>
              <h3>Popular picks customers are loving right now</h3>
            </div>
            <Link to="/products" className="section-link">
              Browse products
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={140}>
        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Trending Now</span>
              <h3>Products getting attention this week</h3>
            </div>
            <div className="carousel-controls">
              <button
                type="button"
                className="carousel-button"
                onClick={() => scrollTrending(-1)}
                aria-label="Scroll trending products left"
              >
                {"<"}
              </button>
              <button
                type="button"
                className="carousel-button"
                onClick={() => scrollTrending(1)}
                aria-label="Scroll trending products right"
              >
                {">"}
              </button>
            </div>
          </div>

          <div className="trending-summary">
            <p>
              A lightweight product rail with more options, quick pricing visibility, and a
              cleaner browsing rhythm.
            </p>
            <span className="trending-summary-badge">
              {featuredProducts.slice(1).length} live picks
            </span>
          </div>

          <div className="trending-track" ref={trendingTrackRef}>
            {featuredProducts.slice(1).map((product) => (
              <article key={product.id} className="trending-card-clean">
                <div className="trending-card-media">
                  <span className={getStockBadgeClassName(product)}>
                    {getStockLabel(product)}
                  </span>
                  <img src={product.image} alt={product.name} className="trending-card-image" />
                </div>
                <div className="trending-card-body">
                  <span className="product-badge">{product.tag}</span>
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <div className="trending-card-footer">
                    <div className="trending-price-block">
                      <strong>{formatPrice(product.price)}</strong>
                      <span>
                        {isOutOfStock(product) ? "Currently unavailable" : `${product.savings} off`}
                      </span>
                    </div>
                    {isOutOfStock(product) ? (
                      <span className="section-link section-link-disabled">Unavailable</span>
                    ) : (
                      <Link to={`/products/${product.id}`} className="section-link">
                        View product
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={180}>
        <section className="offer-banner-clean">
          <div className="offer-banner-copy">
            <span className="section-kicker">Limited Offer</span>
            <h3>Save up to 40% on selected essentials and trending picks.</h3>
            <p>
              A cleaner campaign block with a stronger focal point, sharper spacing,
              and just enough contrast to stand out without feeling heavy.
            </p>
          </div>

          <div className="offer-banner-panel">
            <div className="offer-banner-metric">
              <span>Deal Window</span>
              <strong>72 Hours</strong>
            </div>
            <div className="offer-banner-metric">
              <span>Shipping</span>
              <strong>Free above {"\u20B9"}499</strong>
            </div>
            <div className="offer-banner-actions">
              <Link to="/products">
                <Button>Shop Deals</Button>
              </Link>
              <span className="offer-note">Selected products only</span>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={220}>
        <section className="business-banner">
          <div className="business-banner-copy">
            <span className="section-kicker">For Sellers</span>
            <h3>Want to sell on BrightCart instead of only shopping on it?</h3>
            <p>
              Keep your normal customer account for buying, then switch to a business account only
              when you are ready to manage products, orders, customers, and promotions.
            </p>
          </div>

          <div className="business-banner-panel">
            <div className="business-banner-metric">
              <span>Business setup</span>
              <strong>3 quick steps</strong>
            </div>
            <div className="business-banner-metric">
              <span>Role change</span>
              <strong>Customer to Admin</strong>
            </div>
            <Link to="/business-account">
              <Button>{isAuthenticated && !isAdmin ? "Add Business Details" : "Open Business Setup"}</Button>
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={240}>
        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Testimonials</span>
              <h3>What shoppers are saying</h3>
            </div>
          </div>

          <div className="testimonial-layout">
            <article className="testimonial-lead">
              <span className="section-kicker">Featured Review</span>
              <p className="testimonial-lead-text">{testimonials[0].quote}</p>
              <div className="testimonial-meta-clean">
                <strong>{testimonials[0].name}</strong>
                <span>{testimonials[0].role} {"\u00B7"} {testimonials[0].city}</span>
              </div>
            </article>

            <div className="testimonial-grid-clean">
              {testimonials.slice(1).map((item) => (
                <article key={item.id} className="testimonial-card-clean">
                  <p className="testimonial-text">{item.quote}</p>
                  <div className="testimonial-meta-clean">
                    <strong>{item.name}</strong>
                    <span>{item.role} {"\u00B7"} {item.city}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={320}>
        <section className="newsletter-card-clean">
          <div>
            <span className="section-kicker">Newsletter</span>
            <h3>Get new arrivals and offers in your inbox</h3>
            <p>
              Subscribe for deal alerts, fresh launches, and curated weekly product highlights.
            </p>
          </div>

          <form className="newsletter-form-clean">
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </section>
      </RevealOnScroll>
    </div>
  );
}

function isOutOfStock(product) {
  return typeof product?.stockQuantity === "number" && product.stockQuantity <= 0;
}

function isLowStock(product) {
  return typeof product?.stockQuantity === "number" && product.stockQuantity > 0 && product.stockQuantity <= 5;
}

function getStockLabel(product) {
  if (isOutOfStock(product)) {
    return "Out of Stock";
  }

  if (isLowStock(product)) {
    return `Only ${product.stockQuantity} left`;
  }

  if (typeof product?.stockQuantity === "number") {
    return `${product.stockQuantity} in stock`;
  }

  return "In Stock";
}

function getStockBadgeClassName(product, extraClassName = "") {
  return `product-stock-badge${
    isOutOfStock(product) ? " product-stock-badge-out" : isLowStock(product) ? " product-stock-badge-low" : ""
  } ${extraClassName}`.trim();
}

export default HomePage;
