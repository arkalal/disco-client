"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi';
import './CBFIndexCard.scss';

const CBFIndexCard = ({ influencer, onChangeIndex, position = { top: 0, left: 0 }, isVisible, onClose }) => {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const hoverTimerRef = useRef(null);
  
  // Calculate impacts (these would come from real data in production)
  const impacts = influencer?.name === "Katrina Kaif" ? [
    { 
      positive: true, 
      title: "Strong Engagement rate", 
      subline: "2.24% engagement rate",
      impact: 15
    },
    { 
      positive: false, 
      title: "Decline Follower growth rate", 
      subline: "-0.01% followers growth rate",
      impact: -10
    }
  ] : [
    { 
      positive: true, 
      title: "Strong Engagement rate", 
      subline: "4.44% engagement rate",
      impact: 15
    }
  ];
  
  // More direct approach to handle hover/mouseout
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement || !isVisible) return;
    
    // Keep track of if we're hovering over the pill or card
    let isOverElement = false;
    
    const handleMouseEnter = () => {
      isOverElement = true;
      clearTimeout(hoverTimerRef.current);
      setIsClosing(false);
    };
    
    const handleMouseLeave = () => {
      isOverElement = false;
      
      // Short delay to see if we moved to the pill or card
      hoverTimerRef.current = setTimeout(() => {
        // Check if we're hovering either element
        if (!document.querySelector('.cbf-index-card:hover, .cbf-pill:hover')) {
          setIsClosing(true);
          setTimeout(() => {
            // Double check before closing
            if (!document.querySelector('.cbf-index-card:hover, .cbf-pill:hover')) {
              onClose();
            } else {
              setIsClosing(false);
            }
          }, 120);
        }
      }, 50);
    };
    
    // Handle document-level mouseout to catch when cursor leaves the window
    const handleDocumentMouseOut = (e) => {
      // If mouse leaves the document to an external element (like browser chrome)
      if (!e.relatedTarget && !e.toElement) {
        setIsClosing(true);
        setTimeout(() => onClose(), 120);
      }
    };
    
    // Add listeners
    cardElement.addEventListener('mouseenter', handleMouseEnter);
    cardElement.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', handleDocumentMouseOut);
    
    // Also add a global click handler to close if clicked elsewhere
    const handleGlobalClick = (e) => {
      const clickedElement = e.target;
      const clickedOnCard = cardElement.contains(clickedElement);
      const clickedOnPill = clickedElement.classList.contains('cbf-pill');
      
      if (!clickedOnCard && !clickedOnPill) {
        setIsClosing(true);
        setTimeout(() => onClose(), 120);
      }
    };
    document.addEventListener('click', handleGlobalClick, true);
    
    // Cleanup
    return () => {
      clearTimeout(hoverTimerRef.current);
      cardElement.removeEventListener('mouseenter', handleMouseEnter);
      cardElement.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseout', handleDocumentMouseOut);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [isVisible, onClose]);
  
  // Add explicit event listener for the pill elements
  useEffect(() => {
    if (!isVisible) return;
    
    const pillElements = document.querySelectorAll('.cbf-pill');
    const handlePillMouseLeave = () => {
      // Short timeout to allow moving to the card
      setTimeout(() => {
        // If we're not over the card, close it
        if (!document.querySelector('.cbf-index-card:hover')) {
          setIsClosing(true);
          setTimeout(() => onClose(), 120);
        }
      }, 50);
    };
    
    pillElements.forEach(pill => {
      pill.addEventListener('mouseleave', handlePillMouseLeave);
    });
    
    return () => {
      pillElements.forEach(pill => {
        pill.removeEventListener('mouseleave', handlePillMouseLeave);
      });
    };
  }, [isVisible, onClose]);
  
  if (!isVisible || !influencer) return null;
  
  return (
    <div 
      className={`cbf-index-card ${isClosing ? 'closing' : ''}`}
      ref={cardRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="card-header">
        <div className="influencer-info">
          <div className="avatar">{influencer.name.charAt(0)}</div>
          <div className="name">{influencer.name}</div>
        </div>
        <div className="score-badge">{influencer.cbfIndex}</div>
      </div>
      
      <div className="card-overline">
        CREATOR BRAND FIT (CBF) INDEX FOR
      </div>
      
      <div className="card-body">
        {impacts.map((impact, index) => (
          <div key={index} className="impact-row">
            <div className="impact-icon">
              {impact.positive ? (
                <BiUpArrowAlt size={18} className="positive" />
              ) : (
                <BiDownArrowAlt size={18} className="negative" />
              )}
            </div>
            <div className="impact-content">
              <div className="impact-title">{impact.title}</div>
              <div className="impact-subline">{impact.subline}</div>
            </div>
            <div className={`impact-value ${impact.positive ? 'positive' : 'negative'}`}>
              {impact.positive ? '+' : ''}{impact.impact}
            </div>
          </div>
        ))}
      </div>
      
      <button className="change-index-button" onClick={() => onChangeIndex(influencer)}>
        <FiEdit2 size={14} />
        <span>Change CBF Index</span>
      </button>
    </div>
  );
};

export default CBFIndexCard;
