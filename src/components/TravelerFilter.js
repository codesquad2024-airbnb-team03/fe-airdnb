import React from "react";
import "./TravelerFilter.css";

const TravelerFilter = ({ closeFilter, updateTravelerCount }) => {
  const [count, setCount] = React.useState({
    adults: 0,
    children: 0,
    infants: 0,
  });

  const handleCountChange = (type, delta) => {
    setCount((prevCount) => {
      const newCount = { ...prevCount, [type]: Math.max(0, prevCount[type] + delta) };
      updateTravelerCount(newCount);
      return newCount;
    });
  };

  return (
    <div className="traveler-filter-container">
      <div className="traveler-filter-row">
        <div>성인</div>
        <div className="traveler-filter-counter">
          <button onClick={() => handleCountChange('adults', -1)}>-</button>
          <span>{count.adults}</span>
          <button onClick={() => handleCountChange('adults', 1)}>+</button>
        </div>
      </div>
      <div className="traveler-filter-row">
        <div>어린이</div>
        <div className="traveler-filter-counter">
          <button onClick={() => handleCountChange('children', -1)}>-</button>
          <span>{count.children}</span>
          <button onClick={() => handleCountChange('children', 1)}>+</button>
        </div>
      </div>
      <div className="traveler-filter-row">
        <div>유아</div>
        <div className="traveler-filter-counter">
          <button onClick={() => handleCountChange('infants', -1)}>-</button>
          <span>{count.infants}</span>
          <button onClick={() => handleCountChange('infants', 1)}>+</button>
        </div>
      </div>
      <div className="traveler-filter-buttons">
        <button onClick={closeFilter}>취소</button>
        <button onClick={closeFilter}>적용</button>
      </div>
    </div>
  );
};

export default TravelerFilter;
