"use client";

import React from 'react';
import './MetricBadge.scss';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useState } from 'react';

/**
 * MetricBadge Component
 * 
 * Displays a badge indicating the provenance of a metric
 * 
 * @param {Object} props
 * @param {string} props.type - The type of data: "EXACT", "ESTIMATED", or "PROVIDER_MODELLED"
 * @param {string} props.label - Optional override for the displayed label
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.tooltip - Custom tooltip text
 */
const MetricBadge = ({ type, label, className = '', tooltip = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Define badge styles and tooltips based on type
  const badgeConfig = {
    EXACT: {
      className: 'badge-exact',
      label: label || 'Exact',
      tooltip: tooltip || 'Data sourced directly from the platform API.'
    },
    ESTIMATED: {
      className: 'badge-estimated',
      label: label || 'Est.',
      tooltip: tooltip || 'Estimated value based on available metrics.'
    },
    PROVIDER_MODELLED: {
      className: 'badge-modelled',
      label: label || 'Modelled',
      tooltip: tooltip || 'Data modelled by our provider based on statistical analysis.'
    },
    GOOD: {
      className: 'badge-good',
      label: label || 'Good',
      tooltip: tooltip || 'This metric indicates good performance.'
    },
    AVERAGE: {
      className: 'badge-average',
      label: label || 'Average',
      tooltip: tooltip || 'This metric indicates average performance.'
    },
    EXCELLENT: {
      className: 'badge-excellent',
      label: label || 'Excellent',
      tooltip: tooltip || 'This metric indicates excellent performance.'
    }
  };

  // Get config based on type, or default to ESTIMATED
  const config = badgeConfig[type] || badgeConfig.ESTIMATED;

  return (
    <div 
      className={`metric-badge ${config.className} ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span>{config.label}</span>
      <IoInformationCircleOutline className="info-icon" />
      
      {showTooltip && (
        <div className="metric-tooltip">
          {config.tooltip}
        </div>
      )}
    </div>
  );
};

export default MetricBadge;
