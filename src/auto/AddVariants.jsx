import { useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const commonSpecs = {
  brand: "Tizell",
  material: "Aluminium",
  color: "Silver",
  weight: "200 Gram",
  manufacturer: "Tizell Industries",
};

const commonAbout = `
Quality Material: Made from sturdy stainless steel for long-lasting performance & corrosion resistance.
Elegant Silver Finish: Adds a clean and modern look to your kitchen or outdoor wall setup.
Mesh Screen Design: Fine mesh screen keeps insects and debris out while allowing maximum airflow.
Easy Installation: Fits perfectly on 4-inch ducts for kitchen chimneys, exhaust fans, and bathroom vents.
Sleek Finish: Polished stainless steel adds a modern, clean look to any room or utility space.
`;

const AddSingleChimney = () => {

  useEffect(() => {

    const addProduct = async () => {
      try {
        await addDoc(collection(db, "products"), {
          name: "Stainless Steel Cowl Cover for Chimney/Exhaust/Vent Pipe | Anti-Pest Rain Guard Cap for Duct Outlet",
          category: "chimney",
          price: 999,
          offerPrice: 579,
          discountPercent: 42,

          // 👉 YOUR LOCAL IMAGE NAME
          image: "71alhjBZqzL._SX569_.jpg",
          image2: "71SrWceRhML._SL1500_.jpg",
          image3: "71AJMWsznML._SX569_.jpg",

          // VARIANTS
          variants: [
            { label: "4 Inch", price: 999, offerPrice: 579, discount: 42 },
            { label: "6 Inch", price: 1299, offerPrice: 699, discount: 46 },
          ],

          specs: commonSpecs,
          about: commonAbout,
          createdAt: Date.now(),
        });

        alert("✨ Chimney product added successfully!");
      } catch (error) {
        console.error(error);
        alert("❌ Failed to add product");
      }
    };

    addProduct();
  }, []);

  return <h2 style={{ padding: 20 }}>Adding chimney product...</h2>;
};

export default AddSingleChimney;
