import React from 'react';

const AdminSplitCard = ({ titulo, valorEsq, labelEsq, corEsq, valorDir, labelDir, corDir }) => {
  return (
    <div className="loca-card">
      <span className="loca-card-title">{titulo}</span>
      <div className="split-metric">
        <div className="metric-part">
          <span className={`loca-card-value ${corEsq}`}>{valorEsq}</span>
          <small>{labelEsq}</small>
        </div>
        <div className="metric-divider"></div>
        <div className="metric-part">
          <span className={`loca-card-value ${corDir}`}>{valorDir}</span>
          <small>{labelDir}</small>
        </div>
      </div>
    </div>
  );
};

export default AdminSplitCard;