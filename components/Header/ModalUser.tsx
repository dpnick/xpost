import Box from '@components/Box';
import Button from '@components/Button';
import ChipButton from '@components/ChipButton';
import Modal from '@components/Modal';
import StyledInput from '@components/StyledInput';
import Text from '@components/Text';
import styles from '@styles/Dashboard.module.scss';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { PROD_URL } from 'pages/dashboard';
import React from 'react';
import { BsTwitter } from 'react-icons/bs';
import styled from 'styled-components';

const LogoutButton = styled(Button)`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 16px;
  transition: background-color ease-in-out 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray['200']};
  }
`;

interface ModalUserProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function ModalUser({ session, children }: ModalUserProps) {
  const shareOnTwitter = (param: string) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(param)}`,
      '_blank'
    );
  };

  const logout = () => signOut();

  return (
    <Modal
      content={
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          height='100%'
        >
          <Box>
            <Box
              className={styles.pointer}
              position='relative'
              borderRadius='50%'
              width={80}
              height={80}
              display='flex'
              justifyContent='center'
              alignItems='center'
              bg='white'
              overflow='hidden'
              margin='auto'
            >
              <Image
                src={session!.user!.image!}
                alt='user image'
                layout='fill'
                objectFit='cover'
              />
            </Box>
            <Box my={4} display='flex' justifyContent='center'>
              <ChipButton
                callback={() =>
                  shareOnTwitter(
                    `You should consider using Xpost, the next level content creator & technical writer productivity tool 🚀
${PROD_URL}
                      `
                  )
                }
                color='#1DA1F2'
              >
                <Text mr={1} color='white'>
                  Share
                </Text>
                <BsTwitter size={16} color='white' />
              </ChipButton>
            </Box>

            <Text color='gray.500'>Username</Text>
            <StyledInput disabled value={session?.user?.name ?? '-'} />
            <Text color='gray.500'>Email</Text>
            <StyledInput disabled value={session?.user?.email ?? '-'} />
          </Box>
          <LogoutButton label='Sign out' onClick={logout} />
        </Box>
      }
    >
      {children}
    </Modal>
  );
}
