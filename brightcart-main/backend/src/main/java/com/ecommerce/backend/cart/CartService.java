package com.ecommerce.backend.cart;

import com.ecommerce.backend.auth.CurrentUserService;
import com.ecommerce.backend.auth.User;
import com.ecommerce.backend.catalog.Product;
import com.ecommerce.backend.catalog.ProductCatalogService;
import com.ecommerce.backend.orders.InsufficientStockException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final ProductCatalogService productCatalogService;
    private final CurrentUserService currentUserService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(
            ProductCatalogService productCatalogService,
            CurrentUserService currentUserService,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository
    ) {
        this.productCatalogService = productCatalogService;
        this.currentUserService = currentUserService;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public CartResponse getCart() {
        Cart cart = getOrCreateCart();
        return toCartResponse(cartItemRepository.findByCart(cart));
    }

    @Transactional
    public CartResponse addItem(AddCartItemRequest request) {
        Cart cart = getOrCreateCart();
        Product product = productCatalogService.findEntityById(request.productId());
        int quantityToAdd = request.quantity() == null ? 1 : request.quantity();

        CartItem item = cartItemRepository.findByCartAndProductId(cart, request.productId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    return newItem;
                });

        int requestedQuantity = item.getQuantity() + quantityToAdd;
        validateStock(product, requestedQuantity);
        item.setUnitPrice(product.getPrice());
        item.setQuantity(requestedQuantity);
        cartItemRepository.save(item);
        touch(cart);
        return getCart();
    }

    @Transactional
    public CartResponse updateItem(Long productId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart();
        CartItem item = cartItemRepository.findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new CartItemNotFoundException(productId));

        validateStock(item.getProduct(), request.quantity());
        item.setQuantity(request.quantity());
        item.setUnitPrice(item.getProduct().getPrice());
        cartItemRepository.save(item);
        touch(cart);
        return getCart();
    }

    @Transactional
    public CartResponse removeItem(Long productId) {
        Cart cart = getOrCreateCart();
        cartItemRepository.findByCartAndProductId(cart, productId)
                .ifPresent(cartItemRepository::delete);
        touch(cart);
        return getCart();
    }

    @Transactional
    public void clearCart() {
        Cart cart = getOrCreateCartForCurrentUser();
        cartItemRepository.deleteByCart(cart);
        touch(cart);
    }

    private CartResponse toCartResponse(List<CartItem> cartItems) {
        List<CartItemResponse> items = cartItems.stream()
                .map(this::toCartItem)
                .toList();

        int subtotal = items.stream()
                .mapToInt(item -> item.price() * item.quantity())
                .sum();
        int shipping = items.isEmpty() ? 0 : 99;
        int totalItems = items.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        return new CartResponse(items, subtotal, shipping, totalItems, subtotal + shipping);
    }

    private CartItemResponse toCartItem(CartItem item) {
        return new CartItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getCategory().getName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getProduct().getImageUrl(),
                item.getProduct().getStockQuantity()
        );
    }

    public Cart getOrCreateCartForCurrentUser() {
        User currentUser = currentUserService.getCurrentUser();
        return cartRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(currentUser);
                    cart.setCreatedAt(LocalDateTime.now());
                    cart.setUpdatedAt(LocalDateTime.now());
                    return cartRepository.save(cart);
                });
    }

    private Cart getOrCreateCart() {
        return getOrCreateCartForCurrentUser();
    }

    private void touch(Cart cart) {
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    private void validateStock(Product product, int requestedQuantity) {
        int availableQuantity = product.getStockQuantity() == null ? 0 : product.getStockQuantity();

        if (requestedQuantity > availableQuantity) {
            throw new InsufficientStockException(product.getName(), requestedQuantity, availableQuantity);
        }
    }
}
