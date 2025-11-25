import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const ProductDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found.</h2>;
  }

  // ✅ ADD TO CART
  const addToCart = async () => {
    if (!auth.currentUser) {
      navigate("/login");   // ✅ direct redirect
      return;
    }

    try {
      await addDoc(collection(db, "cart"), {
        userId: auth.currentUser.uid,
        product: product,
        quantity: 1,
        addedAt: Date.now(),
      });

      alert("Added to cart!");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "280px",
          height: "280px",
          objectFit: "contain",
          borderRadius: "8px",
        }}
      />

      <h1 style={{ marginTop: "20px", fontSize: "24px", fontWeight: "bold" }}>
        {product.name}
      </h1>

      <h2 style={{ color: "green", marginTop: "10px" }}>
        ₹ {product.offerPrice}
      </h2>

      <p style={{ marginTop: "5px" }}>
        <span style={{ textDecoration: "line-through", color: "gray" }}>
          ₹ {product.price}
        </span>
        &nbsp;&nbsp;
        <span style={{ color: "red", fontWeight: "bold" }}>
          {product.discountPercent}% OFF
        </span>
      </p>

      <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
        {product.description}
      </p>

      <button
        onClick={addToCart}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "black",
          color: "white",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
