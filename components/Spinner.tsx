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

const StyledSpinner = styled(Box)`
  border: 5px solid ${({ theme }) => theme.colors.accent};
  border-top: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: ${spin} 1s linear infinite;
`;

export default function Spinner() {
  return (
    <Box width={80} height={80}>
      <Box className={styles.absoluteCenter}>
        <StyledSpinner />
      </Box>
      <Box className={styles.absoluteCenter}>
        <Image src='/icon.svg' height={35} width={35} />
      </Box>
    </Box>
  );
}
