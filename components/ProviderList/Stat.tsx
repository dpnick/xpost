import Box from '@components/Box';
import Text from '@components/Text';
import styles from '@styles/Dashboard.module.scss';
import React from 'react';
import { IconType } from 'react-icons';

interface StatProps {
  Icon: IconType;
  value: number | undefined;
  label: string;
}

export default function Stat({ value, label, Icon }: StatProps) {
  return (
    <Box
      flexDirection='column'
      className={`${styles.card} ${styles.flexCenter}`}
      boxShadow='unset'
    >
      <Icon size={24} color='#24b47e' />
      <Text ml='8px' mt='8px'>
        {value || value === 0 ? (
          <Text display='unset' fontWeight='bold'>
            {value}
          </Text>
        ) : (
          '-'
        )}
        &nbsp;{label}
      </Text>
    </Box>
  );
}
