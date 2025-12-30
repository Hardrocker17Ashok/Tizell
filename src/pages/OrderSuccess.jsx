// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import RateStars from "../components/RateStars";
// import { auth, db } from "../firebase";
// import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
// import "./OrderSuccess.css";

// /* Per-product isolated rating row */
// const RatingRow = ({ item }) => {
//   const [rated, setRated] = useState(0);

//   const saveRating = async (stars) => {
//     if (!auth.currentUser) return;

//     try {
//       //  CHECK: already rated or not (DB LEVEL)
//       const q = query(
//         collection(db, "ratings"),
//         where("userId", "==", auth.currentUser.uid),
//         where("productDocId", "==", item.productDocId) 
//       );

//       const snap = await getDocs(q);

//       if (!snap.empty) {
//         alert("You have already rated this product");
//         setRated(snap.docs[0].data().stars); // UI sync
//         return;
//       }

//       const updateProductRating = async (productDocId) => {
//         const q = query(
//           collection(db, "ratings"),
//           where("productDocId", "==", productDocId) 
//         );

//         const snap = await getDocs(q);

//         let total = 0;
//         snap.forEach((doc) => {
//           total += doc.data().stars;
//         });

//         const avg = snap.size ? total / snap.size : 0;

//         await updateDoc(doc(db, "products", productDocId), { 
//           ratingAvg: Number(avg.toFixed(1)),
//           ratingCount: snap.size
//         });
//       };

//       //  SAVE NEW RATING
//       await addDoc(collection(db, "ratings"), {
//         userId: auth.currentUser.uid,
//         productDocId: item.productDocId, 
//         productName: item.productName || item.name,
//         stars,
//         createdAt: Date.now()
//       });

//       setRated(stars);
//       alert(`Thanks for ${stars} ⭐ rating`);

//       await updateProductRating(item.productDocId); 

//     } catch (err) {
//       console.error("Rating error:", err);
//     }
//   };



//   return (
//     <div className="rating-item">
//       <div className="rating-left">
//         <p className="rating-product-name">
//           {item.productName || item.name}
//         </p>
//         <span className="rating-subtext">
//           Your feedback helps other shoppers
//         </span>
//       </div>

//       <div className="rating-right">
//         {rated > 0 ? (
//           <span className="rated-text">Rated {rated} ⭐</span>
//         ) : (
//           <RateStars value={rated} onRate={saveRating} />
//         )}
//       </div>
//     </div>
//   );
// };

// const OrderSuccess = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   return (
//     <div className="os-container">
//       <div className="os-box">
//         <img
//           src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
//           alt="success"
//           className="os-img"
//         />

//         <h2>Order Placed Successfully!</h2>

//         <p className="os-msg">
//           {state?.message || "Your order has been placed."}
//         </p>

//         {state?.items && (
//           <div className="rating-section">
//             <h3 className="rating-title">Rate your purchase</h3>

//             {state.items.map((item, index) => (
//               <RatingRow key={index} item={item} />
//             ))}
//           </div>
//         )}

//         <button className="os-btn" onClick={() => navigate("/orders")}>
//           View My Orders
//         </button>

//         <button className="os-back" onClick={() => navigate("/")}>
//           Continue Shopping
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSuccess;


import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RateStars from "../components/RateStars";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import "./OrderSuccess.css";

const RatingRow = ({ item }) => {
  const [rated, setRated] = useState(0);

  const saveRating = async (stars) => {
  if (!auth.currentUser) return;

  try {
    const q = query(
      collection(db, "ratings"),
      where("userId", "==", auth.currentUser.uid),
      where("productDocId", "==", item.productDocId)
    );

    const snap = await getDocs(q);

    //  Already rated
    if (!snap.empty) {
      const existing = snap.docs[0].data().stars;
      setRated(existing);
      alert(`⭐ You already rated this product (${existing} stars)`);
      return;
    }

    //  Save rating
    await addDoc(collection(db, "ratings"), {
      userId: auth.currentUser.uid,
      productDocId: item.productDocId,
      productName: item.productName || item.name,
      stars,
      createdAt: Date.now()
    });

    // update average
    const all = await getDocs(
      query(collection(db, "ratings"), where("productDocId", "==", item.productDocId))
    );

    let total = 0;
    all.forEach(d => total += d.data().stars);

    await updateDoc(doc(db, "products", item.productDocId), {
      ratingAvg: Number((total / all.size).toFixed(1)),
      ratingCount: all.size
    });

    setRated(stars);
    alert(`✅ Thank you for rating ${stars} ⭐`);
  } catch (err) {
    console.error("Rating error:", err);
    alert("Something went wrong while saving rating");
  }
};


  return (
    <div className="rating-item">
      <div className="rating-left">
        <p className="rating-product-name">
          {item.productName || item.name}
        </p>
        <span className="rating-subtext">Your feedback helps others</span>
      </div>

      <div className="rating-right">
        {rated > 0 ? (
          <div className="rated-box">
            <span className="rated-text">
              ✅ You already rated this product ({rated} ⭐)
            </span>
          </div>
        ) : (
          <RateStars value={rated} onRate={saveRating} />
        )}

      </div>
    </div>
  );
};

const OrderSuccess = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const loadOrder = async () => {
      // COD case (state exists)
      if (state?.items?.length) {
        setItems(state.items);
        return;
      }

      // ONLINE case → fetch from Firestore
      if (orderId) {
        const snap = await getDoc(doc(db, "orders", orderId));
        if (snap.exists()) {
          setItems(snap.data().items || []);
        }
      }
    };

    loadOrder();
  }, [state, orderId]);

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
          Your order has been placed successfully.
        </p>

        {items.length > 0 && (
          <div className="rating-section">
            <h3 className="rating-title">Rate your purchase</h3>

            {items.map((item, index) => (
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

