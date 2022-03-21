import styles from '@styles/Dashboard.module.scss';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import router from 'next/router';
import { PROD_URL } from 'pages/dashboard';
import React, { useEffect, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { BsTwitter } from 'react-icons/bs';
import styled from 'styled-components';
import Box from './Box';
import Button from './Button';
import ChipButton from './ChipButton';
import Modal from './Modal';
import StyledInput from './StyledInput';
import Text from './Text';

enum Greetings {
  MORNING = 'Good morning',
  AFTERNOON = 'Good afternoon',
  EVENING = 'Good evening',
}

const ErrorButton = styled(Button)`
  background-color: white;
  color: red;
  border: 1px solid red;
  margin-bottom: 16px;
`;

export default function Header() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState<string>();

  useEffect(() => {
    let nextGreeting = Greetings.EVENING;
    const hour = new Date().getHours();
    if (hour < 12) {
      nextGreeting = Greetings.MORNING;
    } else if (hour < 20) {
      nextGreeting = Greetings.AFTERNOON;
    }
    setGreeting(nextGreeting);
  }, []);

  const goDashboard = () => router.push('/dashboard');

  const goHome = () => router.push('/');

  const shareOnTwitter = (param: string) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(param)}`,
      '_blank'
    );
  };

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      bg='accent'
      paddingX='3vw'
      borderBottom='2px solid white'
      height='80px'
      borderBottomWidth='1px solid'
      borderBottomColor='gray.300'
    >
      <Box display='flex' alignItems='center'>
        <Box className={styles.pointer} onClick={goHome} mr='16px'>
          <Image src='/icon.svg' alt='xpost logo' width={35} height={35} />
        </Box>
        <h3 className={styles.pointer} onClick={goDashboard}>
          {greeting}
          {session?.user?.name && (
            <span>
              ,
              <Text
                textTransform='capitalize'
                fontWeight='bold'
                color='primary'
                display='unset'
              >
                &nbsp;{session.user.name}
              </Text>
            </span>
          )}
        </h3>
      </Box>
      <Box display='flex'>
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
              <ErrorButton label='Sign out' onClick={() => signOut()} />
            </Box>
          }
        >
          <Box
            className={styles.pointer}
            position='relative'
            borderRadius='50%'
            width={35}
            height={35}
            display='flex'
            justifyContent='center'
            alignItems='center'
            bg='white'
            overflow='hidden'
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt='user image'
                layout='fill'
                objectFit='cover'
              />
            ) : (
              <AiOutlineUser color='black' />
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
