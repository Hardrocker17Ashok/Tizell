import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import RateStars from "../components/RateStars";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import "./OrderSuccess.css";

/* 🔒 Per-product isolated rating row */
const RatingRow = ({ item }) => {
  const [rated, setRated] = useState(0);

  const saveRating = async (stars) => {
    if (!auth.currentUser) return;

    try {
      // 🔒 CHECK: already rated or not (DB LEVEL)
      const q = query(
        collection(db, "ratings"),
        where("userId", "==", auth.currentUser.uid),
        where("productDocId", "==", item.productDocId) // ✅ FIX
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        alert("You have already rated this product");
        setRated(snap.docs[0].data().stars); // UI sync
        return;
      }

      const updateProductRating = async (productDocId) => {
        const q = query(
          collection(db, "ratings"),
          where("productDocId", "==", productDocId) // ✅ FIX
        );

        const snap = await getDocs(q);

        let total = 0;
        snap.forEach((doc) => {
          total += doc.data().stars;
        });

        const avg = snap.size ? total / snap.size : 0;

        await updateDoc(doc(db, "products", productDocId), { // ✅ FIX
          ratingAvg: Number(avg.toFixed(1)),
          ratingCount: snap.size
        });
      };

      // ✅ SAVE NEW RATING
      await addDoc(collection(db, "ratings"), {
        userId: auth.currentUser.uid,
        productDocId: item.productDocId, // ✅ FIX
        productName: item.productName || item.name,
        stars,
        createdAt: Date.now()
      });

      setRated(stars);
      alert(`Thanks for ${stars} ⭐ rating`);

      await updateProductRating(item.productDocId); // ✅ FIX

    } catch (err) {
      console.error("Rating error:", err);
    }
  };



  return (
    <div className="rating-item">
      <div className="rating-left">
        <p className="rating-product-name">
          {item.productName || item.name}
        </p>
        <span className="rating-subtext">
          Your feedback helps other shoppers
        </span>
      </div>

      <div className="rating-right">
        {rated > 0 ? (
          <span className="rated-text">Rated {rated} ⭐</span>
        ) : (
          <RateStars value={rated} onRate={saveRating} />
        )}
      </div>
    </div>
  );
};

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="os-container">
      <div className="os-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="success"
          className="os-img"
        />

        <h2>Order Placed Successfully!</h2>

        <p className="os-msg">
          {state?.message || "Your order has been placed."}
        </p>

        {state?.items && (
          <div className="rating-section">
            <h3 className="rating-title">Rate your purchase</h3>

            {state.items.map((item, index) => (
              <RatingRow key={index} item={item} />
            ))}
          </div>
        )}

        <button className="os-btn" onClick={() => navigate("/orders")}>
          View My Orders
        </button>

        <button className="os-back" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
