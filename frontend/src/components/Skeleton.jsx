import React from 'react';
import './Skeleton.css';

export const Skeleton = ({ width = '100%', height = '1rem', radius = '6px', style = {} }) => (
  <span className="ui-skeleton" style={{ width, height, borderRadius: radius, ...style }} aria-hidden="true" />
);

export const SkeletonTable = ({ linhas = 5, colunas = 4 }) => (
  <tbody>
    {Array.from({ length: linhas }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: colunas }).map((_, j) => (
          <td key={j}><Skeleton height="14px" width={j === 0 ? '70%' : '50%'} /></td>
        ))}
      </tr>
    ))}
  </tbody>
);

export const SkeletonCard = ({ altura = '120px' }) => (
  <div className="ui-skeleton-card"><Skeleton height={altura} radius="14px" /></div>
);

export default Skeleton;
