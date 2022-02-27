import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Box from './Box';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled(Box)<{ width: number; height: number }>`
  border: 5px solid ${({ theme }) => theme.colors.accent};
  border-top: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  animation: ${spin} 1s linear infinite;
`;

interface SpinnerProps {
  width?: number;
  height?: number;
  icon?: boolean;
}

export default function Spinner({
  width = 80,
  height = 80,
  icon = true,
}: SpinnerProps) {
  return (
    <Box width={width} height={height}>
      <Box className={styles.absoluteCenter}>
        <StyledSpinner width={width} height={height} />
      </Box>
      {icon && (
        <Box className={styles.absoluteCenter}>
          <Image src='/icon.svg' height={height / 2} width={width / 2} />
        </Box>
      )}
    </Box>
  );
}
