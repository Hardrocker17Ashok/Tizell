import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="card">

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="product-img"
      />

      {/* Product Name */}
      <h3 className="product-title">{product.name}</h3>

      {/* BOTTOM SECTION */}
      <div className="bottom-section">
        
        {/* Offer Price */}
        <p className="offer-price">₹ {product.offerPrice}</p>

        {/* Actual Price + Discount */}
        <p className="price">
          <span className="actual-price">₹ {product.price}</span>
          <span className="discount"> {product.discountPercent}% OFF</span>
        </p>

        {/* View Details Button */}
        <Link
          to="/product-details"
          state={{ product }}
          className="btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

export default ProductCard;
