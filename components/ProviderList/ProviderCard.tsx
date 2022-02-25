import Box from '@components/Box';
import Text from '@components/Text';
import { Provider } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

interface ProviderCardProps {
  provider: Provider;
  setProvider: (provider: Provider) => void;
}

const Container = styled(Box)`
  margin: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    .name {
      text-decoration: underline;
    }
  }
`;

export default function ProviderCard({
  provider,
  setProvider,
}: ProviderCardProps) {
  const select = () => setProvider(provider);

  return (
    <Container className={styles.clickableCard} onClick={select}>
      <Box margin='auto'>
        <Image
          src={provider.logoUrl}
          alt={`${provider.name} logo`}
          width={40}
          height={40}
        />
      </Box>

      <Text className='name' fontWeight='bold' textAlign='center' mt='8px'>
        {provider.displayName}
      </Text>
    </Container>
  );
}
