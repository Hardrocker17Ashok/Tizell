import { FaStar } from "react-icons/fa";

const StarRating = ({ value = 0, size = 16 }) => {
  const rounded = Math.round(value);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={size}
          color={star <= rounded ? "#FFA41C" : "#ddd"}
        />
      ))}
    </div>
  );
};

export default StarRating;
