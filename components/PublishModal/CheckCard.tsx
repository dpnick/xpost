import Box from '@components/Box';
import styles from '@styles/Dashboard.module.scss';
import React, { useState } from 'react';
import { GoCheck } from 'react-icons/go';
import styled from 'styled-components';

interface CheckCardProps {
  children: React.ReactNode;
  onToggle: () => void;
}

const Container = styled(Box)`
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default function CheckCard({ children, onToggle }: CheckCardProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const toggleChecked = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onToggle();
    setIsChecked((prev) => !prev);
  };

  return (
    <Container
      className={`${styles.clickableCard} ${styles.flexCenter}`}
      onClick={toggleChecked}
      flexDirection='column'
      position='relative'
      padding='8px'
    >
      {children}
      {isChecked && (
        <Box
          className={styles.absoluteCenter}
          bg='rgba(0, 0, 0, 0.5)'
          width='100%'
          height='100%'
          borderRadius='8px'
        >
          <GoCheck size={60} color='white' className={styles.absoluteCenter} />
        </Box>
      )}
    </Container>
  );
}
