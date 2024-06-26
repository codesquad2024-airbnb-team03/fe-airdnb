import React, { useState, useRef } from "react";
import "./AccommodationForm.css";
import axios from "axios";
import API_BASE_URL from "../../config";

const AccommodationForm = ({ user }) => {
  const [form, setForm] = useState({
    name: "",
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
  });

  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [addressVerificationMessage, setAddressVerificationMessage] = useState("");
  const addressRef = useRef(null); // 주소 입력 요소에 대한 ref

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
      setIsAddressVerified(false); // 주소 변경 시 검증 상태 초기화
      setAddressVerificationMessage(""); // 메시지 초기화
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const verifyAddress = async () => {
    const fullAddress = `${form.address.firstAddress} ${form.address.secondAddress} ${form.address.thirdAddress}`;
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/kakaoMap`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { address: fullAddress },
      });
      if (response.status === 200) {
        setIsAddressVerified(true);
        setAddressVerificationMessage("주소 검증이 완료되었습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIsAddressVerified(false);
        setAddressVerificationMessage(
          "유효한 주소가 아닙니다. 다시 확인해주세요."
        );
      } else {
        setIsAddressVerified(false);
        setAddressVerificationMessage("주소 검증 중 오류가 발생했습니다.");
        console.error("Error verifying address:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAddressVerified) {
      alert("주소 검증을 먼저 완료해주세요.");
      addressRef.current.scrollIntoView({ behavior: "smooth" }); // 스크롤 이동
      return;
    }

    // Check if all required fields are filled
    if (
      form.name.trim() === "" ||
      form.price.trim() === "" ||
      form.maxHeadCount <= 0 ||
      form.bedroomCount <= 0 ||
      form.bedCount <= 0 ||
      form.bathroomCount <= 0
    ) {
      alert("모든 필수 항목을 채워주세요.");
      return;
    }

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

    const saveDto = {
      name: form.name,
      address: {
        firstAddress: form.address.firstAddress,
        secondAddress: form.address.secondAddress,
        thirdAddress: form.address.thirdAddress,
      },
      maxHeadCount: form.maxHeadCount,
      bedroomCount: form.bedroomCount,
      bedCount: form.bedCount,
      bathroomCount: form.bathroomCount,
      price: form.price,
      hostId: user.id,
      amenityIds,
    };

    const formData = new FormData();
    formData.append("file", form.photo);
    formData.append("saveDto", new Blob([JSON.stringify(saveDto)], { type: "application/json" }));

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        API_BASE_URL + "/accommodations",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("숙소가 등록되었습니다."); // 성공 알림창
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
          숙소 이름
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label ref={addressRef}>
          숙소 주소
          <select
            name="firstAddress"
            value={form.address.firstAddress}
            onChange={handleChange}
            required
          >
            <option value="">도/(특별)광역시 선택</option>
            <option value="서울특별시">서울특별시</option>
            <option value="경기도">경기도</option>
            <option value="부산광역시">부산광역시</option>
            <option value="대구광역시">대구광역시</option>
            <option value="인천광역시">인천광역시</option>
            <option value="광주광역시">광주광역시</option>
            <option value="대전광역시">대전광역시</option>
            <option value="울산광역시">울산광역시</option>
            <option value="강원도">강원도</option>
            <option value="충청북도">충청북도</option>
            <option value="충청남도">충청남도</option>
            <option value="전라남도">전라남도</option>
            <option value="전라북도">전라북도</option>
            <option value="경상북도">경상북도</option>
            <option value="경상남도">경상남도</option>
            <option value="제주도">제주도</option>
          </select>
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
          <div className="verification-container">
            <button
              type="button"
              className="verify-button"
              onClick={verifyAddress}
            >
              주소 검증
            </button>
            {addressVerificationMessage && (
              <span
                className={`verification-message ${
                  isAddressVerified ? "valid" : "invalid"
                }`}
              >
                {addressVerificationMessage}
              </span>
            )}
          </div>
        </label>
        <label>
          최대 게스트 수
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
          침실 개수
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
          침대 개수
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
          욕실 개수
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
          <legend>숙소 편의시설</legend>
          <div className="amenities">
            <label className="amenity-option">
              <input
                type="checkbox"
                name="wifi"
                checked={form.amenities.wifi}
                onChange={handleChange}
              />
              무선 인터넷
            </label>
            <label className="amenity-option">
              <input
                type="checkbox"
                name="tv"
                checked={form.amenities.tv}
                onChange={handleChange}
              />
              TV
            </label>
            <label className="amenity-option">
              <input
                type="checkbox"
                name="kitchen"
                checked={form.amenities.kitchen}
                onChange={handleChange}
              />
              주방
            </label>
            <label className="amenity-option">
              <input
                type="checkbox"
                name="washer"
                checked={form.amenities.washer}
                onChange={handleChange}
              />
              세탁기
            </label>
            <label className="amenity-option">
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
          숙소 대표 사진
          <input
            type="file"
            name="photos"
            onChange={handlePhotoUpload}
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
