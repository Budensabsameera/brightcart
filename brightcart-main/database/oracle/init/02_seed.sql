INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('CUSTOMER');

INSERT INTO users (role_id, first_name, last_name, email, password_hash, phone, is_active)
VALUES (1, 'BrightCart', 'Admin', 'hello@brightcart.in', 'password123', '9876543210', 1);

INSERT INTO categories (name, slug, description)
VALUES ('Electronics', 'electronics', 'Devices, gadgets, and accessories');

INSERT INTO categories (name, slug, description)
VALUES ('Fashion', 'fashion', 'Clothing, shoes, and style essentials');

INSERT INTO categories (name, slug, description)
VALUES ('Home Living', 'home-living', 'Furniture, decor, and modern home upgrades');

INSERT INTO categories (name, slug, description)
VALUES ('Essentials', 'essentials', 'Everyday products for work, travel, and living');

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active)
VALUES ('WELCOME10', '10% off on your first order', 'PERCENTAGE', 10, 2000, 1);

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active)
VALUES ('SAVE500', 'Flat Rs. 500 off on larger baskets', 'FIXED', 500, 5000, 1);

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active)
VALUES ('SHIP99', 'Shipping covered on eligible orders', 'FIXED', 99, 1500, 1);

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (1, 'Aurora Wireless Headphones', 'aurora-wireless-headphones', 'Premium immersive audio with calm-fit cushioning for work, travel, and deep focus.', 8999, 11999, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 1, '4.8', 'Best Seller');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (2, 'Citrus Everyday Sneakers', 'citrus-everyday-sneakers', 'Lightweight sneakers built for city walks, soft landings, and effortless everyday styling.', 4299, 5699, 60, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', 0, '4.6', 'New In');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (3, 'Halo Ceramic Lamp', 'halo-ceramic-lamp', 'A warm ambient lamp that layers soft light and sculptural texture into any room.', 3199, 4499, 30, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80', 1, '4.7', 'Editor Pick');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (3, 'Solstice Linen Chair', 'solstice-linen-chair', 'Rounded lounge comfort and soft natural tones for flexible, design-forward living spaces.', 12499, 15999, 15, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 1, '4.9', 'Trending');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (1, 'Verdant Smart Watch', 'verdant-smart-watch', 'A sleek everyday wearable with fitness insights, vivid display, and elegant minimal styling.', 14999, 18999, 25, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30e?auto=format&fit=crop&w=900&q=80', 0, '4.7', 'Hot Pick');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (1, 'Sunline Desk Speaker', 'sunline-desk-speaker', 'Compact wireless audio tuned for home desks, low-key evenings, and crisp spoken sound.', 5499, 6999, 35, 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80', 0, '4.5', 'Popular');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (4, 'Aero Travel Backpack', 'aero-travel-backpack', 'Lightweight urban backpack with smart storage, laptop padding, and daily commute comfort.', 3799, 4999, 45, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 1, '4.6', 'Trending');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (3, 'Monarch Coffee Table', 'monarch-coffee-table', 'Minimal wooden table built for bright living rooms and everyday utility.', 8999, 11999, 20, 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80', 1, '4.8', 'Editor Pick');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (4, 'Nova Air Fryer', 'nova-air-fryer', 'Compact kitchen essential for quick snacks, lighter meals, and everyday convenience.', 6299, 7999, 40, 'https://images.unsplash.com/photo-1585515656614-6f3f7f85c8d1?auto=format&fit=crop&w=900&q=80', 0, '4.7', 'Hot Deal');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (2, 'Velo Running Jacket', 'velo-running-jacket', 'Light outer layer for morning runs, weekend travel, and breezy city commutes.', 2899, 3999, 50, 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80', 0, '4.5', 'New In');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (4, 'Mira Glass Water Bottle', 'mira-glass-water-bottle', 'A sleek everyday bottle with a clean silhouette and easy carry loop.', 999, 1399, 80, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', 0, '4.6', 'Daily Pick');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (3, 'Orbit Table Clock', 'orbit-table-clock', 'Compact modern clock for desks, side tables, and calm workspaces.', 1799, 2499, 55, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80', 0, '4.4', 'Fresh Find');

INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, rating, tag)
VALUES (1, 'Arc Mechanical Keyboard', 'arc-mechanical-keyboard', 'Compact tactile keyboard with a cleaner profile for work, gaming, and creator setups.', 6999, 8999, 32, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80', 1, '4.8', 'Top Rated');
