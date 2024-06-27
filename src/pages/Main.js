import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import Image from "../components/Image";

const Main = () => {
  const navigate = useNavigate();
  
  const dataArr = [
    {
      id: 1,
      src: require("../assets/region_image1.png"),
      place: "서울특별시",
      desc: "Seoul",
    },
    {
      id: 2,
      src: require("../assets/region_image2.png"),
      place: "경기도",
      desc: "Gyeonggi-do",
    },
    {
      id: 3,
      src: require("../assets/region_image3.png"),
      place: "인천",
      desc: "Incheon",
    },
    {
      id: 4,
      src: require("../assets/region_image4.png"),
      place: "대구",
      desc: "Daegu",
    },
    {
      id: 5,
      src: require("../assets/region_image5.png"),
      place: "대전",
      desc: "Daejeon",
    },
    {
      id: 6,
      src: require("../assets/region_image6.png"),
      place: "강원도",
      desc: "Gangwon-do",
    },
    {
      id: 7,
      src: require("../assets/region_image7.png"),
      place: "울산",
      desc: "Ulsan",
    },
    {
      id: 8,
      src: require("../assets/region_image8.png"),
      place: "부산",
      desc: "Busan",
    },
  ];

  const handleRegionClick = (region) => {
    navigate("/filteredRegionResults", { state: { region } });
  };

  return (
    <div className="main-container">
      <p className="title">가까운 여행지 둘러보기</p>
      <div className="main-content">
        {dataArr.map((data) => (
          <div key={data.id} onClick={() => handleRegionClick(data.place)}>
            <Image data={data} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
