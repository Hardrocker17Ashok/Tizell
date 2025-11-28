import { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

// ⭐ COMMON SPECS (all products)
const commonSpecs = {
  brand: "Ardnib",
  material: "Aluminium",
  color: "Silver",
  dimensions: "70L x 15W Centimeters",
  weight: "1 Kilograms",
  outerDiameter: "4 Inches",
  length: "90 Centimetres",
  manufacturer: "Bindra Industries",
};

// ⭐ COMMON DESCRIPTION
const commonAbout = `
Built to Last: Crafted from premium aluminum, this chimney ensures durability, perfect for busy kitchens.
Fits Any Setup: Flexible design extends up to 10 feet, perfect for most kitchens.
Everything You Need: Includes cowl, clamp, and aluminum tape.
Safe Delivery: Packaged securely to prevent damage.
Optimal Size: 4-inch diameter for efficient ventilation.
Easy Setup: Simple installation with included accessories.
Consistent Performance: Keeps kitchen air clean & fresh.
IMPORTANT: Confirm chimney outlet size and length before ordering.
`;

const AddVarients = () => {

  useEffect(() => {
    const updateAllProducts = async () => {
      const snap = await getDocs(collection(db, "products"));

      for (const d of snap.docs) {
        await updateDoc(doc(db, "products", d.id), {
          specs: commonSpecs,
          about: commonAbout,
        });

        console.log("UPDATED:", d.id);
      }

      alert("🔥 All product details added successfully!");
    };

    updateAllProducts();
  }, []);

  return <h2 style={{ padding: 20 }}>Updating all products…</h2>;
};

export default AddVarients;
