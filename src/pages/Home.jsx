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
        name: "Flexible Kitchen Chimney Duct Pipe with Cowl, 2 Meter Tape and Free Clamp & Screw",
        price: 15999,
        offerPrice: 11999,
        discountPercent: 25,
        category: "chimney",
        description: "High suction chimney with stainless steel body",
        image: "download.jpg",
      },
      {
        id: 2,
        name: "Flexible Kitchen Chimney Duct Pipe with Cowl and Tape",
        price: 21999,
        offerPrice: 16999,
        discountPercent: 23,
        category: "chimney",
        description: "Auto-clean technology with touch control",
        image: "710mpl5qpUL._SX569_.jpg",
      },
      {
        id: 3,
        name: "Kitchen Chimney Aluminium Duct Pipe with Jali Cover",
        price: 3999,
        offerPrice: 2499,
        discountPercent: 40,
        category: "chimney",
        description: "Aluminium pressure cooker with 5-litre capacity",
        image: "510r7FatyjL._AC_UL480_FMwebp_QL65_.webp",
      },
      {
        id: 4,
        name: "Flexible Kitchen Chimney Duct Pipe with Cowl, 2 Meter Tape and Free Clamp",
        price: 69999,
        offerPrice: 58999,
        discountPercent: 16,
        category: "chimney",
        description: "Flagship performance with stunning display",
        image: "71KKlFVTlGL._AC_UL480_FMwebp_QL65_.webp",
      },
      {
        id: 5,
        name: "Chimney Exhaust Flexible Aluminum Pipe",
        price: 62999,
        offerPrice: 54999,
        discountPercent: 13,
        category: "chimney",
        description: "8GB RAM, 512GB SSD, 11th gen Intel i5",
        image: "71UcTuUNhHL._AC_UL480_FMwebp_QL65_.webp",
      },
      {
        id: 6,
        name: "Air Cap/Ventilation Cowl for Kitchen Chimney Duct Pipe",
        price: 12999,
        offerPrice: 8999,
        discountPercent: 31,
        category: "chimney",
        description: "RO+UV water purifier with 7 stage purification",
        image: "51QPjsyV2vL._AC_UY327_FMwebp_QL65_.webp",
      },
      {
        id: 7,
        name: "ETI Aluminium FOIL Adhesive Tape 48mm X 20 Mtr Set of 01 | Silver",
        price: 12999,
        offerPrice: 8999,
        discountPercent: 31,
        category: "chimney",
        description: "RO+UV water purifier with 7 stage purification",
        image: "71ZLtAS3BsL._AC_UL480_FMwebp_QL65_.webp",
      },
      {
        id: 8,
        name: "Chimney Pipe Cowl Cover for Pipe.",
        price: 12999,
        offerPrice: 8999,
        discountPercent: 31,
        category: "chimney",
        description: "RO+UV water purifier with 7 stage purification",
        image: "41ji9KKXhTL._AC_UY327_FMwebp_QL65_.webp",
      },

      // NEW BLANKET PRODUCTS
      {
        id: 9,
        name: "Soft Double Bed Blanket",
        price: 1999,
        offerPrice: 1499,
        discountPercent: 25,
        category: "blanket",
        description: "Super soft winter blanket",
        image: "blanket1.jpg",
      },
      {
        id: 10,
        name: "Winter Warm Microfiber Blanket",
        price: 2499,
        offerPrice: 1799,
        discountPercent: 28,
        category: "blanket",
        description: "Premium quality blanket",
        image: "blanket2.jpg",
      },

       {
        id: 11,
        name: "Soft Double Bed Blanket",
        price: 1999,
        offerPrice: 1499,
        discountPercent: 25,
        category: "blanket",
        description: "Super soft winter blanket",
        image: "blanket1.jpg",
      },
      {
        id: 12,
        name: "Winter Warm Microfiber Blanket",
        price: 2499,
        offerPrice: 1799,
        discountPercent: 28,
        category: "blanket",
        description: "Premium quality blanket",
        image: "blanket2.jpg",
      },

      {
  id: 13,
  name: "Stylish Waterproof Men's Watch",
  price: 1499,
  offerPrice: 999,
  discountPercent: 33,
  category: "watch",
  description: "Premium stainless steel watch",
  image: "watch1.jpg",
},
{
  id: 14,
  name: "Smart LED Wrist Watch",
  price: 1999,
  offerPrice: 1299,
  discountPercent: 35,
  category: "watch",
  description: "Modern digital display",
  image: "watch2.jpg",
},


{
id: 15,
  name: "Stylish Waterproof Men's Watch",
  price: 1499,
  offerPrice: 999,
  discountPercent: 33,
  category: "watch",
  description: "Premium stainless steel watch",
  image: "watch1.jpg",
},
{
  id: 16,
  name: "Smart LED Wrist Watch",
  price: 1999,
  offerPrice: 1299,
  discountPercent: 35,
  category: "watch",
  description: "Modern digital display",
  image: "watch2.jpg",
},

{
  id: 17,
  name: "Mini Piggy Bank for Kids",
  price: 499,
  offerPrice: 299,
  discountPercent: 40,
  category: "mini-bank",
  description: "Cute cartoon design piggy bank",
  image: "minibank1.jpg",
},
{
  id: 18,
  name: "Electronic Coin Box Mini Bank",
  price: 799,
  offerPrice: 599,
  discountPercent: 25,
  category: "mini-bank",
  description: "Auto coin counting system",
  image: "minibank2.jpg",
},

{
  id: 19,
  name: "Digital LED Jap Counter",
  price: 299,
  offerPrice: 199,
  discountPercent: 34,
  category: "jap-counter",
  description: "Portable jap counting device",
  image: "japcounter1.jpg",
},
{
  id: 20,
  name: "Premium Finger Jap Counter",
  price: 349,
  offerPrice: 249,
  discountPercent: 28,
  category: "jap-counter",
  description: "Comfortable & lightweight",
  image: "japcounter2.jpg",
},
{
  id: 21,
  name: "Premium Finger Jap Counter",
  price: 349,
  offerPrice: 249,
  discountPercent: 28,
  category: "jap-counter",
  description: "Comfortable & lightweight",
  image: "japcounter2.jpg",
},
    ]);
  }, []);

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

      {/* CHIMNEY SECTION */}
      <h2 className="section-title">Chimney Products</h2>
      <div className="product-grid">
        {products
          .filter((item) => item.category === "chimney")
          .map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
      </div>

      {/* BLANKET SECTION */}
      <h2 className="section-title">Blankets</h2>
      <div className="product-grid">
        {products
          .filter((item) => item.category === "blanket")
          .map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
      </div>

      {/* WATCH SECTION */}
<h2 className="section-title">Watches</h2>
<div className="product-grid">
  {products
    .filter((item) => item.category === "watch")
    .map((item) => (
      <ProductCard key={item.id} product={item} />
    ))}
</div>

{/* MINI BANK SECTION */}
<h2 className="section-title">Mini Bank</h2>
<div className="product-grid">
  {products
    .filter((item) => item.category === "mini-bank")
    .map((item) => (
      <ProductCard key={item.id} product={item} />
    ))}
</div>

{/* JAP COUNTER SECTION */}
<h2 className="section-title">Jap Counter</h2>
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
