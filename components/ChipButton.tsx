import Box from '@components/Box';
import styles from '@styles/Dashboard.module.scss';
import React from 'react';
import styled from 'styled-components';

interface ChipButtonProps {
  children: React.ReactNode;
  callback?: (event: React.MouseEvent<HTMLDivElement>) => void;
  color?: string;
  outline?: boolean;
}

const Chip = styled(Box)<{ outline?: boolean }>`
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  &:hover {
    background-color: ${({ theme, outline, color }) =>
      outline ? theme.colors.gray[200] : color};
  &:active {
    opacity: 0.7;
  }
`;

export default function ChipButton({
  children,
  callback,
  color,
  outline,
}: ChipButtonProps) {
  return (
    <Chip
      outline={outline}
      onClick={callback}
      color={color}
      bg={outline ? 'transparent' : color}
      borderStyle='solid'
      borderColor={color}
      margin='4px'
      borderRadius={30}
      display='flex'
      alignItems='center'
      className={styles.button}
    >
      {children}
    </Chip>
  );
}
