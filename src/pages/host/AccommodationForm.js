import React, { useState } from "react";
import "./AccommodationForm.css";
import axios from "axios";
import API_BASE_URL from "../../config";

const AccommodationForm = () => {
  const [form, setForm] = useState({
    name: "",
    profileImg: "",
    address: {
      firstAddress: "",
      secondAddress: "",
      thirdAddress: "",
    },
    maxHeadCount: 1,
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
    photo: null, // 단일 파일로 변경
    price: "",
    longitude: 0,
    latitude: 0,
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setForm({
      ...form,
      photo: file,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prevForm) => ({
        ...prevForm,
        amenities: {
          ...prevForm.amenities,
          [name]: checked,
        },
      }));
    } else if (form.address.hasOwnProperty(name)) {
      setForm((prevForm) => ({
        ...prevForm,
        address: {
          ...prevForm.address,
          [name]: value,
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert amenities to amenityIds
    const amenityIds = Object.keys(form.amenities)
      .filter((key) => form.amenities[key])
      .map((key) => {
        switch (key) {
          case "wifi":
            return 1;
          case "tv":
            return 2;
          case "kitchen":
            return 3;
          case "washer":
            return 4;
          case "parking":
            return 5;
          default:
            return null;
        }
      })
      .filter((id) => id !== null);

    const formData = {
      ...form,
      hostId: 1, // 고정된 호스트 ID
      amenityIds,
      photos: form.photo,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        API_BASE_URL + "/accommodations",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Form submitted successfully:", response.data);
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
            name="firstAddress"
            value={form.address.firstAddress}
            onChange={handleChange}
            placeholder="도/(특별)광역시"
            required
          />
          <input
            type="text"
            name="secondAddress"
            value={form.address.secondAddress}
            onChange={handleChange}
            placeholder="시/군/구"
            required
          />
          <input
            type="text"
            name="thirdAddress"
            value={form.address.thirdAddress}
            onChange={handleChange}
            placeholder="도로명 주소"
            required
          />
        </label>
        <label>
          최대 게스트 수:
          <input
            type="number"
            name="maxHeadCount"
            value={form.maxHeadCount}
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

export default AccommodationForm;
