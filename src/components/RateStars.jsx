import { useState } from "react";
import { FaStar } from "react-icons/fa";

const RateStars = ({ value = 0, onRate, size = 26 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover ? star <= hover : star <= value;

        return (
          <FaStar
            key={star}
            size={size}
            style={{ cursor: "pointer" }}
            color={active ? "#FFA41C" : "#ddd"}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate(star)}
          />
        );
      })}
    </div>
  );
};

export default RateStars;
