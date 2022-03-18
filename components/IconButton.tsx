import styles from '@styles/Dashboard.module.scss';
import React from 'react';
import { IconType } from 'react-icons';
import { AiFillQuestionCircle } from 'react-icons/ai';
import styled from 'styled-components';
import Box from './Box';

interface IconButtonProps {
  Icon: IconType;
  color: string;
  hoverColor?: string;
  size?: number | string;
  onClick: () => void;
}

const Container = styled(Box)`
  border-radius: 50px;
  padding: ${({ theme }) => theme.space[1]}px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  &:active {
    opacity: 0.7;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[200]};
  }
`;

const StyledIcon = styled(AiFillQuestionCircle)<{
  custom: string;
  hover: string;
}>`
  transition: color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  color: ${({ custom }) => custom};
  &:active {
    opacity: 0.7;
  }
  &:hover {
    color: ${({ hover }) => hover};
  }
`;

export default function IconButton({
  Icon,
  color,
  size,
  hoverColor,
  onClick,
}: IconButtonProps) {
  return (
    <Container className={styles.flexCenter}>
      <StyledIcon
        as={Icon}
        size={size ?? 24}
        custom={color}
        hover={hoverColor ?? color}
        onClick={onClick}
      />
    </Container>
  );
}
