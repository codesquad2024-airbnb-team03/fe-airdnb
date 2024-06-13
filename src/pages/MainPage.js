import React from "react";
import "./MainPage.css";
import Image from "../components/Image";

const MainPage = () => {
  const images = [
    { id: 1, src: require("../assets/image.png") },
    { id: 2, src: require("../assets/image.png") },
    { id: 3, src: require("../assets/image.png") },
    { id: 4, src: require("../assets/image.png") },
    { id: 5, src: require("../assets/image.png") },
    { id: 6, src: require("../assets/image.png") },
    { id: 7, src: require("../assets/image.png") },
    { id: 8, src: require("../assets/image.png") },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <p style={{ fontSize: 20, marginLeft: 50 }}>가까운 여행지 둘러보기</p>
      <div className="main_main_content">
        <div className="main_card_content">
          {images.map((image) => (
            <Image key={image.id} data={image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
