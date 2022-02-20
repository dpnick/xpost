import Box from '@components/Box';
import Collapse from '@components/Collapse';
import Text from '@components/Text';
import fetchJson from '@lib/fetchJson';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

const CollapseContainer = styled(Box)`
  width: 90vw;
  margin-top: 32px;
  @media (min-width: 1024px) {
    width: 40vw;
  }
`;

const StyledInput = styled.input`
  width: 90vw;
  height: 40px;
  border: 1px solid lightgray;
  margin-top: 4px;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: 1024px) {
    width: 40vw;
  }
`;

const RegisterButton = styled.input`
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  &:active {
    opacity: 0.4;
  }
`;

export default function New() {
  const router = useRouter();
  let { id, name, logoUrl, instructionsUrl, needInit } = router.query;
  const [submitted, setSubmitted] = useState<boolean>(false);

  const registerIntegration = async (event: any) => {
    event.preventDefault();

    setSubmitted(true);
    const username = event.target.username.value;
    const token = event.target.token.value;
    try {
      await fetchJson(
        '/api/integration/create',
        {
          method: 'POST',
          body: JSON.stringify({
            username,
            token,
            providerId: id,
            needInit,
            providerName: name,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true
      );
      router.push('/dashboard');
    } catch {
      toast.error('Please make sure your token is valid');
      setSubmitted(false);
    }
  };

  return (
    <Box
      display='flex'
      alignItems='center'
      flexDirection='column'
      padding='3vh'
    >
      <Box>
        <Image src={logoUrl!.toString()} width={100} height={100} />
      </Box>
      <Text
        className='name'
        fontSize='1.2em'
        fontWeight='bold'
        textAlign='center'
        mt='16px'
      >
        {name}
      </Text>
      <CollapseContainer>
        <Collapse title='Instructions' open>
          <Box width='100%' height='50vh' position='relative'>
            <Image
              src={instructionsUrl!.toString()}
              layout='fill'
              objectFit='contain'
            />
          </Box>
        </Collapse>
      </CollapseContainer>
      <form
        onSubmit={registerIntegration}
        style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}
      >
        {name?.toString().toLowerCase() === 'hashnode' && (
          <>
            <Text color='gray' fontWeight='bold'>
              Username (without @)
            </Text>
            <StyledInput
              id='username'
              type='text'
              placeholder='Enter your username here'
              autoComplete='username'
              required
            />
          </>
        )}
        <Text color='gray' fontWeight='bold'>
          Token
        </Text>
        <StyledInput
          id='token'
          type='password'
          placeholder='Enter your token here'
          autoComplete='current-password'
          required
        />
        <RegisterButton
          disabled={submitted}
          type='submit'
          value="Let's go &rarr;"
        />
      </form>
    </Box>
  );
}

New.auth = true;
