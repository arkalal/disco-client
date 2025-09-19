"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaInstagram, FaFacebook, FaYoutube, FaTwitter } from 'react-icons/fa';
import { BsLightbulb } from 'react-icons/bs';
import './CreateListDrawer.scss';

const colorOptions = [
  { id: 'orange', value: '#FF6A3D' },
  { id: 'yellow', value: '#FFB84D' },
  { id: 'green', value: '#2BB24C' },
  { id: 'lightBlue', value: '#1E88E5' },
  { id: 'blue', value: '#1C6AE4' },
  { id: 'purple', value: '#5C6CFF' },
  { id: 'pink', value: '#C656A4' },
  { id: 'black', value: '#000000' }
];

const deliverableOptions = [
  'Instagram Post',
  'Instagram Story',
  'Instagram Reel',
  'YouTube Video',
  'YouTube Short',
  'Tweet',
  'Facebook Post'
];

const CreateListDrawer = ({ isOpen, onClose, onCreateList }) => {
  const [listName, setListName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [setDeliverables, setSetDeliverables] = useState(false);
  const [deliverableRows, setDeliverableRows] = useState([
    { id: 1, type: '', quantity: 1, cost: '' }
  ]);
  const [isModified, setIsModified] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  const drawerRef = useRef(null);
  const nameInputRef = useRef(null);
  
  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setListName('');
      setSelectedColor(null);
      setSelectedPlatform(null);
      setSetDeliverables(false);
      setDeliverableRows([{ id: 1, type: '', quantity: 1, cost: '' }]);
      setIsModified(false);
      setShowConfirmDiscard(false);
      
      // Focus the name input when drawer opens
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Track modifications
  useEffect(() => {
    if (isOpen && (listName || selectedColor || selectedPlatform || setDeliverables)) {
      setIsModified(true);
    }
  }, [isOpen, listName, selectedColor, selectedPlatform, setDeliverables]);

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
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

  const handleClose = () => {
    if (isModified && !showConfirmDiscard) {
      setShowConfirmDiscard(true);
    } else {
      onClose();
      setShowConfirmDiscard(false);
    }
  };

  const handleDiscard = () => {
    setShowConfirmDiscard(false);
    onClose();
  };

  const handleCancel = () => {
    setShowConfirmDiscard(false);
  };

  const handleCreateList = () => {
    const newList = {
      name: listName,
      color: selectedColor,
      platform: selectedPlatform,
      deliverables: setDeliverables ? deliverableRows : []
    };
    
    onCreateList(newList);
    onClose();
  };

  const handleDeliverableToggle = () => {
    setSetDeliverables(!setDeliverables);
  };

  const handleDeliverableTypeChange = (id, value) => {
    setDeliverableRows(rows => 
      rows.map(row => 
        row.id === id ? { ...row, type: value } : row
      )
    );
  };

  const handleDeliverableQtyChange = (id, value) => {
    setDeliverableRows(rows => 
      rows.map(row => 
        row.id === id ? { ...row, quantity: value } : row
      )
    );
  };

  const handleDeliverableCostChange = (id, value) => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    setDeliverableRows(rows => 
      rows.map(row => 
        row.id === id ? { ...row, cost: sanitizedValue } : row
      )
    );
  };

  const addDeliverableRow = () => {
    const newId = Math.max(0, ...deliverableRows.map(row => row.id)) + 1;
    setDeliverableRows([...deliverableRows, { id: newId, type: '', quantity: 1, cost: '' }]);
  };

  const removeDeliverableRow = (id) => {
    if (deliverableRows.length > 1) {
      setDeliverableRows(rows => rows.filter(row => row.id !== id));
    }
  };

  const canCreateList = listName.trim() !== '' && selectedPlatform !== null;

  if (!isOpen) return null;

  return (
    <div className="create-list-drawer-container">
      <div className="drawer-scrim" onClick={handleClose}></div>
      <div 
        ref={drawerRef}
        className="drawer-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-list-title"
      >
        <div className="drawer-header">
          <h2 id="create-list-title">Create New List</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="drawer-scrollable-content">
          {showConfirmDiscard ? (
            <div className="confirm-discard">
              <h3>Discard changes?</h3>
              <p>Any changes you've made will be lost.</p>
              <div className="confirm-actions">
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                <button className="discard-button" onClick={handleDiscard}>Discard</button>
              </div>
            </div>
          ) : (
            <>
              <div className="section-title">List Details</div>
              
              <div className="form-field">
                <label htmlFor="list-name">List Name</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="list-name"
                  className="list-name-input"
                  placeholder="Enter list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label>Choose Color</label>
                <div className="color-options">
                  {colorOptions.map(color => (
                    <button
                      key={color.id}
                      className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                      aria-label={`Select ${color.id} color`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="form-field">
                <label>Choose a Platform</label>
                <div className="platform-options">
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
                  <button 
                    className={`platform-button ${selectedPlatform === 'twitter' ? 'active' : ''}`}
                    onClick={() => setSelectedPlatform('twitter')}
                    aria-pressed={selectedPlatform === 'twitter'}
                  >
                    <FaTwitter size={16} /> Twitter
                  </button>
                  <button 
                    className={`platform-button ${selectedPlatform === 'facebook' ? 'active' : ''}`}
                    onClick={() => setSelectedPlatform('facebook')}
                    aria-pressed={selectedPlatform === 'facebook'}
                  >
                    <FaFacebook size={16} /> Facebook
                  </button>
                </div>
              </div>
              
              <div className="form-field toggle-field">
                <div className="toggle-wrapper">
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={setDeliverables} 
                      onChange={handleDeliverableToggle} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Set Deliverables</span>
                </div>
                
                {!setDeliverables ? (
                  <div className="info-card">
                    <div className="info-icon">
                      <BsLightbulb size={20} />
                    </div>
                    <div className="info-content">
                      <p>Setting deliverables for your plan allows you to reach out to influencers to obtain cost estimates and gain access to CPE and CPV metrics.</p>
                      <p>Deliverables, Posts & Costs will be applied to all the profiles in the list.</p>
                    </div>
                  </div>
                ) : (
                  <div className="deliverable-rows">
                    {deliverableRows.map(row => (
                      <div className="deliverable-row" key={row.id}>
                        <div className="deliverable-type">
                          <div className="custom-select">
                            <select 
                              value={row.type} 
                              onChange={(e) => handleDeliverableTypeChange(row.id, e.target.value)}
                              placeholder="Select Deliverable"
                            >
                              <option value="">Select Deliverable</option>
                              {deliverableOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="deliverable-qty">
                          <div className="custom-select">
                            <select 
                              value={row.quantity}
                              onChange={(e) => handleDeliverableQtyChange(row.id, Number(e.target.value))}
                            >
                              {[1, 2, 3, 4, 5].map(qty => (
                                <option key={qty} value={qty}>{qty} Qty</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="deliverable-cost">
                          <input 
                            type="text" 
                            placeholder="₹ Cost (Optional)" 
                            value={row.cost}
                            onChange={(e) => handleDeliverableCostChange(row.id, e.target.value)}
                          />
                        </div>
                        {deliverableRows.length > 1 && (
                          <button 
                            className="remove-row" 
                            onClick={() => removeDeliverableRow(row.id)}
                            aria-label="Remove deliverable row"
                          >
                            <IoClose size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button className="add-more-btn" onClick={addDeliverableRow}>
                      <span className="plus">+</span> Add More
                    </button>
                  </div>
                )}
                
                <div className="info-card-small">
                  <div className="info-icon">
                    <BsLightbulb size={16} />
                  </div>
                  <div className="info-content">
                    <p>Setting deliverables for your plan allows you to reach out to influencers to obtain cost estimates and gain access to CPE and CPV metrics.</p>
                    <p>Deliverables, Posts & Costs will be applied to all the profiles in the list.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="drawer-footer">
          <div className="footer-buttons">
            <button className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button 
              className={`create-button ${!canCreateList ? 'disabled' : ''}`}
              onClick={handleCreateList}
              disabled={!canCreateList}
            >
              Create List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListDrawer;
