import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "./DatePopup.css";

const DatePopup = ({
  checkIn,
  checkOut,
  onDateSelected,
  onToggle,
}) => {
  const [startDate, setStartDate] = useState(checkIn);
  const [endDate, setEndDate] = useState(checkOut);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggle]);

  const handleSelect = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateSelected({ startDate: start, endDate: end });
  };

  const renderHeader = ({
    monthDate,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
  }) => (
    <div className="custom-datepicker-header">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="custom-datepicker-navigation-button"
      >
        &lt;
      </button>
      <span className="custom-datepicker-month-year">
        {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
      </span>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="custom-datepicker-navigation-button"
      >
        &gt;
      </button>
    </div>
  );

  return (
    <div className="custom-datepicker-container" ref={modalRef}>
      <div className="custom-datepicker-close">
        <button onClick={onToggle} className="custom-datepicker-close-button">x</button>
      </div>
      <DatePicker
        selected={startDate}
        onChange={handleSelect}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        locale={ko}
        monthsShown={2}
        dateFormat="yyyy년 MM월 dd일"
        dayClassName={() => "text-center"}
        renderCustomHeader={renderHeader}
        className="react-datepicker"
        wrapperClassName="react-datepicker__month-wrapper"
      />
    </div>
  );
};

export default DatePopup;
