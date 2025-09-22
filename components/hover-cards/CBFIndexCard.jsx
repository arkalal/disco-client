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
  
  // Enhanced approach for reliable hover detection with fast mouse movements
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement || !isVisible) return;
    
    // Clear any pending close timer when the card appears
    clearTimeout(hoverTimerRef.current);
    setIsClosing(false);
    
    // Aggressive event capture for all mouse events
    const addAggressiveListener = (element, eventType, handler) => {
      // Use capture phase to get the events before they bubble
      element.addEventListener(eventType, handler, true);
    };
    
    // Central function to check if we're hovering relevant elements
    const isHoveringTarget = () => {
      // Check for hover on both pill and card
      return !!document.querySelector('.cbf-index-card:hover, .cbf-pill:hover');
    };
    
    // Handle mouse entering the card
    const handleMouseEnter = () => {
      clearTimeout(hoverTimerRef.current);
      setIsClosing(false);
    };
    
    // Handle mouse leaving the card
    const handleMouseLeave = () => {
      // Short delay to check if we moved to a pill
      hoverTimerRef.current = setTimeout(() => {
        if (!isHoveringTarget()) {
          setIsClosing(true);
          setTimeout(() => {
            // Final check before closing
            if (!isHoveringTarget()) {
              onClose();
            } else {
              setIsClosing(false);
            }
          }, 100);
        }
      }, 30); // Shorter delay for faster response
    };
    
    // Handle document-wide mouse movements for edge cases
    const handleDocumentMouseMove = (e) => {
      // If we have a pending close timer but mouse is over a relevant element
      if (hoverTimerRef.current && isHoveringTarget()) {
        // Cancel the close
        clearTimeout(hoverTimerRef.current);
        setIsClosing(false);
      }
    };
    
    // Handle document-level mouseout (when cursor leaves window)
    const handleDocumentMouseOut = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        setIsClosing(true);
        setTimeout(() => onClose(), 100);
      }
    };
    
    // Global click handler to close if clicked elsewhere
    const handleGlobalClick = (e) => {
      const clickedElement = e.target;
      const clickedOnCard = cardElement.contains(clickedElement);
      const clickedOnPill = clickedElement.closest('.cbf-pill') !== null;
      
      if (!clickedOnCard && !clickedOnPill) {
        setIsClosing(true);
        setTimeout(() => onClose(), 100);
      }
    };
    
    // Add all event listeners
    // For the card itself
    addAggressiveListener(cardElement, 'mouseenter', handleMouseEnter);
    addAggressiveListener(cardElement, 'mouseover', handleMouseEnter);
    addAggressiveListener(cardElement, 'mouseleave', handleMouseLeave);
    
    // Document-level listeners
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseout', handleDocumentMouseOut);
    document.addEventListener('click', handleGlobalClick, true);
    
    // Cleanup all listeners
    return () => {
      clearTimeout(hoverTimerRef.current);
      cardElement.removeEventListener('mouseenter', handleMouseEnter, true);
      cardElement.removeEventListener('mouseover', handleMouseEnter, true);
      cardElement.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseout', handleDocumentMouseOut);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [isVisible, onClose]);
  
  // Global monitoring of pill elements
  useEffect(() => {
    if (!isVisible) return;
    
    // Find all pill elements
    const pillElements = document.querySelectorAll('.cbf-pill');
    
    // Add redundant listeners to pills for maximum detection
    pillElements.forEach(pill => {
      const handlePillMouseLeave = () => {
        setTimeout(() => {
          if (!document.querySelector('.cbf-index-card:hover')) {
            setIsClosing(true);
            setTimeout(() => onClose(), 100);
          }
        }, 30);
      };
      
      pill.addEventListener('mouseleave', handlePillMouseLeave, true);
      
      return () => {
        pill.removeEventListener('mouseleave', handlePillMouseLeave, true);
      };
    });
  }, [isVisible, onClose]);
  
  // React to visibility changes
  useEffect(() => {
    if (isVisible) {
      // When card appears, ensure it's not in closing state
      setIsClosing(false);
    }
  }, [isVisible]);
  
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
