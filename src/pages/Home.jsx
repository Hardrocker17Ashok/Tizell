import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BannerSlider from "../components/BannerSlider";
import "./Home.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(list);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // ✅ scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home">

      {/* SPECIAL TEXT SECTION */}
      <div className="special-text">
        <h1>
          Welcome to <span>MyShop</span>
        </h1>
        <p>Premium Products • Best Prices • Fast Delivery</p>
      </div>

      {/* BANNER */}
      <BannerSlider />

      {/* CATEGORIES */}
      <div className="categories-container">
        <h2 className="category-title">Shop by Categories</h2>

        <div className="categories-grid">

          <div
            className="category-card"
            onClick={() => scrollToSection("chimney")}
          >
            <img src="pexels-heyho-8146317.jpg" alt="Kitchen" />
            <p>Kitchen Items</p>
          </div>

          <div
            className="category-card"
            onClick={() => scrollToSection("blanket")}
          >
            <img src="pexels-isabellequinn-1421176.jpg" alt="Blankets" />
            <p>Blankets</p>
          </div>

          <div
            className="category-card"
            onClick={() => scrollToSection("watch")}
          >
            <img src="pexels-mikebirdy-211758.jpg" alt="Wall Clock" />
            <p>Home Decor</p>
          </div>

          <div
            className="category-card"
            onClick={() => scrollToSection("mini-bank")}
          >
            <img src="pexels-clickerhappy-9660.jpg" alt="Mini Bank" />
            <p>Mini Bank</p>
          </div>

          <div
            className="category-card"
            onClick={() => scrollToSection("jap-counter")}
          >
            <img src="pexels-rdne-8710759.jpg" alt="JapCounter" />
            <p>JapCounter</p>
          </div>

        </div>
      </div>

      {/* CHIMNEY SECTION */}
      <h2 id="chimney" className="section-title">Chimney Products</h2>
      <div className="product-grid">
        {products
          .filter((item) => item.category === "chimney")
          .map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
      </div>

      {/* BLANKET SECTION */}
      <h2 id="blanket" className="section-title">Blankets</h2>
      <div className="product-grid">
        {products
          .filter((item) => item.category === "blanket")
          .map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
      </div>

      {/* WATCH SECTION */}
      <h2 id="watch" className="section-title">Watches</h2>
      <div className="product-grid">
        {products
          .filter((item) => item.category === "watch")
          .map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
      </div>

      {/* MINI BANK SECTION */}
      <h2 id="mini-bank" className="section-title">Mini Bank</h2>
      <div className="product-grid">
        {products
          .filter((item) => item.category === "mini-bank")
          .map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
      </div>

      {/* JAP COUNTER SECTION */}
      <h2 id="jap-counter" className="section-title">Jap Counter</h2>
      <div className="product-grid">
        {products
          .filter((item) => item.category === "jap-counter")
          .map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
      </div>

    </div>
  );
};

export default Home;
