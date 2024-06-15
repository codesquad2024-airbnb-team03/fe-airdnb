import React from "react";
import { Range, getTrackBackground } from "react-range";
import "./PriceRangeFilter.css";

const PriceRangeFilter = ({ minPrice, maxPrice, updatePriceRange, closeFilter }) => {
  const [values, setValues] = React.useState([minPrice, maxPrice]);

  const handleChange = (values) => {
    setValues(values);
    updatePriceRange(values[0], values[1]);
  };

  const handleApply = () => {
    closeFilter();
  };

  return (
    <div className="price-range-container">
      <Range
        values={values}
        step={1000}
        min={0}
        max={1000000}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '100%',
              background: getTrackBackground({
                values,
                colors: ['#ccc', '#007bff', '#ccc'],
                min: 0,
                max: 1000000,
              }),
              borderRadius: '3px',
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #aaa',
            }}
          />
        )}
      />
      <div className="price-range-labels">
        <span>{values[0].toLocaleString()}원</span>
        <span>{values[1].toLocaleString()}원</span>
      </div>
      <div className="price-range-buttons">
        <button onClick={closeFilter}>취소</button>
        <button onClick={handleApply}>적용</button>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
