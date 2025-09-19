"use client";

import React, { useState, useEffect, useRef } from 'react';
import './SectionsVisibleDropdown.scss';

const SectionsVisibleDropdown = ({ isOpen, onClose, selectedSections, onSectionsChange, position = { top: 0, left: 0 } }) => {
  const dropdownRef = useRef(null);
  
  const sections = [
    { id: 'expected-outcomes', label: 'Expected Outcomes' },
    { id: 'influencer-category-performance', label: 'Influencer Category Performance' },
    { id: 'expected-audience-impact', label: 'Expected Audience Impact' }
  ];
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  const handleSectionToggle = (sectionId) => {
    const newSelectedSections = selectedSections.includes(sectionId)
      ? selectedSections.filter(id => id !== sectionId)
      : [...selectedSections, sectionId];
    
    onSectionsChange(newSelectedSections);
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="sections-visible-dropdown" 
      ref={dropdownRef} 
      role="menu"
      style={{ 
        position: 'fixed',
        top: position.top, 
        left: position.left
      }}
    >
      {sections.map(section => (
        <div 
          key={section.id}
          className="dropdown-item"
          role="menuitem"
        >
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={selectedSections.includes(section.id)}
              onChange={() => handleSectionToggle(section.id)}
            />
            <span className="checkmark"></span>
            {section.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default SectionsVisibleDropdown;
