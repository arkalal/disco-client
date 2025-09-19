"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiUpload, FiInfo, FiCheck } from 'react-icons/fi';
import './MessageAllDrawer.scss';

const MessageAllDrawer = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: null,
    designation: '',
    linkedinProfile: '',
    phoneNumber: '',
    whatsappNumber: '',
    sameAsPhone: false
  });

  const drawerRef = useRef(null);
  const nameInputRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: checked,
        // If "same as phone" is checked, copy phone number to WhatsApp
        ...(name === 'sameAsPhone' && checked ? { whatsappNumber: formData.phoneNumber } : {})
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        // If phone number changes and "same as phone" is checked, update WhatsApp too
        ...(name === 'phoneNumber' && formData.sameAsPhone ? { whatsappNumber: value } : {})
      }));
    }
  };

  const handleFileUpload = (e) => {
    // This would normally process the file, but for this demo we'll just store the file object
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleSubmit = () => {
    // Here you would typically submit the form data
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="message-all-drawer-container">
      <div className="drawer-scrim" onClick={onClose}></div>
      <div 
        ref={drawerRef}
        className="drawer-content"
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-header">
          <div className="header-content">
            <h2>Let's set up your messenger profile</h2>
            <p>Influencers will be able to see your messenger profile in their app</p>
          </div>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="drawer-scrollable-content">
          <div className="info-card">
            <h3>Why do you need to set up your messenger profile?</h3>
            <ul>
              <li>
                <span className="info-icon"><FiInfo /></span>
                <span>Influencer knows who is sending the message</span>
              </li>
              <li>
                <span className="info-icon"><FiInfo /></span>
                <span>Increases the trust among creators</span>
              </li>
              <li>
                <span className="info-icon"><FiInfo /></span>
                <span>Improves Response rate of your messages</span>
              </li>
            </ul>
          </div>

          <div className="form-section">
            <h3>Personal Details</h3>
            
            <div className="form-field">
              <label htmlFor="name">Your name<span className="required">*</span></label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-field">
              <label>Your profile picture</label>
              <div 
                className="upload-dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('profile-picture-upload').click()}
              >
                <input
                  type="file"
                  id="profile-picture-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <div className="upload-icon">
                  <FiUpload size={24} />
                </div>
                <p>Click to <span className="browse-text">Browse</span> files or Drag & Drop to upload</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="designation">Your current designation<span className="required">*</span></label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Enter your current title at work"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="linkedinProfile">LinkedIn profile<span className="required">*</span></label>
              <input
                type="url"
                id="linkedinProfile"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleInputChange}
                placeholder="Enter your linkedin profile link"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Details</h3>
            
            <div className="form-field">
              <label htmlFor="phoneNumber">Phone number<span className="required">*</span></label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Eg: +91 9999999999"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="whatsappNumber">WhatsApp number<span className="required">*</span></label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                placeholder="Eg: +91 9999999999"
                required
                disabled={formData.sameAsPhone}
              />
            </div>

            <div className="checkbox-field">
              <input
                type="checkbox"
                id="sameAsPhone"
                name="sameAsPhone"
                checked={formData.sameAsPhone}
                onChange={handleInputChange}
              />
              <label htmlFor="sameAsPhone">Same as phone number</label>
            </div>
          </div>
        </div>
        
        <div className="drawer-footer">
          <button 
            className="next-button" 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.designation || !formData.linkedinProfile || !formData.phoneNumber || !formData.whatsappNumber}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageAllDrawer;
