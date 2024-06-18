import React from "react";
import "./Main.css";
import Image from "../components/Image";

const Main = () => {
  const dataArr = [
    {
      id: 1,
      src: require("../assets/image.png"),
      place: "서울",
      desc: "차로 30분 거리",
    },
    {
      id: 2,
      src: require("../assets/image.png"),
      place: "의정부시",
      desc: "차로 30분 거리",
    },
    {
      id: 3,
      src: require("../assets/image.png"),
      place: "대구",
      desc: "차로 3.5시간 거리",
    },
    {
      id: 4,
      src: require("../assets/image.png"),
      place: "대전",
      desc: "차로 2시간 거리",
    },
    {
      id: 5,
      src: require("../assets/image.png"),
      place: "광주",
      desc: "차로 4시간 거리",
    },
    {
      id: 6,
      src: require("../assets/image.png"),
      place: "수원시",
      desc: "차로 45분 거리",
    },
    {
      id: 7,
      src: require("../assets/image.png"),
      place: "울산",
      desc: "차로 4.5시간 거리",
    },
    {
      id: 8,
      src: require("../assets/image.png"),
      place: "부천시",
      desc: "차로 45분 거리",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: 100,
        marginBottom: 100,
      }}
    >
      <p
        style={{
          fontSize: 20,
          fontWeight: 500,
          marginLeft: 55,
        }}
      >
        가까운 여행지 둘러보기
      </p>
      <div className="main_content">
        <div className="card_content">
          {dataArr.map((data) => (
            <Image key={data.id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
