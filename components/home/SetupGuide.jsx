"use client";

import { useState } from "react";
import { BsCheck2, BsChevronRight } from "react-icons/bs";
import { IoChevronUp } from "react-icons/io5";

const SetupGuide = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: "Discover & Plan",
      items: [
        { id: "onboarding", label: "Personalised Onboarding", completed: true },
        {
          id: "browse",
          label: "Browse & Analyse Influencers",
          completed: true,
        },
        { id: "compare", label: "Compare Influencers", completed: false },
        {
          id: "plan",
          label: "Create a Plan with your Chosen Influencers",
          completed: false,
        },
        { id: "reach", label: "Reach-out to Influencers", completed: false },
        {
          id: "explore",
          label: "Explore Leading Campaigns by Categories",
          completed: false,
        },
      ],
    },
    {
      number: 2,
      title: "Report & Analysis",
      items: [],
    },
    {
      number: 3,
      title: "Insights & Trends",
      items: [],
    },
  ];

  return (
    <div className="setup-guide">
      <div className="guide-header">
        <div className="title-section">
          <h2>Your Personalized Setup Guide</h2>
          <span className="progress">1 of 10 Features Explored</span>
        </div>
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <IoChevronUp className={`icon ${isExpanded ? "" : "collapsed"}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="steps-container">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${step.number === currentStep ? "active" : ""}`}
            >
              <div className="step-header">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
              </div>

              {step.number === currentStep && (
                <div className="step-items">
                  {step.items.map((item) => (
                    <div key={item.id} className="step-item">
                      <div
                        className={`status-icon ${
                          item.completed ? "completed" : ""
                        }`}
                      >
                        {item.completed ? <BsCheck2 /> : ""}
                      </div>
                      <span className="item-label">{item.label}</span>
                      {item.id === "browse" && (
                        <button className="explore-button">
                          Explore Top Influencers
                          <BsChevronRight className="arrow-icon" />
                        </button>
                      )}
                      {item.id === "access" && (
                        <div className="access-badge">
                          <span className="star">★</span>
                          Access Creator Insights from Instagram/YouTube
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetupGuide;
