import React from "react";
import { useNavigate } from "react-router-dom";
import "./Image.css";

const Image = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ cursor: "pointer" }}>
      <img src={data.src} className="img" alt={`Image ${data.id}`} />
      <div className="text-content">
        <p className="place-text">{data.place}</p>
        <p className="desc-text">{data.desc}</p>
      </div>
    </div>
  );
};

export default Image;
