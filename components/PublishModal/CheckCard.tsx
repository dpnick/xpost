import Box from '@components/Box';
import Text from '@components/Text';
import { Integration, Provider } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import React, { useState } from 'react';
import { GoCheck } from 'react-icons/go';

interface CheckCardProps {
  integration: Integration & { provider: Provider };
  onToggle: (integration: Integration & { provider: Provider }) => void;
}

export default function CheckCard({ integration, onToggle }: CheckCardProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const toggleChecked = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onToggle(integration);
    setIsChecked((prev) => !prev);
  };

  return (
    <Box
      key={integration.id}
      className={`${styles.clickableCard} ${styles.flexCenter}`}
      onClick={toggleChecked}
      flexDirection='column'
      position='relative'
      padding='8px'
    >
      <Image src={integration.provider.logoUrl} width={100} height={100} />
      <Text mt='8px' fontWeight='bold' fontSize='1.2em'>
        {integration.provider.displayName}
      </Text>
      <Text mt='8px' fontWeight='bold' color='gray' textTransform='capitalize'>
        {integration.username}
      </Text>
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
    </Box>
  );
}
