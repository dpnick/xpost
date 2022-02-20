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

const AbsoluteCenterBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function Spinner() {
  return (
    <Box width={80} height={80}>
      <AbsoluteCenterBox>
        <StyledSpinner />
      </AbsoluteCenterBox>
      <AbsoluteCenterBox>
        <Image src='/icon.svg' height={35} width={35} />
      </AbsoluteCenterBox>
    </Box>
  );
}
