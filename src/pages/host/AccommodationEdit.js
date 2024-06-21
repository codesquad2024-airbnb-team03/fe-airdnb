import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const AccommodationEdit = ({ accommodationId, onBack }) => {
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

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `${API_BASE_URL}/accommodations/${accommodationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const accommodation = response.data;
        setForm({
          ...accommodation,
          amenities: {
            wifi: accommodation.amenities.includes(1),
            tv: accommodation.amenities.includes(2),
            kitchen: accommodation.amenities.includes(3),
            washer: accommodation.amenities.includes(4),
            parking: accommodation.amenities.includes(5),
          },
          photo: accommodation.photo, // 단일 파일로 설정
        });
      } catch (error) {
        console.error("Error fetching accommodation:", error);
      }
    };

    fetchAccommodation();
  }, [accommodationId]);

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
      id: accommodationId, // accommodationId 추가
      name: form.name,
      profileImg: form.photo, // 단일 파일 처리
      address: {
        firstAddress: form.address.firstAddress,
        secondAddress: form.address.secondAddress,
        thirdAddress: form.address.thirdAddress,
      },
      price: form.price,
      maxHeadCount: form.maxHeadCount,
      bedCount: form.bedCount,
      bedroomCount: form.bedroomCount,
      bathroomCount: form.bathroomCount,
      hostId: 1, // 고정된 호스트 ID
      amenityIds,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.put(
        `${API_BASE_URL}/accommodations`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Form updated successfully:", response.data);
      onBack();
    } catch (error) {
      console.error("Error updating form:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  return (
    <div className="accommodation-form-container">
      <h2>숙소 수정</h2>
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
        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default AccommodationEdit;
