"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import "./CreatePlanModal.scss";

const CreatePlanModal = ({ isOpen, onClose, onCreate }) => {
  const [planName, setPlanName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [mode, setMode] = useState("search"); // 'search' or 'manual'
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-plan-overlay" onMouseDown={handleOverlayClick}>
      <div className="create-plan-modal" ref={modalRef} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Plan</h3>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <MdClose size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="cp-plan-name">Name of the Plan</label>
            <input
              id="cp-plan-name"
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter Plan Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cp-brand-name">Brand Name</label>
            <input
              id="cp-brand-name"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
            />
          </div>

          <div className="form-group">
            <label>I want to add influencers by</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="add-mode"
                  value="search"
                  checked={mode === "search"}
                  onChange={() => setMode("search")}
                />
                <span>Searching Influencers From Epigroww Global</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="add-mode"
                  value="manual"
                  checked={mode === "manual"}
                  onChange={() => setMode("manual")}
                />
                <span>Adding Influencers Manually</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className={`primary-btn ${!planName.trim() ? "disabled" : ""}`}
            onClick={() => {
              if (!planName.trim()) return;
              onCreate && onCreate({ planName: planName.trim(), brandName: brandName.trim(), mode });
            }}
            disabled={!planName.trim()}
          >
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;
