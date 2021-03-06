import Button from '@components/Button';
import Collapse from '@components/Collapse';
import Modal from '@components/Modal';
import NewIntegration from '@components/NewIntegration.tsx';
import useProviders from '@hooks/useProviders';
import fetchSwr from '@lib/fetchSwr';
import { IntegrationInfos } from '@models/integration';
import { Integration, Provider } from '@prisma/client';
import React, { useState } from 'react';
import styled from 'styled-components';
import useSWRImmutable, { Fetcher } from 'swr';
import Box from '../Box';
import Text from '../Text';
import IntegrationCard from './IntegrationCard';
import ProviderCard from './ProviderCard';

interface ProviderListProps {
  providers: Provider[];
  integrations: (Integration & { provider: Provider })[];
}

const CardList = styled.div`
  display: -webkit-box;
  overflow-x: scroll;
  box-sizing: border-box;
  padding: 16px 0;
  overflow-y: visible;
  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-gap: 16px;
    overflow: visible;
  }
`;

export default function ProviderList({
  providers,
  integrations,
}: ProviderListProps) {
  const { refresh } = useProviders();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const [showNewProviders, setShowNewProviders] = useState<boolean>(false);

  const infosFetch: Fetcher<IntegrationInfos[]> = fetchSwr;
  const {
    data: infos,
    mutate,
    error: errorInfos,
  } = useSWRImmutable('/api/integration/get-infos', infosFetch);

  const toggleNewProviders = () => {
    setShowNewProviders((prev) => !prev);
  };

  const selectProviderToAdd = (provider: Provider) =>
    setSelectedProvider(provider);

  const onIntegrationSuccess = () => {
    setSelectedProvider(null);
    setShowNewProviders(false);
    refresh();
    mutate();
  };

  const hideIntegrationModal = () => setSelectedProvider(null);

  const newIntegrationModal = () => {
    if (selectedProvider) {
      return (
        <Modal
          open={!!selectedProvider}
          onChange={hideIntegrationModal}
          content={
            <NewIntegration
              provider={selectedProvider}
              closeModal={onIntegrationSuccess}
            />
          }
        />
      );
    }
    return null;
  };

  if (integrations?.length > 0) {
    return (
      <>
        {newIntegrationModal()}
        <CardList>
          {integrations.map((integration) => {
            const integrationInfos = infos?.find(
              ({ integrationId }) => integrationId === integration.id
            );
            return (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                provider={integration.provider!}
                infos={integrationInfos!}
                isStatsLoading={!infos && !errorInfos}
              />
            );
          })}
        </CardList>

        <Box display='flex' justifyContent='center'>
          <Button
            label={showNewProviders ? 'Hide providers' : 'Add new providers'}
            onClick={toggleNewProviders}
          />
        </Box>
        <Collapse isOpen={showNewProviders}>
          <Box display='flex' justifyContent='center'>
            {providers?.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                setProvider={selectProviderToAdd}
              />
            ))}
          </Box>
        </Collapse>
      </>
    );
  }

  return (
    <>
      {newIntegrationModal()}
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        padding='2em'
      >
        <Text
          fontSize='1.2em'
          fontWeight='bold'
          color='grey'
          lineHeight='1.5em'
        >
          Start by adding your first blogging platform
        </Text>
        <Text
          fontSize='1.2em'
          fontWeight='bold'
          color='grey'
          lineHeight='1.5em'
        >
          within a minute
        </Text>
        <div>
          <Box display='flex'>
            {providers?.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                setProvider={selectProviderToAdd}
              />
            ))}
          </Box>
        </div>
      </Box>
    </>
  );
}
