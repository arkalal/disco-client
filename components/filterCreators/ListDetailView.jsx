import React from 'react';
import { FiArrowLeft, FiLock, FiTrash2 } from 'react-icons/fi';
import './ListDetailView.scss';

const ListDetailView = ({ listName, influencers, onBackClick }) => {
  return (
    <div className="list-detail-view">
      <div className="list-detail-header">
        <button className="back-button" onClick={onBackClick}>
          <FiArrowLeft size={16} />
        </button>
        <h2 className="list-name">{listName}</h2>
      </div>
      
      <div className="list-stats">
        <div className="stat-row">
          <div className="stat-label">Total influencer</div>
          <div className="stat-value">{influencers.length}</div>
        </div>
        <div className="stat-row">
          <div className="stat-label">Deliverables</div>
          <div className="stat-value">NA</div>
        </div>
      </div>
      
      <div className="influencers-list">
        {influencers.map(influencer => (
          <div className="influencer-item" key={influencer.id}>
            <div className="influencer-avatar">
              <img src={influencer.profileImg} alt={influencer.name} />
            </div>
            <div className="influencer-details">
              <div className="influencer-name">
                {influencer.name}
              </div>
              <div className="influencer-handle">
                @{influencer.handle}
              </div>
            </div>
            <div className="influencer-actions">
              <button className="delete-button" aria-label="Remove influencer">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListDetailView;
