// HostPage.js

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AccommodationForm from "./AccommodationForm";
import AccommodationList from "./AccommodationList";
import AccommodationEdit from "./AccommodationEdit";
import "./HostPage.css";

const HostPage = () => {
  const [currentTab, setCurrentTab] = useState("list");
  const [editingAccommodationId, setEditingAccommodationId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const handleTabChange = (tab) => {
    if (tab === "edit" && editingAccommodationId === null) {
      alert("수정할 숙소를 먼저 선택해주세요.");
      return;
    }
    setCurrentTab(tab);
    setEditingAccommodationId(null);
  };

  const handleEdit = (id) => {
    setEditingAccommodationId(id);
    setCurrentTab("edit");
  };

  const handleBack = () => {
    setCurrentTab("list");
    setEditingAccommodationId(null);
  };

  return (
    <div className="host-page">
      <nav className="tab-bar">
        <button className="home-button" onClick={() => navigate("/")}>
          홈화면
        </button>
        <div className="tabs">
          <button
            className={currentTab === "list" ? "active" : ""}
            onClick={() => handleTabChange("list")}
          >
            숙소 리스트
          </button>
          <button
            className={currentTab === "edit" ? "active" : ""}
            onClick={() => handleTabChange("edit")}
          >
            숙소 수정
          </button>
          <button
            className={currentTab === "form" ? "active" : ""}
            onClick={() => handleTabChange("form")}
          >
            숙소 등록
          </button>
        </div>
      </nav>
      <main>
        {currentTab === "list" && <AccommodationList onEdit={handleEdit} user={user} />}
        {currentTab === "edit" && editingAccommodationId ? (
          <AccommodationEdit
            accommodationId={editingAccommodationId}
            onBack={handleBack}
          />
        ) : (
          currentTab === "edit" && <div>수정할 숙소를 선택해주세요.</div>
        )}
        {currentTab === "form" && <AccommodationForm user={user} />}
      </main>
    </div>
  );
};

export default HostPage;
