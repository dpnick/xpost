import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { BsWifiOff } from 'react-icons/bs';

export default function Offline() {
  return (
    <Box
      height='100vh'
      width='100vw'
      display='flex'
      justifyContent='center'
      alignItems='center'
      p={3}
    >
      <BsWifiOff size={48} color='#24b47e' />
      <Text fontWeight='bold' fontSize='1.2em'>
        Please, connect to the internet!
      </Text>
    </Box>
  );
}
