import React from 'react';

const AdminSplitCard = ({ titulo, esq, dir }) => (
  <div className="loca-card">
    <span className="loca-card-title">{titulo}</span>
    <div className="split-metric">
      <div className="metric-part">
        <span className={`loca-card-value ${esq.cor}`}>{esq.valor}</span>
        <small>{esq.label}</small>
      </div>
      <div className="metric-divider"></div>
      <div className="metric-part">
        <span className={`loca-card-value ${dir.cor}`}>{dir.valor}</span>
        <small>{dir.label}</small>
      </div>
    </div>
  </div>
);

export default AdminSplitCard;