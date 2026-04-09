import { formatPrice } from "../../utils/formatters";

function CartItem({ item, onDecrease, onIncrease, onRemove }) {
  return (
    <article className="cart-item">
      <div className="cart-item-media">
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </div>

      <div className="cart-item-copy">
        <div className="cart-item-header">
          <div>
            <p className="product-card-category">{item.category}</p>
            <h3 className="cart-item-title">{item.name}</h3>
          </div>
          <button type="button" className="cart-remove-button" onClick={() => onRemove(item.id)}>
            Remove
          </button>
        </div>

        <p className="cart-item-price">{formatPrice(item.price)}</p>
        {typeof item.stockQuantity === "number" ? (
          <p className="cart-item-stock">Available: {item.stockQuantity}</p>
        ) : null}

        <div className="cart-item-footer">
          <div className="quantity-selector" aria-label={`Quantity for ${item.name}`}>
            <button type="button" onClick={() => onDecrease(item.id)}>
              -
            </button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => onIncrease(item.id)}>
              +
            </button>
          </div>

          <p className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
