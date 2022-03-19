import Box from '@components/Box';
import SideBarWrapper from '@components/SideBarWrapper';
import React from 'react';
import { HEADER_HEIGHT } from '.';

export default function Inspirations() {
  return (
    <SideBarWrapper>
      <Box
        width={['100vw', '100vw', '100vw', '85vw']}
        minHeight={`calc(100vh - ${HEADER_HEIGHT}px)`}
        px='3vw'
        pb='10vh'
        pt='8px'
      >
        <div>inspirations</div>
      </Box>
    </SideBarWrapper>
  );
}

Inspirations.auth = true;
