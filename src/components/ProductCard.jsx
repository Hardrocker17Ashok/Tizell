import { Link } from "react-router-dom";
import "./ProductCard.css";
import StarRating from "../components/StarRating";


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

      <div className="product-rating">
        <StarRating value={product.ratingAvg} />
        <span style={{ fontSize: 13, color: "#555" }}>
          ({product.ratingCount})
        </span>
      </div>


      {/* BOTTOM SECTION */}
      <div className="bottom-section">

        {/* Offer Price */}
        <p className="offer-price">₹ {product.offerPrice}</p>

        <p className="price">
          <span className="actual-price">₹ {product.price}</span>
          <span className="discount"> {product.discountPercent}% OFF</span>
        </p>

        {/* View Details Button */}
        {/* <Link
          to="/product-details"
          state={{ product,docId: product.docId  }}
          preventScrollReset
          className="btn"
        >
          View Details
        </Link> */}

        <Link
          to="/product-details"
          state={{
            product: {
              ...product,
              docId: product.docId, // ✅ INSIDE product
            },
          }}
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
