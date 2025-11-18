import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./BannerSlider.css";

const BannerSlider = () => {
  const banners = [
    "pexels-pixabay-276554.jpg",
    "pexels-fotoaibe-1571460.jpg",
    "pexels-sebastians-731082.jpg",
    "pexels-tyra-xu-1105460-2098451.jpg",
    "pexels-pixabay-534174.jpg",
  ];

  return (
    <div className="banner-container">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 2500 }}
        pagination={{ clickable: true }}
        loop={true}
        className="banner-swiper"
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} className="banner-img" alt="Banner" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
