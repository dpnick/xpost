import React from 'react';
import Box from './Box';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Button({ children, onClick, style }: ButtonProps) {
  return (
    <Box
      bg='white'
      borderRadius={8}
      padding='4px'
      style={style}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
