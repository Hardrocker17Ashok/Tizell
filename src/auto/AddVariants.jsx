import { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AddDeliveryText = () => {

  useEffect(() => {
    const updateDelivery = async () => {
      const snap = await getDocs(collection(db, "products"));

      for (let d of snap.docs) {
        await updateDoc(doc(db, "products", d.id), {
          deliveryText: "🚚 Free Delivery"
        });
      }

      alert("🚚 Free Delivery text added to all products!");
    };

    updateDelivery();
  }, []);

  return (
    <h2 style={{ padding: 20 }}>
      Updating all products with Free Delivery...
    </h2>
  );
};

export default AddDeliveryText;
