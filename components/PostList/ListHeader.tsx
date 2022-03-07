import Box from '@components/Box';
import styles from '@styles/Dashboard.module.scss';
import React from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';
import styled from 'styled-components';

interface ListHeaderProps {
  isOpen: boolean;
  title: string;
  toggleOpening: () => void;
  headerAction?: React.ReactNode;
}

const AnimatedIcon = styled(IoChevronDownSharp)<{ open: boolean }>`
  font-size: 24px;
  transition: transform 0.2s;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0)')};
`;

export default function ListHeader({
  isOpen,
  title,
  toggleOpening,
  headerAction,
}: ListHeaderProps) {
  return (
    <Box
      onClick={toggleOpening}
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      borderBottom={`1px solid ${isOpen ? 'gray.300' : 'transparent'}`}
      padding='16px'
      borderRadius='8px'
      className={styles.pointer}
    >
      <h4>{title}</h4>
      <Box display='flex' alignItems='center'>
        {headerAction}
        <AnimatedIcon open={isOpen} />
      </Box>
    </Box>
  );
}
