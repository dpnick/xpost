import React from 'react';
import Box from './Box';

interface CardProps {
  children: React.ReactNode;
  onCardClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

export default function Card({ children, onCardClick, style }: CardProps) {
  return (
    <Box
      bg='white'
      borderRadius={8}
      padding='8px'
      boxShadow='5px 5px 15px 4px lightgray'
      border='1px solid #eaeaea'
      style={style}
      onClick={onCardClick}
    >
      {children}
    </Box>
  );
}
