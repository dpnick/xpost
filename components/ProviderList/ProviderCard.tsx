import Box from '@components/Box';
import Text from '@components/Text';
import { Provider } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface ProviderCardProps {
  provider: Provider;
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

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Link
      href={{
        pathname: '/dashboard/integration/new',
        query: {
          id: provider.id,
          name: provider.name,
          logoUrl: provider.logoUrl,
          instructionsUrl: provider.intructionsUrl,
          needInit: provider.needInit,
        },
      }}
    >
      <Container className={styles.clickableCard}>
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
    </Link>
  );
}
