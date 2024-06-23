import React, { useState, useEffect, useRef } from "react";
import "./Filter.css";
import TravelerFilter from "./TravelerFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import DatePopup from "./DatePopup";

const Filter = ({ applyFilters }) => {
  const [showTravelerFilter, setShowTravelerFilter] = useState(false);
  const [showPriceRangeFilter, setShowPriceRangeFilter] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [travelerCount, setTravelerCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [minPrice, setMinPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [isScrolled, setIsScrolled] = useState(false);

  const travelerRef = useRef(null);
  const priceRangeRef = useRef(null);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const toggleTravelerFilter = () => {
    if (!isScrolled) setShowTravelerFilter(!showTravelerFilter);
  };

  const togglePriceRangeFilter = () => {
    if (!isScrolled) setShowPriceRangeFilter(!showPriceRangeFilter);
  };

  const toggleDatePopup = () => {
    if (!isScrolled) setShowDatePopup(!showDatePopup);
  };

  const updateTravelerCount = (count) => {
    setTravelerCount(count);
  };

  const updatePriceRange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleDateSelected = ({ startDate, endDate }) => {
    setCheckIn(startDate);
    setCheckOut(endDate);
    setShowDatePopup(false);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getModalStyle = (ref) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      return {
        top: `${rect.bottom - 80}px`,
        left: `${rect.left - 273}px`,
        width: `${rect.width - 35}px`,
      };
    }
    return {};
  };

  const handleFilterClick = (event) => {
    if (isScrolled) {
      event.stopPropagation();
      setIsScrolled(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
  };

  const handleApplyFilters = () => {
    const formattedCheckIn = formatDate(checkIn);
    const formattedCheckOut = formatDate(checkOut);
    applyFilters({
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      travelerCount,
      minPrice,
      maxPrice
    });
  };

  return (
    <div className={`filter-bar ${isScrolled ? 'scrolled' : ''}`} onClick={handleFilterClick}>
      <button className="filter-item" ref={checkInRef} onClick={toggleDatePopup}>
        <div className="filter-label">{isScrolled ? "어디든지" : "체크인"}</div>
        <div className="filter-value">{isScrolled ? "" : (checkIn ? checkIn.toLocaleDateString() : "날짜 입력")}</div>
      </button>
      <button className="filter-item" ref={checkOutRef} onClick={toggleDatePopup}>
        <div className="filter-label">{isScrolled ? "언제든 일주일" : "체크아웃"}</div>
        <div className="filter-value">{isScrolled ? "" : (checkOut ? checkOut.toLocaleDateString() : "날짜 입력")}</div>
      </button>
      <button className="filter-item" ref={priceRangeRef} onClick={togglePriceRangeFilter}>
        <div className="filter-label">{isScrolled ? "게스트 추가" : "요금"}</div>
        <div className="filter-value">
          {isScrolled ? "" : `₩${minPrice.toLocaleString()} - ₩${maxPrice.toLocaleString()}`}
        </div>
      </button>
      {!isScrolled && (
        <button className="filter-item" ref={travelerRef} onClick={toggleTravelerFilter}>
          <div className="filter-label">여행자</div>
          <div className="filter-value">
            게스트 {travelerCount.adults + travelerCount.children + travelerCount.infants}명
          </div>
        </button>
      )}
      <button className="filter-search-button" onClick={isScrolled ? (e) => e.preventDefault() : handleApplyFilters}>
        검색
      </button>
      {showTravelerFilter && (
        <div className="traveler-filter-modal" style={getModalStyle(travelerRef)}>
          <TravelerFilter closeFilter={toggleTravelerFilter} updateTravelerCount={updateTravelerCount} />
        </div>
      )}
      {showPriceRangeFilter && (
        <div className="price-range-filter-modal" style={getModalStyle(priceRangeRef)}>
          <PriceRangeFilter minPrice={minPrice} maxPrice={maxPrice} updatePriceRange={updatePriceRange} closeFilter={togglePriceRangeFilter} />
        </div>
      )}
      {showDatePopup && (
        <DatePopup checkIn={checkIn} checkOut={checkOut} onDateSelected={handleDateSelected} onToggle={toggleDatePopup} />
      )}
    </div>
  );
};

export default Filter;
