import providersHelper from '@lib/providers';
import { IntegrationInfos } from '@models/integration';
import { Integration, Provider } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from '../Box';
import Text from '../Text';
import IntegrationCard from './IntegrationCard';
import ProviderCard from './ProviderCard';

interface ProviderListProps {
  providers: Provider[];
  integrations: Integration[];
}

const CardList = styled.div`
  display: -webkit-box;
  overflow-x: scroll;
  box-sizing: border-box;
  padding: 16px 0;
  overflow-y: visible;
  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 16px;
    overflow: visible;
  }
`;

export default function ProviderList({
  providers,
  integrations,
}: ProviderListProps) {
  const [infos, setInfos] = useState<IntegrationInfos[]>();

  useEffect(() => {
    const getInfos = async () => {
      if (integrations?.length > 0) {
        const promises = integrations.map((integration) => {
          const provider = providers.find(
            (provider) => provider.id === integration.providerId
          );
          return providersHelper[provider!.name].getUserInfos(integration);
        });
        const result = await Promise.all(promises);
        setInfos(result);
      }
    };

    getInfos();
  }, [integrations]);

  if (integrations?.length > 0) {
    return (
      <CardList>
        {integrations.map((integration) => {
          const provider = providers.find(
            (provider) => provider.id === integration.providerId
          );
          const integrationInfos = infos?.find(
            ({ integrationId }) => integrationId === integration.id
          );
          return (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              provider={provider!}
              infos={integrationInfos!}
            />
          );
        })}
      </CardList>
    );
  }

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      padding='2em'
    >
      <Text fontSize='1.2em' fontWeight='bold' color='grey' lineHeight='1.5em'>
        Start by adding your first blogging platform
      </Text>
      <Text fontSize='1.2em' fontWeight='bold' color='grey' lineHeight='1.5em'>
        within a minute
      </Text>
      <div>
        <Box display='flex'>
          {providers?.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </Box>
      </div>
    </Box>
  );
}
