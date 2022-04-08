import Box from '@components/Box';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import Text from '@components/Text';
import { Integration, Provider } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import styled from 'styled-components';
import CheckCard from './CheckCard';
import Divider from './Divider';

interface SelectIntegrationsProps {
  integrations: (Integration & { provider: Provider })[];
  integrationsSelected: (Integration & {
    provider: Provider;
  })[];
  setIntegrationsSelected: React.Dispatch<
    React.SetStateAction<(Integration & { provider: Provider })[]>
  >;
  next: () => void;
  previous: () => void;
}

const ModalIntegrationList = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 16px;
  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: auto auto auto;
  }
`;

const ButtonDocked = styled(Button)`
  width: 100%;
  position: sticky;
  bottom: 8px;
  border-radius: 4px;
`;

export default function SelectIntegrations({
  integrations,
  integrationsSelected,
  setIntegrationsSelected,
  previous,
  next,
}: SelectIntegrationsProps) {
  const updateIntegrations = (
    integration: Integration & { provider: Provider }
  ) => {
    let nextIntegrations = [...integrationsSelected, integration];
    const toRemove = integrationsSelected.find(
      (selected) => selected.id === integration.id
    );
    if (toRemove) {
      nextIntegrations = integrationsSelected.filter(
        (int) => int.id !== integration.id
      );
    }
    setIntegrationsSelected(nextIntegrations);
  };

  if (!integrations) {
    <Text color='gray.500'>
      Connect your first blogging platform to be able to publish!
    </Text>;
  }

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <div>
        <Box display='flex' alignItems='center' mb={3}>
          <IconButton Icon={IoMdArrowBack} color='black' onClick={previous} />
          <Text fontSize='1.4em' fontWeight='bold'>
            Where do you want to publish?
          </Text>
        </Box>
        <Divider />
        <ModalIntegrationList>
          {integrations.map((integration) => (
            <CheckCard
              key={integration.id}
              onToggle={() => updateIntegrations(integration)}
            >
              <Image
                src={integration.provider.logoUrl}
                alt='provider logo'
                width={100}
                height={100}
              />
              <Text mt='8px' fontWeight='bold' fontSize='1.2em'>
                {integration.provider.displayName}
              </Text>
              <Text
                mt='8px'
                fontWeight='bold'
                color='gray.500'
                textTransform='capitalize'
              >
                {integration.username}
              </Text>
            </CheckCard>
          ))}
        </ModalIntegrationList>
      </div>
      <ButtonDocked
        label='Next'
        disabled={!integrationsSelected || integrationsSelected?.length < 1}
        onClick={next}
      />
    </Box>
  );
}
