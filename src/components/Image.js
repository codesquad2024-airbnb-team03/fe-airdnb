import React from "react";
import { useNavigate } from "react-router-dom";
import "./Image.css";

const Image = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/image/${data.id}`);
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img src={data.src} className="img" alt={`Image ${data.id}`} />
    </div>
  );
};

export default Image;
