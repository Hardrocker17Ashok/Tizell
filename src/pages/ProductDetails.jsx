import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // For now, a sample local data (later we will fetch from Firebase)
  const sample = [
    {
      id: 1,
      name: "iPhone 15",
      price: 79999,
      description: "Latest iPhone with A17 chip and stunning camera.",
      image:
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-finish-select-202309-6_5g?wid=512&hei=512&fmt=jpeg&qlt=90&.v=1692999428152",
    },
    {
      id: 2,
      name: "Samsung S23",
      price: 69999,
      description: "Premium Samsung flagship with Snapdragon processor.",
      image:
        "https://images.samsung.com/is/image/samsung/p6pim/in/sm-s911bzkdins/gallery/in-galaxy-s23-s911-412669-sm-s911bzkdins-thumb-534759329?$216_216_PNG$",
    },
  ];

  useEffect(() => {
    const found = sample.find((item) => item.id == id);
    setProduct(found);
  }, [id]);

  if (!product) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div className="product-details">
      <img src={product.image} className="details-img" />

      <div className="details-content">
        <h2>{product.name}</h2>
        <p>Price: ₹{product.price}</p>

        <p style={{ marginTop: 10 }}>{product.description}</p>

        <button
          className="add-btn"
          onClick={() => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Added to Cart!");
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
