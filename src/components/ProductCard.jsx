import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="card">

      <img
        src={product.image}
        alt={product.name}
        className="product-img"
      />

      {/* Product Name */}
      <h3 className="product-title">{product.name}</h3>

      {/* FREE DELIVERY TEXT  */}
      {product.deliveryText && (
        <p className="free-delivery">{product.deliveryText}</p>
      )}

      {/* BOTTOM SECTION */}
      <div className="bottom-section">

        {/* Offer Price */}
        <p className="offer-price">₹ {product.offerPrice}</p>

        <p className="price">
          <span className="actual-price">₹ {product.price}</span>
          <span className="discount"> {product.discountPercent}% OFF</span>
        </p>

        {/* View Details Button */}
        <Link
          to="/product-details"
          state={{ product }}
          preventScrollReset
          className="btn"
        >
          View Details
        </Link>


      </div>

    </div>
  );
};

export default ProductCard;
