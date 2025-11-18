import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BannerSlider from "../components/BannerSlider";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);

  // Dummy data (later connect Firebase)
  useEffect(() => {
    setProducts([
      {
    id: 1,
    name: "Kitchen Chimney Pro 60cm",
    price: 15999,
    offerPrice: 11999,
    discountPercent: 25,
    category: "chimney",
    description: "High suction chimney with stainless steel body",
    image: "https://i.imgur.com/V0t2Rpl.jpeg",
  },
  {
    id: 2,
    name: "Auto Clean Chimney 90cm",
    price: 21999,
    offerPrice: 16999,
    discountPercent: 23,
    category: "chimney",
    description: "Auto-clean technology with touch control",
    image: "https://i.imgur.com/8Jj3j5Z.jpeg",
  },

  {
    id: 3,
    name: "Non-Stick Pressure Cooker",
    price: 3999,
    offerPrice: 2499,
    discountPercent: 40,
    category: "kitchen",
    description: "Aluminium pressure cooker with 5-litre capacity",
    image: "https://i.imgur.com/iLwXZwg.jpeg",
  },

  {
    id: 4,
    name: "Samsung S23",
    price: 69999,
    offerPrice: 58999,
    discountPercent: 16,
    category: "mobiles",
    description: "Flagship performance with stunning display",
    image:
      "https://images.samsung.com/is/image/samsung/p6pim/in/sm-s911bzkdins/gallery/in-galaxy-s23-s911-412669-sm-s911bzkdins-thumb-534759329?$216_216_PNG$",
  },

  {
    id: 5,
    name: "Dell i5 Laptop",
    price: 62999,
    offerPrice: 54999,
    discountPercent: 13,
    category: "laptops",
    description: "8GB RAM, 512GB SSD, 11th gen Intel i5",
    image: "https://i.imgur.com/xo3T4YJ.jpeg",
  },

  {
    id: 6,
    name: "Water Purifier RO+UV",
    price: 12999,
    offerPrice: 8999,
    discountPercent: 31,
    category: "appliances",
    description: "RO+UV water purifier with 7 stage purification",
    image: "https://i.imgur.com/1wGpoZC.jpeg",
  },
    ]);
  }, []);

  return (
    <div className="home">

      {/* WEBSITE LOGO */}
      {/* <div className="top-logo">
        <h1>MyShop</h1>
      </div> */}

      {/* SPECIAL TEXT SECTION */}
      <div className="special-text">
        <h1>
          Welcome to <span>MyShop</span>
        </h1>
        <p>Premium Products • Best Prices • Fast Delivery</p>
      </div>

      {/* BANNER SLIDER */}
      <BannerSlider />

      {/* CATEGORIES SECTION */}
<div className="categories-container">
  <h2 className="category-title">Shop by Categories</h2>

  <div className="categories-grid">
    <div className="category-card">
      <img src="pexels-heyho-8146317.jpg" alt="Kitchen" />
      <p>Kitchen Items</p>
    </div>

    <div className="category-card">
      <img src="pexels-isabellequinn-1421176.jpg" alt="Blankets" />
      <p>Blankets</p>
    </div>

    <div className="category-card">
      <img src="pexels-mikebirdy-211758.jpg" alt="Wall Clock" />
      <p>Wall Clock</p>
    </div>

    <div className="category-card">
      <img src="pexels-clickerhappy-9660.jpg" alt="Mini Bank" />
      <p>Mini Bank</p>
    </div>

    <div className="category-card">
      <img src="pexels-rdne-8710759.jpg" alt="JapCounter" />
      <p>JapCounter</p>
    </div>
  </div>
</div>


      <h2 className="section-title">Top Products</h2>

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

    </div>
  );
};

export default Home;
