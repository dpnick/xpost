import Box from '@components/Box';
import Confetti from '@components/Confetti';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import CustomizePublication from './CustomizePublication';
import SelectIntegrations from './SelectIntegrations';
import SelectPublicationDate from './SelectPublicationDate';
import Success from './Success';

const Inner = styled.div<{ index: number }>`
  display: flex;
  height: 100%;
  transition: all 0.3s ease;
  transform: translateX(${({ index }) => index * -100}%);
`;

const Item = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding-left: 16px;
  padding-right: 16px;
  overflow: ${({ selected }) => (selected ? 'auto' : 'hidden')};

  & > div {
    width: 100%;
    @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
      width: 70vw;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
      width: 50vw;
    }
  }
`;

interface PublishModalProps {
  post: Post;
  integrations: (Integration & { provider: Provider })[];
}

enum Step {
  SELECT_PUBLICATION_DATE = 0,
  SELECT_INTEGRATIONS = 1,
  CUSTOMIZE_PUBLICATION = 2,
  SUCCESS = 3,
}

export default function PublishModal({
  post,
  integrations,
}: PublishModalProps) {
  const [index, setIndex] = useState<number>(0);
  const successFireFn: React.MutableRefObject<(() => void) | null> =
    useRef(null);

  // confetti shot on success page appear
  useEffect(() => {
    if (index === Step.SUCCESS && successFireFn?.current) {
      successFireFn.current();
    }
  }, [index]);

  const [integrationsSelected, setIntegrationsSelected] = useState<
    (Integration & { provider: Provider })[]
  >([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);

  const next = () => setIndex((prev) => ++prev);
  const previous = () => setIndex((prev) => --prev);

  return (
    <>
      <Confetti fireFromParent={successFireFn} />
      <Box overflowX='hidden' height='100%'>
        <Inner index={index}>
          <Item selected={index === Step.SELECT_PUBLICATION_DATE}>
            <SelectPublicationDate
              next={next}
              setScheduledDate={setScheduledAt}
            />
          </Item>
          <Item selected={index === Step.SELECT_INTEGRATIONS}>
            <SelectIntegrations
              integrations={integrations}
              previous={previous}
              next={next}
              integrationsSelected={integrationsSelected}
              setIntegrationsSelected={setIntegrationsSelected}
            />
          </Item>
          <Item selected={index === Step.CUSTOMIZE_PUBLICATION}>
            <CustomizePublication
              post={post}
              integrationsSelected={integrationsSelected}
              setPublications={setPublications}
              scheduledAt={scheduledAt}
              next={next}
              previous={previous}
            />
          </Item>
          <Item selected={index === Step.SUCCESS}>
            <Success
              post={post}
              publications={publications}
              integrations={integrations}
              scheduledAt={scheduledAt}
            />
          </Item>
        </Inner>
      </Box>
    </>
  );
}
