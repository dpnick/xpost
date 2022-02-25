import Box from '@components/Box';
import styles from '@styles/Dashboard.module.scss';
import React from 'react';
import { IconType } from 'react-icons';

interface ChipButtonProps {
  label: string;
  callback: (event: React.MouseEvent<HTMLDivElement>) => void;
  Icon?: IconType;
  color?: string;
  background?: string;
}

export default function ChipButton({
  label,
  callback,
  Icon,
  color,
  background,
}: ChipButtonProps) {
  return (
    <Box
      onClick={callback}
      color={color}
      bg={background}
      border={`1px solid ${background === 'unset' ? color : background}`}
      marginX='4px'
      borderRadius={30}
      display='flex'
      alignItems='center'
      className={styles.button}
    >
      {label}
      {Icon && <Icon size={16} color={color} style={{ marginLeft: 4 }} />}
    </Box>
  );
}
