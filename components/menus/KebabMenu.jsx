"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FiEdit2, FiArchive } from 'react-icons/fi';
import './KebabMenu.scss';

const KebabMenu = ({ onEditDetails, onArchivePlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        containerRef.current && 
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      // Use a slight delay to ensure the event doesn't immediately trigger on the same click
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);
      }, 10);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleAction = (action) => {
    if (action === 'edit') {
      onEditDetails();
    } else if (action === 'archive') {
      onArchivePlan();
    }
    setIsOpen(false);
  };
  
  return (
    <div className="kebab-menu-container" ref={containerRef}>
      <button 
        ref={buttonRef}
        className="kebab-button" 
        onClick={toggleMenu}
        aria-label="More options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <BsThreeDots size={20} />
      </button>
      
      {isOpen && (
        <div 
          ref={menuRef}
          className="kebab-menu" 
          role="menu"
          aria-orientation="vertical"
        >
          <button 
            className="menu-item" 
            onClick={() => handleAction('edit')}
            role="menuitem"
          >
            <FiEdit2 size={15} />
            <span>Edit Details</span>
          </button>
          <button 
            className="menu-item" 
            onClick={() => handleAction('archive')}
            role="menuitem"
          >
            <FiArchive size={15} />
            <span>Archive Plan</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default KebabMenu;
