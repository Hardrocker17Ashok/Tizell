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

      <h3 className="product-title">{product.name}</h3>

      {/* BOTTOM FIXED SECTION */}
      <div className="bottom-section">
        <p className="offer-price">₹ {product.offerPrice}</p>

        <p className="price">
          <span className="actual-price">₹ {product.price}</span>
          <span className="discount"> {product.discountPercent}% OFF</span>
        </p>

        <Link to={`/product/${product.id}`} className="btn">
          View Details
        </Link>
      </div>

    </div>
  );
};

export default ProductCard;
