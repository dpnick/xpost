import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { IconType } from 'react-icons';
import styled from 'styled-components';

const Element = styled(Box)<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color linear 0.2s;
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'unset')};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.gray['300'] : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['300']};
  }
`;

interface SideBarElementProps {
  label: string;
  isSelected: boolean;
  Icon: IconType;
  onClick: () => void;
}

export default function SideBarElement({
  label,
  isSelected,
  Icon,
  onClick,
}: SideBarElementProps) {
  return (
    <Element onClick={onClick} isSelected={isSelected}>
      <Icon size={18} />
      <Text ml={2}>{label}</Text>
    </Element>
  );
}
