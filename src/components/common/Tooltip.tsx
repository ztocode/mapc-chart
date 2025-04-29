import React from 'react';

export interface TooltipProps {
  x: number;
  y: number;
  content: React.ReactNode;
  visible: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ x, y, content, visible }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x ,
        top: y,
        backgroundColor: 'white',
        color: 'black',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        pointerEvents: 'none',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        maxWidth: '200px',
        border: '1px solid #ddd',
      }}
    >
      {content}
    </div>
  );
}; 