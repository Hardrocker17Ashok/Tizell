import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import StarRating from "../components/StarRating";
import {
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";


import "./ProductDetails.css";

const ProductDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  console.log("PRODUCT DETAILS PAGE =>", {
    name: product?.name,
    firestoreDocId: product?.id,
    productDocId: product?.docId
  });


  const [enableSticky, setEnableSticky] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  const [mainImage, setMainImage] = useState(
    product.image || product.image2 || product.image3
  );


  useEffect(() => {
    document.activeElement?.blur();
    const t = setTimeout(() => setEnableSticky(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!product) return <h2 className="pd-error">Product not found.</h2>;

  // ADD TO CART
  console.log("ADD TO CART PRODUCT =>", product);

  const addToCart = async () => {
    if (!auth.currentUser) return navigate("/login");

    try {
      // 1️⃣ Check if same product + same variant already exists
      const q = query(
        collection(db, "cart"),
        where("userId", "==", auth.currentUser.uid),
        where("productId", "==", product.id),
        where("variant.label", "==", selectedVariant.label)
      );

      const snap = await getDocs(q);

      // 2️⃣ If exists → increase quantity
      if (!snap.empty) {
        const cartDoc = snap.docs[0];
        const currentQty = cartDoc.data().quantity || 1;

        await updateDoc(doc(db, "cart", cartDoc.id), {
          quantity: currentQty + 1,
        });

      } else {
        // 3️⃣ Else → add new item
        console.log("ADD TO CART ITEM =>", {
          name: product.name,
          firestoreDocId: product.id,
          productDocId: product.docId
        });

        await addDoc(collection(db, "cart"), {
          userId: auth.currentUser.uid,
          // productId: product.id,
          productDocId: product.docId,
          productName: product.name,
          variant: selectedVariant,
          offerPrice: selectedVariant.offerPrice,
          price: selectedVariant.price,
          quantity: 1,
          image: product.image,
          addedAt: Date.now(),
        });
      }

    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };


  const handleBuyNow = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    try {
      // 1️⃣ Check if same product (Firestore docId) + variant already in cart
      const q = query(
        collection(db, "cart"),
        where("userId", "==", auth.currentUser.uid),
        where("productDocId", "==", product.docId), // ✅ FIX
        where("variant.label", "==", selectedVariant.label)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        // 2️⃣ If exists → increase quantity
        const cartDoc = snap.docs[0];
        const qty = cartDoc.data().quantity || 1;

        await updateDoc(doc(db, "cart", cartDoc.id), {
          quantity: qty + 1
        });
      } else {
        // 3️⃣ Else → add fresh cart item (SAME STRUCTURE AS CART)
        await addDoc(collection(db, "cart"), {
          userId: auth.currentUser.uid,
          productDocId: product.docId,      // ✅ FIX (MOST IMPORTANT)
          productId: product.id,             // optional (keep if you want)
          productName: product.name,
          variant: selectedVariant,
          offerPrice: selectedVariant.offerPrice,
          price: selectedVariant.price,
          quantity: 1,
          image: product.image,
          addedAt: Date.now(),
        });
      }

      // 4️⃣ Go to checkout normally
      navigate("/checkout");

    } catch (err) {
      console.error("Buy Now error:", err);
    }
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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StarRating value={product.ratingAvg} size={20} />
          <span>({product.ratingCount} ratings)</span>
        </div>


        {/* VARIANTS */}
        <h3 className="pd-sub-title">Choose Variant</h3>
        <div className="pd-variant-box">
          {product.variants?.map((v, i) => (
            <div
              key={i}
              className={`variant-item ${selectedVariant?.label === v.label ? "active" : ""
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
      <div className={`pd-right ${enableSticky ? "sticky" : ""}`}>

        <p className="pd-stock">In Stock</p>

        <div className="pd-delivery">
          <p>🚚 Free Delivery</p>
          <p>📍 Delivered to your location</p>
          <p>🔁 Easy 7-Day Return & Replacement</p>

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
