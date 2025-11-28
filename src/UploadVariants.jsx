import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function UploadVariants() {
  const addVariants = async () => {
    const variants = [
      { label: "1 Meter", price: 499, offerPrice: 299, discount: 40 },
      { label: "2 Meter", price: 899, offerPrice: 549, discount: 38 },
      { label: "3 Meter", price: 1199, offerPrice: 749, discount: 37 },
      { label: "4 Meter", price: 1499, offerPrice: 949, discount: 36 },
      { label: "5 Meter", price: 1799, offerPrice: 1149, discount: 36 },
      { label: "6 Meter", price: 1999, offerPrice: 1299, discount: 35 },
      { label: "7 Meter", price: 2199, offerPrice: 1399, discount: 36 }
    ];

    const snap = await getDocs(collection(db, "products"));

    snap.forEach(async (p) => {
      await updateDoc(doc(db, "products", p.id), {
        variants: variants
      });
    });

    alert("Variants added to all products!");
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={addVariants}>Add Variants to All Products</button>
    </div>
  );
}
