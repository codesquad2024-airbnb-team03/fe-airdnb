import React, { useState, useRef } from "react";
import "./Filter.css";
import TravelerFilter from "./TravelerFilter";
import PriceRangeFilter from "./PriceRangeFilter";

const Filter = ({ applyFilters }) => {
  const [showTravelerFilter, setShowTravelerFilter] = useState(false);
  const [showPriceRangeFilter, setShowPriceRangeFilter] = useState(false);
  const [travelerCount, setTravelerCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const travelerRef = useRef(null);
  const priceRangeRef = useRef(null);

  const toggleTravelerFilter = () => {
    setShowTravelerFilter(!showTravelerFilter);
  };

  const togglePriceRangeFilter = () => {
    setShowPriceRangeFilter(!showPriceRangeFilter);
  };

  const updateTravelerCount = (count) => {
    setTravelerCount(count);
  };

  const updatePriceRange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const getModalStyle = (ref) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      return {
        top: `${rect.bottom + window.scrollY - 100}px`,
        left: `${rect.left + window.scrollX - 50}px`,
        width: `${rect.width}px`,
      };
    }
    return {};
  };

  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label className="filter-label">체크인</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="date-picker"
        />
      </div>
      <div className="filter-item">
        <label className="filter-label">체크아웃</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="date-picker"
        />
      </div>
      <div className="filter-item" ref={priceRangeRef} onClick={togglePriceRangeFilter}>
        <label className="filter-label">가격 범위</label>
        <span className="filter-span">
          {minPrice.toLocaleString()}원 - {maxPrice.toLocaleString()}원
        </span>
      </div>
      <div className="filter-item" ref={travelerRef} onClick={toggleTravelerFilter}>
        <label className="filter-label">여행자</label>
        <span className="filter-span">
          게스트 {travelerCount.adults + travelerCount.children + travelerCount.infants}명
        </span>
      </div>
      <button className="filter-search-button" onClick={() => applyFilters({ checkIn, checkOut, travelerCount, minPrice, maxPrice })}>검색</button>
      {showTravelerFilter && (
        <div className="traveler-filter-modal" style={getModalStyle(travelerRef)}>
          <TravelerFilter 
            closeFilter={toggleTravelerFilter} 
            updateTravelerCount={updateTravelerCount} 
          />
        </div>
      )}
      {showPriceRangeFilter && (
        <div className="price-range-filter-modal" style={getModalStyle(priceRangeRef)}>
          <PriceRangeFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            updatePriceRange={updatePriceRange}
            closeFilter={togglePriceRangeFilter}
          />
        </div>
      )}
    </div>
  );
};

export default Filter;
