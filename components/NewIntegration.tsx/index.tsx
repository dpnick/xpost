import Box from '@components/Box';
import Collapse from '@components/Collapse';
import ListHeader from '@components/PostList/ListHeader';
import Text from '@components/Text';
import fetchJson from '@lib/fetchJson';
import { Provider } from '@prisma/client';
import styles from '@styles/Dashboard.module.scss';
import Image from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';

interface NewIntegrationProps {
  provider: Provider;
  closeModal: () => void;
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  width: 100%;
`;

const CollapseContainer = styled(Box)`
  width: 100%;
  margin-top: 32px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid lightgray;
  margin-top: 4px;
  margin-bottom: 16px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
  &:focus {
    outline: solid 2px ${({ theme }) => theme.colors.primary};
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

export default function NewIntegration({
  provider,
  closeModal,
}: NewIntegrationProps) {
  const { id, name, logoUrl, intructionsUrl } = provider;
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleOpening = () => {
    setIsOpen((prev) => !prev);
  };

  const registerIntegration = async (event: any) => {
    event.preventDefault();

    setSubmitted(true);
    const username = event.target.username?.value;
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
            providerName: name,
          }),
          headers: { 'Content-type': 'application/json' },
        },
        true,
        {
          success: `You can now start publishing on ${name} 🎉`,
          loading: 'Almost there',
          error: 'Please make sure your token is valid',
        }
      );
      closeModal();
    } catch {
      setSubmitted(false);
    }
  };

  return (
    <Box display='flex' alignItems='center' flexDirection='column'>
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
        <Box p={0} border='unset' className={styles.card}>
          <ListHeader
            isOpen={isOpen}
            title='Instructions'
            toggleOpening={toggleOpening}
          />
        </Box>
        <Collapse isOpen={isOpen}>
          <Box width='100%' height='50vh' position='relative'>
            <Image
              alt='instructions'
              src={intructionsUrl!.toString()}
              layout='fill'
              objectFit='contain'
            />
          </Box>
        </Collapse>
      </CollapseContainer>
      <StyledForm onSubmit={registerIntegration}>
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
      </StyledForm>
    </Box>
  );
}
