import Collapse from '@components/Collapse';
import Modal from '@components/Modal';
import NewIntegration from '@components/NewIntegration.tsx';
import providersHelper from '@lib/providers';
import { IntegrationInfos } from '@models/integration';
import { Integration, Provider } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
  const router = useRouter();
  const [infos, setInfos] = useState<IntegrationInfos[]>();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const [showNewProviders, setShowNewProviders] = useState<boolean>(false);

  useEffect(() => {
    const getInfos = async () => {
      if (integrations?.length > 0) {
        const promises = integrations.map((integration) => {
          const provider = providers.find(
            (provider) => provider.id === integration.providerId
          );
          return providersHelper[provider!.name].getUserInfos(integration);
        });

        try {
          const result = await Promise.all(promises);
          setInfos(result);
        } catch {
          toast.error('Something went wrong getting integration infos');
        }
      }
    };

    getInfos();
  }, [integrations]);

  const toggleNewProviders = () => {
    setShowNewProviders((prev) => !prev);
  };

  const selectProviderToAdd = (provider: Provider) => {
    window.scrollTo(0, 0);
    setSelectedProvider(provider);
  };

  const onIntegrationSuccess = () => {
    setSelectedProvider(null);
    document.body.classList.remove('modal-open');
    router.replace(router.asPath);
  };

  const newIntegrationModal = () => {
    if (selectedProvider) {
      return (
        <Modal onClose={() => setSelectedProvider(null)}>
          <NewIntegration
            provider={selectedProvider}
            closeModal={onIntegrationSuccess}
          />
        </Modal>
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

        <Box display='flex' justifyContent='center'>
          <Box
            p='12px 16px'
            bg='primary'
            color='white'
            onClick={toggleNewProviders}
            className={styles.button}
          >
            {showNewProviders ? 'Hide providers' : 'Add new providers'}
          </Box>
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
