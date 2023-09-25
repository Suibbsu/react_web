import { useState } from "react";
import "./main.css";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";

const Main = () => {
  const [swiper, setSwiper] = useState(null);
  const swiperParams = {
    navigation: false,
    onSwiper: setSwiper,
    autoplay: { delay: 3000, disableOnInteraction: false },
    loop: true,
  };
  SwiperCore.use([Autoplay]);
  return (
    <div className="main-slide">
      <Swiper {...swiperParams} ref={setSwiper}>
        <SwiperSlide>
          <img src="/Image/c1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/Image/c2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/Image/c3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/Image/c4.jpg" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Main;
