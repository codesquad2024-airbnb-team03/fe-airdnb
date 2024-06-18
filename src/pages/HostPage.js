import React, { useState } from "react";
import "./HostPage.css";
import axios from "axios";

const HostPage = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    guestCount: 1,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    amenities: {
      wifi: false,
      tv: false,
      kitchen: false,
      washer: false,
      parking: false,
    },
    photos: [],
    price: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({
        ...form,
        amenities: {
          ...form.amenities,
          [name]: checked,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm({
      ...form,
      photos: files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼이 제출될 때 브라우저가 페이지를 새로고침하는 기본 동작을 방지
    const formData = {
      // 폼에 입력된 데이터를 formData 객체에 저장
      ...form,
      photos: form.photos.map((photo) => photo.name), // 파일 이름만 전송
    };

     try {
       const response = await axios.post(
         "http://localhost:8080/accommodations",
         formData,
         {
           headers: {
             "Content-Type": "multipart/form-data",
           },
         }
       );
       console.log("Form submitted successfully:", response.data);
       // 필요한 경우, 폼 제출 후 추가 동작 수행
     } catch (error) {
       console.error("Error submitting form:", error);
     }
  };

  return (
    <div className="accommodation-form-container">
      <h2>숙소 등록</h2>
      <form onSubmit={handleSubmit}>
        <label>
          숙소 이름:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          숙소 주소:
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          게스트 수:
          <input
            type="number"
            name="guestCount"
            value={form.guestCount}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <label>
          침실 개수:
          <input
            type="number"
            name="bedroomCount"
            value={form.bedroomCount}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <label>
          침대 개수:
          <input
            type="number"
            name="bedCount"
            value={form.bedCount}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <label>
          욕실 개수:
          <input
            type="number"
            name="bathroomCount"
            value={form.bathroomCount}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <fieldset>
          <legend>숙소 편의시설:</legend>
          <div className="amenities">
            <label>
              <input
                type="checkbox"
                name="wifi"
                checked={form.amenities.wifi}
                onChange={handleChange}
              />
              무선 인터넷
            </label>
            <label>
              <input
                type="checkbox"
                name="tv"
                checked={form.amenities.tv}
                onChange={handleChange}
              />
              TV
            </label>
            <label>
              <input
                type="checkbox"
                name="kitchen"
                checked={form.amenities.kitchen}
                onChange={handleChange}
              />
              주방
            </label>
            <label>
              <input
                type="checkbox"
                name="washer"
                checked={form.amenities.washer}
                onChange={handleChange}
              />
              세탁기
            </label>
            <label>
              <input
                type="checkbox"
                name="parking"
                checked={form.amenities.parking}
                onChange={handleChange}
              />
              건물 내 무료 주차
            </label>
          </div>
        </fieldset>
        <label>
          숙소 사진:
          <input
            type="file"
            name="photos"
            onChange={handlePhotoUpload}
            multiple
            accept="image/*"
          />
        </label>
        <label>
          숙소 요금 (1박 기준):
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default HostPage;
