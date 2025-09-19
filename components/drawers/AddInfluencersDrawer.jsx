"use client";

import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaInstagram } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';
import './AddInfluencersDrawer.scss';

const AddInfluencersDrawer = ({ isOpen, onClose, onSubmit }) => {
  const [selectedList, setSelectedList] = useState('List 2');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [influencers, setInfluencers] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const drawerRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      // Set initial focus
      setTimeout(() => {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
          focusableElements[0].focus();
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

  const handleSubmit = () => {
    if (!canSubmit()) return;
    
    const influencerList = influencers
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item);
      
    onSubmit({
      list: selectedList,
      platform: selectedPlatform,
      influencers: influencerList
    });
    
    onClose();
  };

  const canSubmit = () => {
    return influencers.trim().length > 0;
  };

  if (!isOpen) return null;

  return (
    <div className="add-influencers-drawer-container">
      <div className="drawer-scrim" onClick={onClose}></div>
      <div 
        ref={drawerRef}
        className="drawer-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-influencers-title"
      >
        <div className="drawer-header">
          <h2 id="add-influencers-title">Add Influencers</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="form-field">
            <label htmlFor="list-select">Choose a list</label>
            <div className="custom-select" ref={dropdownRef}>
              <button 
                className="select-button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                {selectedList} <IoChevronDown />
              </button>
              {isDropdownOpen && (
                <div className="select-dropdown">
                  <div 
                    className="select-option" 
                    onClick={() => {
                      setSelectedList('List 1');
                      setIsDropdownOpen(false);
                    }}
                  >
                    List 1
                  </div>
                  <div 
                    className="select-option" 
                    onClick={() => {
                      setSelectedList('List 2');
                      setIsDropdownOpen(false);
                    }}
                  >
                    List 2
                  </div>
                  <div 
                    className="select-option create-option" 
                    onClick={() => {
                      setSelectedList('New List');
                      setIsDropdownOpen(false);
                    }}
                  >
                    + Create new list
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-field">
            <label>Choose a platform</label>
            <div className="platform-selector">
              <button 
                className={`platform-button ${selectedPlatform === 'instagram' ? 'active' : ''}`}
                onClick={() => setSelectedPlatform('instagram')}
                aria-pressed={selectedPlatform === 'instagram'}
              >
                <FaInstagram size={16} /> Instagram
              </button>
              <button 
                className={`platform-button ${selectedPlatform === 'youtube' ? 'active' : ''}`}
                onClick={() => setSelectedPlatform('youtube')}
                aria-pressed={selectedPlatform === 'youtube'}
              >
                <FaYoutube size={16} /> YouTube
              </button>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="influencers-input">Add Influencers</label>
            <textarea
              ref={textareaRef}
              id="influencers-input"
              className="influencers-textarea"
              value={influencers}
              onChange={(e) => setInfluencers(e.target.value)}
              placeholder={`Enter Instagram profiles in any of these formats (separate with commas).\nFull link: https://www.instagram.com/johndoe\nHandle: johndoe  or  @johndoe`}
              rows={8}
            />
          </div>
        </div>

        <div className="drawer-footer">
          <div className="footer-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              className={`submit-button ${canSubmit() ? '' : 'disabled'}`}
              onClick={handleSubmit}
              disabled={!canSubmit()}
            >
              Add Influencers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInfluencersDrawer;
