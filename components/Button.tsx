import styles from '@styles/Dashboard.module.scss';
import React from 'react';
import { IconType } from 'react-icons';
import styled from 'styled-components';
import Box from './Box';
import Text from './Text';

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  label: string;
  Icon?: IconType;
  className?: string;
}

const HoverBox = styled(Box)`
  width: fit-content;
  transition: opacity 0.2s ease-in-out;
  &:active {
    opacity: 0.7;
  }
`;

export default function Button({
  label,
  Icon,
  onClick,
  className,
}: ButtonProps) {
  return (
    <HoverBox
      backgroundColor='primary'
      color='white'
      border='1px solid primary'
      borderRadius='8px 16px'
      padding='8px 16px'
      minHeight='40px'
      onClick={onClick}
      className={`${className} ${styles.flexCenter} ${styles.pointer}`}
    >
      <Text mr={Icon ? '4px' : 0}>{label}</Text>
      {Icon && <Icon size={24} color='white' />}
    </HoverBox>
  );
}
