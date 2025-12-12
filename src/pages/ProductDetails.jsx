import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  const [mainImage, setMainImage] = useState(
    product.image || product.image2 || product.image3
  );

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) return <h2 className="pd-error">Product not found.</h2>;

  // ADD TO CART
  const addToCart = async () => {
    if (!auth.currentUser) return navigate("/login");

    try {
      await addDoc(collection(db, "cart"), {
        userId: auth.currentUser.uid,
        productId: product.id,
        productName: product.name,
        variant: selectedVariant,
        offerPrice: selectedVariant.offerPrice,
        price: selectedVariant.price,
        quantity: 1,
        image: product.image,
        addedAt: Date.now(),
      });
    
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyNow = () => {
  if (!auth.currentUser) {
    navigate("/login");
    return;
  }

  navigate("/checkout", {
    state: {
      buyNow: true,
      product,
      variant: selectedVariant,
      quantity: 1
    }
  });
};


  return (
    <div className="pd-container">

      {/* LEFT IMAGES */}
      <div className="pd-left">
        <img src={mainImage} className="pd-main-img" alt={product.name} />

        <div className="pd-small-images">
          {[product.image, product.image2, product.image3, product.image4, product.image5]
            .filter(Boolean)
            .map((img, i) => (
              <img 
                key={i} 
                src={img} 
                onClick={() => setMainImage(img)} 
                className={mainImage === img ? "active-thumb" : ""}
                alt="thumb" 
              />
            ))}
        </div>
      </div>

      {/* CENTER DETAILS */}
      <div className="pd-center">
        <h2 className="pd-title">{product.name}</h2>

    
        <div className="pd-rating">
          ⭐⭐⭐ <span className="pd-review-count">(210 ratings)</span>
        </div>

        {/* VARIANTS */}
        <h3 className="pd-sub-title">Choose Variant</h3>
        <div className="pd-variant-box">
          {product.variants?.map((v, i) => (
            <div
              key={i}
              className={`variant-item ${
                selectedVariant?.label === v.label ? "active" : ""
              }`}
              onClick={() => setSelectedVariant(v)}
            >
              {v.label}
            </div>
          ))}
        </div>

        {/* PRICE */}
        <div className="pd-price-box">
          <h1 className="pd-price">₹{selectedVariant?.offerPrice}</h1>
          <p className="pd-mrp">M.R.P: ₹{selectedVariant?.price}</p>
          <p className="pd-discount">{selectedVariant?.discount}% OFF</p>
        </div>

        {/* TECHNICAL DETAILS */}
        <h3 className="pd-sub-title">Technical Details</h3>

        <table className="pd-spec-table">
          <tbody>
            <tr><td>Brand</td><td>{product.specs?.brand}</td></tr>
            <tr><td>Material</td><td>{product.specs?.material}</td></tr>
            <tr><td>Colour</td><td>{product.specs?.color}</td></tr>
            
            <tr><td>Weight</td><td>{product.specs?.weight}</td></tr>
            
           
            <tr><td>Manufacturer</td><td>{product.specs?.manufacturer}</td></tr>
          </tbody>
        </table>

        {/* ABOUT SECTION */}
        <h3 className="pd-sub-title">About this item</h3>
        <ul className="pd-about">
          {product.about
            ?.split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, i) => (
              <li key={i}>{line}</li>
            ))}
        </ul>
      </div>

      {/* RIGHT BUY BOX */}
      <div className="pd-right">
        <p className="pd-stock">In Stock</p>

        <div className="pd-delivery">
          <p>🚚 Free Delivery</p>
          <p>📍 Delivered to your location</p>
        </div>

        <button className="pd-add" onClick={addToCart}>
          Add to Cart
        </button>

        <button className="pd-buy" onClick={handleBuyNow}>
  Buy Now
</button>

      </div>
    </div>
  );
};

export default ProductDetails;
