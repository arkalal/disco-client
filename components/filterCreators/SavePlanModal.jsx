import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import './SavePlanModal.scss';

const SavePlanModal = ({ isOpen, onClose, onSave }) => {
  const [planName, setPlanName] = useState('');
  const [brandName, setBrandName] = useState('');
  
  const handleSave = () => {
    if (!planName.trim()) return;
    
    onSave({
      planName: planName.trim(),
      brandName: brandName.trim()
    });
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="save-plan-modal-overlay" onClick={onClose}>
      <div className="save-plan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="save-plan-header">
          <h2>Save Plan</h2>
          <button className="close-button" onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        
        <div className="save-plan-content">
          <div className="form-field">
            <label htmlFor="plan-name">Name of the Plan</label>
            <input 
              type="text" 
              id="plan-name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter Plan Name"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="brand-name">Brand Name</label>
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" size={16} />
              <input 
                type="text" 
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
              />
            </div>
          </div>
        </div>
        
        <div className="save-plan-footer">
          <button 
            className={`save-button ${!planName.trim() ? 'disabled' : ''}`}
            onClick={handleSave}
            disabled={!planName.trim()}
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePlanModal;
