import { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AddProductRatings = () => {

  useEffect(() => {
    const updateRatings = async () => {
      const snap = await getDocs(collection(db, "products"));

      for (let d of snap.docs) {
        await updateDoc(doc(db, "products", d.id), {
          ratingAvg: 0,
          ratingCount: 0
        });
      }

      alert("⭐ Rating fields added to all products!");
    };

    updateRatings();
  }, []);

  return (
    <h2 style={{ padding: 20 }}>
      Adding rating fields to all products...
    </h2>
  );
};

export default AddProductRatings;
