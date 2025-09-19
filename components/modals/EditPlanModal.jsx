"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import './EditPlanModal.scss';

const EditPlanModal = ({ isOpen, onClose, planName = "Unsaved Plan", onSubmit }) => {
  const [formData, setFormData] = useState({
    planName: planName,
    brandName: ''
  });
  const [errors, setErrors] = useState({});
  
  const modalRef = useRef(null);
  const planNameInputRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (planNameInputRef.current) {
          planNameInputRef.current.focus();
        }
      }, 100);
      
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    const handleClickOutside = (e) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(e.target) &&
        e.target.classList.contains('modal-scrim')
      ) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="edit-plan-modal-container">
      <div className="modal-scrim"></div>
      <div 
        className="modal-content" 
        ref={modalRef} 
        role="dialog" 
        aria-labelledby="edit-plan-title"
      >
        <div className="modal-header">
          <h2 id="edit-plan-title">Edit Plan Details</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="planName">Plan Name</label>
            <input
              ref={planNameInputRef}
              type="text"
              id="planName"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              aria-describedby={errors.planName ? "planName-error" : undefined}
              aria-invalid={!!errors.planName}
            />
            {errors.planName && (
              <div className="error-message" id="planName-error">
                {errors.planName}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="brandName">Brand Name</label>
            <div className="search-input-container">
              <FiSearch size={16} className="search-icon" />
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!formData.planName.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlanModal;
