"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoShareOutline } from 'react-icons/io5';
import { FiLink, FiEdit } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import './SharePlanModal.scss';

const SharePlanModal = ({ isOpen, onClose, planName = "Unsaved Plan" }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('can view');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  const modalRef = useRef(null);
  const emailInputRef = useRef(null);
  const permissionButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Focus email input when modal opens
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent scrolling when modal is open
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

  // Click outside to close dropdown or modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close dropdown if clicking outside dropdown and permission button
      if (
        isDropdownOpen &&
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        permissionButtonRef.current &&
        !permissionButtonRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
      
      // Close modal if clicking on the background (scrim)
      if (
        modalRef.current &&
        e.target.classList.contains('modal-scrim')
      ) {
        onClose();
      }
    };
    
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, isDropdownOpen, onClose]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePermissionChange = (newPermission) => {
    setPermission(newPermission);
    setIsDropdownOpen(false);
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInvite = () => {
    if (validateEmail(email)) {
      console.log('Inviting:', email, 'with permission:', permission);
      setEmail('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && validateEmail(email)) {
      handleInvite();
    }
  };

  const copyLink = () => {
    const link = `https://app.trydisco.in/share/plan/${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => {
          setShowCopySuccess(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="share-plan-modal-container">
      <div className="modal-scrim"></div>
      <div className="modal-content" ref={modalRef} role="dialog" aria-labelledby="share-plan-title">
        <div className="modal-header">
          <div className="title">
            <IoShareOutline size={20} />
            <h2 id="share-plan-title">Share "{planName}"</h2>
          </div>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="invite-row">
            <div className="email-input-container">
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                onKeyPress={handleKeyPress}
                aria-label="Email address"
              />
              
              <div className="permission-control">
                <button 
                  ref={permissionButtonRef}
                  className="permission-button" 
                  onClick={toggleDropdown}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  {permission === 'can view' ? (
                    <AiOutlineEye size={14} />
                  ) : (
                    <FiEdit size={14} />
                  )}
                  <span>{permission}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="permission-dropdown" ref={dropdownRef} role="listbox">
                    <div 
                      className={`dropdown-item ${permission === 'can edit' ? 'selected' : ''}`}
                      onClick={() => handlePermissionChange('can edit')}
                      role="option"
                      aria-selected={permission === 'can edit'}
                    >
                      <FiEdit size={14} />
                      <span>can edit</span>
                    </div>
                    <div 
                      className={`dropdown-item ${permission === 'can view' ? 'selected' : ''}`}
                      onClick={() => handlePermissionChange('can view')}
                      role="option"
                      aria-selected={permission === 'can view'}
                    >
                      <AiOutlineEye size={14} />
                      <span>can view</span>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="invite-button" 
                onClick={handleInvite}
                disabled={!validateEmail(email)}
              >
                Invite
              </button>
            </div>
          </div>
          
          <div className="collaborators-list">
            <div className="collaborator">
              <div className="collaborator-info">
                <div className="avatar">A</div>
                <div className="email">arkalal@epigrowwglobal.com</div>
              </div>
              <div className="role">Owner</div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="link-info">Anyone with the link can view this file</div>
          <button 
            className={`copy-link-button ${showCopySuccess ? 'success' : ''}`}
            onClick={copyLink}
          >
            {showCopySuccess ? (
              <>Copy Success</>
            ) : (
              <>
                <FiLink size={16} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePlanModal;
