"use client";

import React from 'react';
import { FiLink } from 'react-icons/fi';
import './SummaryEmptyState.scss';

const SummaryEmptyState = ({ onSetDeliverables, activeListId }) => {
  return (
    <div className="summary-empty-state">
      <div className="content">
        <div className="illustration">
          {/* This would ideally be an SVG or image, but for now we'll use a placeholder */}
          <img 
            src="/images/summary-illustration.svg" 
            alt="Setup deliverables" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIHJ4PSI4IiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNzUiIHk9Ijc1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiPkRlbGl2ZXJhYmxlcyBJbGx1c3RyYXRpb248L3RleHQ+PC9zdmc+"; 
            }}
          />
        </div>
        <h2>Just one more step!</h2>
        <p>
          Add deliverables for this list to unlock a detailed summary, including in-depth metrics and expected outcomes for your selected influencers
        </p>
        <button 
          className="set-deliverables-btn"
          onClick={() => onSetDeliverables(activeListId)}
        >
          <FiLink size={16} />
          Set Deliverables
        </button>
      </div>
    </div>
  );
};

export default SummaryEmptyState;
