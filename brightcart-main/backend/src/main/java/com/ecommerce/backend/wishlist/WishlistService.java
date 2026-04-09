package com.ecommerce.backend.wishlist;

import com.ecommerce.backend.auth.CurrentUserService;
import com.ecommerce.backend.auth.User;
import com.ecommerce.backend.catalog.Product;
import com.ecommerce.backend.catalog.ProductCatalogService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class WishlistService {

    private final CurrentUserService currentUserService;
    private final ProductCatalogService productCatalogService;
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;

    public WishlistService(
            CurrentUserService currentUserService,
            ProductCatalogService productCatalogService,
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository
    ) {
        this.currentUserService = currentUserService;
        this.productCatalogService = productCatalogService;
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
    }

    @Transactional
    public WishlistResponse getWishlist() {
        Wishlist wishlist = getOrCreateWishlist();
        return toResponse(wishlistItemRepository.findByWishlistOrderByCreatedAtDesc(wishlist));
    }

    @Transactional
    public WishlistResponse addItem(Long productId) {
        Wishlist wishlist = getOrCreateWishlist();
        Product product = productCatalogService.findEntityById(productId);

        wishlistItemRepository.findByWishlistAndProductId(wishlist, productId)
                .orElseGet(() -> {
                    WishlistItem item = new WishlistItem();
                    item.setWishlist(wishlist);
                    item.setProduct(product);
                    item.setCreatedAt(LocalDateTime.now());
                    return wishlistItemRepository.save(item);
                });

        return toResponse(wishlistItemRepository.findByWishlistOrderByCreatedAtDesc(wishlist));
    }

    @Transactional
    public WishlistResponse removeItem(Long productId) {
        Wishlist wishlist = getOrCreateWishlist();
        wishlistItemRepository.findByWishlistAndProductId(wishlist, productId)
                .ifPresent(wishlistItemRepository::delete);
        return toResponse(wishlistItemRepository.findByWishlistOrderByCreatedAtDesc(wishlist));
    }

    private WishlistResponse toResponse(List<WishlistItem> items) {
        List<WishlistItemResponse> mappedItems = items.stream()
                .map(item -> new WishlistItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getCategory().getName(),
                        item.getProduct().getDescription(),
                        item.getProduct().getPrice(),
                        item.getProduct().getOriginalPrice(),
                        item.getProduct().getStockQuantity(),
                        calculateSavings(item.getProduct().getPrice(), item.getProduct().getOriginalPrice()),
                        item.getProduct().getRating(),
                        item.getProduct().getTag(),
                        item.getProduct().getImageUrl()
                ))
                .toList();

        return new WishlistResponse(mappedItems, mappedItems.size());
    }

    private String calculateSavings(Integer price, Integer originalPrice) {
        if (price == null || originalPrice == null || originalPrice <= 0 || originalPrice <= price) {
            return "0%";
        }

        double ratio = ((double) (originalPrice - price) / originalPrice) * 100;
        return Math.round(ratio) + "%";
    }

    private Wishlist getOrCreateWishlist() {
        User user = currentUserService.getCurrentUser();
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> {
                    Wishlist wishlist = new Wishlist();
                    wishlist.setUser(user);
                    wishlist.setCreatedAt(LocalDateTime.now());
                    return wishlistRepository.save(wishlist);
                });
    }
}
