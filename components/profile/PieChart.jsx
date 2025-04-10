"use client";

import React from "react";
import "./ProfileOverview.scss";

const PieChart = ({ segments, innerContent, size = 100 }) => {
  // Calculate total for normalization
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  // Calculate the stroke dash offset for each segment
  let cumulativeOffset = 0;
  const segmentsWithOffset = segments.map((segment) => {
    const normalizedValue = total > 0 ? (segment.value / total) * 100 : 0;
    const currentOffset = cumulativeOffset;
    cumulativeOffset += normalizedValue;

    return {
      ...segment,
      normalizedValue,
      dashoffset: currentOffset,
    };
  });

  return (
    <div className="pie-chart-container" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36">
        {segmentsWithOffset.map((segment, index) => (
          <path
            key={index}
            className={`segment ${segment.className || ""}`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={segment.color}
            strokeWidth="3"
            strokeDasharray={`${segment.normalizedValue}, 100`}
            strokeDashoffset={
              segment.dashoffset > 0 ? `-${segment.dashoffset}` : "0"
            }
          />
        ))}
      </svg>
      {innerContent && <div className="inner-content">{innerContent}</div>}
    </div>
  );
};

export default PieChart;
